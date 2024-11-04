// Global functions and initialization
window.initSqlJs = window.initSqlJs || (() => {
  return import('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js')
    .then(module => module.default);
});

// Modal functions
window.openModal = (modalId) => {
  document.getElementById(modalId).style.display = 'block';
};

window.closeModal = (modalId) => {
  document.getElementById(modalId).style.display = 'none';
};

// Item management functions
window.editItem = (reference) => {
  const stmt = window.db.prepare('SELECT * FROM items WHERE reference = ?');
  stmt.bind([reference]);
  const item = stmt.getAsObject();
  
  const form = document.getElementById('itemForm');
  form.reference.value = item.reference;
  form.name.value = item.name;
  form.category.value = item.category_id;
  form.quantity.value = item.quantity;
  form.min.value = item.min_quantity;
  form.max.value = item.max_quantity;
  
  openModal('itemModal');
};

window.deleteItem = (reference) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    window.db.run('DELETE FROM items WHERE reference = ?', [reference]);
    window.inventory.updateTable();
  }
};

// Supplier management functions
window.editSupplier = (id) => {
  const stmt = window.db.prepare('SELECT * FROM suppliers WHERE id = ?');
  stmt.bind([id]);
  const supplier = stmt.getAsObject();
  
  const form = document.getElementById('supplierForm');
  form.name.value = supplier.name;
  form.contact.value = supplier.contact;
  form.email.value = supplier.email;
  form.phone.value = supplier.phone;
  form.address.value = supplier.address;
  
  openModal('supplierModal');
};

window.deleteSupplier = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
    window.db.run('DELETE FROM suppliers WHERE id = ?', [id]);
    window.suppliers.updateTable();
  }
};

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize database
    window.db = await initDB();
    
    // Initialize modules
    const modules = [
      inventory,
      categories,
      suppliers,
      history,
      analytics,
      notifications,
      locations,
      search
    ];

    for (const module of modules) {
      await module.init();
    }

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Application initialization failed:', error);
    alert('Une erreur est survenue lors de l\'initialisation. Veuillez rafraîchir la page.');
  }
});