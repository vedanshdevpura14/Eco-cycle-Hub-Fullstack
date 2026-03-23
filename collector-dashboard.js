// DOM Elements
const collectorDashboard = document.getElementById('collectorDashboard');
const collectorMenuToggle = document.getElementById('collectorMenuToggle');
const collectorSidebar = document.getElementById('collectorSidebar');
const collectorMainContent = document.getElementById('collectorMainContent');
const collectorNavItems = document.querySelectorAll('#collectorSidebar .nav-item');
const collectorDashboardSections = document.querySelectorAll('#collectorMainContent .dashboard-section');
const collectorThemeToggle = document.getElementById('collectorThemeToggle');
const toast = document.getElementById('toast');
const collectorStatValues = document.querySelectorAll('#collectorDashboard .stat-value');
const collectorUserName = document.getElementById('collectorUserName');
const collectorUserTypeBadge = document.getElementById('collectorUserTypeBadge');
const collectorProfileName = document.getElementById('collectorProfileName');
const collectorProfileEmail = document.getElementById('collectorProfileEmail');
const collectorProfilePhone = document.getElementById('collectorProfilePhone');
const collectorProfileFullName = document.getElementById('collectorProfileFullName');
const collectorProfileFullEmail = document.getElementById('collectorProfileFullEmail');
const collectorProfileFullPhone = document.getElementById('collectorProfileFullPhone');
const myPickupsNavItem = document.querySelector('.nav-item[data-section="collectorPickups"]');


// Fare Calculator Elements
const calculateFareBtn = document.getElementById('calculateFareBtn');
const fareResult = document.getElementById('fareResult');
const distanceInput = document.getElementById('distance');
const wasteTypeSelect = document.getElementById('wasteType');
const weightInput = document.getElementById('weight');
const baseFare = document.getElementById('baseFare');
const distanceFare = document.getElementById('distanceFare');
const weightFare = document.getElementById('weightFare');
const wasteBonus = document.getElementById('wasteBonus');
const totalFare = document.getElementById('totalFare');

// Time Estimation Elements
const calculateTimeBtn = document.getElementById('calculateTimeBtn');
const timeResult = document.getElementById('timeResult');
const currentLocationInput = document.getElementById('currentLocation');
const destinationInput = document.getElementById('destination');
const trafficSelect = document.getElementById('traffic');
const timeResultValue = document.getElementById('timeResultValue');

// Cancel Pickup Modal Elements
const cancelPickupModal = document.getElementById('cancelPickupModal');
const modalClose = document.getElementById('modalClose');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const reasonOther = document.getElementById('reasonOther');
const otherReasonContainer = document.getElementById('otherReasonContainer');
const otherReasonText = document.getElementById('otherReasonText');
const cancelPickupBtns = document.querySelectorAll('.cancel-pickup-btn');

// Pickup Details Modal Elements
const pickupDetailsModal = document.getElementById('pickupDetailsModal');
const pickupDetailsModalClose = document.getElementById('pickupDetailsModalClose');
const closePickupDetailsBtn = document.getElementById('closePickupDetailsBtn');
const cancelFromDetailsBtn = document.getElementById('cancelFromDetailsBtn');
const viewDetailsBtns = document.querySelectorAll('.view-details-btn');

// Settings Elements
const collectorSettingsForm = document.getElementById('collectorSettingsForm');
const collectorCancelSettingsBtn = document.getElementById('collectorCancelSettingsBtn');
const collectorEmailNotifications = document.getElementById('collectorEmailNotifications');
const collectorSmsNotifications = document.getElementById('collectorSmsNotifications');
const collectorPaymentNotifications = document.getElementById('collectorPaymentNotifications');

