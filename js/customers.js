/**
 * Insurance Policy Management System
 * customers.js - Customer Management Module
 */

const Customers = {
    getAll() {
        return Storage.get(STORAGE_KEYS.CUSTOMERS, []);
    },

    getById(customerId) {
        return this.getAll().find(c => c.id === customerId) || null;
    },

    save(customerData) {
        const customers = this.getAll();
        const existingIndex = customers.findIndex(c => c.id === customerData.id);

        if (existingIndex >= 0) {
            // Update
            customers[existingIndex] = { ...customers[existingIndex], ...customerData };
            Storage.set(STORAGE_KEYS.CUSTOMERS, customers);
            Storage.logActivity(`Updated customer profile for ${customerData.fullName} (${customerData.id})`);
            return { success: true, customer: customers[existingIndex], isNew: false };
        } else {
            // Create
            const newCustomer = {
                id: customerData.id || Storage.generateId('CUST'),
                fullName: customerData.fullName.trim(),
                email: customerData.email.trim(),
                phone: customerData.phone.trim(),
                address: customerData.address.trim(),
                dob: customerData.dob,
                registeredDate: customerData.registeredDate || new Date().toISOString().split('T')[0],
                assignedAgent: customerData.assignedAgent || 'Sarah Jenkins',
                status: customerData.status || 'Active'
            };

            customers.unshift(newCustomer);
            Storage.set(STORAGE_KEYS.CUSTOMERS, customers);
            Storage.logActivity(`Registered new customer: ${newCustomer.fullName} (${newCustomer.id})`);
            return { success: true, customer: newCustomer, isNew: true };
        }
    },

    delete(customerId) {
        const customers = this.getAll();
        const target = customers.find(c => c.id === customerId);
        if (!target) return { success: false, message: 'Customer not found.' };

        // Check active policies
        const policies = Storage.get(STORAGE_KEYS.POLICIES, []);
        const activePolicies = policies.filter(p => p.customerId === customerId && p.status === 'Active');
        if (activePolicies.length > 0) {
            return {
                success: false,
                message: `Cannot delete customer. They have ${activePolicies.length} active insurance policy/policies.`
            };
        }

        const filtered = customers.filter(c => c.id !== customerId);
        Storage.set(STORAGE_KEYS.CUSTOMERS, filtered);
        Storage.logActivity(`Deleted customer record: ${target.fullName} (${target.id})`);
        return { success: true, message: `Customer ${target.fullName} deleted successfully.` };
    },

    getCustomerPolicies(customerId) {
        const policies = Storage.get(STORAGE_KEYS.POLICIES, []);
        return policies.filter(p => p.customerId === customerId);
    },

    getCustomerClaims(customerId) {
        const claims = Storage.get(STORAGE_KEYS.CLAIMS, []);
        return claims.filter(c => c.customerId === customerId);
    },

    getCustomerPayments(customerId) {
        const payments = Storage.get(STORAGE_KEYS.PAYMENTS, []);
        return payments.filter(p => p.customerId === customerId);
    },

    search(query) {
        const list = this.getAll();
        if (!query || !query.trim()) return list;
        const q = query.trim().toLowerCase();
        return list.filter(c =>
            c.fullName.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q) ||
            c.address.toLowerCase().includes(q)
        );
    }
};
