class SupplierManager {
  constructor(db) {
    this.db = db;
  }

  async init() {
    this.updateTable();
    this.setupEventListeners();
  }

  updateTable() {
    const stmt = this.db.prepare('SELECT * FROM suppliers');
    const tbody = document.querySelector('#supplierTable tbody');
    tbody.innerHTML = '';

    while (stmt.step()) {
      const row = stmt.getAsObject();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.name}</td>
        <td>${row.contact}</td>
        <td>${row.email}</td>
        <td>${row.phone}</td>
        <td>${row.address}</td>
        <td>
          <button onclick="editSupplier(${row.id})" class="btn-icon">
            <i class="material-icons">edit</i>
          </button>
          <button onclick="deleteSupplier(${row.id})" class="btn-icon">
            <i class="material-icons">delete</i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    }
    stmt.free();
  }

  setupEventListeners() {
    document.getElementById('supplierForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveSupplier(new FormData(e.target));
    });
  }

  saveSupplier(formData) {
    const data = Object.fromEntries(formData);
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO suppliers (name, contact, email, phone, address)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run([data.name, data.contact, data.email, data.phone, data.address]);
    this.updateTable();
    closeModal('supplierModal');
  }
}

export { SupplierManager };