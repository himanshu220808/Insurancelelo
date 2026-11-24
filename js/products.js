/**
 * Insurance Policy Management System
 * products.js - Insurance Products Management Module
 */

const Products = {
    getAll() {
        return Storage.get(STORAGE_KEYS.PRODUCTS, []);
    },

    getById(productId) {
        return this.getAll().find(p => p.id === productId) || null;
    },

    getByCategory(category) {
        const products = this.getAll();
        if (!category || category === 'All') return products;
        return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    },

    save(productData) {
        const products = this.getAll();
        const existingIndex = products.findIndex(p => p.id === productData.id);

        if (existingIndex >= 0) {
            products[existingIndex] = {
                ...products[existingIndex],
                name: productData.name.trim(),
                category: productData.category,
                coverage: Number(productData.coverage),
                basePremium: Number(productData.basePremium),
                duration: Number(productData.duration),
                description: productData.description.trim(),
                status: productData.status || 'Active'
            };
            Storage.set(STORAGE_KEYS.PRODUCTS, products);
            Storage.logActivity(`Updated insurance product: ${productData.name} (${productData.id})`);
            return { success: true, product: products[existingIndex] };
        } else {
            const newProduct = {
                id: productData.id || Storage.generateId('PROD'),
                name: productData.name.trim(),
                category: productData.category,
                coverage: Number(productData.coverage),
                basePremium: Number(productData.basePremium),
                duration: Number(productData.duration),
                description: productData.description.trim(),
                features: productData.features || ['Standard Protection Cover', '24x7 Customer Support'],
                status: productData.status || 'Active'
            };
            products.unshift(newProduct);
            Storage.set(STORAGE_KEYS.PRODUCTS, products);
            Storage.logActivity(`Created new insurance product: ${newProduct.name} (${newProduct.id})`);
            return { success: true, product: newProduct };
        }
    },

    delete(productId) {
        const products = this.getAll();
        const target = products.find(p => p.id === productId);
        if (!target) return { success: false, message: 'Product not found.' };

        // Check if policies are linked
        const policies = Storage.get(STORAGE_KEYS.POLICIES, []);
        const linked = policies.filter(p => p.productId === productId);
        if (linked.length > 0) {
            return {
                success: false,
                message: `Cannot delete product. It is referenced by ${linked.length} policy record(s).`
            };
        }

        const filtered = products.filter(p => p.id !== productId);
        Storage.set(STORAGE_KEYS.PRODUCTS, filtered);
        Storage.logActivity(`Deleted insurance product: ${target.name} (${target.id})`);
        return { success: true, message: `Product ${target.name} deleted successfully.` };
    }
};
