/**
 * Insurance Policy Management System
 * app.js - Master Application Controller & UI Logic
 */

const App = {
    currentPage: 'login',

    init() {
        // Check authentication state
        const user = Auth.getCurrentUser();
        if (user) {
            this.showAppLayout();
            this.navigateTo(Auth.getRoleDefaultPage());
        } else {
            this.showLoginLayout();
        }

        this.bindEvents();
        this.init3DTilt();
    },

    // UI Toast Notification
    toast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg class="svg-icon" style="color: var(--success-solid);"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg class="svg-icon" style="color: var(--danger-solid);"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
        } else {
            iconSvg = `<svg class="svg-icon" style="color: var(--accent-600);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }

        toast.innerHTML = `${iconSvg} <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },

    // Modals Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    },

    closeAllModals() {
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
        document.body.style.overflow = '';
    },

    // Layout toggling
    showLoginLayout() {
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
        this.currentPage = 'login';
    },

    showAppLayout() {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        this.updateUserBadge();
        this.updateSidebarNav();
    },

    updateUserBadge() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const avatar = document.getElementById('userAvatar');
        const name = document.getElementById('userName');
        const role = document.getElementById('userRole');
        const roleDropdown = document.getElementById('roleSwitcherSelect');

        if (avatar) avatar.textContent = user.avatarText || user.name.slice(0, 2).toUpperCase();
        if (name) name.textContent = user.name;
        if (role) role.textContent = user.role;
        if (roleDropdown) roleDropdown.value = user.username;
    },

    // Filter sidebar navigation items based on logged-in role
    updateSidebarNav() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        navLinks.forEach(link => {
            const targetPage = link.getAttribute('data-page');
            const hasAccess = Auth.hasPermission(targetPage);
            const parentItem = link.closest('.nav-item');
            if (parentItem) {
                if (hasAccess) {
                    parentItem.classList.remove('hidden');
                } else {
                    parentItem.classList.add('hidden');
                }
            }
        });
    },

    // Page Navigation
    navigateTo(pageId) {
        if (!Auth.isAuthenticated()) {
            this.showLoginLayout();
            return;
        }

        // Check permission
        if (!Auth.hasPermission(pageId)) {
            this.toast(`Access restricted: Your role (${Auth.getCurrentUser().role}) cannot view this page.`, 'error');
            this.navigateTo(Auth.getRoleDefaultPage());
            return;
        }

        this.currentPage = pageId;

        // Hide all views
        document.querySelectorAll('.page-view').forEach(view => {
            view.classList.remove('active');
        });

        // Show target view
        const targetView = document.getElementById(`page-${pageId}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update active class on sidebar
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update breadcrumb title
        const breadcrumb = document.getElementById('headerPageTitle');
        if (breadcrumb) {
            const pageNames = {
                'admin-dashboard': 'Administrator Dashboard',
                'agent-dashboard': 'Agent Operations Portal',
                'customer-dashboard': 'Customer Policy Portal',
                'customers': 'Customer Directory & Profiles',
                'products': 'Insurance Product Portfolio',
                'policies': 'Policy Administration & Tracking',
                'calculator': 'Smart Premium Calculator',
                'payments': 'Payment Ledger & Simulated Billing',
                'claims': 'Claims Processing & Adjudication',
                'reports': 'Reports & Analytics Intelligence',
                'system-testing': 'System Verification & Test Suite',
                'settings': 'System Settings & Data Management'
            };
            breadcrumb.textContent = pageNames[pageId] || 'Dashboard';
        }

        // Close mobile drawer if open
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');

        // Render contents of page
        this.renderCurrentPage(pageId);
    },

    renderCurrentPage(pageId) {
        switch (pageId) {
            case 'admin-dashboard':
                this.renderAdminDashboard();
                break;
            case 'agent-dashboard':
                this.renderAgentDashboard();
                break;
            case 'customer-dashboard':
                this.renderCustomerDashboard();
                break;
            case 'customers':
                this.renderCustomersTable();
                break;
            case 'products':
                this.renderProductsGrid();
                break;
            case 'policies':
                this.renderPoliciesTable();
                break;
            case 'calculator':
                this.renderCalculator();
                break;
            case 'payments':
                this.renderPaymentsTable();
                break;
            case 'claims':
                this.renderClaimsTable();
                break;
            case 'reports':
                this.renderReports();
                break;
            case 'system-testing':
                this.renderSystemTesting();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }

        // Initialize 3D dynamic perspective and tilt on all cards
        setTimeout(() => this.init3DTilt(), 50);
    },

    // ==================== ADMIN DASHBOARD ====================
    renderAdminDashboard() {
        const analytics = Reports.getAnalytics();

        // Update stat counters
        document.getElementById('statTotalCustomers').textContent = analytics.totalCustomers;
        document.getElementById('statTotalPolicies').textContent = analytics.totalPolicies;
        document.getElementById('statActivePolicies').textContent = analytics.activePolicies;
        document.getElementById('statExpiredPolicies').textContent = analytics.expiredPolicies;
        document.getElementById('statTotalClaims').textContent = analytics.totalClaims;
        document.getElementById('statPendingClaims').textContent = analytics.claimStatuses.Submitted + analytics.claimStatuses.UnderReview;
        document.getElementById('statTotalPremium').textContent = '₹' + analytics.totalPremiumCollected.toLocaleString();

        // Render Recent Activities list
        const activities = Storage.get(STORAGE_KEYS.ACTIVITIES, []).slice(0, 6);
        const actContainer = document.getElementById('adminRecentActivities');
        if (actContainer) {
            if (activities.length === 0) {
                actContainer.innerHTML = `<div class="table-empty-state"><p>No recorded activity logs yet.</p></div>`;
            } else {
                actContainer.innerHTML = activities.map(act => `
                    <div class="flex items-center justify-between" style="padding: 0.85rem 0; border-bottom: 1px solid #EDF2F7;">
                        <div>
                            <div style="font-weight: 600; color: var(--primary-900); font-size: 0.88rem;">${act.action}</div>
                            <div class="text-xs text-muted" style="margin-top: 0.15rem;">Initiated by: ${act.user}</div>
                        </div>
                        <div class="text-xs text-muted" style="white-space: nowrap;">${act.timestamp}</div>
                    </div>
                `).join('');
            }
        }

        // Render Recent Claims Table in Admin dashboard
        const claims = Claims.getAll().slice(0, 5);
        const claimBody = document.getElementById('adminRecentClaimsBody');
        if (claimBody) {
            claimBody.innerHTML = claims.map(c => `
                <tr>
                    <td class="cell-primary">${c.claimId}</td>
                    <td>${c.customerName}</td>
                    <td>${c.policyNumber}</td>
                    <td>₹${c.claimedAmount.toLocaleString()}</td>
                    <td><span class="badge ${this.getClaimBadgeClass(c.claimStatus)}"><span class="badge-dot"></span>${c.claimStatus}</span></td>
                    <td>
                        <button class="btn btn-outline btn-sm" onclick="App.openClaimReviewModal('${c.claimId}')">Review</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    // ==================== AGENT DASHBOARD ====================
    renderAgentDashboard() {
        const user = Auth.getCurrentUser();
        const policies = Policies.getAll();
        const customers = Customers.getAll();
        const claims = Claims.getAll();

        document.getElementById('agentStatCustomers').textContent = customers.length;
        document.getElementById('agentStatPolicies').textContent = policies.length;
        document.getElementById('agentStatClaims').textContent = claims.length;
        
        const totalSales = policies.reduce((s, p) => s + (p.premiumAmount || 0), 0);
        document.getElementById('agentStatSales').textContent = '₹' + totalSales.toLocaleString();

        // Render Agent Assigned Customer Policies
        const tableBody = document.getElementById('agentPoliciesBody');
        if (tableBody) {
            tableBody.innerHTML = policies.slice(0, 6).map(p => `
                <tr>
                    <td class="cell-primary">${p.policyNumber}</td>
                    <td>${p.customerName}</td>
                    <td>${p.productName}</td>
                    <td>₹${p.premiumAmount}/yr</td>
                    <td>${p.expiryDate}</td>
                    <td><span class="badge ${this.getPolicyBadgeClass(p.status)}"><span class="badge-dot"></span>${p.status}</span></td>
                    <td>
                        <button class="btn btn-outline btn-sm" onclick="App.openRenewModal('${p.policyNumber}')">Renew</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    // ==================== CUSTOMER DASHBOARD ====================
    renderCustomerDashboard() {
        const user = Auth.getCurrentUser();
        const customerId = user ? user.customerId : 'CUST-1001';
        const customer = Customers.getById(customerId);
        
        const myPolicies = Policies.getByCustomerId(customerId);
        const myClaims = Claims.getAll().filter(c => c.customerId === customerId);
        const myPayments = Payments.getAll().filter(p => p.customerId === customerId);

        // Header greeting
        document.getElementById('custWelcomeName').textContent = customer ? customer.fullName : user.name;
        document.getElementById('custHeaderId').textContent = customerId;
        
        // Stats
        document.getElementById('custStatPolicies').textContent = myPolicies.length;
        document.getElementById('custStatActive').textContent = myPolicies.filter(p => p.status === 'Active' || p.status === 'Renewed').length;
        document.getElementById('custStatClaims').textContent = myClaims.length;

        // Customer Profile Card
        if (customer) {
            document.getElementById('custProfileName').textContent = customer.fullName;
            document.getElementById('custProfileEmail').textContent = customer.email;
            document.getElementById('custProfilePhone').textContent = customer.phone;
            document.getElementById('custProfileAddress').textContent = customer.address;
            document.getElementById('custProfileDob').textContent = customer.dob;
        }

        // My Policies Table
        const polBody = document.getElementById('custPoliciesBody');
        if (polBody) {
            if (myPolicies.length === 0) {
                polBody.innerHTML = `<tr><td colspan="6" class="table-empty-state">No insurance policies currently active.</td></tr>`;
            } else {
                polBody.innerHTML = myPolicies.map(p => `
                    <tr>
                        <td class="cell-primary">${p.policyNumber}</td>
                        <td>${p.productName}</td>
                        <td>₹${p.coverageAmount.toLocaleString()}</td>
                        <td>₹${p.premiumAmount}/yr</td>
                        <td>${p.expiryDate}</td>
                        <td><span class="badge ${this.getPolicyBadgeClass(p.status)}"><span class="badge-dot"></span>${p.status}</span></td>
                        <td>
                            <button class="btn btn-outline btn-sm" onclick="App.openPolicyDetailsModal('${p.policyNumber}')">Details</button>
                            ${p.status === 'Active' || p.status === 'Expired' ? `
                                <button class="btn btn-accent btn-sm" onclick="App.openRenewModal('${p.policyNumber}')">Renew</button>
                            ` : ''}
                        </td>
                    </tr>
                `).join('');
            }
        }

        // My Claims Table
        const clmBody = document.getElementById('custClaimsBody');
        if (clmBody) {
            if (myClaims.length === 0) {
                clmBody.innerHTML = `<tr><td colspan="6" class="table-empty-state">No claims lodged to date.</td></tr>`;
            } else {
                clmBody.innerHTML = myClaims.map(c => `
                    <tr>
                        <td class="cell-primary">${c.claimId}</td>
                        <td>${c.policyNumber}</td>
                        <td>${c.claimType}</td>
                        <td>₹${c.claimedAmount.toLocaleString()}</td>
                        <td><span class="badge ${this.getClaimBadgeClass(c.claimStatus)}"><span class="badge-dot"></span>${c.claimStatus}</span></td>
                        <td>
                            <button class="btn btn-outline btn-sm" onclick="App.openClaimDetailsModal('${c.claimId}')">Track</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    },

    // ==================== CUSTOMERS MODULE ====================
    renderCustomersTable() {
        const query = (document.getElementById('customerSearchInput')?.value || '').trim();
        const list = Customers.search(query);
        const tbody = document.getElementById('customersTableBody');

        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="table-empty-state"><p>No matching customer records found.</p></td></tr>`;
            return;
        }

        const isAdmin = Auth.isAdmin();

        tbody.innerHTML = list.map(c => `
            <tr>
                <td class="cell-primary">${c.id}</td>
                <td>
                    <div style="font-weight: 600; color: var(--primary-900);">${c.fullName}</div>
                    <div class="text-xs text-muted">${c.dob ? 'DOB: ' + c.dob : ''}</div>
                </td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.address}</td>
                <td><span class="badge badge-active"><span class="badge-dot"></span>${c.status || 'Active'}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-sm" onclick="App.openCustomerDetailsModal('${c.id}')">View</button>
                        <button class="btn btn-outline btn-sm" onclick="App.openEditCustomerModal('${c.id}')">Edit</button>
                        ${isAdmin ? `<button class="btn btn-outline btn-sm" style="color: var(--danger-solid);" onclick="App.confirmDeleteCustomer('${c.id}')">Delete</button>` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    openAddCustomerModal() {
        document.getElementById('customerModalTitle').textContent = 'Register New Customer';
        document.getElementById('customerFormId').value = '';
        document.getElementById('customerFullName').value = '';
        document.getElementById('customerEmail').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerAddress').value = '';
        document.getElementById('customerDob').value = '1995-01-01';
        this.openModal('customerModal');
    },

    openEditCustomerModal(customerId) {
        const customer = Customers.getById(customerId);
        if (!customer) return;

        document.getElementById('customerModalTitle').textContent = `Edit Customer - ${customer.id}`;
        document.getElementById('customerFormId').value = customer.id;
        document.getElementById('customerFullName').value = customer.fullName;
        document.getElementById('customerEmail').value = customer.email;
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerAddress').value = customer.address;
        document.getElementById('customerDob').value = customer.dob || '';
        this.openModal('customerModal');
    },

    saveCustomerForm(event) {
        event.preventDefault();
        const id = document.getElementById('customerFormId').value;
        const fullName = document.getElementById('customerFullName').value;
        const email = document.getElementById('customerEmail').value;
        const phone = document.getElementById('customerPhone').value;
        const address = document.getElementById('customerAddress').value;
        const dob = document.getElementById('customerDob').value;

        if (!fullName || !email || !phone) {
            this.toast('Please fill in all mandatory fields.', 'error');
            return;
        }

        const res = Customers.save({ id, fullName, email, phone, address, dob });
        if (res.success) {
            this.toast(res.isNew ? 'Customer registered successfully!' : 'Customer updated successfully!', 'success');
            this.closeModal('customerModal');
            this.renderCustomersTable();
        } else {
            this.toast(res.message || 'Operation failed.', 'error');
        }
    },

    confirmDeleteCustomer(customerId) {
        const customer = Customers.getById(customerId);
        if (!customer) return;

        if (confirm(`Are you sure you want to delete customer "${customer.fullName}" (${customerId})? This cannot be undone.`)) {
            const res = Customers.delete(customerId);
            if (res.success) {
                this.toast(res.message, 'success');
                this.renderCustomersTable();
            } else {
                this.toast(res.message, 'error');
            }
        }
    },

    openCustomerDetailsModal(customerId) {
        const customer = Customers.getById(customerId);
        if (!customer) return;

        const policies = Customers.getCustomerPolicies(customerId);
        const claims = Customers.getCustomerClaims(customerId);

        document.getElementById('viewCustName').textContent = customer.fullName;
        document.getElementById('viewCustId').textContent = customer.id;
        document.getElementById('viewCustEmail').textContent = customer.email;
        document.getElementById('viewCustPhone').textContent = customer.phone;
        document.getElementById('viewCustAddress').textContent = customer.address;
        document.getElementById('viewCustDob').textContent = customer.dob;
        document.getElementById('viewCustRegistered').textContent = customer.registeredDate;

        // Render their policies
        const polBody = document.getElementById('viewCustPoliciesBody');
        if (policies.length === 0) {
            polBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted" style="padding: 1rem;">No policies found.</td></tr>`;
        } else {
            polBody.innerHTML = policies.map(p => `
                <tr>
                    <td class="cell-primary">${p.policyNumber}</td>
                    <td>${p.productName}</td>
                    <td>₹${p.premiumAmount}/yr</td>
                    <td><span class="badge ${this.getPolicyBadgeClass(p.status)}">${p.status}</span></td>
                </tr>
            `).join('');
        }

        // Render their claims
        const clmBody = document.getElementById('viewCustClaimsBody');
        if (claims.length === 0) {
            clmBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted" style="padding: 1rem;">No claims found.</td></tr>`;
        } else {
            clmBody.innerHTML = claims.map(c => `
                <tr>
                    <td class="cell-primary">${c.claimId}</td>
                    <td>₹${c.claimedAmount.toLocaleString()}</td>
                    <td><span class="badge ${this.getClaimBadgeClass(c.claimStatus)}">${c.claimStatus}</span></td>
                    <td class="text-xs">${c.claimDate}</td>
                </tr>
            `).join('');
        }

        this.openModal('customerDetailsModal');
    },

    // ==================== PRODUCTS MODULE ====================
    renderProductsGrid() {
        const category = document.getElementById('productCategoryFilter')?.value || 'All';
        const list = Products.getByCategory(category);
        const container = document.getElementById('productsContainer');
        if (!container) return;

        const isAdmin = Auth.isAdmin();

        container.innerHTML = list.map(p => `
            <div class="product-card">
                <div class="product-card-top">
                    <div>
                        <span class="category-pill category-${p.category.toLowerCase()}">${p.category} Insurance</span>
                        <h3 class="product-title" style="margin-top: 0.5rem;">${p.name}</h3>
                        <div class="text-xs text-muted">ID: ${p.id}</div>
                    </div>
                    ${isAdmin ? `
                        <div class="table-actions">
                            <button class="btn btn-icon-only" title="Edit" onclick="App.openEditProductModal('${p.id}')">
                                <svg class="svg-icon" style="width: 16px; height: 16px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button class="btn btn-icon-only" title="Delete" style="color: var(--danger-solid);" onclick="App.confirmDeleteProduct('${p.id}')">
                                <svg class="svg-icon" style="width: 16px; height: 16px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    ` : ''}
                </div>
                <p class="product-description">${p.description}</p>
                <div class="product-pricing-box">
                    <div>
                        <div class="product-price-label">Coverage Limit</div>
                        <div style="font-weight: 700; color: var(--primary-900);">₹${p.coverage.toLocaleString()}</div>
                    </div>
                    <div class="text-right">
                        <div class="product-price-label">Base Premium</div>
                        <div class="product-price-val">₹${p.basePremium}<span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">/yr</span></div>
                    </div>
                </div>
                <ul class="product-features-list">
                    ${(p.features || ['Comprehensive Standard Protection Cover']).map(f => `
                        <li>
                            <svg class="svg-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>${f}</span>
                        </li>
                    `).join('')}
                </ul>
                <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid #EDF2F7; display: flex; justify-content: space-between; align-items: center;">
                    <span class="text-xs text-muted">Term: ${p.duration} Year(s)</span>
                    <button class="btn btn-accent btn-sm" onclick="App.openCreatePolicyForProduct('${p.id}')">Create Policy</button>
                </div>
            </div>
        `).join('');
    },

    openAddProductModal() {
        document.getElementById('productModalTitle').textContent = 'Add Insurance Product';
        document.getElementById('productFormId').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('productCategory').value = 'Life';
        document.getElementById('productCoverage').value = '100000';
        document.getElementById('productBasePremium').value = '350';
        document.getElementById('productDuration').value = '1';
        document.getElementById('productDescription').value = '';
        this.openModal('productModal');
    },

    openEditProductModal(productId) {
        const prod = Products.getById(productId);
        if (!prod) return;

        document.getElementById('productModalTitle').textContent = `Edit Product - ${prod.id}`;
        document.getElementById('productFormId').value = prod.id;
        document.getElementById('productName').value = prod.name;
        document.getElementById('productCategory').value = prod.category;
        document.getElementById('productCoverage').value = prod.coverage;
        document.getElementById('productBasePremium').value = prod.basePremium;
        document.getElementById('productDuration').value = prod.duration;
        document.getElementById('productDescription').value = prod.description;
        this.openModal('productModal');
    },

    saveProductForm(event) {
        event.preventDefault();
        const id = document.getElementById('productFormId').value;
        const name = document.getElementById('productName').value;
        const category = document.getElementById('productCategory').value;
        const coverage = document.getElementById('productCoverage').value;
        const basePremium = document.getElementById('productBasePremium').value;
        const duration = document.getElementById('productDuration').value;
        const description = document.getElementById('productDescription').value;

        if (!name || !coverage || !basePremium) {
            this.toast('Please fill in product details.', 'error');
            return;
        }

        const res = Products.save({ id, name, category, coverage, basePremium, duration, description });
        if (res.success) {
            this.toast('Insurance product saved successfully!', 'success');
            this.closeModal('productModal');
            this.renderProductsGrid();
        }
    },

    confirmDeleteProduct(productId) {
        const prod = Products.getById(productId);
        if (!prod) return;

        if (confirm(`Are you sure you want to delete product "${prod.name}"?`)) {
            const res = Products.delete(productId);
            if (res.success) {
                this.toast(res.message, 'success');
                this.renderProductsGrid();
            } else {
                this.toast(res.message, 'error');
            }
        }
    },

    // ==================== POLICIES MODULE ====================
    renderPoliciesTable() {
        const status = document.getElementById('policyStatusFilter')?.value || 'All';
        const category = document.getElementById('policyCategoryFilter')?.value || 'All';
        const query = (document.getElementById('policySearchInput')?.value || '').trim();

        const list = Policies.filter(status, category, query);
        const tbody = document.getElementById('policiesTableBody');
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="table-empty-state"><p>No policy records found.</p></td></tr>`;
            return;
        }

        const isCustomer = Auth.isCustomer();

        tbody.innerHTML = list.map(p => `
            <tr>
                <td class="cell-primary">${p.policyNumber}</td>
                <td>
                    <div style="font-weight: 600; color: var(--primary-900);">${p.customerName}</div>
                    <div class="text-xs text-muted">${p.customerId}</div>
                </td>
                <td>
                    <div>${p.productName}</div>
                    <span class="category-pill category-${p.category.toLowerCase()}">${p.category}</span>
                </td>
                <td>₹${p.coverageAmount.toLocaleString()}</td>
                <td style="font-weight: 600;">₹${p.premiumAmount}/yr</td>
                <td>
                    <div class="text-xs text-muted">Expires</div>
                    <div style="font-weight: 500;">${p.expiryDate}</div>
                </td>
                <td><span class="badge ${this.getPolicyBadgeClass(p.status)}"><span class="badge-dot"></span>${p.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-sm" onclick="App.openPolicyDetailsModal('${p.policyNumber}')">View</button>
                        ${p.status === 'Active' || p.status === 'Expired' ? `
                            <button class="btn btn-outline btn-sm" style="color: var(--accent-600);" onclick="App.openRenewModal('${p.policyNumber}')">Renew</button>
                        ` : ''}
                        ${!isCustomer && p.status === 'Active' ? `
                            <button class="btn btn-outline btn-sm" style="color: var(--danger-solid);" onclick="App.confirmCancelPolicy('${p.policyNumber}')">Cancel</button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    openCreatePolicyModal(prefilledProductId = null) {
        // Populate customer dropdown
        const custSelect = document.getElementById('newPolicyCustomerId');
        const customers = Customers.getAll();
        custSelect.innerHTML = customers.map(c => `<option value="${c.id}">${c.fullName} (${c.id})</option>`).join('');

        // Populate product dropdown
        const prodSelect = document.getElementById('newPolicyProductId');
        const products = Products.getAll();
        prodSelect.innerHTML = products.map(p => `<option value="${p.id}" data-category="${p.category}" data-coverage="${p.coverage}" data-base="${p.basePremium}" data-duration="${p.duration}">${p.name} - ${p.category} (₹${p.basePremium}/yr)</option>`).join('');

        if (prefilledProductId) {
            prodSelect.value = prefilledProductId;
        }

        // Set default start date to today
        document.getElementById('newPolicyStartDate').value = new Date().toISOString().split('T')[0];

        // Trigger dynamic updates
        this.updatePolicyModalValues();
        this.openModal('createPolicyModal');
    },

    openCreatePolicyForProduct(productId) {
        this.navigateTo('policies');
        this.openCreatePolicyModal(productId);
    },

    updatePolicyModalValues() {
        const prodSelect = document.getElementById('newPolicyProductId');
        const selectedOpt = prodSelect.options[prodSelect.selectedIndex];
        if (!selectedOpt) return;

        const baseCoverage = selectedOpt.getAttribute('data-coverage');
        const basePremium = selectedOpt.getAttribute('data-base');
        const duration = selectedOpt.getAttribute('data-duration');

        document.getElementById('newPolicyCoverage').value = baseCoverage;
        document.getElementById('newPolicyDuration').value = duration;
        document.getElementById('newPolicyPremium').value = basePremium;
    },

    saveNewPolicy(event) {
        event.preventDefault();
        const customerId = document.getElementById('newPolicyCustomerId').value;
        const productId = document.getElementById('newPolicyProductId').value;
        const startDate = document.getElementById('newPolicyStartDate').value;
        const coverageAmount = document.getElementById('newPolicyCoverage').value;
        const durationYears = document.getElementById('newPolicyDuration').value;
        const premiumAmount = document.getElementById('newPolicyPremium').value;
        const paymentMethod = document.getElementById('newPolicyPaymentMethod').value;
        const notes = document.getElementById('newPolicyNotes').value;

        const res = Policies.create({
            customerId,
            productId,
            startDate,
            coverageAmount,
            durationYears,
            premiumAmount,
            paymentMethod,
            notes
        });

        if (res.success) {
            this.toast(`Policy ${res.policy.policyNumber} issued successfully!`, 'success');
            this.closeModal('createPolicyModal');
            this.renderPoliciesTable();
        } else {
            this.toast(res.message, 'error');
        }
    },

    openRenewModal(policyNumber) {
        const policy = Policies.getById(policyNumber);
        if (!policy) return;

        document.getElementById('renewPolicyNumber').value = policy.policyNumber;
        document.getElementById('renewCustName').textContent = policy.customerName;
        document.getElementById('renewProdName').textContent = policy.productName;
        document.getElementById('renewCurrentExpiry').textContent = policy.expiryDate;
        document.getElementById('renewPremiumAmount').textContent = `₹${policy.premiumAmount}`;
        document.getElementById('renewDurationYears').value = '1';

        this.openModal('renewPolicyModal');
    },

    executePolicyRenewal(event) {
        event.preventDefault();
        const policyNumber = document.getElementById('renewPolicyNumber').value;
        const durationYears = document.getElementById('renewDurationYears').value;
        const paymentMethod = document.getElementById('renewPaymentMethod').value;

        const res = Policies.renew(policyNumber, durationYears, paymentMethod);
        if (res.success) {
            this.toast(`Policy ${policyNumber} renewed successfully until ${res.policy.expiryDate}!`, 'success');
            this.closeModal('renewPolicyModal');
            this.renderCurrentPage(this.currentPage);
        } else {
            this.toast(res.message, 'error');
        }
    },

    confirmCancelPolicy(policyNumber) {
        const reason = prompt('Please provide a reason for cancelling this policy:');
        if (reason !== null && reason.trim()) {
            const res = Policies.cancel(policyNumber, reason);
            if (res.success) {
                this.toast(`Policy ${policyNumber} has been cancelled.`, 'info');
                this.renderPoliciesTable();
            } else {
                this.toast(res.message, 'error');
            }
        }
    },

    openPolicyDetailsModal(policyNumber) {
        const policy = Policies.getById(policyNumber);
        if (!policy) return;

        document.getElementById('detPolNumber').textContent = policy.policyNumber;
        document.getElementById('detPolCustomer').textContent = `${policy.customerName} (${policy.customerId})`;
        document.getElementById('detPolProduct').textContent = `${policy.productName} [${policy.category}]`;
        document.getElementById('detPolCoverage').textContent = `₹${policy.coverageAmount.toLocaleString()}`;
        document.getElementById('detPolPremium').textContent = `₹${policy.premiumAmount}/yr`;
        document.getElementById('detPolStart').textContent = policy.startDate;
        document.getElementById('detPolExpiry').textContent = policy.expiryDate;
        document.getElementById('detPolStatus').innerHTML = `<span class="badge ${this.getPolicyBadgeClass(policy.status)}">${policy.status}</span>`;
        document.getElementById('detPolNotes').textContent = policy.notes || 'No extra notes recorded.';

        this.openModal('policyDetailsModal');
    },

    // ==================== PREMIUM CALCULATOR ====================
    renderCalculator() {
        this.calculatePremiumLive();
    },

    calculatePremiumLive() {
        const category = document.getElementById('calcCategory')?.value || 'Life';
        const coverage = document.getElementById('calcCoverage')?.value || 100000;
        const duration = document.getElementById('calcDuration')?.value || 1;
        const age = document.getElementById('calcAge')?.value || 30;

        // Checkbox add-ons
        const addOns = [];
        if (document.getElementById('calcAddonAccidental')?.checked) addOns.push('accidental');
        if (document.getElementById('calcAddonCritical')?.checked) addOns.push('critical');
        if (document.getElementById('calcAddonZeroDep')?.checked) addOns.push('zero_dep');
        if (document.getElementById('calcAddonRoadside')?.checked) addOns.push('roadside');

        const result = Calculator.calculate({
            category,
            coverage: Number(coverage),
            durationYears: Number(duration),
            applicantAge: Number(age),
            addOns
        });

        // Update UI
        document.getElementById('calcTotalPremiumDisplay').textContent = `₹${result.finalAnnualPremium.toLocaleString()}`;
        document.getElementById('calcMonthlyDisplay').textContent = `or ~₹${result.monthlyInstallment}/month`;

        document.getElementById('calcBreakdownBase').textContent = `₹${result.basePremium}`;
        document.getElementById('calcBreakdownCoverage').textContent = `+₹${result.coverageCharge}`;
        document.getElementById('calcBreakdownAgeFactor').textContent = `x${result.ageMultiplier}`;
        document.getElementById('calcBreakdownDiscount').textContent = `-${result.termDiscountPercent}%`;
        document.getElementById('calcBreakdownAddons').textContent = `+₹${result.addOnsCost}`;
        document.getElementById('calcBreakdownTax').textContent = `+₹${result.tax}`;

        // Save last calculation state to memory for "Convert to Policy"
        this.lastCalculation = result;
    },

    applyQuoteToPolicy() {
        if (!this.lastCalculation) return;

        this.navigateTo('policies');
        this.openCreatePolicyModal();

        // Pre-fill fields from calculation
        document.getElementById('newPolicyCoverage').value = this.lastCalculation.coverage;
        document.getElementById('newPolicyDuration').value = this.lastCalculation.durationYears;
        document.getElementById('newPolicyPremium').value = this.lastCalculation.finalAnnualPremium;
        document.getElementById('newPolicyNotes').value = `Generated via Quote Calculator: ${this.lastCalculation.category} Plan (₹${this.lastCalculation.coverage} sum assured).`;
        
        this.toast('Quote applied to Policy Creation form!', 'info');
    },

    // ==================== PAYMENTS MODULE ====================
    renderPaymentsTable() {
        const status = document.getElementById('paymentStatusFilter')?.value || 'All';
        const query = (document.getElementById('paymentSearchInput')?.value || '').trim();

        const list = Payments.filter(status, query);
        const tbody = document.getElementById('paymentsTableBody');
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="table-empty-state"><p>No transaction records found.</p></td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(p => `
            <tr>
                <td class="cell-primary">${p.paymentId}</td>
                <td>
                    <div style="font-weight: 600; color: var(--primary-900);">${p.policyNumber}</div>
                    <div class="text-xs text-muted">${p.customerName}</div>
                </td>
                <td style="font-weight: 700; color: var(--primary-900);">₹${Number(p.amount).toLocaleString()}</td>
                <td>${p.paymentDate}</td>
                <td>
                    <div>${p.paymentMethod}</div>
                    <div class="text-xs text-muted">${p.transactionRef || '-'}</div>
                </td>
                <td><span class="badge ${this.getPaymentBadgeClass(p.paymentStatus)}"><span class="badge-dot"></span>${p.paymentStatus}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="App.openReceiptModal('${p.paymentId}')">Receipt</button>
                </td>
            </tr>
        `).join('');
    },

    openRecordPaymentModal() {
        // Populate active policies
        const polSelect = document.getElementById('recordPaymentPolicySelect');
        const policies = Policies.getAll();
        polSelect.innerHTML = policies.map(p => `<option value="${p.policyNumber}" data-custid="${p.customerId}" data-custname="${p.customerName}" data-amount="${p.premiumAmount}">${p.policyNumber} - ${p.customerName} (₹${p.premiumAmount})</option>`).join('');

        this.updatePaymentModalValues();
        this.openModal('recordPaymentModal');
    },

    updatePaymentModalValues() {
        const select = document.getElementById('recordPaymentPolicySelect');
        const opt = select.options[select.selectedIndex];
        if (!opt) return;

        document.getElementById('recordPaymentCustName').value = opt.getAttribute('data-custname');
        document.getElementById('recordPaymentAmount').value = opt.getAttribute('data-amount');
    },

    saveSimulatedPayment(event) {
        event.preventDefault();
        const select = document.getElementById('recordPaymentPolicySelect');
        const opt = select.options[select.selectedIndex];
        if (!opt) return;

        const policyNumber = select.value;
        const customerId = opt.getAttribute('data-custid');
        const customerName = opt.getAttribute('data-custname');
        const amount = document.getElementById('recordPaymentAmount').value;
        const paymentMethod = document.getElementById('recordPaymentMethod').value;
        const notes = document.getElementById('recordPaymentNotes').value;

        const res = Payments.recordPayment({
            policyNumber,
            customerId,
            customerName,
            amount,
            paymentMethod,
            paymentStatus: 'Successful',
            notes
        });

        if (res.success) {
            this.toast(`Simulated payment of ₹${amount} recorded successfully!`, 'success');
            this.closeModal('recordPaymentModal');
            this.renderPaymentsTable();
            this.openReceiptModal(res.payment.paymentId);
        }
    },

    openReceiptModal(paymentId) {
        const payment = Payments.getById(paymentId);
        if (!payment) return;

        document.getElementById('receiptPaymentId').textContent = payment.paymentId;
        document.getElementById('receiptTxnRef').textContent = payment.transactionRef;
        document.getElementById('receiptDate').textContent = payment.paymentDate;
        document.getElementById('receiptPolicyNo').textContent = payment.policyNumber;
        document.getElementById('receiptCustomer').textContent = `${payment.customerName} (${payment.customerId})`;
        document.getElementById('receiptMethod').textContent = payment.paymentMethod;
        document.getElementById('receiptAmount').textContent = `₹${payment.amount.toLocaleString()}`;
        document.getElementById('receiptStatus').innerHTML = `<span class="badge ${this.getPaymentBadgeClass(payment.paymentStatus)}">${payment.paymentStatus}</span>`;

        this.openModal('paymentReceiptModal');
    },

    // ==================== CLAIMS MODULE ====================
    renderClaimsTable() {
        const status = document.getElementById('claimStatusFilter')?.value || 'All';
        const query = (document.getElementById('claimSearchInput')?.value || '').trim();

        const list = Claims.filter(status, query);
        const tbody = document.getElementById('claimsTableBody');
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="table-empty-state"><p>No insurance claims found.</p></td></tr>`;
            return;
        }

        const isCustomer = Auth.isCustomer();

        tbody.innerHTML = list.map(c => `
            <tr>
                <td class="cell-primary">${c.claimId}</td>
                <td>
                    <div style="font-weight: 600; color: var(--primary-900);">${c.policyNumber}</div>
                    <div class="text-xs text-muted">${c.customerName}</div>
                </td>
                <td>${c.claimType}</td>
                <td>${c.claimDate}</td>
                <td style="font-weight: 700;">₹${c.claimedAmount.toLocaleString()}</td>
                <td><span class="badge ${this.getClaimBadgeClass(c.claimStatus)}"><span class="badge-dot"></span>${c.claimStatus}</span></td>
                <td>
                    <div class="text-xs text-muted">${c.settlementRef ? 'Settlement: ' + c.settlementRef : c.adminRemarks || '-'}</div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-sm" onclick="App.openClaimDetailsModal('${c.claimId}')">View</button>
                        ${!isCustomer ? `
                            <button class="btn btn-accent btn-sm" onclick="App.openClaimReviewModal('${c.claimId}')">Adjudicate</button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    openSubmitClaimModal() {
        const user = Auth.getCurrentUser();
        const polSelect = document.getElementById('claimPolicySelect');
        
        let availablePolicies = Policies.getAll();
        // If customer, only show customer's own active policies
        if (user && user.role === 'Customer') {
            availablePolicies = availablePolicies.filter(p => p.customerId === user.customerId);
        }

        if (availablePolicies.length === 0) {
            this.toast('No policies available to claim against.', 'error');
            return;
        }

        polSelect.innerHTML = availablePolicies.map(p => `
            <option value="${p.policyNumber}" data-custid="${p.customerId}" data-custname="${p.customerName}" data-coverage="${p.coverageAmount}" data-status="${p.status}">
                ${p.policyNumber} - ${p.customerName} (${p.productName} | Max ₹${p.coverageAmount})
            </option>
        `).join('');

        document.getElementById('claimAmountInput').value = '';
        document.getElementById('claimTypeInput').value = 'Accidental Vehicle Damage';
        document.getElementById('claimDescInput').value = '';

        this.openModal('submitClaimModal');
    },

    submitClaimForm(event) {
        event.preventDefault();
        const polSelect = document.getElementById('claimPolicySelect');
        const opt = polSelect.options[polSelect.selectedIndex];
        if (!opt) return;

        const policyNumber = polSelect.value;
        const customerId = opt.getAttribute('data-custid');
        const claimType = document.getElementById('claimTypeInput').value;
        const claimDescription = document.getElementById('claimDescInput').value;
        const claimedAmount = document.getElementById('claimAmountInput').value;

        if (!claimDescription || !claimedAmount) {
            this.toast('Please provide a claim description and claimed amount.', 'error');
            return;
        }

        const res = Claims.submitClaim({
            policyNumber,
            customerId,
            claimType,
            claimDescription,
            claimedAmount
        });

        if (res.success) {
            this.toast(`Claim ${res.claim.claimId} submitted successfully!`, 'success');
            this.closeModal('submitClaimModal');
            this.renderCurrentPage(this.currentPage);
        } else {
            this.toast(res.message, 'error');
        }
    },

    openClaimReviewModal(claimId) {
        const claim = Claims.getById(claimId);
        if (!claim) return;

        document.getElementById('revClaimId').textContent = claim.claimId;
        document.getElementById('revClaimHiddenId').value = claim.claimId;
        document.getElementById('revCustName').textContent = `${claim.customerName} (${claim.customerId})`;
        document.getElementById('revPolicyNumber').textContent = claim.policyNumber;
        document.getElementById('revClaimType').textContent = claim.claimType;
        document.getElementById('revClaimAmount').textContent = `₹${claim.claimedAmount.toLocaleString()}`;
        document.getElementById('revClaimDesc').textContent = claim.claimDescription;
        
        document.getElementById('revStatusSelect').value = claim.claimStatus === 'Settled' ? 'Settled' : claim.claimStatus;
        document.getElementById('revApprovedAmount').value = claim.approvedAmount !== null ? claim.approvedAmount : claim.claimedAmount;
        document.getElementById('revRemarks').value = claim.adminRemarks || '';

        // Settle button visibility
        const settleBtn = document.getElementById('revSettleBtn');
        if (claim.claimStatus === 'Approved') {
            settleBtn.classList.remove('hidden');
        } else {
            settleBtn.classList.add('hidden');
        }

        this.openModal('claimReviewModal');
    },

    saveClaimReview(event) {
        event.preventDefault();
        const claimId = document.getElementById('revClaimHiddenId').value;
        const newStatus = document.getElementById('revStatusSelect').value;
        const remarks = document.getElementById('revRemarks').value;
        const approvedAmount = document.getElementById('revApprovedAmount').value;

        const res = Claims.updateStatus(claimId, newStatus, remarks, approvedAmount);
        if (res.success) {
            this.toast(`Claim status updated to "${newStatus}"!`, 'success');
            this.closeModal('claimReviewModal');
            this.renderCurrentPage(this.currentPage);
        } else {
            this.toast(res.message, 'error');
        }
    },

    triggerDirectSettlement() {
        const claimId = document.getElementById('revClaimHiddenId').value;
        const res = Claims.settleClaim(claimId);
        if (res.success) {
            this.toast(`Claim settled! Disbursement Ref: ${res.settlementRef}`, 'success');
            this.closeModal('claimReviewModal');
            this.renderCurrentPage(this.currentPage);
        } else {
            this.toast(res.message, 'error');
        }
    },

    openClaimDetailsModal(claimId) {
        const claim = Claims.getById(claimId);
        if (!claim) return;

        document.getElementById('viewClaimId').textContent = claim.claimId;
        document.getElementById('viewClaimPolicy').textContent = claim.policyNumber;
        document.getElementById('viewClaimCustomer').textContent = `${claim.customerName} (${claim.customerId})`;
        document.getElementById('viewClaimDate').textContent = claim.claimDate;
        document.getElementById('viewClaimType').textContent = claim.claimType;
        document.getElementById('viewClaimAmount').textContent = `₹${claim.claimedAmount.toLocaleString()}`;
        document.getElementById('viewClaimStatus').innerHTML = `<span class="badge ${this.getClaimBadgeClass(c => claim.claimStatus)}">${claim.claimStatus}</span>`;
        document.getElementById('viewClaimSettlement').textContent = claim.settlementRef || 'Pending';
        document.getElementById('viewClaimDesc').textContent = claim.claimDescription;
        document.getElementById('viewClaimRemarks').textContent = claim.adminRemarks || 'None';

        // Render timeline
        const timeline = document.getElementById('claimHistoryTimeline');
        if (timeline) {
            timeline.innerHTML = (claim.history || []).map(h => `
                <div class="timeline-item completed">
                    <div class="timeline-dot"></div>
                    <div class="timeline-title">${h.status}</div>
                    <div class="timeline-time">${h.timestamp}</div>
                    <div class="timeline-desc">${h.note}</div>
                </div>
            `).join('');
        }

        this.openModal('claimDetailsModal');
    },

    // ==================== REPORTS & ANALYTICS ====================
    renderReports() {
        const analytics = Reports.getAnalytics();

        // Summary cards
        document.getElementById('repTotalPremium').textContent = '₹' + analytics.totalPremiumCollected.toLocaleString();
        document.getElementById('repActivePolicies').textContent = `${analytics.activePolicies} of ${analytics.totalPolicies}`;
        document.getElementById('repSettlementRate').textContent = `${analytics.settlementRate}%`;
        document.getElementById('repTotalClaimsPaid').textContent = '₹' + analytics.totalSettledAmount.toLocaleString();

        // Render Category Breakdown Bars
        const catContainer = document.getElementById('reportCategoryBars');
        if (catContainer) {
            const maxVal = Math.max(analytics.categoryPremiums.Life, analytics.categoryPremiums.Health, analytics.categoryPremiums.Vehicle, 1);
            
            catContainer.innerHTML = `
                <div class="bar-row">
                    <div class="bar-meta">
                        <span>Life Insurance (${analytics.categoryCounts.Life} policies)</span>
                        <span>₹${analytics.categoryPremiums.Life.toLocaleString()}</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill bar-fill-life" style="width: ${(analytics.categoryPremiums.Life / maxVal) * 100}%;"></div>
                    </div>
                </div>
                <div class="bar-row">
                    <div class="bar-meta">
                        <span>Health Insurance (${analytics.categoryCounts.Health} policies)</span>
                        <span>₹${analytics.categoryPremiums.Health.toLocaleString()}</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill bar-fill-health" style="width: ${(analytics.categoryPremiums.Health / maxVal) * 100}%;"></div>
                    </div>
                </div>
                <div class="bar-row">
                    <div class="bar-meta">
                        <span>Vehicle Insurance (${analytics.categoryCounts.Vehicle} policies)</span>
                        <span>₹${analytics.categoryPremiums.Vehicle.toLocaleString()}</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill bar-fill-vehicle" style="width: ${(analytics.categoryPremiums.Vehicle / maxVal) * 100}%;"></div>
                    </div>
                </div>
            `;
        }

        // Render Claim Status Distribution Bars
        const claimContainer = document.getElementById('reportClaimStatusBars');
        if (claimContainer) {
            const total = analytics.totalClaims || 1;
            claimContainer.innerHTML = `
                <div class="bar-row">
                    <div class="bar-meta"><span>Settled</span><span>${analytics.claimStatuses.Settled}</span></div>
                    <div class="bar-track"><div class="bar-fill bar-fill-success" style="width: ${(analytics.claimStatuses.Settled / total) * 100}%;"></div></div>
                </div>
                <div class="bar-row">
                    <div class="bar-meta"><span>Approved (Awaiting Settlement)</span><span>${analytics.claimStatuses.Approved}</span></div>
                    <div class="bar-track"><div class="bar-fill bar-fill-health" style="width: ${(analytics.claimStatuses.Approved / total) * 100}%;"></div></div>
                </div>
                <div class="bar-row">
                    <div class="bar-meta"><span>Under Review / In Assessment</span><span>${analytics.claimStatuses.UnderReview}</span></div>
                    <div class="bar-track"><div class="bar-fill bar-fill-warning" style="width: ${(analytics.claimStatuses.UnderReview / total) * 100}%;"></div></div>
                </div>
                <div class="bar-row">
                    <div class="bar-meta"><span>Submitted Intake</span><span>${analytics.claimStatuses.Submitted}</span></div>
                    <div class="bar-track"><div class="bar-fill bar-fill-life" style="width: ${(analytics.claimStatuses.Submitted / total) * 100}%;"></div></div>
                </div>
                <div class="bar-row">
                    <div class="bar-meta"><span>Rejected</span><span>${analytics.claimStatuses.Rejected}</span></div>
                    <div class="bar-track"><div class="bar-fill bar-fill-danger" style="width: ${(analytics.claimStatuses.Rejected / total) * 100}%;"></div></div>
                </div>
            `;
        }
    },

    // ==================== SYSTEM TESTING MODULE ====================
    renderSystemTesting() {
        const results = SystemTesting.getLastResults();
        this.renderTestTable(results);
    },

    runSystemTests() {
        this.toast('Executing automated system test suite...', 'info');
        const results = SystemTesting.runAll();
        this.renderTestTable(results);
        const passedCount = results.filter(r => r.passed).length;
        this.toast(`System testing completed: ${passedCount}/${results.length} tests passed!`, 'success');
    },

    renderTestTable(results) {
        const tbody = document.getElementById('systemTestsTableBody');
        if (!tbody) return;

        const passedCount = results.filter(r => r.status === 'Demo Passed').length;
        document.getElementById('testSummaryPassBadge').textContent = `${passedCount} of ${results.length} Passed`;

        tbody.innerHTML = results.map(t => `
            <tr>
                <td class="cell-primary">${t.id}</td>
                <td>
                    <div style="font-weight: 600; color: var(--primary-900);">${t.name}</div>
                    <div class="text-xs text-muted">${t.description}</div>
                </td>
                <td><span class="category-pill" style="background: #F1F5F9; color: var(--primary-800);">${t.category}</span></td>
                <td class="text-xs" style="color: var(--text-secondary);">${t.expected}</td>
                <td class="text-xs" style="font-weight: 500;">${t.actual}</td>
                <td>
                    ${t.status === 'Demo Passed' 
                        ? `<span class="badge badge-active"><span class="badge-dot"></span>Demo Passed</span>`
                        : t.status === 'Pending'
                        ? `<span class="badge badge-submitted"><span class="badge-dot"></span>Pending</span>`
                        : `<span class="badge badge-cancelled"><span class="badge-dot"></span>Failed</span>`
                    }
                </td>
            </tr>
        `).join('');
    },

    // ==================== SETTINGS MODULE ====================
    renderSettings() {
        const user = Auth.getCurrentUser();
        if (user) {
            document.getElementById('settingsUserRole').textContent = user.role;
            document.getElementById('settingsUserName').textContent = user.name;
            document.getElementById('settingsUserEmail').textContent = user.email;
        }

        const counts = {
            customers: Customers.getAll().length,
            policies: Policies.getAll().length,
            payments: Payments.getAll().length,
            claims: Claims.getAll().length,
            products: Products.getAll().length
        };

        document.getElementById('settingsStorageStats').textContent = 
            `${counts.customers} Customers, ${counts.products} Products, ${counts.policies} Policies, ${counts.payments} Payments, ${counts.claims} Claims in LocalStorage.`;
    },

    resetSystemData() {
        if (confirm('Are you sure you want to restore demo records to their initial state? Any custom entries will be reset.')) {
            Storage.resetAllData();
            this.toast('Demo data reset to factory demonstration records!', 'success');
            this.renderCurrentPage(this.currentPage);
        }
    },

    exportDataBackup() {
        const json = Storage.exportDataJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `insureguard_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(a);
        this.toast('System database exported successfully!', 'success');
    },

    importDataBackup(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const success = Storage.importDataJSON(e.target.result);
            if (success) {
                this.toast('System backup successfully imported!', 'success');
                this.renderCurrentPage(this.currentPage);
            } else {
                this.toast('Invalid JSON backup file structure.', 'error');
            }
        };
        reader.readAsText(file);
    },

    // ==================== BADGE HELPERS ====================
    getPolicyBadgeClass(status) {
        switch (status) {
            case 'Active': return 'badge-active';
            case 'Renewed': return 'badge-renewed';
            case 'Expired': return 'badge-expired';
            case 'Cancelled': return 'badge-cancelled';
            default: return 'badge-submitted';
        }
    },

    getClaimBadgeClass(status) {
        switch (status) {
            case 'Submitted': return 'badge-submitted';
            case 'Under Review': return 'badge-under-review';
            case 'Approved': return 'badge-approved';
            case 'Settled': return 'badge-settled';
            case 'Rejected': return 'badge-rejected';
            default: return 'badge-submitted';
        }
    },

    getPaymentBadgeClass(status) {
        switch (status) {
            case 'Successful': return 'badge-successful';
            case 'Pending': return 'badge-pending';
            case 'Failed': return 'badge-failed';
            default: return 'badge-submitted';
        }
    },

    // ==================== 3D INTERACTIVE TILT CONTROLLER ====================
    init3DTilt() {
        const tiltTargets = document.querySelectorAll('.stat-card, .product-card, .calc-summary-card, .home-hero-banner, .login-card, .card');
        tiltTargets.forEach(card => {
            if (card.dataset.tiltActive) return;
            card.dataset.tiltActive = 'true';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Subtle professional 3D tilt angles (max ~5.5 degrees)
                const rotateX = ((y - centerY) / centerY) * -5.5;
                const rotateY = ((x - centerX) / centerX) * 5.5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
                card.style.transition = 'transform 0.08s ease-out, box-shadow 0.08s ease-out';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease';
            });
        });
    },

    // ==================== GLOBAL EVENT BINDING ====================
    bindEvents() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const u = document.getElementById('loginUsername').value;
                const p = document.getElementById('loginPassword').value;
                const res = Auth.login(u, p);
                if (res.success) {
                    this.toast(`Welcome back, ${res.user.name}!`, 'success');
                    this.showAppLayout();
                    this.navigateTo(Auth.getRoleDefaultPage());
                } else {
                    this.toast(res.message, 'error');
                }
            });
        }

        // Quick login autofill buttons
        document.querySelectorAll('.btn-demo-quick').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const role = e.currentTarget.getAttribute('data-demo-role');
                if (role === 'admin') {
                    document.getElementById('loginUsername').value = 'admin';
                    document.getElementById('loginPassword').value = 'admin123';
                } else if (role === 'agent') {
                    document.getElementById('loginUsername').value = 'agent';
                    document.getElementById('loginPassword').value = 'agent123';
                } else if (role === 'customer') {
                    document.getElementById('loginUsername').value = 'customer';
                    document.getElementById('loginPassword').value = 'customer123';
                }
                document.getElementById('loginForm').dispatchEvent(new Event('submit'));
            });
        });

        // Sidebar Navigation click
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                if (page) this.navigateTo(page);
            });
        });

        // Mobile drawer toggle
        const toggleBtn = document.getElementById('mobileToggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('open');
            });
        }

        // Top role quick switch
        const roleDropdown = document.getElementById('roleSwitcherSelect');
        if (roleDropdown) {
            roleDropdown.addEventListener('change', (e) => {
                const targetUser = e.target.value;
                const demoAcc = DEMO_ACCOUNTS[targetUser];
                if (demoAcc) {
                    Auth.login(demoAcc.username, demoAcc.password);
                    this.updateUserBadge();
                    this.updateSidebarNav();
                    this.navigateTo(Auth.getRoleDefaultPage());
                    this.toast(`Switched perspective to ${demoAcc.role} (${demoAcc.name})`, 'info');
                }
            });
        }

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            Auth.logout();
            this.showLoginLayout();
            this.toast('You have been logged out successfully.', 'info');
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeAllModals();
                }
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
