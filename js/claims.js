/**
 * Insurance Policy Management System
 * claims.js - Claims Lifecycle, Eligibility & Settlement Engine
 */

const Claims = {
    VALID_STATUSES: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Settled'],

    getAll() {
        return Storage.get(STORAGE_KEYS.CLAIMS, []);
    },

    getById(claimId) {
        return this.getAll().find(c => c.claimId === claimId) || null;
    },

    filter(status = 'All', searchQuery = '') {
        let list = this.getAll();

        const currentUser = Auth.getCurrentUser();
        if (currentUser && currentUser.role === 'Customer') {
            list = list.filter(c => c.customerId === currentUser.customerId);
        }

        if (status && status !== 'All') {
            list = list.filter(c => c.claimStatus.toLowerCase() === status.toLowerCase());
        }

        if (searchQuery && searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter(c =>
                c.claimId.toLowerCase().includes(q) ||
                c.policyNumber.toLowerCase().includes(q) ||
                c.customerName.toLowerCase().includes(q) ||
                c.claimType.toLowerCase().includes(q) ||
                (c.settlementRef && c.settlementRef.toLowerCase().includes(q))
            );
        }

        return list;
    },

    // Submit new claim with policy eligibility checks
    submitClaim({ policyNumber, customerId, claimType, claimDescription, claimedAmount }) {
        // Step 1: Policy validation
        const policy = Policies.getById(policyNumber);
        if (!policy) {
            return { success: false, message: 'Policy not found in registry.' };
        }

        // Step 2: Customer validation
        if (policy.customerId !== customerId) {
            return { success: false, message: 'Customer ID does not match the policy record holder.' };
        }

        // Step 3: Eligibility check - Policy must be Active or Renewed
        if (policy.status === 'Cancelled') {
            return { success: false, message: 'Cannot file claim against a cancelled policy.' };
        }
        if (policy.status === 'Expired') {
            return {
                success: false,
                message: `Policy expired on ${policy.expiryDate}. Claims cannot be lodged on lapsed coverage.`
            };
        }

        // Check claimed amount sanity
        const amount = Number(claimedAmount);
        if (isNaN(amount) || amount <= 0) {
            return { success: false, message: 'Please provide a valid claimed amount greater than zero.' };
        }
        if (amount > policy.coverageAmount) {
            return {
                success: false,
                message: `Claimed amount (₹${amount}) exceeds maximum policy coverage limit (₹${policy.coverageAmount}).`
            };
        }

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toISOString().slice(0, 16).replace('T', ' ');

        const claimId = Storage.generateId('CLM');
        const newClaim = {
            claimId,
            policyNumber: policy.policyNumber,
            customerId: policy.customerId,
            customerName: policy.customerName,
            claimDate: dateStr,
            claimType: claimType.trim(),
            claimDescription: claimDescription.trim(),
            claimedAmount: amount,
            approvedAmount: null,
            claimStatus: 'Submitted',
            adminRemarks: 'Claim registered and queued for assessment.',
            settlementRef: null,
            settledDate: null,
            history: [
                {
                    status: 'Submitted',
                    timestamp: timeStr,
                    note: 'Claim submitted with verified policy eligibility.'
                }
            ]
        };

        const claims = this.getAll();
        claims.unshift(newClaim);
        Storage.set(STORAGE_KEYS.CLAIMS, claims);

        Storage.logActivity(`Submitted new claim ${newClaim.claimId} for ₹${amount} on policy ${policy.policyNumber}`);
        return { success: true, claim: newClaim };
    },

    // Review / Update Claim Status
    updateStatus(claimId, newStatus, remarks = '', approvedAmount = null) {
        if (!this.VALID_STATUSES.includes(newStatus)) {
            return { success: false, message: `Invalid status: ${newStatus}` };
        }

        const claims = this.getAll();
        const index = claims.findIndex(c => c.claimId === claimId);
        if (index === -1) return { success: false, message: 'Claim not found.' };

        const claim = claims[index];
        const now = new Date();
        const timeStr = now.toISOString().slice(0, 16).replace('T', ' ');

        // Prevent invalid transitions
        if (claim.claimStatus === 'Settled') {
            return { success: false, message: 'Claim is already settled and cannot be modified.' };
        }

        claim.claimStatus = newStatus;
        if (remarks) claim.adminRemarks = remarks;
        
        if (newStatus === 'Approved') {
            claim.approvedAmount = approvedAmount !== null ? Number(approvedAmount) : claim.claimedAmount;
        } else if (newStatus === 'Rejected') {
            claim.approvedAmount = 0;
        }

        claim.history.push({
            status: newStatus,
            timestamp: timeStr,
            note: remarks || `Status transitioned to ${newStatus}`
        });

        claims[index] = claim;
        Storage.set(STORAGE_KEYS.CLAIMS, claims);
        Storage.logActivity(`Updated Claim ${claimId} to status "${newStatus}". Remarks: ${remarks || 'None'}`);
        return { success: true, claim };
    },

    // Execute Settlement (with Duplicate Prevention)
    settleClaim(claimId, customRef = '') {
        const claims = this.getAll();
        const index = claims.findIndex(c => c.claimId === claimId);
        if (index === -1) return { success: false, message: 'Claim not found.' };

        const claim = claims[index];

        // Critical duplicate check
        if (claim.claimStatus === 'Settled' || claim.settlementRef) {
            return {
                success: false,
                message: `Duplicate settlement blocked: Claim ${claimId} has already been settled with reference ${claim.settlementRef}.`
            };
        }

        if (claim.claimStatus !== 'Approved') {
            return {
                success: false,
                message: `Claim cannot be settled. Current status is "${claim.claimStatus}". It must be Approved first.`
            };
        }

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toISOString().slice(0, 16).replace('T', ' ');
        const settlementRef = customRef.trim() || `SET-${Math.floor(10000 + Math.random() * 90000)}`;

        claim.claimStatus = 'Settled';
        claim.settlementRef = settlementRef;
        claim.settledDate = dateStr;
        claim.adminRemarks = (claim.adminRemarks ? claim.adminRemarks + ' | ' : '') + `Settlement disbursed under ref: ${settlementRef}`;
        
        claim.history.push({
            status: 'Settled',
            timestamp: timeStr,
            note: `Simulated electronic settlement executed with disbursement reference ${settlementRef}.`
        });

        claims[index] = claim;
        Storage.set(STORAGE_KEYS.CLAIMS, claims);

        Storage.logActivity(`Claim ${claimId} settled successfully for ₹${claim.approvedAmount || claim.claimedAmount} (Ref: ${settlementRef})`);
        return { success: true, claim, settlementRef };
    }
};
