// History Management
export const history = {
  updateTable() {
    const result = db.exec(`
      SELECT h.id, i.name, h.action, h.quantity, h.user, h.timestamp
      FROM history h
      JOIN items i ON h.item_id = i.id
      ORDER BY h.timestamp DESC
      LIMIT 100
    `);
    
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';
    
    if (result.length > 0) {
      result[0].values.forEach(row => {
        const tr = document.createElement('tr');
        const date = new Date(row[5]).toLocaleString('fr-FR');
        const actionText = this.getActionText(row[2], row[3]);
        
        tr.innerHTML = `
          <td>${date}</td>
          <td>${row[1]}</td>
          <td>${actionText}</td>
          <td>${row[4]}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  },

  getActionText(action, quantity) {
    switch (action) {
      case 'add':
        return `Ajout initial de ${quantity} unités`;
      case 'update':
        return `Mise à jour du stock (${quantity > 0 ? '+' : ''}${quantity})`;
      case 'delete':
        return 'Suppression de l\'article';
      default:
        return action;
    }
  },

  init() {
    this.updateTable();
  }
};