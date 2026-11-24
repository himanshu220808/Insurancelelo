/**
 * Insurance Policy Management System
 * storage.js - LocalStorage Persistence & Mock Data Seeding
 */

const STORAGE_KEYS = {
    CUSTOMERS: 'ipms_customers',
    PRODUCTS: 'ipms_products',
    POLICIES: 'ipms_policies',
    PAYMENTS: 'ipms_payments',
    CLAIMS: 'ipms_claims',
    ACTIVITIES: 'ipms_activities',
    AUTH_USER: 'ipms_auth_user',
    SYSTEM_TESTS: 'ipms_system_tests'
};

// Initial Seed Data
const DEFAULT_PRODUCTS = [
    {
        id: 'PROD-101',
        name: 'Term Life Shield',
        category: 'Life',
        coverage: 500000,
        basePremium: 450,
        duration: 20,
        description: 'Comprehensive term life protection providing high financial safety for your family against unforeseen events.',
        features: ['Full Death Benefit', 'Accidental Rider Support', 'Tax Exemption Eligible'],
        status: 'Active'
    },
    {
        id: 'PROD-102',
        name: 'Endowment Wealth Life',
        category: 'Life',
        coverage: 250000,
        basePremium: 680,
        duration: 15,
        description: 'Dual benefit plan combining guaranteed life cover with maturity returns for milestone planning.',
        features: ['Maturity Bonus', 'Guaranteed Surrender Value', 'Loan Facility Available'],
        status: 'Active'
    },
    {
        id: 'PROD-201',
        name: 'Comprehensive Family Health',
        category: 'Health',
        coverage: 100000,
        basePremium: 320,
        duration: 1,
        description: 'Family floater healthcare plan covering hospitalization, daycare procedures, pre and post-care.',
        features: ['Cashless Hospitalization', 'Zero Co-Pay', 'Over 8,000 Network Hospitals'],
        status: 'Active'
    },
    {
        id: 'PROD-202',
        name: 'Critical Illness Secure',
        category: 'Health',
        coverage: 75000,
        basePremium: 210,
        duration: 1,
        description: 'Lump-sum payout upon diagnosis of 36 critical illnesses to protect savings and income.',
        features: ['Direct Lump Sum Payout', 'Second Medical Opinion', 'Worldwide Coverage'],
        status: 'Active'
    },
    {
        id: 'PROD-301',
        name: 'Comprehensive Auto Guard',
        category: 'Vehicle',
        coverage: 40000,
        basePremium: 280,
        duration: 1,
        description: 'Full bumper-to-bumper vehicle insurance covering accidental damage, third-party liability, and theft.',
        features: ['Zero Depreciation', '24x7 Roadside Assistance', 'Engine Protection Cover'],
        status: 'Active'
    },
    {
        id: 'PROD-302',
        name: 'Commercial Fleet Shield',
        category: 'Vehicle',
        coverage: 150000,
        basePremium: 890,
        duration: 1,
        description: 'High-limit commercial vehicle protection tailored for corporate vans, trucks, and company fleets.',
        features: ['Multi-Driver Cover', 'Cargo Liability Inclusion', 'Priority Claim Settlement'],
        status: 'Active'
    }
];

const DEFAULT_CUSTOMERS = [
    {
        id: 'CUST-1001',
        fullName: 'David Miller',
        email: 'david.miller@email.com',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace, Springfield, IL',
        dob: '1988-06-14',
        registeredDate: '2023-01-10',
        assignedAgent: 'Sarah Jenkins',
        status: 'Active'
    },
    {
        id: 'CUST-1002',
        fullName: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+1 (555) 345-6789',
        address: '108 Metro Tower, West End, Austin, TX',
        dob: '1992-09-22',
        registeredDate: '2023-04-18',
        assignedAgent: 'Sarah Jenkins',
        status: 'Active'
    },
    {
        id: 'CUST-1003',
        fullName: 'Marcus Chen',
        email: 'marcus.chen@example.com',
        phone: '+1 (555) 456-7890',
        address: '45 Harbor View Drive, Seattle, WA',
        dob: '1985-03-30',
        registeredDate: '2022-11-05',
        assignedAgent: 'Sarah Jenkins',
        status: 'Active'
    },
    {
        id: 'CUST-1004',
        fullName: 'Emily Watson',
        email: 'emily.watson@example.com',
        phone: '+1 (555) 567-8901',
        address: '12 Elm Street, Boston, MA',
        dob: '1995-12-08',
        registeredDate: '2024-02-14',
        assignedAgent: 'Sarah Jenkins',
        status: 'Active'
    },
    {
        id: 'CUST-1005',
        fullName: 'Robert Taylor',
        email: 'robert.taylor@example.com',
        phone: '+1 (555) 678-9012',
        address: '890 Maple Boulevard, Denver, CO',
        dob: '1980-08-19',
        registeredDate: '2023-08-20',
        assignedAgent: 'Sarah Jenkins',
        status: 'Active'
    }
];

