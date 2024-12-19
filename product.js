const apiUrl = 'https://fakestoreapi.com/products';
const productsContainer = document.getElementById('products-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const loadingShimmer = document.getElementById('loading-shimmer');
let products = [];
let displayedProducts = 0;
let filteredProducts = [];

function fetchProducts() {
  loadingShimmer.style.display = 'block';
  productsContainer.innerHTML = '';

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      products = data;
      filteredProducts = data;
      displayProducts();
      loadingShimmer.style.display = 'none';
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
      loadingShimmer.style.display = 'none';
    });
}

function displayProducts() {
  const productsToDisplay = filteredProducts.slice(
    displayedProducts,
    displayedProducts + 10
  );
  productsToDisplay.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p class="product-price">$${product.price}</p>
    `;

    productsContainer.appendChild(productCard);
  });

  displayedProducts += productsToDisplay.length;

  if (displayedProducts >= filteredProducts.length) {
    loadMoreBtn.disabled = true;
  }
}

document
  .getElementById('category-filter')
  .addEventListener('change', function () {
    const category = this.value;
    filteredProducts = category
      ? products.filter((product) => product.category === category)
      : products;
    displayedProducts = 0;
    productsContainer.innerHTML = '';
    displayProducts();
  });

document.getElementById('sort-by').addEventListener('change', function () {
  const sortBy = this.value;
  filteredProducts.sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price;
    }
    return a.title.localeCompare(b.title);
  });
  displayedProducts = 0;
  productsContainer.innerHTML = '';
  displayProducts();
});


document.getElementById('search-bar').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );
  displayedProducts = 0;
  productsContainer.innerHTML = '';
  displayProducts();
});


loadMoreBtn.addEventListener('click', function () {
  displayProducts();
});


fetchProducts();
