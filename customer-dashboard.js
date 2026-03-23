// DOM Elements
const customerDashboard = document.getElementById('customerDashboard');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const navItems = document.querySelectorAll('.nav-item');
const dashboardSections = document.querySelectorAll('.dashboard-section');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');
const statValues = document.querySelectorAll('.stat-value');
const userName = document.getElementById('userName');
const userTypeBadge = document.getElementById('userTypeBadge');
const profileUserName = document.getElementById('profileUserName');
const profileUserEmail = document.getElementById('profileUserEmail');
const profileUserPhone = document.getElementById('profileUserPhone');
const pastRecordsNavItem = document.querySelector('.nav-item[data-section="records"]');

// Waste Calculator Elements
const wasteTypesGrid = document.getElementById('wasteTypesGrid');
const subtotalValue = document.getElementById('subtotalValue');
const pickupFee = document.getElementById('pickupFee');
const totalValue = document.getElementById('totalValue');
const pickupRequirement = document.getElementById('pickupRequirement');
const schedulePickupBtn = document.getElementById('schedulePickupBtn');

// Address Elements
const editAddressBtn = document.getElementById('editAddressBtn');
const saveAddressBtn = document.getElementById('saveAddressBtn');
const cancelAddressBtn = document.getElementById('cancelAddressBtn');
const addressDisplay = document.getElementById('addressDisplay');
const addressInput = document.getElementById('addressInput');
const addressFieldValue = document.getElementById('addressFieldValue');

// Settings Elements
const customerSettingsForm = document.getElementById('customerSettingsForm');
const customerCancelSettingsBtn = document.getElementById('customerCancelSettingsBtn');
const customerEmailNotifications = document.getElementById('customerEmailNotifications');
const customerSmsNotifications = document.getElementById('customerSmsNotifications');

// Waste types data with realistic Indian market values
const wasteTypes = [
    { id: 'newspaper', name: 'Newspaper', icon: 'fa-newspaper', value: 12, unit: 'kg' },
    { id: 'plastic-bottles', name: 'Plastic Bottles', icon: 'fa-wine-bottle', value: 25, unit: 'kg' },
    { id: 'cardboard', name: 'Cardboard', icon: 'fa-box', value: 10, unit: 'kg' },
    { id: 'glass-bottles', name: 'Glass Bottles', icon: 'fa-wine-glass', value: 8, unit: 'kg' },
    { id: 'aluminum-cans', name: 'Aluminum Cans', icon: 'fa-beer', value: 65, unit: 'kg' },
    { id: 'electronic', name: 'Electronic Waste', icon: 'fa-laptop', value: 120, unit: 'kg' },
    { id: 'batteries', name: 'Batteries', icon: 'fa-battery-full', value: 85, unit: 'kg' },
    { id: 'textiles', name: 'Textiles', icon: 'fa-tshirt', value: 15, unit: 'kg' }
];

// Minimum pickup amount
const minimumPickupAmount = 120;
const pickupFeeAmount = 30;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Set user information (in a real app, this would come from session/cookie)
    userName.textContent = 'Customer User';
    userTypeBadge.textContent = 'Customer';
    profileUserName.textContent = 'Customer User';
    profileUserEmail.textContent = 'customer@example.com';
    profileUserPhone.textContent = '+91 (555) 123-4567';
    
    // Initialize waste calculator
    initializeWasteCalculator();
    
    // Animate counters
    animateCounters();
});

// --- EVENT LISTENERS ---

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !menuToggle.contains(e.target) && 
        sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
    }
});

// Main navigation functionality
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding section
        const sectionId = item.getAttribute('data-section');
        dashboardSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
        
        // Initialize waste calculator when navigating to it
        if (sectionId === 'calculator') {
            initializeWasteCalculator();
        }

        // NEW: Fetch history when navigating to the records section
        if (sectionId === 'records') {
            fetchAndDisplayCustomerHistory();
        }
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('mobile-open');
        }
    });
});

