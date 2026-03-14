// Categories Page Script
let categories = [];
let currentCategoryId = null;

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[v0] Categories page loading');
  
  try {
    await loadCategories();
    setupEventListeners();
  } catch (error) {
    console.error('[v0] Categories init error:', error);
    showError(error.message);
  }
});

async function loadCategories() {
  try {
    categories = await apiGet('/categories');
    renderCategoriesGrid();
  } catch (error) {
    console.error('[v0] Load categories error:', error);
    showError(error.message);
  }
}

function renderCategoriesGrid() {
  const grid = document.getElementById('categoriesGrid');
  
  if (categories.length === 0) {
    grid.innerHTML = '<p class="text-center">No categories yet</p>';
    return;
  }

  grid.innerHTML = categories.map(cat => `
    <div class="category-card">
      <div class="category-card-header">
        <h3 class="category-card-title">${cat.name}</h3>
        <div class="category-card-color" style="background-color: ${cat.color};"></div>
      </div>
      <div class="category-card-meta">
        <p>${cat.expense_count || 0} expenses</p>
      </div>
      <div class="category-card-actions">
        <button class="btn btn-secondary btn-sm" onclick="editCategory(${cat.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCategory(${cat.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function setupEventListeners() {
  // Add category button
  document.getElementById('addCategoryBtn').addEventListener('click', () => {
    currentCategoryId = null;
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryColor').value = '#3498db';
    updateColorPreview('#3498db');
    showModal('categoryModal');
  });

  // Close modal
  document.getElementById('closeCategoryModal').addEventListener('click', () => {
    hideModal('categoryModal');
  });

  document.getElementById('cancelCategoryBtn').addEventListener('click', () => {
    hideModal('categoryModal');
  });

  // Color picker update
  document.getElementById('categoryColor').addEventListener('change', (e) => {
    updateColorPreview(e.target.value);
  });

  // Form submission
  document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveCategory();
  });

  // Close modal when clicking outside
  document.getElementById('categoryModal').addEventListener('click', (e) => {
    if (e.target.id === 'categoryModal') {
      hideModal('categoryModal');
    }
  });
}

function updateColorPreview(color) {
  const preview = document.getElementById('colorPreview');
  if (preview) {
    preview.style.backgroundColor = color;
  }
}

async function saveCategory() {
  const name = document.getElementById('categoryName').value;
  const color = document.getElementById('categoryColor').value;

  try {
    if (currentCategoryId) {
      await apiPut(`/categories/${currentCategoryId}`, { name, color });
    } else {
      await apiPost('/categories', { name, color });
    }

    hideModal('categoryModal');
    await loadCategories();
    showSuccess('Category saved successfully');
  } catch (error) {
    console.error('[v0] Save category error:', error);
    showError(error.message);
  }
}

async function editCategory(id) {
  try {
    const cat = categories.find(c => c.id === id);
    if (!cat) throw new Error('Category not found');

    currentCategoryId = id;
    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryName').value = cat.name;
    document.getElementById('categoryColor').value = cat.color;
    updateColorPreview(cat.color);
    
    showModal('categoryModal');
  } catch (error) {
    console.error('[v0] Edit category error:', error);
    showError(error.message);
  }
}

async function deleteCategory(id) {
  if (!confirm('Are you sure you want to delete this category?')) {
    return;
  }

  try {
    await apiDelete(`/categories/${id}`);
    await loadCategories();
    showSuccess('Category deleted successfully');
  } catch (error) {
    console.error('[v0] Delete category error:', error);
    showError(error.message);
  }
}
