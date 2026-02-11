// script.js - NEXORA Public Site

// Load divisions (same as before)
function loadDivisions() {
    const divisions = JSON.parse(localStorage.getItem('nexoraDivisions')) || defaultDivisions;
    // ... (same as previous)
}

// Load partners ke public page
function loadPartnersToPublic() {
    const partners = JSON.parse(localStorage.getItem('nexoraPartners')) || [];
    
    // Render partners grid
    const partnersContainer = document.getElementById('partners-container');
    if (partnersContainer) {
        partnersContainer.innerHTML = partners.map(partner => `
            <a href="${partner.url || '#'}" target="_blank" class="partner-card" rel="noopener noreferrer">
                <div class="partner-icon"><i class="${partner.icon}"></i></div>
                <h4>${partner.name}</h4>
                <span class="partner-division">${partner.division === 'all' ? 'Global Partner' : partner.division}</span>
            </a>
        `).join('');
    }
    
    // Render client logos di bawah
    const clientContainer = document.getElementById('client-logos-container');
    if (clientContainer) {
        // Ambil 6 partner random untuk ditampilkan di client section
        const displayPartners = partners.slice(0, 7);
        clientContainer.innerHTML = displayPartners.map(partner => `
            <a href="${partner.url || '#'}" target="_blank" style="color: inherit;">
                <i class="${partner.icon}" style="font-size: 2.8rem; color: #8fa0c0; transition: 0.2s;" 
                   onmouseover="this.style.color='#00f0ff'" onmouseout="this.style.color='#8fa0c0'"></i>
            </a>
        `).join('');
    }
    
    // Render footer partners list
    const footerPartners = document.getElementById('footer-partners-list');
    if (footerPartners) {
        footerPartners.innerHTML = partners.slice(0, 5).map(partner => `
            <li><a href="${partner.url || '#'}" target="_blank">${partner.name}</a></li>
        `).join('');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDivisions();
    loadPartnersToPublic();
    // ... mobile menu etc
});