// Schedule pickup button
schedulePickupBtn.addEventListener('click', async function() {
    if (this.disabled) return;

    const token = localStorage.getItem('token');
    if (!token) {
        showToast('You are not logged in!', 'error');
        return;
    }

    const wasteItems = [];
    wasteTypes.forEach(waste => {
        const input = document.querySelector(`input[data-waste-id="${waste.id}"]`);
        const quantity = parseFloat(input.value) || 0;
        if (quantity > 0) {
            wasteItems.push({ type: waste.name, weight: quantity });
        }
    });
    
    const total = parseFloat(totalValue.textContent.replace('₹', ''));
    const address = document.getElementById('addressDisplay').textContent;

    try {
        const response = await fetch('https://eco-cycle-hub-api.onrender.com/api/pickups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                wasteItems: wasteItems,
                totalValue: total,
                pickupAddress: address
            })
        });

        if (response.ok) {
             showToast('Pickup scheduled successfully!', 'success');
             setTimeout(() => initializeWasteCalculator(), 2000);
        } else {
             showToast('Failed to schedule pickup.', 'error');
        }
    } catch (error) {
        console.error('Schedule Pickup Error:', error);
        showToast('Could not connect to the server.', 'error');
    }
});

// --- ORIGINAL DASHBOARD FUNCTIONS (UNCHANGED) ---

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        showToast('Dark mode enabled', 'success');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        showToast('Light mode enabled', 'success');
    }
});

// Initialize waste calculator
function initializeWasteCalculator() {
    if (!wasteTypesGrid) return;
    wasteTypesGrid.innerHTML = '';
    
    wasteTypes.forEach(waste => {
        const wasteCard = document.createElement('div');
        wasteCard.className = 'waste-type-card';
        wasteCard.dataset.wasteId = waste.id;
        wasteCard.dataset.value = waste.value;
        
        wasteCard.innerHTML = `
            <div class="waste-type-icon">
                <i class="fas ${waste.icon}"></i>
            </div>
            <div class="waste-type-name">${waste.name}</div>
            <div class="waste-type-value">₹${waste.value.toFixed(2)} per ${waste.unit}</div>
            <div class="waste-quantity-container">
                <input type="number" class="waste-quantity-input" min="0" step="0.1" value="0" data-waste-id="${waste.id}">
                <span class="waste-quantity-unit">${waste.unit}</span>
            </div>
        `;
        
        wasteCard.addEventListener('click', function(e) {
            if (!e.target.classList.contains('waste-quantity-input')) {
                this.classList.toggle('selected');
                const input = this.querySelector('.waste-quantity-input');
                if (this.classList.contains('selected') && input.value === '0') {
                    input.value = '1';
                } else if (!this.classList.contains('selected')) {
                    input.value = '0';
                }
                updateWasteCalculator();
            }
        });
        
        const quantityInput = wasteCard.querySelector('.waste-quantity-input');
        quantityInput.addEventListener('input', function() {
            if (this.value > 0) {
                wasteCard.classList.add('selected');
            } else {
                wasteCard.classList.remove('selected');
            }
            updateWasteCalculator();
        });
        
        wasteTypesGrid.appendChild(wasteCard);
    });
    
    updateWasteCalculator();
}

