// Sample van data
const vans = [
  {
    id: "VAN001",
    plate: "ABC 1234",
    model: "Toyota HiAce",
    capacity: 12,
    status: "active",
    driver: "Juan Dela Cruz",
    maintenance: "2023-05-15",
    notes: "Regular service completed"
  },
  {
    id: "VAN002",
    plate: "XYZ 5678",
    model: "Nissan Urvan",
    capacity: 14,
    status: "maintenance",
    driver: "",
    maintenance: "2023-06-01",
    notes: "Engine check required"
  }
];

// DOM Elements
const addVanModal = document.getElementById('add-van-modal');
const editVanModal = document.getElementById('edit-van-modal');
const addVanForm = document.getElementById('add-van-form');
const editVanForm = document.getElementById('edit-van-form');
const deleteModal = document.getElementById('delete-modal');
let vanToDelete = null;

// Navigation between sections
document.querySelectorAll('.sidebar-menu a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    document.querySelectorAll('.sidebar-menu a').forEach(item => {
      item.classList.remove('active');
    });
    this.classList.add('active');
    
    const sectionId = this.getAttribute('data-section');
    document.querySelectorAll('.dashboard-section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
  });
});

// Add Van Modal
document.getElementById('add-van-btn').addEventListener('click', function() {
  resetAddVanForm();
  addVanModal.style.display = 'flex';
});

document.getElementById('cancel-add-van').addEventListener('click', function(e) {
  e.preventDefault();
  addVanModal.style.display = 'none';
});

addVanModal.addEventListener('click', function(e) {
  if (e.target === addVanModal) {
    addVanModal.style.display = 'none';
  }
});

// Edit Van Modal
document.getElementById('cancel-edit-van').addEventListener('click', function(e) {
  e.preventDefault();
  editVanModal.style.display = 'none';
});

editVanModal.addEventListener('click', function(e) {
  if (e.target === editVanModal) {
    editVanModal.style.display = 'none';
  }
});

// Close buttons for both modals
document.querySelectorAll('.close-van-modal').forEach(btn => {
  btn.addEventListener('click', function() {
    addVanModal.style.display = 'none';
    editVanModal.style.display = 'none';
  });
});

// Add Van Form Submission
addVanForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const vanData = {
    id: document.getElementById('add-van-id').value,
    plate: document.getElementById('add-van-plate').value,
    model: document.getElementById('add-van-model').value,
    capacity: document.getElementById('add-van-capacity').value,
    status: document.getElementById('add-van-status').value,
    driver: document.getElementById('add-van-driver').value,
    notes: document.getElementById('add-van-notes').value,
    maintenance: new Date().toISOString().split('T')[0]
  };

  if (!vanData.id || !vanData.plate || !vanData.model) {
    alert('Please fill in all required fields');
    return;
  }

  // Check if van ID already exists
  if (vans.some(v => v.id === vanData.id)) {
    alert('A van with this ID already exists');
    return;
  }

  vans.push(vanData);
  refreshVanTable();
  addVanModal.style.display = 'none';
  alert('Van added successfully!');
});

// Edit Van Form Submission
editVanForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const vanId = document.getElementById('edit-van-id').value;
  const vanData = {
    id: vanId,
    plate: document.getElementById('edit-van-plate').value,
    model: document.getElementById('edit-van-model').value,
    capacity: document.getElementById('edit-van-capacity').value,
    status: document.getElementById('edit-van-status').value,
    driver: document.getElementById('edit-van-driver').value,
    notes: document.getElementById('edit-van-notes').value
  };

  if (!vanData.plate || !vanData.model) {
    alert('Please fill in all required fields');
    return;
  }

  const index = vans.findIndex(v => v.id === vanId);
  if (index !== -1) {
    // Preserve maintenance date
    vanData.maintenance = vans[index].maintenance;
    vans[index] = vanData;
  }

  refreshVanTable();
  editVanModal.style.display = 'none';
  alert('Van updated successfully!');
});

