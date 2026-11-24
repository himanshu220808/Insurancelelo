/**
 * Insurance Policy Management System
 * payments.js - Payment Simulation, Tracking & Demo Receipts
 */

const Payments = {
    getAll() {
        return Storage.get(STORAGE_KEYS.PAYMENTS, []);
    },

    getById(paymentId) {
        return this.getAll().find(p => p.paymentId === paymentId) || null;
    },

    filter(status = 'All', searchQuery = '') {
        let list = this.getAll();

        // Customer scope
        const currentUser = Auth.getCurrentUser();
        if (currentUser && currentUser.role === 'Customer') {
            list = list.filter(p => p.customerId === currentUser.customerId);
        }

        if (status && status !== 'All') {
            list = list.filter(p => p.paymentStatus.toLowerCase() === status.toLowerCase());
        }

        if (searchQuery && searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter(p =>
                p.paymentId.toLowerCase().includes(q) ||
                p.policyNumber.toLowerCase().includes(q) ||
                p.customerName.toLowerCase().includes(q) ||
                p.paymentMethod.toLowerCase().includes(q) ||
                (p.transactionRef && p.transactionRef.toLowerCase().includes(q))
            );
        }

        return list;
    },

    // Record a simulated payment
    recordPayment({ policyNumber, customerId, customerName, amount, paymentMethod, paymentStatus = 'Successful', notes = '' }) {
        const payments = this.getAll();
        const paymentId = Storage.generateId('PAY');
        
        // Generate simulated transaction reference
        const prefixMap = {
            'Credit Card': 'TXN-CC',
            'Debit Card': 'TXN-DC',
            'UPI': 'TXN-UPI',
            'Net Banking': 'TXN-NB',
            'Bank Cheque': 'CHQ-DEMO'
        };
        const refPrefix = prefixMap[paymentMethod] || 'TXN-SIM';
        const transactionRef = `${refPrefix}-${Math.floor(1000000 + Math.random() * 9000000)}`;

        const paymentRecord = {
            paymentId,
            policyNumber,
            customerId,
            customerName,
            amount: Number(amount),
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod,
            paymentStatus, // 'Successful', 'Pending', 'Failed'
            transactionRef,
            notes: notes || 'Simulated demonstration transaction'
        };

        payments.unshift(paymentRecord);
        Storage.set(STORAGE_KEYS.PAYMENTS, payments);

        // If payment is successful, update policy payment status if applicable
        if (paymentStatus === 'Successful') {
            const policies = Storage.get(STORAGE_KEYS.POLICIES, []);
            const polIndex = policies.findIndex(p => p.policyNumber === policyNumber);
            if (polIndex !== -1) {
                policies[polIndex].paymentStatus = 'Paid';
                Storage.set(STORAGE_KEYS.POLICIES, policies);
            }
        }

        Storage.logActivity(`Processed demo payment of ₹${amount} for policy ${policyNumber} via ${paymentMethod} (${paymentStatus})`);
        return { success: true, payment: paymentRecord };
    },

    // Update payment status (e.g., mark pending payment as successful)
    updateStatus(paymentId, newStatus) {
        const payments = this.getAll();
        const index = payments.findIndex(p => p.paymentId === paymentId);
        if (index === -1) return { success: false, message: 'Payment record not found.' };

        payments[index].paymentStatus = newStatus;
        Storage.set(STORAGE_KEYS.PAYMENTS, payments);
        Storage.logActivity(`Updated Payment ${paymentId} status to ${newStatus}`);
        return { success: true, payment: payments[index] };
    }
};
