// Utility functions for enhanced features
export const utils = {
  // Export to Excel/CSV
  async exportToExcel() {
    const result = db.exec(`
      SELECT reference, name, category, quantity, min_quantity, max_quantity
      FROM items
    `);
    
    const ws = XLSX.utils.json_to_sheet(result[0].values.map(row => ({
      Reference: row[0],
      Name: row[1],
      Category: row[2],
      Quantity: row[3],
      'Min Quantity': row[4],
      'Max Quantity': row[5]
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "inventory_export.xlsx");
  },

  // Database backup
  exportDatabase() {
    const data = db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_backup_${new Date().toISOString().split('T')[0]}.db`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Generate QR Code
  generateQRCode(text) {
    return new QRCode(document.createElement('div'), {
      text: text,
      width: 128,
      height: 128
    }).makeCode(text);
  },

  // Analytics calculations
  calculateAnalytics() {
    const analytics = db.exec(`
      SELECT 
        COUNT(*) as total_items,
        SUM(quantity) as total_stock,
        COUNT(CASE WHEN quantity <= min_quantity THEN 1 END) as low_stock,
        AVG(quantity) as avg_stock
      FROM items
    `)[0].values[0];

    const usage = db.exec(`
      SELECT item_id, COUNT(*) as movements
      FROM history
      WHERE action = 'update'
      GROUP BY item_id
      ORDER BY movements DESC
      LIMIT 5
    `);

    return {
      totalItems: analytics[0],
      totalStock: analytics[1],
      lowStock: analytics[2],
      avgStock: analytics[3],
      topMovers: usage.length > 0 ? usage[0].values : []
    };
  },

  // Location management
  async updateLocation(itemId, location) {
    db.run(`
      UPDATE items 
      SET location = ? 
      WHERE id = ?
    `, [location, itemId]);
  },

  // Enhanced search with multiple criteria
  advancedSearch(criteria) {
    let query = `
      SELECT i.*, l.name as location
      FROM items i
      LEFT JOIN locations l ON i.location_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (criteria.search) {
      query += ` AND (i.name LIKE ? OR i.reference LIKE ? OR i.category LIKE ?)`;
      params.push(`%${criteria.search}%`, `%${criteria.search}%`, `%${criteria.search}%`);
    }

    if (criteria.category) {
      query += ` AND i.category = ?`;
      params.push(criteria.category);
    }

    if (criteria.location) {
      query += ` AND i.location_id = ?`;
      params.push(criteria.location);
    }

    if (criteria.stock === 'low') {
      query += ` AND i.quantity <= i.min_quantity`;
    }

    return db.exec(query, params);
  }
};