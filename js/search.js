// Enhanced search functionality
export const search = {
  init() {
    this.setupSearchForm();
    this.setupSavedSearches();
  },

  setupSearchForm() {
    const form = document.getElementById('advancedSearchForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      this.performSearch({
        term: formData.get('searchTerm'),
        category: formData.get('category'),
        location: formData.get('location'),
        stock: formData.get('stockLevel'),
        dateFrom: formData.get('dateFrom'),
        dateTo: formData.get('dateTo')
      });
    });
  },

  async performSearch(criteria) {
    const results = await utils.advancedSearch(criteria);
    this.displayResults(results);
  },

  displayResults(results) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    if (results.length > 0) {
      results[0].values.forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `
          <h3>${item[2]}</h3>
          <p>Reference: ${item[1]}</p>
          <p>Category: ${item[3]}</p>
          <p>Location: ${item.location || 'Not specified'}</p>
          <p>Stock: ${item[4]}/${item[5]}</p>
        `;
        container.appendChild(div);
      });
    } else {
      container.innerHTML = '<p>No results found</p>';
    }
  },

  saveSearch(name, criteria) {
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    savedSearches.push({ name, criteria });
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    this.updateSavedSearchesList();
  },

  setupSavedSearches() {
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    const container = document.getElementById('savedSearches');
    
    savedSearches.forEach(search => {
      const div = document.createElement('div');
      div.className = 'saved-search';
      div.innerHTML = `
        <span>${search.name}</span>
        <button onclick="search.loadSavedSearch('${search.name}')">Load</button>
        <button onclick="search.deleteSavedSearch('${search.name}')">Delete</button>
      `;
      container.appendChild(div);
    });
  }
};