let currentPickupId = '';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Set user information (in a real app, this would come from session/cookie)
    collectorUserName.textContent = 'Collector User';
    collectorUserTypeBadge.textContent = 'Collector';
    collectorProfileName.textContent = 'Collector User';
    collectorProfileEmail.textContent = 'collector@example.com';
    collectorProfilePhone.textContent = '+91 (555) 987-6543';
    collectorProfileFullName.textContent = 'Collector User';
    collectorProfileFullEmail.textContent = 'collector@example.com';
    collectorProfileFullPhone.textContent = '+91 (555) 987-6543';
    
    // Animate counters
    animateCollectorCounters();

    //Fetch and display real data from the backend
    fetchAndDisplayPickups();

    //Fetch and display active pickups
    fetchAndDisplayActivePickups();
});

//When user navigates to this section it, it fetches the latest history
myPickupsNavItem.addEventListener('click', () => {
    // When the user navigates to this section, fetch the latest history
    fetchAndDisplayPickupHistory();
});

// Mobile menu toggle
collectorMenuToggle.addEventListener('click', () => {
    collectorSidebar.classList.toggle('mobile-open');
});

//To fetch and display the data
async function fetchAndDisplayPickups() {
    const token = localStorage.getItem('token');
    if (!token) {
        // If no token, the user isn't logged in. Redirect them.
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('https://eco-cycle-hub-api.onrender.com/api/pickups/collector/available', {
            method: 'GET',
            headers: {
                'x-auth-token': token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pickups');
        }

        const pickups = await response.json();
        const pickupsContainer = document.querySelector('#collectorHome .addresses-grid');
        
        // Clear the hardcoded example pickups
        pickupsContainer.innerHTML = ''; 

        if (pickups.length === 0) {
            pickupsContainer.innerHTML = '<p>No available pickups at the moment. Check back soon!</p>';
            return;
        }

        pickups.forEach(pickup => {
            const pickupCard = document.createElement('div');
            pickupCard.className = 'address-card pickup-card';
            
            // Note: The customer details are now available under pickup.customer.username
            const wasteTypes = pickup.wasteItems.map(item => item.type).join(', ');

            pickupCard.innerHTML = `
                <div class="pickup-header">
                    <div class="pickup-id">#${pickup._id.slice(-6).toUpperCase()}</div>
                    <div class="pickup-time">${new Date(pickup.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div class="pickup-details">
                    <p><i class="fas fa-user"></i> <strong>Customer:</strong> ${pickup.customer.username}</p>
                    <p><i class="fas fa-map-marker-alt"></i> <strong>Address:</strong> ${pickup.pickupAddress}</p>
                    <p><i class="fas fa-boxes"></i> <strong>Type:</strong> ${wasteTypes}</p>
                </div>
                <div class="pickup-amount">Estimated Value: ₹${pickup.totalValue.toFixed(2)}</div>
                <div class="address-actions">
                    <button class="btn btn-small view-details-btn" data-pickup-id="${pickup._id}">View Details</button>
                    <button class="btn btn-small btn-success accept-job-btn" data-pickup-id="${pickup._id}">Accept Job</button>
                </div>
            `;
            pickupsContainer.appendChild(pickupCard);
        });

    } catch (error) {
        console.error('Fetch Pickups Error:', error);
        showToast('Could not load available pickups.', 'error');
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !collectorSidebar.contains(e.target) && 
        !collectorMenuToggle.contains(e.target) && 
        collectorSidebar.classList.contains('mobile-open')) {
        collectorSidebar.classList.remove('mobile-open');
    }
});

//Populates the table with the collectors history
async function fetchAndDisplayPickupHistory() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('https://eco-cycle-hub-api.onrender.com/api/pickups/collector/history', {
            method: 'GET',
            headers: { 'x-auth-token': token }
        });

        if (!response.ok) throw new Error('Failed to fetch pickup history');

        const history = await response.json();
        const tableBody = document.getElementById('pickup-history-table-body');
        tableBody.innerHTML = ''; // Clear any old data

        if (history.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No past pickups found.</td></tr>`;
            return;
        }

        history.forEach(pickup => {
            const row = document.createElement('tr');
            const statusBadge = getStatusBadge(pickup.status); // Use the helper function
            const completedDate = new Date(pickup.updatedAt).toLocaleDateString();

            row.innerHTML = `
                <td>#${pickup._id.slice(-6).toUpperCase()}</td>
                <td>${completedDate}</td>
                <td>${pickup.customer ? pickup.customer.username : 'N/A'}</td>
                <td>${statusBadge}</td>
                <td>${pickup.totalValue.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Fetch History Error:', error);
        showToast('Could not load pickup history.', 'error');
    }
}

//Making complete and Cancel buttons functional
// Add this single event listener to your collector-dashboard.js file

collectorMainContent.addEventListener('click', async (e) => {
    const token = localStorage.getItem('token');
    const target = e.target; // The element that was actually clicked
    const pickupId = target.dataset.pickupId;

    if (!pickupId) return; // Exit if the clicked element is not a button with a pickup ID

    // --- Handle VIEW DETAILS button clicks ---
    if (target.classList.contains('view-details-btn')) {
        showPickupDetails(pickupId); // This will now work for ALL view details buttons
    }

    // --- Handle ACCEPT JOB button clicks ---
    if (target.classList.contains('accept-job-btn')) {
        if (!token) return showToast('You must be logged in.', 'error');
        try {
            const response = await fetch(`https://eco-cycle-hub-api.onrender.com/api/pickups/accept/${pickupId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                showToast('Job accepted!', 'success');
                fetchAndDisplayAvailablePickups(); // Refresh available list
                fetchAndDisplayActivePickups();   // Refresh active list
            } else {
                showToast('Failed to accept job.', 'error');
            }
        } catch (error) { console.error('Accept job error:', error); }
    }

    // --- Handle COMPLETE button clicks ---
    if (target.classList.contains('complete-pickup-btn')) {
        if (!confirm('Mark this pickup as complete?')) return;
        try {
            const response = await fetch(`https://eco-cycle-hub-api.onrender.com/api/pickups/complete/${pickupId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                showToast('Pickup completed!', 'success');
                target.closest('.pickup-card').remove(); // Remove card from the view
            } else {
                showToast('Failed to complete pickup.', 'error');
            }
        } catch (error) { console.error('Complete pickup error:', error); }
    }

    // --- Handle CANCEL button clicks ---
    if (target.classList.contains('cancel-pickup-btn')) {
        confirmCancelBtn.dataset.pickupId = pickupId;
        cancelPickupModal.classList.add('active');
    }
});

// For fetching active pickups
async function fetchAndDisplayActivePickups() {
    const token = localStorage.getItem('token');
    if (!token) return; // The main fetch function will handle the redirect

    try {
        const response = await fetch('https://eco-cycle-hub-api.onrender.com/api/pickups/collector/active', {
            method: 'GET',
            headers: { 'x-auth-token': token }
        });

        if (!response.ok) throw new Error('Failed to fetch active pickups');

        const activePickups = await response.json();
        const activeContainer = document.getElementById('active-pickups-grid');
        activeContainer.innerHTML = ''; // Clear the "Loading..." message

        if (activePickups.length === 0) {
            activeContainer.innerHTML = '<p style="padding: 1.5rem;">You have no active pickups.</p>';
            return;
        }

        activePickups.forEach(pickup => {
            const pickupCard = document.createElement('div');
            pickupCard.className = 'address-card pickup-card';
            const wasteTypes = pickup.wasteItems.map(item => item.type).join(', ');

            // Note the new buttons and classes: 'complete-pickup-btn' and 'cancel-pickup-btn'
            pickupCard.innerHTML = `
                <div class="pickup-header">
                    <div class="pickup-id">#${pickup._id.slice(-6).toUpperCase()}</div>
                    <div class="pickup-time">Accepted</div>
                </div>
                <div class="pickup-details">
                    <p><i class="fas fa-user"></i> <strong>Customer:</strong> ${pickup.customer.username}</p>
                    <p><i class="fas fa-map-marker-alt"></i> <strong>Address:</strong> ${pickup.pickupAddress}</p>
                    <p><i class="fas fa-boxes"></i> <strong>Type:</strong> ${wasteTypes}</p>
                </div>
                <div class="pickup-amount">Estimated Value: ₹${pickup.totalValue.toFixed(2)}</div>
                <div class="address-actions">
                    <button class="btn btn-small btn-success complete-pickup-btn" data-pickup-id="${pickup._id}">Complete</button>
                    <button class="btn btn-small btn-danger cancel-pickup-btn" data-pickup-id="${pickup._id}">Cancel</button>
                </div>
            `;
            activeContainer.appendChild(pickupCard);
        });

    } catch (error) {
        console.error('Fetch Active Pickups Error:', error);
        showToast('Could not load your active pickups.', 'error');
    }
}

// Using event delegation to handle clicks on dynamically created buttons
document.getElementById('collectorHome').addEventListener('click', async (e) => {
    // Check if the clicked element is an "Accept Job" button
    if (e.target.classList.contains('accept-job-btn')) {
        const pickupId = e.target.dataset.pickupId;
        const token = localStorage.getItem('token');

        if (!token) {
            showToast('You must be logged in.', 'error');
            return;
        }

        try {
            const response = await fetch(`https://eco-cycle-hub-api.onrender.com/api/pickups/accept/${pickupId}`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': token
                }
            });

            if (response.ok) {
                showToast('Job accepted successfully!', 'success');

                // Remove the card from the UI since it's no longer "available"
                const cardToRemove = e.target.closest('.pickup-card');
                if (cardToRemove) {
                    cardToRemove.style.transition = 'opacity 0.5s ease';
                    cardToRemove.style.opacity = '0';
                    setTimeout(() => cardToRemove.remove(), 500);
                }
            } else {
                const errorData = await response.json();
                showToast(errorData.msg || 'Failed to accept job.', 'error');
            }

        } catch (error) {
            console.error('Accept job error:', error);
            showToast('Server error. Please try again.', 'error');
        }
    }
});

