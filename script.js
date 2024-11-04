import { inventoryManager } from './js/inventory.js';
import { SupplierManager } from './js/suppliers.js';

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await inventoryManager.init();
    const supplierManager = new SupplierManager(inventoryManager.db);
    await supplierManager.init();
    
    setupNavigation();
    setupCharts();
  } catch (error) {
    console.error('Application initialization failed:', error);
  }
});

function setupNavigation() {
  document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      showView(view);
    });
  });
}

function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  document.querySelectorAll('.nav-button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.getElementById(viewId).classList.add('active');
  document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
}

function setupCharts() {
  const stockCtx = document.getElementById('stockChart').getContext('2d');
  new Chart(stockCtx, {
    type: 'bar',
    data: {
      labels: ['En stock', 'Minimum', 'Maximum'],
      datasets: [{
        label: 'Niveaux de Stock',
        data: [300, 100, 1000],
        backgroundColor: ['#4CAF50', '#FFC107', '#2196F3']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });
}