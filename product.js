document.addEventListener("DOMContentLoaded", function () {
  const productListContainer = document.getElementById('productList');
  const minPriceRange = document.getElementById('minPriceRange');
  const maxPriceRange = document.getElementById('maxPriceRange');
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const categoryNavItems = document.querySelectorAll('.category_nav li a');
  const checkboxCategories = document.querySelectorAll('.custom-checkbox input[type="checkbox"]');
  const searchInput = document.getElementById('searchInput');

  // Fetch product data from API
  fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
          displayProducts(data);
      })
      .catch(error => console.error('Error fetching data:', error));

  function displayProducts(products) {
      productListContainer.innerHTML = ''; // Clear current product list
      products.forEach(product => {
          const productCol = document.createElement('div');
          productCol.classList.add('product_col');
          productCol.innerHTML = `
              <img src="${product.image}" alt="${product.title}" />
              <p>${product.title}</p>
              <span>$${product.price.toFixed(2)}</span>
          `;
          productListContainer.appendChild(productCol);
      });
  }

  // Filter functionality
  minPriceRange.addEventListener('input', syncPriceInputs);
  maxPriceRange.addEventListener('input', syncPriceInputs);
  minPriceInput.addEventListener('input', syncPriceSliders);
  maxPriceInput.addEventListener('input', syncPriceSliders);
  checkboxCategories.forEach(checkbox => {
      checkbox.addEventListener('change', filterProducts);
  });
  searchInput.addEventListener('input', filterProducts);

  function syncPriceInputs() {
      minPriceInput.value = minPriceRange.value;
      maxPriceInput.value = maxPriceRange.value;
      filterProducts();
  }

  function syncPriceSliders() {
      minPriceRange.value = minPriceInput.value;
      maxPriceRange.value = maxPriceInput.value;
      filterProducts();
  }

  function filterProducts() {
      const minPrice = parseInt(minPriceRange.value);
      const maxPrice = parseInt(maxPriceRange.value);
      const selectedCategories = Array.from(checkboxCategories)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.value);
      const searchTerm = searchInput.value.toLowerCase();

      fetch('https://fakestoreapi.com/products')
          .then(response => response.json())
          .then(data => {
              let filteredProducts = data.filter(product => {
                  const matchesPriceRange = product.price >= minPrice && product.price <= maxPrice;
                  const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
                  const matchesSearchTerm = product.title.toLowerCase().includes(searchTerm);

                  return matchesPriceRange && matchesCategory && matchesSearchTerm;
              });
              displayProducts(filteredProducts);
          })
          .catch(error => console.error('Error filtering data:', error));
  }

  filterProducts();
});