const DEFAULT_POLICIES = [
    {
        policyNumber: 'POL-2024-1001',
        customerId: 'CUST-1001',
        customerName: 'David Miller',
        productId: 'PROD-301',
        productName: 'Comprehensive Auto Guard',
        category: 'Vehicle',
        startDate: '2024-01-15',
        expiryDate: '2025-01-14',
        coverageAmount: 40000,
        premiumAmount: 350,
        status: 'Active',
        paymentStatus: 'Paid',
        notes: 'Vehicle: 2022 Honda Civic (VIN: 1HGCR2F83HA029381)'
    },
    {
        policyNumber: 'POL-2023-1002',
        customerId: 'CUST-1001',
        customerName: 'David Miller',
        productId: 'PROD-101',
        productName: 'Term Life Shield',
        category: 'Life',
        startDate: '2023-06-01',
        expiryDate: '2043-05-31',
        coverageAmount: 500000,
        premiumAmount: 520,
        status: 'Active',
        paymentStatus: 'Paid',
        notes: 'Nominee: Sarah Miller (Spouse)'
    },
    {
        policyNumber: 'POL-2024-1003',
        customerId: 'CUST-1002',
        customerName: 'Priya Sharma',
        productId: 'PROD-201',
        productName: 'Comprehensive Family Health',
        category: 'Health',
        startDate: '2024-02-10',
        expiryDate: '2025-02-09',
        coverageAmount: 100000,
        premiumAmount: 380,
        status: 'Active',
        paymentStatus: 'Paid',
        notes: 'Covers Self and Dependent Parent'
    },
    {
        policyNumber: 'POL-2022-1004',
        customerId: 'CUST-1003',
        customerName: 'Marcus Chen',
        productId: 'PROD-301',
        productName: 'Comprehensive Auto Guard',
        category: 'Vehicle',
        startDate: '2023-01-01',
        expiryDate: '2024-01-01',
        coverageAmount: 35000,
        premiumAmount: 290,
        status: 'Expired',
        paymentStatus: 'Paid',
        notes: 'Vehicle: 2020 Toyota Camry'
    },
    {
        policyNumber: 'POL-2024-1005',
        customerId: 'CUST-1004',
        customerName: 'Emily Watson',
        productId: 'PROD-102',
        productName: 'Endowment Wealth Life',
        category: 'Life',
        startDate: '2024-03-20',
        expiryDate: '2039-03-19',
        coverageAmount: 250000,
        premiumAmount: 680,
        status: 'Active',
        paymentStatus: 'Paid',
        notes: 'Annual premium frequency with dividend reinvestment'
    },
    {
        policyNumber: 'POL-2023-1006',
        customerId: 'CUST-1005',
        customerName: 'Robert Taylor',
        productId: 'PROD-201',
        productName: 'Comprehensive Family Health',
        category: 'Health',
        startDate: '2023-05-01',
        expiryDate: '2024-05-01',
        coverageAmount: 100000,
        premiumAmount: 340,
        status: 'Cancelled',
        paymentStatus: 'Refunded',
        notes: 'Customer relocated abroad; policy cancelled per request.'
    }
];

const DEFAULT_PAYMENTS = [
    {
        paymentId: 'PAY-9001',
        policyNumber: 'POL-2024-1001',
        customerId: 'CUST-1001',
        customerName: 'David Miller',
        amount: 350,
        paymentDate: '2024-01-15',
        paymentMethod: 'Credit Card',
        paymentStatus: 'Successful',
        transactionRef: 'TXN-CC-7849102',
        notes: 'Annual policy inception payment'
    },
    {
        paymentId: 'PAY-9002',
        policyNumber: 'POL-2023-1002',
        customerId: 'CUST-1001',
        customerName: 'David Miller',
        amount: 520,
        paymentDate: '2023-06-01',
        paymentMethod: 'Net Banking',
        paymentStatus: 'Successful',
        transactionRef: 'TXN-NB-1092837',
        notes: 'First premium installment'
    },
    {
        paymentId: 'PAY-9003',
        policyNumber: 'POL-2024-1003',
        customerId: 'CUST-1002',
        customerName: 'Priya Sharma',
        amount: 380,
        paymentDate: '2024-02-10',
        paymentMethod: 'UPI',
        paymentStatus: 'Successful',
        transactionRef: 'TXN-UPI-9920148',
        notes: 'Annual family health renewal'
    },
    {
        paymentId: 'PAY-9004',
        policyNumber: 'POL-2024-1005',
        customerId: 'CUST-1004',
        customerName: 'Emily Watson',
        amount: 680,
        paymentDate: '2024-03-20',
        paymentMethod: 'Debit Card',
        paymentStatus: 'Successful',
        transactionRef: 'TXN-DC-3481902',
        notes: 'Endowment policy initial premium'
    },
    {
        paymentId: 'PAY-9005',
        policyNumber: 'POL-2024-1001',
        customerId: 'CUST-1001',
        customerName: 'David Miller',
        amount: 350,
        paymentDate: '2024-11-20',
        paymentMethod: 'Credit Card',
        paymentStatus: 'Pending',
        transactionRef: 'TXN-CC-9018274',
        notes: 'Scheduled upcoming term renewal'
    }
];