// Navigation functionality
collectorNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active nav item
        collectorNavItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding section
        const sectionId = item.getAttribute('data-section');
        collectorDashboardSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            collectorSidebar.classList.remove('mobile-open');
        }
    });
});

// Theme toggle
collectorThemeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = collectorThemeToggle.querySelector('i');
    
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

// Fare Calculator functionality
calculateFareBtn.addEventListener('click', () => {
    const distance = parseFloat(distanceInput.value) || 0;
    const wasteType = wasteTypeSelect.value;
    const weight = parseFloat(weightInput.value) || 0;
    
    if (distance > 0 && wasteType && weight > 0) {
        // Calculate base fare (fixed amount)
        const base = 50;
        
        // Calculate distance fare (per km)
        const distanceRate = 10;
        const distanceAmount = distance * distanceRate;
        
        // Calculate weight fare (per kg)
        const weightRate = 5;
        const weightAmount = weight * weightRate;
        
        // Calculate waste type bonus
        let bonus = 0;
        switch(wasteType) {
            case 'electronic':
                bonus = 30;
                break;
            case 'batteries':
                bonus = 25;
                break;
            case 'metal':
                bonus = 20;
                break;
            case 'glass':
                bonus = 15;
                break;
            case 'plastic':
                bonus = 10;
                break;
            case 'paper':
                bonus = 5;
                break;
            default:
                bonus = 0;
        }
        
        // Calculate total fare
        const total = base + distanceAmount + weightAmount + bonus;
        
        // Update UI
        baseFare.textContent = `₹${base.toFixed(2)}`;
        distanceFare.textContent = `₹${distanceAmount.toFixed(2)}`;
        weightFare.textContent = `₹${weightAmount.toFixed(2)}`;
        wasteBonus.textContent = `₹${bonus.toFixed(2)}`;
        totalFare.textContent = `₹${total.toFixed(2)}`;
        
        // Show result
        fareResult.style.display = 'block';
    } else {
        showToast('Please fill all fields with valid values', 'error');
    }
});