// Update waste calculator calculations
function updateWasteCalculator() {
    let subtotal = 0;
    
    wasteTypes.forEach(waste => {
        const input = document.querySelector(`input[data-waste-id="${waste.id}"]`);
        if(input) {
            const quantity = parseFloat(input.value) || 0;
            subtotal += quantity * waste.value;
        }
    });
    
    let effectivePickupFee = pickupFeeAmount;
    if (subtotal >= minimumPickupAmount) {
        effectivePickupFee = 0;
    }
    
    const total = Math.max(0, subtotal - effectivePickupFee);
    
    subtotalValue.textContent = `₹${subtotal.toFixed(2)}`;
    pickupFee.textContent = `₹${effectivePickupFee.toFixed(2)}${effectivePickupFee === 0 ? ' (Waived)' : ''}`;
    totalValue.textContent = `₹${total.toFixed(2)}`;
    
    if (subtotal >= minimumPickupAmount) {
        pickupRequirement.className = 'pickup-requirement met';
        pickupRequirement.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i> Minimum pickup amount met: ₹${minimumPickupAmount.toFixed(2)} (Current: ₹${subtotal.toFixed(2)})`;
        schedulePickupBtn.disabled = false;
    } else {
        pickupRequirement.className = 'pickup-requirement not-met';
        pickupRequirement.innerHTML = `<i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i> Minimum pickup amount: ₹${minimumPickupAmount.toFixed(2)} (Current: ₹${subtotal.toFixed(2)})`;
        schedulePickupBtn.disabled = true;
    }
}

// Address editing functionality
editAddressBtn.addEventListener('click', function() {
    addressDisplay.classList.add('hidden');
    addressInput.classList.add('active');
    editAddressBtn.style.display = 'none';
    saveAddressBtn.style.display = 'inline-block';
    cancelAddressBtn.style.display = 'inline-block';
});

saveAddressBtn.addEventListener('click', function() {
    const newAddress = addressFieldValue.value;
    addressDisplay.textContent = newAddress;
    addressDisplay.classList.remove('hidden');
    addressInput.classList.remove('active');
    editAddressBtn.style.display = 'inline-block';
    saveAddressBtn.style.display = 'none';
    cancelAddressBtn.style.display = 'none';
    showToast('Address updated successfully!', 'success');
});

cancelAddressBtn.addEventListener('click', function() {
    addressDisplay.classList.remove('hidden');
    addressInput.classList.remove('active');
    editAddressBtn.style.display = 'inline-block';
    saveAddressBtn.style.display = 'none';
    cancelAddressBtn.style.display = 'none';
    addressFieldValue.value = addressDisplay.textContent;
});

// Customer Settings functionality
customerSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Settings updated successfully!', 'success');
});

customerCancelSettingsBtn.addEventListener('click', () => {
    customerSettingsForm.reset();
});

// Notification toggle functionality
customerEmailNotifications.addEventListener('change', function() {
    showToast(`Email notifications ${this.checked ? 'enabled' : 'disabled'}`, 'success');
});

customerSmsNotifications.addEventListener('change', function() {
    showToast(`SMS notifications ${this.checked ? 'enabled' : 'disabled'}`, 'success');
});

// Animate counters
function animateCounters() {
    statValues.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 50;
        const updateCounter = () => {
            const current = +counter.innerText;
            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCounter, 30);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });
}

// Toast notification function
function showToast(message, type = 'success') {
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    
    if (type === 'success') {
        toastIcon.className = 'toast-icon fas fa-check-circle';
    } else if (type === 'error') {
        toastIcon.className = 'toast-icon fas fa-exclamation-circle';
        toastIcon.style.color = '#e74c3c';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- NEW FUNCTIONALITY FOR CUSTOMER HISTORY ---

async function fetchAndDisplayCustomerHistory() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('https://eco-cycle-hub-api.onrender.com/api/pickups/customer', {
            method: 'GET',
            headers: { 'x-auth-token': token }
        });

        if (!response.ok) throw new Error('Failed to fetch pickup history');

        const history = await response.json();
        const tableBody = document.getElementById('customer-history-table-body');
        tableBody.innerHTML = ''; // Clear any old or sample data

        if (history.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">You haven't scheduled any pickups yet.</td></tr>`;
            return;
        }

        history.forEach(pickup => {
            const row = document.createElement('tr');
            const statusBadge = getStatusBadge(pickup.status);
            const scheduledDate = new Date(pickup.createdAt).toLocaleDateString();
            const totalWeight = pickup.wasteItems.reduce((sum, item) => sum + item.weight, 0);
            const wasteTypes = pickup.wasteItems.map(item => item.type).join(', ');

            row.innerHTML = `
                <td>${scheduledDate}</td>
                <td>${wasteTypes}</td>
                <td>${totalWeight.toFixed(1)}</td>
                <td>${statusBadge}</td>
                <td>${pickup.totalValue.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Fetch Customer History Error:', error);
        showToast('Could not load your pickup history.', 'error');
    }
}

function getStatusBadge(status) {
    const statusClasses = {
        'pending': 'status-badge status-pending',
        'accepted': 'status-badge status-accepted', // You may need to add CSS for this class
        'completed': 'status-badge status-completed',
        'cancelled': 'status-badge status-cancelled'
    };
    return `<span class="${statusClasses[status] || ''}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}
