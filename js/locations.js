// Location management
export const locations = {
  init() {
    this.setupListeners();
    this.updateLocationsList();
  },

  setupListeners() {
    document.getElementById('locationForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      this.addLocation(formData);
    });
  },

  addLocation(formData) {
    db.run(`
      INSERT INTO locations (name, description)
      VALUES (?, ?)
    `, [formData.get('name'), formData.get('description')]);
    
    this.updateLocationsList();
  },

  updateLocationsList() {
    const result = db.exec(`
      SELECT l.id, l.name, l.description,
             COUNT(i.id) as item_count
      FROM locations l
      LEFT JOIN items i ON l.id = i.location_id
      GROUP BY l.id
    `);

    const container = document.getElementById('locationsList');
    container.innerHTML = '';

    if (result.length > 0) {
      result[0].values.forEach(row => {
        const div = document.createElement('div');
        div.className = 'location-card';
        div.innerHTML = `
          <h3>${row[1]}</h3>
          <p>${row[2]}</p>
          <span class="item-count">${row[3]} items</span>
          <button onclick="locations.viewLocation(${row[0]})">View Items</button>
        `;
        container.appendChild(div);
      });
    }
  },

  viewLocation(locationId) {
    const items = db.exec(`
      SELECT i.*
      FROM items i
      WHERE i.location_id = ?
    `, [locationId]);

    // Update the items view for the selected location
    inventory.updateTable(items[0].values);
  }
};