// Time Estimation functionality
calculateTimeBtn.addEventListener('click', () => {
    const currentLocation = currentLocationInput.value.trim();
    const destination = destinationInput.value.trim();
    const traffic = trafficSelect.value;
    
    if (currentLocation && destination) {
        // Simulate API call to calculate time
        // In a real application, this would use a mapping service API
        
        // Base time in minutes (simulated)
        let baseTime = 15;
        
        // Adjust based on traffic conditions
        switch(traffic) {
            case 'low':
                baseTime = baseTime * 0.8;
                break;
            case 'moderate':
                baseTime = baseTime * 1.2;
                break;
            case 'high':
                baseTime = baseTime * 1.8;
                break;
        }
        
        // Round to nearest 5 minutes
        const estimatedTime = Math.round(baseTime / 5) * 5;
        
        // Update UI
        timeResultValue.textContent = `${estimatedTime} min`;
        
        // Show result
        timeResult.style.display = 'block';
    } else {
        showToast('Please enter both current location and destination', 'error');
    }
});

// Cancel Pickup Modal functionality
cancelPickupBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentPickupId = btn.getAttribute('data-pickup-id');
        cancelPickupModal.classList.add('active');
    });
});

modalClose.addEventListener('click', () => {
    cancelPickupModal.classList.remove('active');
    resetCancelPickupModal();
});

