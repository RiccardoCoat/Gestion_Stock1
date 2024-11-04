// Notification system
export const notifications = {
  init() {
    this.checkPermission();
    this.startMonitoring();
  },

  async checkPermission() {
    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  },

  startMonitoring() {
    setInterval(() => this.checkStockLevels(), 3600000); // Check every hour
  },

  checkStockLevels() {
    const lowStock = db.exec(`
      SELECT name, quantity, min_quantity
      FROM items
      WHERE quantity <= min_quantity
    `);

    if (lowStock.length > 0) {
      lowStock[0].values.forEach(item => {
        this.sendNotification(
          'Stock Alert',
          `Low stock for ${item[0]}: ${item[1]}/${item[2]}`
        );
      });
    }
  },

  sendNotification(title, message) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  }
};