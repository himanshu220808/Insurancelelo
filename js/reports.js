/**
 * Insurance Policy Management System
 * reports.js - Analytics, Statistical Aggregations & Reports
 */

const Reports = {
    getAnalytics() {
        const customers = Storage.get(STORAGE_KEYS.CUSTOMERS, []);
        const policies = Storage.get(STORAGE_KEYS.POLICIES, []);
        const payments = Storage.get(STORAGE_KEYS.PAYMENTS, []);
        const claims = Storage.get(STORAGE_KEYS.CLAIMS, []);

        // Policy breakdown
        const totalPolicies = policies.length;
        const activePolicies = policies.filter(p => p.status === 'Active').length;
        const expiredPolicies = policies.filter(p => p.status === 'Expired').length;
        const renewedPolicies = policies.filter(p => p.status === 'Renewed').length;
        const cancelledPolicies = policies.filter(p => p.status === 'Cancelled').length;

        // Premium collection
        const totalPremiumCollected = payments
            .filter(p => p.paymentStatus === 'Successful')
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        const pendingPremium = payments
            .filter(p => p.paymentStatus === 'Pending')
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        // Category distribution
        const categoryCounts = { Life: 0, Health: 0, Vehicle: 0 };
        const categoryPremiums = { Life: 0, Health: 0, Vehicle: 0 };

        policies.forEach(p => {
            const cat = p.category || 'Life';
            if (categoryCounts[cat] !== undefined) {
                categoryCounts[cat]++;
                categoryPremiums[cat] += Number(p.premiumAmount) || 0;
            }
        });

        // Payment status distribution
        const paymentStatuses = {
            Successful: payments.filter(p => p.paymentStatus === 'Successful').length,
            Pending: payments.filter(p => p.paymentStatus === 'Pending').length,
            Failed: payments.filter(p => p.paymentStatus === 'Failed').length
        };

        // Claims breakdown
        const totalClaims = claims.length;
        const claimStatuses = {
            Submitted: claims.filter(c => c.claimStatus === 'Submitted').length,
            UnderReview: claims.filter(c => c.claimStatus === 'Under Review').length,
            Approved: claims.filter(c => c.claimStatus === 'Approved').length,
            Settled: claims.filter(c => c.claimStatus === 'Settled').length,
            Rejected: claims.filter(c => c.claimStatus === 'Rejected').length
        };

        const totalClaimedAmount = claims.reduce((sum, c) => sum + (Number(c.claimedAmount) || 0), 0);
        const totalSettledAmount = claims
            .filter(c => c.claimStatus === 'Settled')
            .reduce((sum, c) => sum + (Number(c.approvedAmount || c.claimedAmount) || 0), 0);

        // Claim settlement ratio
        const decidedClaims = claimStatuses.Settled + claimStatuses.Approved + claimStatuses.Rejected;
        const settlementRate = decidedClaims > 0 
            ? Math.round(((claimStatuses.Settled + claimStatuses.Approved) / decidedClaims) * 100) 
            : 0;

        return {
            totalCustomers: customers.length,
            totalPolicies,
            activePolicies,
            expiredPolicies,
            renewedPolicies,
            cancelledPolicies,
            totalPremiumCollected,
            pendingPremium,
            categoryCounts,
            categoryPremiums,
            paymentStatuses,
            totalClaims,
            claimStatuses,
            totalClaimedAmount,
            totalSettledAmount,
            settlementRate
        };
    },

    // Print Report
    printReport() {
        window.print();
    }
};
