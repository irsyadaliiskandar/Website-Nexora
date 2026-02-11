// partnership.js - NEXORA Partnership Admin

const ADMIN_PASSWORD = "nexora2026";

// Initialize default partners
function initPartners() {
    if (!localStorage.getItem('nexoraPartners')) {
        const defaultPartners = [
            { id: 1, name: 'Google', icon: 'fab fa-google', url: 'https://google.com', division: 'all' },
            { id: 2, name: 'Microsoft', icon: 'fab fa-microsoft', url: 'https://microsoft.com', division: 'all' },
            { id: 3, name: 'Caterpillar', icon: 'fas fa-tractor', url: 'https://caterpillar.com', division: 'builders' },
            { id: 4, name: 'Toyota', icon: 'fas fa-car', url: 'https://toyota.com', division: 'automotive' },
            { id: 5, name: 'JCDecaux', icon: 'fas fa-ad', url: 'https://jcdecaux.com', division: 'advertisement' },
            { id: 6, name: 'Hertz', icon: 'fas fa-car-side', url: 'https://hertz.com', division: 'rental' }
        ];
        localStorage.setItem('nexoraPartners', JSON.stringify(defaultPartners));
    }
    
    if (!localStorage.getItem('nexoraOrders')) {
        localStorage.setItem('nexoraOrders', JSON.stringify([]));
    }
}

// Render partners list in admin
function renderPartnersList() {
    const partners = JSON.parse(localStorage.getItem('nexoraPartners')) || [];
    const container = document.getElementById('partners-list-container');
    if (!container) return;
    
    container.innerHTML = partners.map(partner => `
        <div class="partner-row">
            <div style="color: white;">${partner.name}</div>
            <div><i class="${partner.icon}" style="color: #00f0ff; font-size: 1.5rem;"></i> <span style="color: #98aac7; margin-left: 0.5rem;">${partner.icon}</span></div>
            <div style="color: #b5c8e2;">${partner.division}</div>
            <div style="display: flex; gap: 0.8rem;">
                <button class="btn-partner btn-edit" onclick="editPartner(${partner.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-partner btn-delete" onclick="deletePartner(${partner.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Render orders summary
function renderOrdersSummary() {
    const orders = JSON.parse(localStorage.getItem('nexoraOrders')) || [];
    const container = document.getElementById('orders-summary-container');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = '<p style="color: #98aac7;">No orders yet.</p>';
        return;
    }
    
    // Show last 5 orders
    const recentOrders = orders.slice(-5).reverse();
    container.innerHTML = recentOrders.map(order => `
        <div style="display: grid; grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr; gap: 1rem; padding: 0.8rem; border-bottom: 1px solid #2a3548; align-items: center;">
            <div style="color: white;">${order.division}</div>
            <div>${order.name}</div>
            <div style="color: #98aac7;">${order.email}</div>
            <div><span style="background: #ffb34720; color: #ffb347; padding: 0.2rem 0.8rem; border-radius: 20px;">${order.status || 'pending'}</span></div>
            <div style="font-size: 0.8rem; color: #6a80a0;">${order.date || 'Just now'}</div>
        </div>
    `).join('');
}

// CRUD Operations
window.editPartner = function(id) {
    const partners = JSON.parse(localStorage.getItem('nexoraPartners')) || [];
    const partner = partners.find(p => p.id === id);
    if (!partner) return;
    
    document.getElementById('partnerName').value = partner.name;
    document.getElementById('partnerLogo').value = partner.icon;
    document.getElementById('partnerUrl').value = partner.url || '';
    document.getElementById('partnerDivision').value = partner.division;
    
    // Store editing ID
    document.getElementById('savePartnerBtn').setAttribute('data-edit-id', id);
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
};

window.deletePartner = function(id) {
    if (confirm('Delete this partner?')) {
        let partners = JSON.parse(localStorage.getItem('nexoraPartners')) || [];
        partners = partners.filter(p => p.id !== id);
        localStorage.setItem('nexoraPartners', JSON.stringify(partners));
        renderPartnersList();
        // Also update public page if needed
        if (typeof loadPartnersToPublic === 'function') loadPartnersToPublic();
    }
};

// Save partner
function savePartner() {
    const partners = JSON.parse(localStorage.getItem('nexoraPartners')) || [];
    const name = document.getElementById('partnerName').value;
    const icon = document.getElementById('partnerLogo').value;
    const url = document.getElementById('partnerUrl').value;
    const division = document.getElementById('partnerDivision').value;
    const editId = document.getElementById('savePartnerBtn').getAttribute('data-edit-id');
    
    if (!name || !icon) {
        alert('Partner name and icon are required');
        return;
    }
    
    if (editId) {
        // Update existing
        const index = partners.findIndex(p => p.id == editId);
        if (index !== -1) {
            partners[index] = { ...partners[index], name, icon, url, division };
        }
        document.getElementById('savePartnerBtn').removeAttribute('data-edit-id');
        document.getElementById('cancelEditBtn').style.display = 'none';
    } else {
        // Create new
        const newId = partners.length > 0 ? Math.max(...partners.map(p => p.id)) + 1 : 1;
        partners.push({ id: newId, name, icon, url, division });
    }
    
    localStorage.setItem('nexoraPartners', JSON.stringify(partners));
    
    // Clear form
    document.getElementById('partnerName').value = '';
    document.getElementById('partnerLogo').value = '';
    document.getElementById('partnerUrl').value = '';
    document.getElementById('partnerDivision').value = 'all';
    
    renderPartnersList();
    alert('Partner saved!');
}

// Cancel edit
function cancelEdit() {
    document.getElementById('partnerName').value = '';
    document.getElementById('partnerLogo').value = '';
    document.getElementById('partnerUrl').value = '';
    document.getElementById('partnerDivision').value = 'all';
    document.getElementById('savePartnerBtn').removeAttribute('data-edit-id');
    document.getElementById('cancelEditBtn').style.display = 'none';
}

// Authentication
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('nexoraPartnerAdmin') === 'true';
    if (!isLoggedIn && window.location.pathname.includes('admin-partnership')) {
        const password = prompt('Enter admin password:');
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('nexoraPartnerAdmin', 'true');
        } else {
            alert('Incorrect password');
            window.location.href = 'index.html';
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('partners-list-container')) {
        initPartners();
        renderPartnersList();
        renderOrdersSummary();
        
        document.getElementById('savePartnerBtn').addEventListener('click', savePartner);
        document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);
        document.getElementById('logoutBtn').addEventListener('click', function() {
            sessionStorage.removeItem('nexoraPartnerAdmin');
            window.location.href = 'index.html';
        });
    }
});