cancelModalBtn.addEventListener('click', () => {
    cancelPickupModal.classList.remove('active');
    resetCancelPickupModal();
});

reasonOther.addEventListener('change', () => {
    if (reasonOther.checked) {
        otherReasonContainer.style.display = 'block';
    } else {
        otherReasonContainer.style.display = 'none';
    }
});

confirmCancelBtn.addEventListener('click', () => {
    const selectedReason = document.querySelector('input[name="cancelReason"]:checked');
    
    if (selectedReason) {
        let reason = selectedReason.value;
        
        if (reason === 'other') {
            const otherReason = otherReasonText.value.trim();
            if (otherReason) {
                reason = otherReason;
            } else {
                showToast('Please specify the reason for cancellation', 'error');
                return;
            }
        }
        
        // Simulate API call to cancel pickup
        showToast(`Pickup #${currentPickupId} cancelled successfully`, 'success');
        
        // In a real application, you would update the pickup status in the database
        // and refresh the pickup list
        
        // Close modal
        cancelPickupModal.classList.remove('active');
        resetCancelPickupModal();
        
        // Refresh the page to show updated pickup status
        setTimeout(() => {
            location.reload();
        }, 1500);
    } else {
        showToast('Please select a reason for cancellation', 'error');
    }
});

function resetCancelPickupModal() {
    document.querySelectorAll('input[name="cancelReason"]').forEach(radio => {
        radio.checked = false;
    });
    otherReasonContainer.style.display = 'none';
    otherReasonText.value = '';
    currentPickupId = '';
}

// Pickup Details Modal functionality
viewDetailsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const pickupId = btn.getAttribute('data-pickup-id');
        showPickupDetails(pickupId);
    });
});

pickupDetailsModalClose.addEventListener('click', () => {
    pickupDetailsModal.classList.remove('active');
});

closePickupDetailsBtn.addEventListener('click', () => {
    pickupDetailsModal.classList.remove('active');
});

cancelFromDetailsBtn.addEventListener('click', () => {
    pickupDetailsModal.classList.remove('active');
    currentPickupId = document.getElementById('detailPickupId').textContent.replace('#', '');
    cancelPickupModal.classList.add('active');
});

