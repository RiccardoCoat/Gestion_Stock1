// Load SQL.js WebAssembly module
let db;

async function initDB() {
  try {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    
    // Create a new database
    db = new SQL.Database();
    
    // Create tables
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER DEFAULT 0,
        min_quantity INTEGER DEFAULT 0,
        max_quantity INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS item_suppliers (
        item_id INTEGER,
        supplier_id INTEGER,
        price REAL,
        FOREIGN KEY (item_id) REFERENCES items (id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers (id),
        PRIMARY KEY (item_id, supplier_id)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER,
        action TEXT NOT NULL,
        quantity INTEGER,
        user TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES items (id)
      );
    `);

    // Insert sample data
    db.run(`
      INSERT INTO items (reference, name, category, quantity, min_quantity, max_quantity)
      VALUES 
        ('RAM-32GB', 'RAM DDR4 32GB', 'informatique', 15, 5, 30),
        ('PAPER-A4', 'Papier A4 500 feuilles', 'bureau', 45, 20, 100)
    `);

    db.run(`
      INSERT INTO suppliers (name, contact, email, phone, address)
      VALUES 
        ('TechPro SARL', 'Jean Dupont', 'contact@techpro.fr', '0123456789', '123 Rue de la Tech, 75001 Paris'),
        ('Bureau Plus', 'Marie Martin', 'sales@bureauplus.fr', '0987654321', '456 Avenue des Fournitures, 69002 Lyon')
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (err) {
    console.error('Failed to initialize database:', err);
    throw err;
  }
}

// Export database initialization
window.db = null;
window.initDB = initDB;