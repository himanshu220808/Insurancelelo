/**
 * Insurance Policy Management System
 * calculator.js - Premium Calculation Engine & Demonstration Logic
 */

const Calculator = {
    // Category base rate table
    CATEGORY_BASE_RATES: {
        Life: { base: 350, multiplier: 0.0008, durationDiscountPerYear: 0.01 },
        Health: { base: 260, multiplier: 0.0018, durationDiscountPerYear: 0.02 },
        Vehicle: { base: 220, multiplier: 0.0045, durationDiscountPerYear: 0.03 }
    },

    /**
     * Calculate estimated premium
     * @param {string} category - 'Life' | 'Health' | 'Vehicle'
     * @param {number} coverage - Sum assured / coverage amount
     * @param {number} durationYears - Policy term in years
     * @param {number} applicantAge - Age of primary insured
     * @param {Array<string>} addOns - Selected riders
     */
    calculate({ category = 'Life', coverage = 100000, durationYears = 1, applicantAge = 30, addOns = [] }) {
        const rates = this.CATEGORY_BASE_RATES[category] || this.CATEGORY_BASE_RATES.Life;
        
        const baseAmount = rates.base;
        
        // Coverage portion
        const coverageCharge = Math.round(Number(coverage) * rates.multiplier);

        // Age factor
        let ageMultiplier = 1.0;
        if (applicantAge > 60) ageMultiplier = 1.6;
        else if (applicantAge > 45) ageMultiplier = 1.35;
        else if (applicantAge > 35) ageMultiplier = 1.15;
        else if (applicantAge < 25) ageMultiplier = 0.95;

        // Subtotal before term & addons
        const riskSubtotal = (baseAmount + coverageCharge) * ageMultiplier;

        // Term adjustment (multi-year savings)
        const termDiscountRate = Math.min(0.20, (Number(durationYears) - 1) * rates.durationDiscountPerYear);
        const termAdjusted = riskSubtotal * (1 - termDiscountRate);

        // Add-ons computation
        let addOnsCost = 0;
        const addOnDetails = [];
        
        if (addOns.includes('accidental')) {
            const cost = 45;
            addOnsCost += cost;
            addOnDetails.push({ name: 'Accidental Death & Dismemberment Rider', cost });
        }
        if (addOns.includes('critical')) {
            const cost = 65;
            addOnsCost += cost;
            addOnDetails.push({ name: 'Critical Illness Protection Rider', cost });
        }
        if (addOns.includes('zero_dep')) {
            const cost = 75;
            addOnsCost += cost;
            addOnDetails.push({ name: 'Zero Depreciation Bumper Guard', cost });
        }
        if (addOns.includes('roadside')) {
            const cost = 25;
            addOnsCost += cost;
            addOnDetails.push({ name: '24x7 Roadside Assistance & Towing', cost });
        }

        const subtotal = Math.round(termAdjusted + addOnsCost);
        // Demo regulatory taxes / surcharge (5%)
        const tax = Math.round(subtotal * 0.05);
        const finalAnnualPremium = subtotal + tax;

        return {
            category,
            coverage: Number(coverage),
            durationYears: Number(durationYears),
            applicantAge: Number(applicantAge),
            basePremium: baseAmount,
            coverageCharge,
            ageMultiplier,
            termDiscountPercent: Math.round(termDiscountRate * 100),
            addOnsCost,
            addOnDetails,
            tax,
            finalAnnualPremium,
            monthlyInstallment: Math.round(finalAnnualPremium / 12)
        };
    }
};