function showPickupDetails(pickupId) {
    // Simulate fetching pickup details based on ID
    // In a real application, this would be an API call
    
    // Sample data based on pickup ID
    const pickupData = {
        'PCK-2023-1056': {
            id: '#PCK-2023-1056',
            status: 'pending',
            date: 'October 16, 2023',
            time: '10:30 AM',
            customerName: 'Rajesh Kumar',
            customerPhone: '+91 98765 43210',
            customerEmail: 'rajesh@example.com',
            address: '45 Park Avenue, Green Hills, Bangalore 560001',
            landmark: 'Near City Mall',
            wasteItems: [
                { type: 'Plastic', weight: '5.0 kg' },
                { type: 'Paper', weight: '3.5 kg' }
            ],
            totalWeight: '8.5 kg',
            baseFare: '₹50.00',
            distanceFare: '₹60.00',
            weightFare: '₹40.00',
            wasteBonus: '₹30.00',
            totalFare: '₹180.00'
        },
        'PCK-2023-1057': {
            id: '#PCK-2023-1057',
            status: 'pending',
            date: 'October 16, 2023',
            time: '2:15 PM',
            customerName: 'Priya Sharma',
            customerPhone: '+91 98765 43211',
            customerEmail: 'priya@example.com',
            address: '21 Lake View, Eco City, Bangalore 560078',
            landmark: 'Opposite Lake Park',
            wasteItems: [
                { type: 'Electronic', weight: '3.2 kg' },
                { type: 'Glass', weight: '2.0 kg' }
            ],
            totalWeight: '5.2 kg',
            baseFare: '₹50.00',
            distanceFare: '₹70.00',
            weightFare: '₹25.00',
            wasteBonus: '₹65.00',
            totalFare: '₹210.00'
        },
        'PCK-2023-1058': {
            id: '#PCK-2023-1058',
            status: 'cancelled',
            date: 'October 16, 2023',
            time: '4:45 PM',
            customerName: 'Amit Patel',
            customerPhone: '+91 98765 43212',
            customerEmail: 'amit@example.com',
            address: '78 Market Street, Downtown, Bangalore 560001',
            landmark: 'Near Central Market',
            wasteItems: [
                { type: 'Metal', weight: '4.0 kg' },
                { type: 'Cardboard', weight: '2.8 kg' }
            ],
            totalWeight: '6.8 kg',
            baseFare: '₹50.00',
            distanceFare: '₹55.00',
            weightFare: '₹35.00',
            wasteBonus: '₹55.00',
            totalFare: '₹195.00',
            cancelledOn: 'October 16, 2023, 9:15 AM',
            cancellationReason: 'Vehicle breakdown'
        },
        'PCK-2023-1055': {
            id: '#PCK-2023-1055',
            status: 'completed',
            date: 'October 15, 2023',
            time: '3:30 PM',
            customerName: 'Suresh Reddy',
            customerPhone: '+91 98765 43213',
            customerEmail: 'suresh@example.com',
            address: '9 Hill Road, Eco City, Bangalore 560001',
            landmark: 'Near Hill View Apartment',
            wasteItems: [
                { type: 'Plastic', weight: '4.5 kg' },
                { type: 'Glass', weight: '2.7 kg' }
            ],
            totalWeight: '7.2 kg',
            baseFare: '₹50.00',
            distanceFare: '₹65.00',
            wasteBonus: '₹85.00',
            totalFare: '₹200.00'
        }
    };
    
    const data = pickupData[pickupId] || pickupData['PCK-2023-1056'];
    
    // Update modal content
    document.getElementById('detailPickupId').textContent = data.id;
    document.getElementById('detailStatus').innerHTML = getStatusBadge(data.status);
    document.getElementById('detailDate').textContent = data.date;
    document.getElementById('detailTime').textContent = data.time;
    document.getElementById('detailCustomerName').textContent = data.customerName;
    document.getElementById('detailCustomerPhone').textContent = data.customerPhone;
    document.getElementById('detailCustomerEmail').textContent = data.customerEmail;
    document.getElementById('detailAddress').textContent = data.address;
    document.getElementById('detailLandmark').textContent = data.landmark;
    document.getElementById('detailTotalWeight').textContent = data.totalWeight;
    document.getElementById('detailBaseFare').textContent = data.baseFare;
    document.getElementById('detailDistanceFare').textContent = data.distanceFare;
    document.getElementById('detailWeightFare').textContent = data.weightFare || '₹0.00';
    document.getElementById('detailWasteBonus').textContent = data.wasteBonus;
    document.getElementById('detailTotalFare').textContent = data.totalFare;
    
    // Update waste items
    const wasteItemsContainer = document.querySelector('.waste-items');
    wasteItemsContainer.innerHTML = '';
    data.wasteItems.forEach(item => {
        const wasteItem = document.createElement('div');
        wasteItem.className = 'waste-item';
        wasteItem.innerHTML = `
            <span>${item.type}</span>
            <span>${item.weight}</span>
        `;
        wasteItemsContainer.appendChild(wasteItem);
    });
    
    // Show/hide cancellation section
    const cancellationSection = document.getElementById('cancellationSection');
    const cancelFromDetailsBtn = document.getElementById('cancelFromDetailsBtn');
    
    if (data.status === 'cancelled') {
        cancellationSection.style.display = 'block';
        document.getElementById('detailCancelledOn').textContent = data.cancelledOn;
        document.getElementById('detailCancellationReason').textContent = data.cancellationReason;
        cancelFromDetailsBtn.style.display = 'none';
    } else if (data.status === 'pending') {
        cancellationSection.style.display = 'none';
        cancelFromDetailsBtn.style.display = 'inline-block';
        cancelFromDetailsBtn.setAttribute('data-pickup-id', pickupId);
    } else {
        cancellationSection.style.display = 'none';
        cancelFromDetailsBtn.style.display = 'none';
    }
    
    // Show modal
    pickupDetailsModal.classList.add('active');
}

