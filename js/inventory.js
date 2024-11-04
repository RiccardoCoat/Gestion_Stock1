import { initDB } from './db.js';

class InventoryManager {
  constructor() {
    this.db = null;
  }

  async init() {
    try {
      this.db = await initDB();
      this.updateTable();
      this.setupEventListeners();
    } catch (error) {
      console.error('Inventory initialization failed:', error);
    }
  }

  updateTable() {
    const stmt = this.db.prepare(`
      SELECT i.*, c.name as category_name 
      FROM items i 
      LEFT JOIN categories c ON i.category_id = c.id
    `);
    
    const tbody = document.querySelector('#inventoryTable tbody');
    tbody.innerHTML = '';

    while (stmt.step()) {
      const row = stmt.getAsObject();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.reference}</td>
        <td>${row.name}</td>
        <td>${row.category_name}</td>
        <td>${row.quantity}</td>
        <td>${row.min_quantity}</td>
        <td>${row.max_quantity}</td>
        <td>
          <button onclick="editItem('${row.reference}')" class="btn-icon">
            <i class="material-icons">edit</i>
          </button>
          <button onclick="deleteItem('${row.reference}')" class="btn-icon">
            <i class="material-icons">delete</i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    }
    stmt.free();
  }

  setupEventListeners() {
    document.getElementById('itemForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveItem(new FormData(e.target));
    });

    document.getElementById('searchInventory').addEventListener('input', (e) => {
      this.filterItems(e.target.value);
    });
  }

  saveItem(formData) {
    const data = Object.fromEntries(formData);
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO items (reference, name, category_id, quantity, min_quantity, max_quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      data.reference,
      data.name,
      data.category,
      parseInt(data.quantity),
      parseInt(data.min),
      parseInt(data.max)
    ]);
    
    this.updateTable();
    closeModal('itemModal');
  }

  filterItems(query) {
    const stmt = this.db.prepare(`
      SELECT i.*, c.name as category_name 
      FROM items i 
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.name LIKE ? OR i.reference LIKE ?
    `);
    
    const searchPattern = `%${query}%`;
    stmt.bind([searchPattern, searchPattern]);
    
    const tbody = document.querySelector('#inventoryTable tbody');
    tbody.innerHTML = '';
    
    while (stmt.step()) {
      // Same row creation logic as updateTable
    }
    stmt.free();
  }
}

export const inventoryManager = new InventoryManager();