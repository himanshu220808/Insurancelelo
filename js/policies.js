/**
 * Insurance Policy Management System
 * policies.js - Policy Creation, Renewal, Expiry & Cancellation
 */

const Policies = {
    getAll() {
        return Storage.get(STORAGE_KEYS.POLICIES, []);
    },

    getById(policyNumber) {
        return this.getAll().find(p => p.policyNumber === policyNumber) || null;
    },

    getByCustomerId(customerId) {
        return this.getAll().filter(p => p.customerId === customerId);
    },

    // Create a new policy
    create(data) {
        const policies = this.getAll();
        
        // Auto-generate policy number if not provided
        const policyNumber = data.policyNumber || Storage.generatePolicyNumber();

        // Customer & Product check
        const customer = Customers.getById(data.customerId);
        if (!customer) {
            return { success: false, message: 'Invalid customer selected.' };
        }

        const product = Products.getById(data.productId);
        if (!product) {
            return { success: false, message: 'Invalid insurance product selected.' };
        }

        const startDate = data.startDate || new Date().toISOString().split('T')[0];
        
        // Calculate expiry date based on duration (years)
        const durationYears = Number(data.durationYears || product.duration || 1);
        const startObj = new Date(startDate);
        const expiryObj = new Date(startObj);
        expiryObj.setFullYear(startObj.getFullYear() + durationYears);
        // Expiry is 1 day before anniversary
        expiryObj.setDate(expiryObj.getDate() - 1);
        const expiryDate = data.expiryDate || expiryObj.toISOString().split('T')[0];

        const newPolicy = {
            policyNumber,
            customerId: customer.id,
            customerName: customer.fullName,
            productId: product.id,
            productName: product.name,
            category: product.category,
            startDate,
            expiryDate,
            coverageAmount: Number(data.coverageAmount || product.coverage),
            premiumAmount: Number(data.premiumAmount || product.basePremium),
            status: data.status || 'Active',
            paymentStatus: data.paymentStatus || 'Paid',
            notes: data.notes || `Created under ${product.name} scheme.`
        };

        policies.unshift(newPolicy);
        Storage.set(STORAGE_KEYS.POLICIES, policies);

        // Also record an initial payment record if marked Paid
        if (newPolicy.paymentStatus === 'Paid') {
            const paymentId = Storage.generateId('PAY');
            const payments = Storage.get(STORAGE_KEYS.PAYMENTS, []);
            payments.unshift({
                paymentId,
                policyNumber: newPolicy.policyNumber,
                customerId: newPolicy.customerId,
                customerName: newPolicy.customerName,
                amount: newPolicy.premiumAmount,
                paymentDate: newPolicy.startDate,
                paymentMethod: data.paymentMethod || 'Credit Card',
                paymentStatus: 'Successful',
                transactionRef: 'TXN-GEN-' + Math.floor(1000000 + Math.random() * 9000000),
                notes: 'Inception premium payment'
            });
            Storage.set(STORAGE_KEYS.PAYMENTS, payments);
        }

        Storage.logActivity(`Issued new policy ${newPolicy.policyNumber} to ${newPolicy.customerName} (₹${newPolicy.premiumAmount}/yr)`);
        return { success: true, policy: newPolicy };
    },

    // Renew Policy
    renew(policyNumber, durationYears = 1, paymentMethod = 'UPI') {
        const policies = this.getAll();
        const index = policies.findIndex(p => p.policyNumber === policyNumber);
        if (index === -1) return { success: false, message: 'Policy not found.' };

        const policy = policies[index];
        
        // Compute new start and expiry date
        const currentExpiry = new Date(policy.expiryDate);
        const today = new Date();
        // If expired in the past, renew starts today; otherwise extends from current expiry
        const newStart = currentExpiry > today ? new Date(currentExpiry.getTime() + 86400000) : today;
        const newExpiry = new Date(newStart);
        newExpiry.setFullYear(newStart.getFullYear() + Number(durationYears));
        newExpiry.setDate(newExpiry.getDate() - 1);

        policy.startDate = newStart.toISOString().split('T')[0];
        policy.expiryDate = newExpiry.toISOString().split('T')[0];
        policy.status = 'Renewed';
        policy.paymentStatus = 'Paid';
        policy.notes = (policy.notes ? policy.notes + ' | ' : '') + `Renewed on ${today.toISOString().split('T')[0]}`;

        policies[index] = policy;
        Storage.set(STORAGE_KEYS.POLICIES, policies);

        // Generate renewal payment record
        const paymentId = Storage.generateId('PAY');
        const payments = Storage.get(STORAGE_KEYS.PAYMENTS, []);
        payments.unshift({
            paymentId,
            policyNumber: policy.policyNumber,
            customerId: policy.customerId,
            customerName: policy.customerName,
            amount: policy.premiumAmount,
            paymentDate: today.toISOString().split('T')[0],
            paymentMethod,
            paymentStatus: 'Successful',
            transactionRef: 'TXN-RNW-' + Math.floor(1000000 + Math.random() * 9000000),
            notes: `Policy Renewal for ${durationYears} year(s)`
        });
        Storage.set(STORAGE_KEYS.PAYMENTS, payments);

        Storage.logActivity(`Renewed policy ${policy.policyNumber} for customer ${policy.customerName} until ${policy.expiryDate}`);
        return { success: true, policy };
    },

    // Cancel Policy
    cancel(policyNumber, reason = 'Customer request') {
        const policies = this.getAll();
        const index = policies.findIndex(p => p.policyNumber === policyNumber);
        if (index === -1) return { success: false, message: 'Policy not found.' };

        const policy = policies[index];
        policy.status = 'Cancelled';
        policy.notes = (policy.notes ? policy.notes + ' | ' : '') + `Cancelled: ${reason}`;
        
        policies[index] = policy;
        Storage.set(STORAGE_KEYS.POLICIES, policies);

        Storage.logActivity(`Cancelled policy ${policy.policyNumber} (${reason})`);
        return { success: true, policy };
    },

    // Filter & Search
    filter(status = 'All', category = 'All', searchQuery = '') {
        let list = this.getAll();

        // Customer role constraint
        const currentUser = Auth.getCurrentUser();
        if (currentUser && currentUser.role === 'Customer') {
            list = list.filter(p => p.customerId === currentUser.customerId);
        }

        if (status && status !== 'All') {
            list = list.filter(p => p.status.toLowerCase() === status.toLowerCase());
        }

        if (category && category !== 'All') {
            list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        if (searchQuery && searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter(p =>
                p.policyNumber.toLowerCase().includes(q) ||
                p.customerName.toLowerCase().includes(q) ||
                p.productName.toLowerCase().includes(q) ||
                p.customerId.toLowerCase().includes(q)
            );
        }

        return list;
    }
};
