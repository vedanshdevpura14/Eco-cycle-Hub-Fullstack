document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELECT ALL HTML ELEMENTS ---
    // --- NEW: Password Strength Validation ---
const customerRegPassword = document.getElementById('customerRegPassword');
const customerPasswordFeedback = document.getElementById('customerPasswordFeedback');
const collectorRegPassword = document.getElementById('collectorRegPassword');
const collectorPasswordFeedback = document.getElementById('collectorPasswordFeedback');

const passwordCriteria = {
    length: { regex: /.{8,}/, element: customerPasswordFeedback.querySelector('#length') },
    uppercase: { regex: /[A-Z]/, element: customerPasswordFeedback.querySelector('#uppercase') },
    lowercase: { regex: /[a-z]/, element: customerPasswordFeedback.querySelector('#lowercase') },
    number: { regex: /[0-9]/, element: customerPasswordFeedback.querySelector('#number') }
};

customerRegPassword.addEventListener('input', () => {
    const password = customerRegPassword.value;
    Object.keys(passwordCriteria).forEach(key => {
        const criterion = passwordCriteria[key];
        if (criterion.regex.test(password)) {
            criterion.element.classList.add('valid');
            criterion.element.querySelector('i').className = 'fas fa-check-circle';
        } else {
            criterion.element.classList.remove('valid');
            criterion.element.querySelector('i').className = 'fas fa-times-circle';
        }
    });
});
// You can add a similar listener for collectorRegPassword if its feedback div has different IDs

