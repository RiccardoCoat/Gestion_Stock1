// Category Management
export const categories = {
  list: [
    { id: 'bureau', name: 'Fournitures de Bureau' },
    { id: 'informatique', name: 'Matériel Informatique' },
    { id: 'entretien', name: 'Produits d\'Entretien' }
  ],

  add(id, name) {
    this.list.push({ id, name });
    this.updateCategorySelects();
    this.updateCategoryFilter();
  },

  updateCategorySelects() {
    const selects = document.querySelectorAll('select[name="category"]');
    selects.forEach(select => {
      const currentValue = select.value;
      select.innerHTML = `
        <option value="">Sélectionner une catégorie</option>
        ${this.list.map(cat => `
          <option value="${cat.id}">${cat.name}</option>
        `).join('')}
        <option value="new">+ Nouvelle Catégorie</option>
      `;
      if (currentValue && currentValue !== 'new') {
        select.value = currentValue;
      }
    });
  },

  updateCategoryFilter() {
    const filter = document.getElementById('categoryFilter');
    filter.innerHTML = `
      <option value="">Toutes les catégories</option>
      ${this.list.map(cat => `
        <option value="${cat.id}">${cat.name}</option>
      `).join('')}
    `;
  },

  init() {
    this.updateCategorySelects();
    this.updateCategoryFilter();
    this.setupListeners();
  },

  setupListeners() {
    document.querySelectorAll('select[name="category"]').forEach(select => {
      select.addEventListener('change', (e) => {
        if (e.target.value === 'new') {
          e.target.value = '';
          document.getElementById('categoryModal').style.display = 'block';
        }
      });
    });

    document.getElementById('categoryForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get('categoryId');
      const name = formData.get('categoryName');
      
      if (this.list.some(cat => cat.id === id)) {
        alert('Cet identifiant de catégorie existe déjà');
        return;
      }
      
      this.add(id, name);
      closeModal('categoryModal');
      e.target.reset();
    });
  }
};