// Edit van button
function attachEditVanListeners() {
  document.querySelectorAll('.edit-van-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const vanId = this.closest('tr').getAttribute('data-van-id');
      const van = vans.find(v => v.id === vanId);
      
      if (van) {
        document.getElementById('edit-van-id').value = van.id;
        document.getElementById('edit-van-id-display').value = van.id;
        document.getElementById('edit-van-plate').value = van.plate;
        document.getElementById('edit-van-model').value = van.model;
        document.getElementById('edit-van-capacity').value = van.capacity;
        document.getElementById('edit-van-status').value = van.status;
        document.getElementById('edit-van-driver').value = van.driver;
        document.getElementById('edit-van-notes').value = van.notes;
        
        editVanModal.style.display = 'flex';
      }
    });
  });
}

// Delete van
function attachDeleteVanListeners() {
  document.querySelectorAll('.delete-van-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      vanToDelete = this.closest('tr').getAttribute('data-van-id');
      deleteModal.style.display = 'flex';
    });
  });
}

// Delete confirmation
document.getElementById('confirm-delete').addEventListener('click', function() {
  if (vanToDelete) {
    const index = vans.findIndex(v => v.id === vanToDelete);
    if (index !== -1) {
      vans.splice(index, 1);
    }
    
    refreshVanTable();
    alert(`Van ${vanToDelete} deleted successfully!`);
    deleteModal.style.display = 'none';
    vanToDelete = null;
  }
});

// Cancel delete
document.getElementById('cancel-delete').addEventListener('click', function() {
  deleteModal.style.display = 'none';
  vanToDelete = null;
});

// Close modal
document.querySelector('.close-modal').addEventListener('click', function() {
  deleteModal.style.display = 'none';
  vanToDelete = null;
});

// Reset add van form
function resetAddVanForm() {
  document.getElementById('add-van-id').value = '';
  document.getElementById('add-van-plate').value = '';
  document.getElementById('add-van-model').value = '';
  document.getElementById('add-van-capacity').value = '';
  document.getElementById('add-van-status').value = 'active';
  document.getElementById('add-van-driver').value = '';
  document.getElementById('add-van-notes').value = '';
}

// Refresh van table
function refreshVanTable() {
  const tbody = document.querySelector('#vans-table tbody');
  tbody.innerHTML = '';
  
  vans.forEach(van => {
    const row = document.createElement('tr');
    row.setAttribute('data-van-id', van.id);
    
    row.innerHTML = `
      <td>${van.id}</td>
      <td>${van.plate}</td>
      <td>${van.model}</td>
      <td>${van.capacity}</td>
      <td><span class="status-badge ${getStatusClass(van.status)}">${getStatusText(van.status)}</span></td>
      <td>${van.driver || '-'}</td>
      <td>${van.maintenance || '-'}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-secondary btn-sm edit-van-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm delete-van-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    
    tbody.appendChild(row);
  });
  
  attachEditVanListeners();
  attachDeleteVanListeners();
}


  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  
// Helper functions for status
function getStatusClass(status) {
  switch(status) {
    case 'active': return 'status-active';
    case 'maintenance': return 'status-maintenance';
    case 'inactive': return 'status-inactive';
    default: return '';
  }
}

function getStatusText(status) {
  switch(status) {
    case 'active': return 'Active';
    case 'maintenance': return 'Maintenance';
    case 'inactive': return 'Inactive';
    default: return status;
  }
}

// Initialize the van table
refreshVanTable();


  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------

// Existing functionality
document.getElementById('logout-btn').addEventListener('click', function() {
  if(confirm('Are you sure you want to logout?')) {
    window.location.href = 'index.html';
  }
});


  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------

document.querySelector('.search-bar input').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const rows = document.querySelectorAll('#vans-table tbody tr');
  
  rows.forEach(row => {
    const rowText = row.textContent.toLowerCase();
    row.style.display = rowText.includes(searchTerm) ? '' : 'none';
  });
});