function getStatusBadge(status) {
    const statusClasses = {
        'pending': 'status-badge status-pending',
        'completed': 'status-badge status-completed',
        'cancelled': 'status-badge status-cancelled'
    };
    
    const statusTexts = {
        'pending': 'Pending',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    
    return `<span class="${statusClasses[status]}">${statusTexts[status]}</span>`;
}

// Collector Settings functionality
collectorSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('collectorSettingsEmail').value;
    const currentPassword = document.getElementById('collectorSettingsCurrentPassword').value;
    const newPassword = document.getElementById('collectorSettingsNewPassword').value;
    const confirmPassword = document.getElementById('collectorSettingsConfirmPassword').value;
    
    if (!currentPassword) {
        showToast('Please enter your current password', 'error');
        return;
    }
    
    if (newPassword && newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    // Simulate API call to update settings
    showToast('Settings updated successfully!', 'success');
    
    // Update email in profile if changed
    if (email !== collectorProfileEmail.textContent) {
        collectorProfileEmail.textContent = email;
        collectorProfileFullEmail.textContent = email;
    }
    
    // Reset form
    collectorSettingsForm.reset();
    document.getElementById('collectorSettingsEmail').value = collectorProfileEmail.textContent;
});

collectorCancelSettingsBtn.addEventListener('click', () => {
    // Reset form
    collectorSettingsForm.reset();
    document.getElementById('collectorSettingsEmail').value = collectorProfileEmail.textContent;
});

// Notification toggle functionality
collectorEmailNotifications.addEventListener('change', function() {
    showToast(`Email notifications ${this.checked ? 'enabled' : 'disabled'}`, 'success');
});

collectorSmsNotifications.addEventListener('change', function() {
    showToast(`SMS notifications ${this.checked ? 'enabled' : 'disabled'}`, 'success');
});

collectorPaymentNotifications.addEventListener('change', function() {
    showToast(`Payment notifications ${this.checked ? 'enabled' : 'disabled'}`, 'success');
});

// Animate collector counters
function animateCollectorCounters() {
    collectorStatValues.forEach(counter => {
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
