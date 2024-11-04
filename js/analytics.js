// Analytics and reporting
export const analytics = {
  init() {
    this.setupCharts();
    this.updateDashboard();
  },

  setupCharts() {
    this.setupStockChart();
    this.setupMovementChart();
    this.setupCategoryChart();
  },

  setupStockChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');
    const data = this.getStockData();
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Current Stock',
          data: data.quantities,
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }, {
          label: 'Minimum Stock',
          data: data.minimums,
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }]
      }
    });
  },

  getStockData() {
    const result = db.exec(`
      SELECT name, quantity, min_quantity
      FROM items
      ORDER BY quantity DESC
      LIMIT 10
    `);

    return {
      labels: result[0].values.map(row => row[0]),
      quantities: result[0].values.map(row => row[1]),
      minimums: result[0].values.map(row => row[2])
    };
  },

  setupMovementChart() {
    const ctx = document.getElementById('movementChart').getContext('2d');
    const data = this.getMovementData();

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.dates,
        datasets: [{
          label: 'Stock Movements',
          data: data.movements,
          borderColor: 'rgb(75, 192, 192)'
        }]
      }
    });
  },

  getMovementData() {
    const result = db.exec(`
      SELECT DATE(timestamp) as date, COUNT(*) as movements
      FROM history
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
      LIMIT 30
    `);

    return {
      dates: result[0].values.map(row => row[0]),
      movements: result[0].values.map(row => row[1])
    };
  }
};