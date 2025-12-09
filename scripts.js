// =========================================
// Dashboard Kit - Custom JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize Chart
  initTrendsChart();
  
  // Mobile menu toggle
  initMobileMenu();
  
  // Task completion handlers
  initTaskHandlers();
  
  // Add animation to stats on scroll
  initScrollAnimations();
  
});

// =========================================
// Chart Initialization
// =========================================
function initTrendsChart() {
  const ctx = document.getElementById('trendsChart');
  if (!ctx) return;
  
  // Sample data matching the design
  const todayData = [15, 22, 28, 35, 48, 38, 42, 35, 28, 22, 32, 38, 45, 38, 28, 35, 30, 25, 20, 18, 15, 12, 10];
  const yesterdayData = [10, 15, 20, 25, 30, 28, 32, 28, 25, 20, 25, 30, 35, 30, 25, 28, 25, 22, 18, 15, 12, 10, 8];
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length: 23}, (_, i) => i.toString()),
      datasets: [
        {
          label: 'Today',
          data: todayData,
          borderColor: '#3751FF',
          backgroundColor: 'rgba(55, 81, 255, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#3751FF',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        },
        {
          label: 'Yesterday',
          data: yesterdayData,
          borderColor: '#DFE0EB',
          backgroundColor: 'rgba(223, 224, 235, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#DFE0EB',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#363740',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#DFE0EB',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#9FA2B3',
            font: {
              size: 12
            }
          }
        },
        y: {
          border: {
            display: false
          },
          grid: {
            color: 'rgba(223, 224, 235, 0.5)',
            drawBorder: false
          },
          ticks: {
            color: '#9FA2B3',
            font: {
              size: 12
            },
            stepSize: 10
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

// =========================================
// Mobile Menu Toggle
// =========================================
function initMobileMenu() {
  // Create mobile menu button
  const topBar = document.querySelector('.top-bar');
  const menuButton = document.createElement('button');
  menuButton.className = 'btn btn-link text-dark d-md-none';
  menuButton.innerHTML = '<i class="bi bi-list fs-4"></i>';
  menuButton.setAttribute('aria-label', 'Toggle menu');
  
  // Insert at the beginning of top bar
  topBar.insertBefore(menuButton, topBar.firstChild);
  
  const sidebar = document.querySelector('.sidebar');
  
  // Toggle sidebar
  menuButton.addEventListener('click', function() {
    sidebar.classList.toggle('show');
  });
  
  // Close sidebar when clicking outside
  document.addEventListener('click', function(event) {
    if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
      sidebar.classList.remove('show');
    }
  });
  
  // Close sidebar on nav link click (mobile)
  const navLinks = sidebar.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < 768) {
        sidebar.classList.remove('show');
      }
    });
  });
}

// =========================================
// Task Handlers
// =========================================
function initTaskHandlers() {
  const taskCheckboxes = document.querySelectorAll('.task-item .form-check-input');
  
  taskCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const taskItem = this.closest('.task-item');
      
      if (this.checked) {
        taskItem.style.opacity = '0.6';
        showToast('Task completed! 🎉');
      } else {
        taskItem.style.opacity = '1';
      }
    });
  });
  
  // Add task form submission
  const addTaskModal = document.getElementById('addTaskModal');
  if (addTaskModal) {
    addTaskModal.addEventListener('show.bs.modal', function() {
      // Reset form when modal opens
      const form = this.querySelector('form');
      if (form) form.reset();
    });
    
    const createButton = addTaskModal.querySelector('.btn-primary');
    if (createButton) {
      createButton.addEventListener('click', function() {
        const taskName = document.getElementById('taskName').value;
        if (taskName.trim()) {
          showToast('Task "' + taskName + '" created successfully!');
          bootstrap.Modal.getInstance(addTaskModal).hide();
        } else {
          showToast('Please enter a task name', 'warning');
        }
      });
    }
  }
}

// =========================================
// Scroll Animations
// =========================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          entry.target.style.transition = 'all 0.5s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe cards
  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
}

// =========================================
// Toast Notifications
// =========================================
function showToast(message, type = 'success') {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toastId = 'toast-' + Date.now();
  const bgClass = type === 'success' ? 'bg-success' : type === 'warning' ? 'bg-warning' : 'bg-primary';
  
  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  
  toastContainer.insertAdjacentHTML('beforeend', toastHTML);
  
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 3000
  });
  
  toast.show();
  
  // Remove toast element after it's hidden
  toastElement.addEventListener('hidden.bs.toast', function() {
    this.remove();
  });
}

// =========================================
// Stat Card Animations
// =========================================
function animateStatValue(element, targetValue) {
  const duration = 1000;
  const start = 0;
  const increment = targetValue / (duration / 16);
  let current = start;
  
  const timer = setInterval(function() {
    current += increment;
    if (current >= targetValue) {
      element.textContent = targetValue;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Animate stats on page load
window.addEventListener('load', function() {
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(stat => {
    const value = parseInt(stat.textContent);
    stat.textContent = '0';
    setTimeout(() => {
      animateStatValue(stat, value);
    }, 300);
  });
});

// =========================================
// Search Functionality (Demo)
// =========================================
const searchModal = document.getElementById('searchModal');
if (searchModal) {
  const searchInput = searchModal.querySelector('input');
  
  searchModal.addEventListener('shown.bs.modal', function() {
    searchInput.focus();
  });
  
  searchInput.addEventListener('input', function() {
    // This is where you would implement actual search functionality
    console.log('Searching for:', this.value);
  });
}

// =========================================
// Keyboard Shortcuts
// =========================================
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
    searchModal.show();
  }
});

// =========================================
// Update Time Display
// =========================================
function updateTime() {
  const now = new Date();
  const options = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  const timeString = now.toLocaleDateString('en-US', options).replace(',', ', ');
  
  const timeElements = document.querySelectorAll('.text-muted.small');
  timeElements.forEach(el => {
    if (el.textContent.includes('as of')) {
      el.textContent = 'as of ' + timeString;
    }
  });
}

// Update time every minute
setInterval(updateTime, 60000);
