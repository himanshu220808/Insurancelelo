# InsureGuard - Insurance Policy Management System
**College Micro-Project: Frontend Web Development**

A complete, modern, responsive Insurance Policy Management System built strictly with vanilla **HTML5, CSS3, and JavaScript**, powered by client-side **LocalStorage** for persistence without external backends or database dependencies.

---

## 1. Demo Credentials & Roles

| Role | Username | Password | Linked Demo Profile |
|------|----------|----------|---------------------|
| **Administrator** | `admin` | `admin123` | Arthur Vance (System Administrator) |
| **Insurance Agent** | `agent` | `agent123` | Sarah Jenkins (AGT-201) |
| **Customer** | `customer` | `customer123` | David Miller (CUST-1001) |

*Tip: The login page includes 1-click demo login buttons for immediate testing.*

---

## 2. Core Functional Modules

1. **Role-Based Authentication & Access Control (RBAC):**
   - Three distinct portals: Administrator, Insurance Agent, and Customer.
   - Dynamic sidebar navigation with view permissions.
   - Quick perspective switcher in the top navigation bar.

2. **Customer Management Module:**
   - Full CRUD: Add, edit, delete (with active policy guard), and search.
   - Customer profile inspection modal displaying associated policies and claims.

3. **Insurance Product Portfolio:**
   - Three core categories: Life Insurance, Health Insurance, and Vehicle Insurance.
   - Add, edit, delete, and filter products with standard terms and base rates.

4. **Policy Administration:**
   - Create new policy with customer selector, product binding, and automatic expiry calculation.
   - Policy statuses: `Active`, `Expired`, `Cancelled`, `Renewed`.
   - Policy renewal workflow with extension terms and simulated receipt issuance.
   - Cancellation workflow with reason auditing.

5. **Smart Premium Calculator:**
   - Actuarial estimation formula based on sum assured, category baseline, age risk bracket, multi-year discount, and riders (Accidental, Critical Illness, Zero Depreciation, Roadside Assistance).
   - "Convert Quote to New Policy" button that pre-populates the policy issuance form.

6. **Simulated Payment Gateway & Ledger:**
   - Record demo payments via Credit Card, Debit Card, UPI, Net Banking, or Bank Cheque.
   - Unique transaction reference generator (`TXN-CC-*`, `TXN-UPI-*`, etc.).
   - Official printable payment receipt dialog.

7. **Claims Adjudication System:**
   - Full lifecycle: `Submitted` → `Under Review` → `Approved` / `Rejected` → `Settled`.
   - Automated policy eligibility validation (blocks claims on expired or cancelled policies, or claims exceeding coverage limit).
   - Claim status history timeline tracking every change.
   - Duplicate settlement protection preventing multiple payouts on the same claim.

8. **Reports & Business Analytics:**
   - Pure CSS/SVG bar charts for revenue by line and claims distribution.
   - Aggregated KPIs (Premium collected, Loss ratio, Approval rate).
   - Printable report view using `@media print` styling.

9. **System Testing Suite (Milestone 4):**
   - 8 automated test cases with live browser test runner.
   - Tests field validations, boundary calculations, date ordering, unique key collisions, claims progression, payment simulation, LocalStorage round-trip, and duplicate settlement blocks.

10. **Data Persistence & Backups:**
    - LocalStorage persistence.
    - JSON Export and Import backup utilities.
    - Reset Demo Data to initial state.

---

## 3. How to Run the Project

1. Open the project folder in VS Code.
2. Right-click on `index.html` and choose **"Open with Live Server"** (or simply double-click `index.html` to open in any web browser like Chrome, Edge, or Firefox).
3. Select any demo user on the login screen to explore the respective portal.