// --- NEW: OTP Auto-Tabbing ---
function setupOtpAutotab(containerId) {
    const inputs = document.querySelectorAll(`#${containerId} .otp-input`);
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
}
setupOtpAutotab('customerOtpContainer');
setupOtpAutotab('collectorOtpContainer');

    // Main Containers
    const userTypeSelection = document.getElementById('userTypeSelection');
    const customerLoginContainer = document.getElementById('customerLoginContainer');
    const customerRegisterContainer = document.getElementById('customerRegisterContainer');
    const collectorLoginContainer = document.getElementById('collectorLoginContainer');
    const collectorRegisterContainer = document.getElementById('collectorRegisterContainer');

    // Forms
    const customerLoginForm = document.getElementById('customerLoginForm');
    const customerRegisterForm = document.getElementById('customerRegisterForm');
    const collectorLoginForm = document.getElementById('collectorLoginForm');
    const collectorRegisterForm = document.getElementById('collectorRegisterForm');
    
    // All Buttons
    const customerBtn = document.getElementById('customerBtn');
    const collectorBtn = document.getElementById('collectorBtn');
    const showCustomerRegisterBtn = document.getElementById('showCustomerRegisterBtn');
    const backToCustomerLoginBtn = document.getElementById('backToCustomerLoginBtn');
    const showCollectorRegisterBtn = document.getElementById('showCollectorRegisterBtn');
    const backToCollectorLoginBtn = document.getElementById('backToCollectorLoginBtn');
    const backToUserTypeBtn1 = document.getElementById('backToUserTypeBtn1');
    const backToUserTypeBtn2 = document.getElementById('backToUserTypeBtn2');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    // Simplified Registration Step Buttons (from your new HTML)
    const sendCustomerOtpBtn = document.getElementById('sendCustomerOtpBtn');
    const verifyCustomerOtpBtn = document.getElementById('verifyCustomerOtpBtn');
    const sendCollectorOtpBtn = document.getElementById('sendCollectorOtpBtn');
    const verifyCollectorOtpBtn = document.getElementById('verifyCollectorOtpBtn');


    // --- 2. SETUP NAVIGATION BETWEEN FORMS ---
    customerBtn.addEventListener('click', () => {
        userTypeSelection.style.display = 'none';
        customerLoginContainer.style.display = 'block';
    });
    collectorBtn.addEventListener('click', () => {
        userTypeSelection.style.display = 'none';
        collectorLoginContainer.style.display = 'block';
    });
    showCustomerRegisterBtn.addEventListener('click', () => {
        customerLoginContainer.style.display = 'none';
        customerRegisterContainer.style.display = 'block';
    });
    backToCustomerLoginBtn.addEventListener('click', () => {
        customerRegisterContainer.style.display = 'none';
        customerLoginContainer.style.display = 'block';
    });
    showCollectorRegisterBtn.addEventListener('click', () => {
        collectorLoginContainer.style.display = 'none';
        collectorRegisterContainer.style.display = 'block';
    });
    backToCollectorLoginBtn.addEventListener('click', () => {
        collectorRegisterContainer.style.display = 'none';
        collectorLoginContainer.style.display = 'block';
    });
    backToUserTypeBtn1.addEventListener('click', () => {
        customerLoginContainer.style.display = 'none';
        userTypeSelection.style.display = 'block';
    });
     backToUserTypeBtn2.addEventListener('click', () => {
        collectorLoginContainer.style.display = 'none';
        userTypeSelection.style.display = 'block';
    });
    
    // --- 3. PASSWORD VISIBILITY TOGGLE ---
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = toggle.querySelector('i');
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                targetInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // --- 4. SIMULATED OTP FLOW ---
    // This logic simulates the multi-step UI without calling a real OTP service.
    // The final registration happens in the 'submit' event listener for the form.
    sendCustomerOtpBtn.addEventListener('click', () => {
        document.getElementById('customerRegisterStep1').classList.remove('active');
        document.getElementById('customerRegisterStep2').classList.add('active');
        document.getElementById('customerStep1Indicator').classList.add('completed');
        document.getElementById('customerStep2Indicator').classList.add('active');
        showToast('Simulated OTP sent!', 'success');
    });
    verifyCustomerOtpBtn.addEventListener('click', () => {
        document.getElementById('customerRegisterStep2').classList.remove('active');
        document.getElementById('customerRegisterStep3').classList.add('active');
        document.getElementById('customerStep2Indicator').classList.add('completed');
        document.getElementById('customerStep3Indicator').classList.add('active');
        showToast('OTP verified!', 'success');
    });
     sendCollectorOtpBtn.addEventListener('click', () => {
        document.getElementById('collectorRegisterStep1').classList.remove('active');
        document.getElementById('collectorRegisterStep2').classList.add('active');
        document.getElementById('collectorStep1Indicator').classList.add('completed');
        document.getElementById('collectorStep2Indicator').classList.add('active');
        showToast('Simulated OTP sent!', 'success');
    });
    verifyCollectorOtpBtn.addEventListener('click', () => {
        document.getElementById('collectorRegisterStep2').classList.remove('active');
        document.getElementById('collectorRegisterStep3').classList.add('active');
        document.getElementById('collectorStep2Indicator').classList.add('completed');
        document.getElementById('collectorStep3Indicator').classList.add('active');
        showToast('OTP verified!', 'success');
    });

    // --- 5. API CALLS FOR LOGIN AND REGISTRATION ---

    // CUSTOMER LOGIN
    customerLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('customerEmail').value;
        const password = document.getElementById('customerPassword').value;
        if (!email || !password) return showToast('Please fill all fields', 'error');

        try {
            const response = await fetch('https://eco-cycle-hub-api.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrUsername: email, password: password })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                if (data.userType === 'customer') {
                    window.location.href = 'customer_dashboard.html';
                } else {
                    showToast('Not a customer account.', 'error');
                }
            } else {
                const errorData = await response.json();
                showToast(errorData.msg || 'Login failed.', 'error');
            }
        } catch (error) {
            showToast('Could not connect to the server.', 'error');
        }
    });

    // CUSTOMER REGISTRATION
    customerRegisterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('customerRegUsername').value;
        const mobile = document.getElementById('customerRegMobile').value;
        const password = document.getElementById('customerRegPassword').value;
        if(password !== document.getElementById('customerRegConfirmPassword').value) return showToast('Passwords do not match', 'error');

        try {
            const response = await fetch('https://eco-cycle-hub-api.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, mobileNumber: mobile, password, userType: 'customer' }),
            });
            if (response.ok) {
                showToast('Registration successful! Please login.', 'success');
                setTimeout(() => {
                    customerRegisterContainer.style.display = 'none';
                    customerLoginContainer.style.display = 'block';
                }, 1500);
            } else {
                const errorData = await response.json();
                showToast(errorData.msg || 'Registration failed.', 'error');
            }
        } catch (error) {
            showToast('Could not connect to the server.', 'error');
        }
    });

    // COLLECTOR LOGIN
    collectorLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('collectorEmail').value;
        const password = document.getElementById('collectorPassword').value;
        if (!email || !password) return showToast('Please fill all fields', 'error');

        try {
            const response = await fetch('https://eco-cycle-hub-api.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrUsername: email, password: password })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                if (data.userType === 'collector') {
                    window.location.href = 'collector_dashboard.html';
                } else {
                    showToast('Not a collector account.', 'error');
                }
            } else {
                const errorData = await response.json();
                showToast(errorData.msg || 'Login failed.', 'error');
            }
        } catch (error) {
            showToast('Could not connect to the server.', 'error');
        }
    });

    // COLLECTOR REGISTRATION
    collectorRegisterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('collectorRegUsername').value;
        const mobile = document.getElementById('collectorRegMobile').value;
        const password = document.getElementById('collectorRegPassword').value;
        if(password !== document.getElementById('collectorRegConfirmPassword').value) return showToast('Passwords do not match', 'error');

        try {
            const response = await fetch('https://eco-cycle-hub-api.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, mobileNumber: mobile, password, userType: 'collector' }),
            });
            if (response.ok) {
                showToast('Registration successful! Please login.', 'success');
                setTimeout(() => {
                    collectorRegisterContainer.style.display = 'none';
                    collectorLoginContainer.style.display = 'block';
                }, 1500);
            } else {
                const errorData = await response.json();
                showToast(errorData.msg || 'Registration failed.', 'error');
            }
        } catch (error) {
            showToast('Could not connect to the server.', 'error');
        }
    });

    // --- 6. HELPER FUNCTION FOR TOAST NOTIFICATIONS ---
    function showToast(message, type = 'success') {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="toast-icon"></i> <span class="toast-message">${message}</span>`;
        toast.className = `toast ${type} show`;
        const toastIcon = toast.querySelector('.toast-icon');
        toastIcon.className = (type === 'success') ? 'toast-icon fas fa-check-circle' : 'toast-icon fas fa-exclamation-circle';
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
});
