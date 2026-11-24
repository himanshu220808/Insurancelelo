/**
 * Insurance Policy Management System
 * auth.js - Demo Authentication & Role-Based Access Control
 */

const DEMO_ACCOUNTS = {
    admin: {
        username: 'admin',
        password: 'admin123',
        role: 'Administrator',
        name: 'Arthur Vance',
        email: 'admin@insureguard.com',
        avatarText: 'AV',
        badge: 'Admin'
    },
    agent: {
        username: 'agent',
        password: 'agent123',
        role: 'Insurance Agent',
        name: 'Sarah Jenkins',
        agentId: 'AGT-201',
        email: 's.jenkins@insureguard.com',
        avatarText: 'SJ',
        badge: 'Agent'
    },
    customer: {
        username: 'customer',
        password: 'customer123',
        role: 'Customer',
        name: 'David Miller',
        customerId: 'CUST-1001',
        email: 'david.miller@email.com',
        avatarText: 'DM',
        badge: 'Customer'
    }
};

const Auth = {
    getCurrentUser() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    login(username, password) {
        const trimmedUser = (username || '').trim().toLowerCase();
        const trimmedPass = (password || '').trim();

        const account = DEMO_ACCOUNTS[trimmedUser];
        if (account && account.password === trimmedPass) {
            const sessionUser = {
                username: account.username,
                role: account.role,
                name: account.name,
                email: account.email,
                avatarText: account.avatarText,
                badge: account.badge,
                customerId: account.customerId || null,
                agentId: account.agentId || null,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(sessionUser));
            Storage.logActivity(`User ${sessionUser.name} logged in as ${sessionUser.role}`, sessionUser.name);
            return { success: true, user: sessionUser };
        }

        return { success: false, message: 'Invalid credentials. Please use demo credentials listed on screen.' };
    },

    logout() {
        const user = this.getCurrentUser();
        if (user) {
            Storage.logActivity(`User ${user.name} logged out.`, user.name);
        }
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    },

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'Administrator';
    },

    isAgent() {
        const user = this.getCurrentUser();
        return user && user.role === 'Insurance Agent';
    },

    isCustomer() {
        const user = this.getCurrentUser();
        return user && user.role === 'Customer';
    },

    getRoleDefaultPage() {
        const user = this.getCurrentUser();
        if (!user) return 'login';
        if (user.role === 'Administrator') return 'admin-dashboard';
        if (user.role === 'Insurance Agent') return 'agent-dashboard';
        if (user.role === 'Customer') return 'customer-dashboard';
        return 'admin-dashboard';
    },

    // Check if current user has permission to view a section
    hasPermission(pageId) {
        const user = this.getCurrentUser();
        if (!user) return pageId === 'login';

        // Admin has access to all pages
        if (user.role === 'Administrator') return true;

        // Agent permissions
        if (user.role === 'Insurance Agent') {
            const allowedForAgent = [
                'agent-dashboard',
                'customers',
                'products',
                'policies',
                'calculator',
                'payments',
                'claims',
                'reports',
                'system-testing',
                'settings'
            ];
            return allowedForAgent.includes(pageId);
        }

        // Customer permissions
        if (user.role === 'Customer') {
            const allowedForCustomer = [
                'customer-dashboard',
                'policies',
                'claims',
                'payments',
                'calculator',
                'settings'
            ];
            return allowedForCustomer.includes(pageId);
        }

        return false;
    }
};