const DEFAULT_CLAIMS = [
    {
        claimId: 'CLM-5001',
        policyNumber: 'POL-2024-1001',
        customerId: 'CUST-1001',
        customerName: 'David Miller',
        claimDate: '2024-04-12',
        claimType: 'Accidental Vehicle Damage',
        claimDescription: 'Rear bumper and tail-light replacement following parking bay impact. Work done at authorized service center.',
        claimedAmount: 1200,
        approvedAmount: 1200,
        claimStatus: 'Settled',
        adminRemarks: 'Workshop bill verified against repair estimate. Authorized payment disbursed.',
        settlementRef: 'SET-78910',
        settledDate: '2024-04-20',
        history: [
            { status: 'Submitted', timestamp: '2024-04-12 10:15', note: 'Claim submitted online with garage quote' },
            { status: 'Under Review', timestamp: '2024-04-14 14:30', note: 'Surveyor assigned to inspect vehicle' },
            { status: 'Approved', timestamp: '2024-04-18 09:00', note: 'Surveyor approved repair cost of ₹1,200' },
            { status: 'Settled', timestamp: '2024-04-20 16:45', note: 'Settlement disbursed via direct wire ref SET-78910' }
        ]
    },
    {
        claimId: 'CLM-5002',
        policyNumber: 'POL-2024-1003',
        customerId: 'CUST-1002',
        customerName: 'Priya Sharma',
        claimDate: '2024-07-08',
        claimType: 'Hospitalization & Daycare',
        claimDescription: 'Emergency hospital admission for acute appendectomy at St. Jude Memorial Hospital.',
        claimedAmount: 2800,
        approvedAmount: null,
        claimStatus: 'Under Review',
        adminRemarks: 'Awaiting itemized pharmaceutical invoices and surgeon clearance form.',
        settlementRef: null,
        settledDate: null,
        history: [
            { status: 'Submitted', timestamp: '2024-07-08 11:40', note: 'Hospital discharge papers uploaded' },
            { status: 'Under Review', timestamp: '2024-07-10 16:00', note: 'Medical reviewer requested medicine vouchers' }
        ]
    },
    {
        claimId: 'CLM-5003',
        policyNumber: 'POL-2023-1002',
        customerId: 'CUST-1001',
        customerName: 'David Miller',
        claimDate: '2024-09-15',
        claimType: 'Annual Diagnostic Assessment',
        claimDescription: 'Comprehensive annual preventative health screening reimbursement request.',
        claimedAmount: 450,
        approvedAmount: 450,
        claimStatus: 'Approved',
        adminRemarks: 'Eligible preventative care rider confirmed. Ready for settlement clearance.',
        settlementRef: null,
        settledDate: null,
        history: [
            { status: 'Submitted', timestamp: '2024-09-15 14:22', note: 'Claim registered by customer' },
            { status: 'Under Review', timestamp: '2024-09-18 10:05', note: 'Policy rider eligibility confirmed' },
            { status: 'Approved', timestamp: '2024-09-22 15:30', note: 'Approved for ₹450 payout awaiting settlement' }
        ]
    },
    {
        claimId: 'CLM-5004',
        policyNumber: 'POL-2022-1004',
        customerId: 'CUST-1003',
        customerName: 'Marcus Chen',
        claimDate: '2024-03-02',
        claimType: 'Vehicle Collision Claim',
        claimDescription: 'Minor collision at highway intersection on February 28, 2024.',
        claimedAmount: 3500,
        approvedAmount: 0,
        claimStatus: 'Rejected',
        adminRemarks: 'Policy POL-2022-1004 expired on 2024-01-01. Incident occurred after policy lapse date.',
        settlementRef: null,
        settledDate: null,
        history: [
            { status: 'Submitted', timestamp: '2024-03-02 09:12', note: 'Claim entered by customer' },
            { status: 'Rejected', timestamp: '2024-03-04 11:20', note: 'Rejected due to lapsed policy' }
        ]
    }
];

