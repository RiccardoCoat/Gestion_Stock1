// Database initialization and core functions
const initDB = async () => {
  try {
    const SQL = await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });
    
    const db = new SQL.Database();
    
    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS items (
        reference TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category_id TEXT,
        quantity INTEGER DEFAULT 0,
        min_quantity INTEGER DEFAULT 0,
        max_quantity INTEGER DEFAULT 0,
        location_id TEXT,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )`,
      `CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact TEXT,
        email TEXT,
        phone TEXT,
        address TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        item_ref TEXT,
        action TEXT,
        user TEXT,
        quantity INTEGER,
        FOREIGN KEY (item_ref) REFERENCES items(reference)
      )`,
      `CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      )`
    ];

    // Execute all table creation queries
    for (const query of tables) {
      db.run(query);
    }

    // Insert sample data if tables are empty
    const hasData = db.exec('SELECT COUNT(*) FROM categories')[0].values[0][0] > 0;
    
    if (!hasData) {
      // Insert default categories
      db.run(`
        INSERT INTO categories (id, name) VALUES 
        ('office', 'Fournitures de Bureau'),
        ('cleaning', 'Produits d''Entretien')
      `);

      // Insert sample products
      db.run(`
        INSERT INTO items (reference, name, category_id, quantity, min_quantity, max_quantity) VALUES 
        ('PAP001', 'Papier A4', 'office', 500, 100, 1000),
        ('NET001', 'Détergent Multi-usage', 'cleaning', 20, 5, 50)
      `);

      // Insert sample location
      db.run(`
        INSERT INTO locations (name, description) VALUES 
        ('Entrepôt Principal', 'Zone de stockage principale')
      `);
    }

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export { initDB };