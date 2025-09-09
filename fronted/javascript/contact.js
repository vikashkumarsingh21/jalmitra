// javascript/contact.js
const API_BASE_URL = 'http://localhost:3000/api';

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Get form data
        const formData = new FormData(e.target);
        const data = {
            fullName: formData.get('fullName') || document.getElementById('fullName').value,
            email: formData.get('email') || document.getElementById('email').value,
            phone: formData.get('phone') || document.getElementById('phone').value,
            company: formData.get('company') || document.getElementById('company').value,
            jobTitle: formData.get('jobTitle') || document.getElementById('jobTitle').value,
            country: formData.get('country') || document.getElementById('country').value,
            state: formData.get('state') || document.getElementById('state').value,
            industry: formData.get('industry') || document.getElementById('industry').value,
            message: formData.get('message') || document.getElementById('message').value
        };
        
        // Validate required fields
        const requiredFields = ['fullName', 'email', 'phone', 'company', 'country', 'state', 'industry'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
        
        if (missingFields.length > 0) {
            throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('Please enter a valid email address');
        }
        
        // Submit to backend
        const response = await fetch(`${API_BASE_URL}/inquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to submit inquiry');
        }
        
        // Show success message
        showSuccessMessage(result.inquiryId);
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showErrorMessage(error.message);
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function showSuccessMessage(inquiryId) {
    const successHTML = `
        <div class="alert alert-success" style="
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            animation: slideIn 0.5s ease-out;
        ">
            <i class="bi bi-check-circle-fill" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h3>Thank You!</h3>
            <p>Your inquiry has been submitted successfully.</p>
            <p><strong>Inquiry ID:</strong> #${inquiryId}</p>
            <p>We'll get back to you within 3-4 business days.</p>
        </div>
        <style>
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        </style>
    `;
    
    // Insert success message before the form
    const form = document.querySelector('form');
    form.insertAdjacentHTML('beforebegin', successHTML);
    
    // Remove success message after 10 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert-success');
        if (alert) {
            alert.remove();
        }
    }, 10000);
    
    // Scroll to success message
    document.querySelector('.alert-success').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

function showErrorMessage(message) {
    const errorHTML = `
        <div class="alert alert-error" style="
            background: linear-gradient(135deg, #dc3545, #e74c3c);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            animation: slideIn 0.5s ease-out;
        ">
            <i class="bi bi-exclamation-triangle-fill" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h3>Error</h3>
            <p>${message}</p>
            <p>Please try again or contact us directly at <a href="mailto:jalmitra1@outlook.com" style="color: #fff; text-decoration: underline;">jalmitra1@outlook.com</a></p>
        </div>
        <style>
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        </style>
    `;
    
    // Insert error message before the form
    const form = document.querySelector('form');
    form.insertAdjacentHTML('beforebegin', errorHTML);
    
    // Remove error message after 8 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert-error');
        if (alert) {
            alert.remove();
        }
    }, 8000);
    
    // Scroll to error message
    document.querySelector('.alert-error').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error styling when user starts typing
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('placeholder') || field.id;
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('error');
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${fieldName} is required`);
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    
    errorDiv.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
}

// Add CSS for error styling
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
    
    .form-group input.error:focus,
    .form-group textarea.error:focus {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2) !important;
    }
`;
document.head.appendChild(style);

// Navbar scroll effect (if needed)
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            navbar.style.backdropFilter = 'blur(5px)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    }
});

// Floating elements animation
document.addEventListener('DOMContentLoaded', function() {
    const floatingElements = document.querySelectorAll('.floating-icon');
    
    floatingElements.forEach((element, index) => {
        element.style.animation = `float 6s ease-in-out infinite ${index * 0.5}s`;
    });
});

// Add floating animation CSS
const floatingStyle = document.createElement('style');
floatingStyle.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(5deg); }
        50% { transform: translateY(-20px) rotate(0deg); }
        75% { transform: translateY(-10px) rotate(-5deg); }
    }
    
    .floating-icon {
        opacity: 0.1;
        font-size: 2rem;
        position: absolute;
        pointer-events: none;
    }
    
    .floating-icon:nth-child(1) {
        top: 20%;
        left: 10%;
        color: #667eea;
    }
    
    .floating-icon:nth-child(2) {
        top: 60%;
        right: 15%;
        color: #764ba2;
    }
    
    .floating-icon:nth-child(3) {
        bottom: 20%;
        left: 20%;
        color: #667eea;
    }
`;
document.head.appendChild(floatingStyle);