const DEFAULT_ACTIVITIES = [
    { id: 'ACT-101', timestamp: '2024-11-24 14:20', user: 'Admin (Arthur Vance)', action: 'Reviewed and Approved Claim CLM-5003 for ₹450' },
    { id: 'ACT-102', timestamp: '2024-11-23 11:15', user: 'Agent (Sarah Jenkins)', action: 'Generated Quote for Customer Emily Watson' },
    { id: 'ACT-103', timestamp: '2024-11-22 16:40', user: 'Customer (David Miller)', action: 'Submitted Claim CLM-5003 under Policy POL-2023-1002' },
    { id: 'ACT-104', timestamp: '2024-11-20 10:00', user: 'Admin (Arthur Vance)', action: 'Disbursed Claim Settlement SET-78910 for CLM-5001' },
    { id: 'ACT-105', timestamp: '2024-11-18 09:30', user: 'Agent (Sarah Jenkins)', action: 'Created Policy POL-2024-1005 for Emily Watson' }
];

// Storage Engine
const Storage = {
    // Initializer: check if keys exist, if not seed them
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
            this.set(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
            this.set(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.POLICIES)) {
            this.set(STORAGE_KEYS.POLICIES, DEFAULT_POLICIES);
        }
        if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
            this.set(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.CLAIMS)) {
            this.set(STORAGE_KEYS.CLAIMS, DEFAULT_CLAIMS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
            this.set(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
        }
    },

    get(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error(`Error reading ${key} from LocalStorage:`, e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Error writing ${key} to LocalStorage:`, e);
            return false;
        }
    },

    logActivity(actionText, userName = null) {
        const activities = this.get(STORAGE_KEYS.ACTIVITIES, []);
        const currentUser = Auth.getCurrentUser();
        const actor = userName || (currentUser ? `${currentUser.role} (${currentUser.name})` : 'System');
        
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
        
        const newActivity = {
            id: 'ACT-' + Math.floor(100 + Math.random() * 900),
            timestamp,
            user: actor,
            action: actionText
        };

        activities.unshift(newActivity);
        if (activities.length > 30) activities.pop(); // keep last 30
        this.set(STORAGE_KEYS.ACTIVITIES, activities);
    },

    // ID Generators
    generateId(prefix) {
        const timestampSuffix = Date.now().toString().slice(-4);
        const randomNum = Math.floor(10 + Math.random() * 90);
        return `${prefix}-${timestampSuffix}${randomNum}`;
    },

    generatePolicyNumber() {
        const year = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `POL-${year}-${rand}`;
    },

    resetAllData() {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(DEFAULT_POLICIES));
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(DEFAULT_PAYMENTS));
        localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(DEFAULT_CLAIMS));
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
        this.logActivity('Reset all system records to default demonstration data.', 'System Administrator');
    },

    exportDataJSON() {
        const dump = {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            customers: this.get(STORAGE_KEYS.CUSTOMERS),
            products: this.get(STORAGE_KEYS.PRODUCTS),
            policies: this.get(STORAGE_KEYS.POLICIES),
            payments: this.get(STORAGE_KEYS.PAYMENTS),
            claims: this.get(STORAGE_KEYS.CLAIMS),
            activities: this.get(STORAGE_KEYS.ACTIVITIES)
        };
        return JSON.stringify(dump, null, 2);
    },

    importDataJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (!parsed.customers || !parsed.policies) {
                throw new Error('Invalid schema: Missing required core entities.');
            }
            if (parsed.customers) this.set(STORAGE_KEYS.CUSTOMERS, parsed.customers);
            if (parsed.products) this.set(STORAGE_KEYS.PRODUCTS, parsed.products);
            if (parsed.policies) this.set(STORAGE_KEYS.POLICIES, parsed.policies);
            if (parsed.payments) this.set(STORAGE_KEYS.PAYMENTS, parsed.payments);
            if (parsed.claims) this.set(STORAGE_KEYS.CLAIMS, parsed.claims);
            if (parsed.activities) this.set(STORAGE_KEYS.ACTIVITIES, parsed.activities);
            this.logActivity('Imported external system database backup.', 'System Administrator');
            return true;
        } catch (err) {
            console.error('Import error:', err);
            return false;
        }
    }
};

// Initialize on script load
Storage.init();
