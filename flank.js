// Enhanced Booking Form Functionality with PayMongo Integration
document.addEventListener('DOMContentLoaded', function() {
  // PayMongo API Configuration
  const PAYMONGO_PUBLIC_KEY = 'pk_test_QQxZ5A1VPAEjn1Dfc8jjH5sW';
  const PAYMONGO_SECRET_KEY = 'sk_test_DjXyhG3JeqqteQkPSAKCLp4H';
  
  // Set minimum date to today and disable past dates
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  document.getElementById('date').min = todayFormatted;
  
  // Disable weekends (Saturday and Sunday)
  document.getElementById('date').addEventListener('change', function() {
    const selectedDate = new Date(this.value);
    const day = selectedDate.getDay();
    
    if (day === 0 || day === 6) { // Sunday (0) or Saturday (6)
      alert('Weekend bookings are not available. Please select a weekday.');
      this.value = '';
    }
  });

  // Step Navigation
  const steps = document.querySelectorAll('.step');
  const formSections = document.querySelectorAll('.form-section');
  
  document.getElementById('next-to-passengers').addEventListener('click', function() {
    if (validateRouteSection()) {
      updateStep(2);
      updateSummary();
    }
  });
  
  document.getElementById('back-to-route').addEventListener('click', function() {
    updateStep(1);
  });
  
  document.getElementById('next-to-payment').addEventListener('click', function() {
    if (validatePassengerSection()) {
      updateStep(3);
      updateSummary();
    }
  });
  
  document.getElementById('back-to-passengers').addEventListener('click', function() {
    updateStep(2);
  });
  
  // Form Validation Functions
  function validateRouteSection() {
    const terminal = document.getElementById('terminal').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    if (!terminal || !destination) {
      showAlert('Please select both terminal and destination');
      return false;
    }
    
    if (terminal === destination) {
      showAlert('Departure and destination cannot be the same');
      return false;
    }
    
    if (!date) {
      showAlert('Please select a travel date');
      return false;
    }
    
    if (!time) {
      showAlert('Please select a travel time');
      return false;
    }
    
    return true;
  }
  
  function validatePassengerSection() {
    if (passengerCount < 1) {
      showAlert('Please select at least one passenger');
      return false;
    }
    
    return true;
  }
  
  function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'form-alert';
    alertBox.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
      <button class="close-alert">&times;</button>
    `;
    
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
      alertBox.classList.add('show');
    }, 10);
    
    // Remove alert after 5 seconds or when clicked
    setTimeout(() => {
      alertBox.remove();
    }, 5000);
    
    alertBox.querySelector('.close-alert').addEventListener('click', () => {
      alertBox.remove();
    });
  }
  
  function updateStep(stepNumber) {
    // Update step indicators
    steps.forEach((step, index) => {
      if (index < stepNumber - 1) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (index === stepNumber - 1) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
    
    // Show corresponding form section
    formSections.forEach((section, index) => {
      if (index === stepNumber - 1) {
        section.classList.add('active');
        
        // Scroll to top of section
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        section.classList.remove('active');
      }
    });
  }
  
  // Passenger Controls
  let passengerCount = 1;
  const maxPassengers = 12;
  
  document.getElementById('increase-passengers').addEventListener('click', function() {
    if (passengerCount < maxPassengers) {
      passengerCount++;
      document.getElementById('passenger-count').textContent = passengerCount;
      
      // Adjust baggage limit if needed
      const maxBaggage = maxBaggagePerPassenger * passengerCount;
      if (baggageCount > maxBaggage) {
        baggageCount = maxBaggage;
        document.getElementById('baggage-count').textContent = baggageCount;
      }
      
      updateSummary();
    } else {
      showAlert(`Maximum ${maxPassengers} passengers allowed per booking`);
    }
  });
  
  document.getElementById('decrease-passengers').addEventListener('click', function() {
    if (passengerCount > 1) {
      passengerCount--;
      document.getElementById('passenger-count').textContent = passengerCount;
      updateSummary();
    }
  });
  
  // Baggage Controls
  let baggageCount = 0;
  const maxBaggagePerPassenger = 20;
  
  document.getElementById('increase-baggage').addEventListener('click', function() {
    const maxAllowed = maxBaggagePerPassenger * passengerCount;
    if (baggageCount < maxAllowed) {
      baggageCount++;
      document.getElementById('baggage-count').textContent = baggageCount;
      updateSummary();
    } else {
      showAlert(`Maximum ${maxAllowed}kg baggage allowed for ${passengerCount} passenger(s)`);
    }
  });
  
  document.getElementById('decrease-baggage').addEventListener('click', function() {
    if (baggageCount > 0) {
      baggageCount--;
      document.getElementById('baggage-count').textContent = baggageCount;
      updateSummary();
    }
  });
  
  // Discount Toggle
  const discountCheckbox = document.getElementById('apply-discount');
  const discountNote = document.querySelector('.discount-note');
  
  discountCheckbox.addEventListener('change', function() {
    if (this.checked) {
      discountNote.classList.add('show');
    } else {
      discountNote.classList.remove('show');
    }
    updateSummary();
  });
  
  // Payment Method Selection
  const paymentOptions = document.querySelectorAll('.payment-option');
  
  paymentOptions.forEach(option => {
    option.addEventListener('click', function() {
      paymentOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
  
  // Proceed to Payment
  document.getElementById('proceed-payment').addEventListener('click', async function() {
    const paymentButton = this;
    const processing = document.querySelector('.payment-processing');
    const success = document.querySelector('.payment-success');
    const error = document.querySelector('.payment-error');
    
    // Show processing state
    paymentButton.style.display = 'none';
    processing.classList.add('active');
    success.classList.remove('active');
    error.classList.remove('active');
    
    try {
      const amount = updatePaymentSummary();
      const selectedMethod = document.querySelector('.payment-option.selected').getAttribute('data-method');
      
      // In a real implementation, you would:
      // 1. Create a payment intent on your backend
      // 2. Handle the payment processing
      // 3. Verify the payment status
      
      // For demo purposes, we'll simulate a successful payment
      setTimeout(() => {
        processing.classList.remove('active');
        success.classList.add('active');
        document.getElementById('view-ticket').style.display = 'block';
        updateConfirmationDetails();
        
        // In real implementation, you would:
        // - Save booking to database
        // - Send confirmation email
        // - Update user's ticket history
      }, 2000);
      
    } catch (err) {
      console.error('Payment error:', err);
      processing.classList.remove('active');
      error.classList.add('active');
      paymentButton.style.display = 'flex';
      error.querySelector('p').textContent = `Payment failed: ${err.message}`;
    }
  });
  
  // Update Payment Summary
  function updatePaymentSummary() {
    const baseFare = 150 * passengerCount;
    const baggageFee = 10 * baggageCount;
    const serviceFee = 10;
    const discount = discountCheckbox.checked ? 30 : 0;
    const total = baseFare + baggageFee + serviceFee - discount;
    const downpayment = Math.ceil(total * 0.5); // 50% downpayment
    
    // Update all summary displays
    document.querySelectorAll('[id^="total-fare"]').forEach(el => {
      el.textContent = `₱${(baseFare + baggageFee).toFixed(2)}`;
    });
    
    document.querySelectorAll('[id^="discount-amount"]').forEach(el => {
      el.textContent = `-₱${discount.toFixed(2)}`;
    });
    
    document.querySelectorAll('[id^="amount-to-pay"]').forEach(el => {
      el.textContent = `₱${downpayment.toFixed(2)}`;
    });
    
    return downpayment * 100; // Return amount in cents for PayMongo
  }
  
  // Update Booking Summary
  function updateSummary() {
    updatePaymentSummary();
    
    // Update confirmation section if it exists
    if (document.getElementById('confirmation-section')) {
      updateConfirmationDetails();
    }
  }
  
  // Update Confirmation Details
  function updateConfirmationDetails() {
    const terminal = document.getElementById('terminal').options[document.getElementById('terminal').selectedIndex].text;
    const destination = document.getElementById('destination').options[document.getElementById('destination').selectedIndex].text;
    const date = new Date(document.getElementById('date').value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = document.getElementById('time').options[document.getElementById('time').selectedIndex].text;
    const paymentMethod = document.querySelector('.payment-option.selected .payment-name').textContent;
    const discountApplied = discountCheckbox.checked;
    
    const baseFare = 150 * passengerCount;
    const baggageFee = 10 * baggageCount;
    const serviceFee = 10;
    const discount = discountApplied ? 30 : 0;
    const total = baseFare + baggageFee + serviceFee - discount;
    const downpayment = Math.ceil(total * 0.5);
    
    const confirmationSummary = document.querySelector('#confirmation-section .booking-summary');
    if (confirmationSummary) {
      confirmationSummary.querySelector('.summary-item:nth-child(1) .summary-value').textContent = `VT${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      confirmationSummary.querySelector('.summary-item:nth-child(2) .summary-value').textContent = `${terminal} to ${destination}`;
      confirmationSummary.querySelector('.summary-item:nth-child(3) .summary-value').textContent = `${date} at ${time}`;
      confirmationSummary.querySelector('.summary-item:nth-child(4) .summary-value').textContent = passengerCount;
      confirmationSummary.querySelector('.summary-item:nth-child(5) .summary-value').textContent = `${baggageCount}kg`;
      confirmationSummary.querySelector('.summary-item:nth-child(6) .summary-value').textContent = `${paymentMethod} (50% downpayment)`;
      
      // Add or update discount row
      let discountRow = confirmationSummary.querySelector('.discount-row');
      if (discountApplied) {
        if (!discountRow) {
          discountRow = document.createElement('div');
          discountRow.className = 'summary-item discount-row';
          confirmationSummary.insertBefore(discountRow, confirmationSummary.querySelector('.summary-total'));
        }
        discountRow.innerHTML = `
          <span class="summary-label">Discount Applied:</span>
          <span class="summary-value">-₱30.00 (ID required)</span>
        `;
      } else if (discountRow) {
        discountRow.remove();
      }
      
      confirmationSummary.querySelector('.summary-total .summary-value').textContent = `₱${downpayment.toFixed(2)}`;
    }
  }
  
  // View Ticket after payment
  document.getElementById('view-ticket').addEventListener('click', function() {
    updateStep(4);
  });
  
  // Print/Save Ticket
  document.getElementById('print-ticket').addEventListener('click', function() {
    // Generate printable ticket content
    const ticketContent = `
      <div class="ticket-print">
        <h2>VanTastic Ticket</h2>
        <div class="ticket-details">
          <p><strong>Ticket Number:</strong> VT${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}</p>
          <p><strong>Route:</strong> ${document.getElementById('terminal').options[document.getElementById('terminal').selectedIndex].text} to ${document.getElementById('destination').options[document.getElementById('destination').selectedIndex].text}</p>
          <p><strong>Date:</strong> ${new Date(document.getElementById('date').value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Time:</strong> ${document.getElementById('time').options[document.getElementById('time').selectedIndex].text}</p>
          <p><strong>Passengers:</strong> ${passengerCount}</p>
          <p><strong>Baggage:</strong> ${baggageCount}kg</p>
          <p><strong>Status:</strong> Confirmed</p>
        </div>
        <div class="ticket-barcode">
          <img src="https://barcode.tec-it.com/barcode.ashx?data=VT${new Date().getTime()}&code=Code128&dpi=96" alt="Ticket Barcode">
        </div>
      </div>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>VanTastic Ticket</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .ticket-print { max-width: 500px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
          .ticket-details p { margin: 10px 0; }
          .ticket-barcode { margin-top: 20px; text-align: center; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${ticketContent}
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()">Print Ticket</button>
          <button onclick="window.close()">Close</button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  });
  
  document.getElementById('save-ticket').addEventListener('click', function() {
    // In a real app, this would generate a PDF or image
    alert('Ticket saved to your device. In a real app, this would download a PDF.');
  });
  
  // Initialize form
  updateSummary();
});