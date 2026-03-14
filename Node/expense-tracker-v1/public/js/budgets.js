// Budgets Page Script
let categories = [];
let budgets = [];
let currentBudgetId = null;
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[v0] Budgets page loading');
  
  try {
    await loadCategories();
    await loadBudgets();
    setupEventListeners();
    updateMonthDisplay();
  } catch (error) {
    console.error('[v0] Budgets init error:', error);
    showError(error.message);
  }
});

async function loadCategories() {
  try {
    categories = await apiGet('/categories');
    populateCategorySelect();
  } catch (error) {
    console.error('[v0] Load categories error:', error);
  }
}

async function loadBudgets() {
  try {
    budgets = await apiGet(`/budgets?month=${currentMonth}&year=${currentYear}`);
    renderBudgetsGrid();
  } catch (error) {
    console.error('[v0] Load budgets error:', error);
    showError(error.message);
  }
}

function renderBudgetsGrid() {
  const grid = document.getElementById('budgetsGrid');
  
  if (budgets.length === 0) {
    grid.innerHTML = '<p class="text-center">No budgets set for this month</p>';
    return;
  }

  grid.innerHTML = budgets.map(budget => {
    const percentage = Math.min((budget.spent_amount / budget.limit_amount) * 100, 100);
    const isOverBudget = budget.spent_amount > budget.limit_amount;
    const statusClass = percentage >= 90 ? 'danger' : percentage >= 75 ? 'warning' : '';

    return `
      <div class="budget-card">
        <div class="budget-header">
          <h3 class="budget-name">${budget.category_name}</h3>
          <div class="budget-color" style="background-color: ${budget.color};"></div>
        </div>
        <div class="budget-info">
          <span class="budget-spent">Spent: ${formatCurrency(budget.spent_amount)}</span>
          <span class="budget-limit">Limit: ${formatCurrency(budget.limit_amount)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${statusClass}" style="width: ${Math.min(percentage, 100)}%;"></div>
        </div>
        <div class="budget-percentage">
          ${Math.round(percentage)}% ${isOverBudget ? '(Over budget!)' : 'used'}
        </div>
        <div class="category-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="editBudget(${budget.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteBudget(${budget.id})">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function populateCategorySelect() {
  const select = document.getElementById('budgetCategory');
  const options = categories.map(cat => 
    `<option value="${cat.id}">${cat.name}</option>`
  ).join('');
  select.innerHTML = '<option value="">Select a category</option>' + options;
}

function setupEventListeners() {
  // Add budget button
  document.getElementById('addBudgetBtn').addEventListener('click', () => {
    currentBudgetId = null;
    document.getElementById('budgetModalTitle').textContent = 'Set Budget';
    document.getElementById('budgetForm').reset();
    showModal('budgetModal');
  });

  // Close modal
  document.getElementById('closeBudgetModal').addEventListener('click', () => {
    hideModal('budgetModal');
  });

  document.getElementById('cancelBudgetBtn').addEventListener('click', () => {
    hideModal('budgetModal');
  });

  // Form submission
  document.getElementById('budgetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveBudget();
  });

  // Month navigation
  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    updateMonthDisplay();
    loadBudgets();
  });

  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
    updateMonthDisplay();
    loadBudgets();
  });

  // Close modal when clicking outside
  document.getElementById('budgetModal').addEventListener('click', (e) => {
    if (e.target.id === 'budgetModal') {
      hideModal('budgetModal');
    }
  });
}

function updateMonthDisplay() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const display = `${monthNames[currentMonth - 1]} ${currentYear}`;
  document.getElementById('currentMonthDisplay').textContent = display;
}

async function saveBudget() {
  const categoryId = document.getElementById('budgetCategory').value;
  const limitAmount = parseFloat(document.getElementById('budgetLimit').value);

  if (!categoryId || !limitAmount) {
    showError('Please fill in all fields');
    return;
  }

  try {
    await apiPost('/budgets', {
      categoryId: parseInt(categoryId),
      limitAmount,
      month: currentMonth,
      year: currentYear
    });

    hideModal('budgetModal');
    await loadBudgets();
    showSuccess('Budget saved successfully');
  } catch (error) {
    console.error('[v0] Save budget error:', error);
    showError(error.message);
  }
}

async function editBudget(id) {
  const budget = budgets.find(b => b.id === id);
  if (!budget) {
    showError('Budget not found');
    return;
  }

  currentBudgetId = id;
  document.getElementById('budgetModalTitle').textContent = 'Edit Budget';
  document.getElementById('budgetCategory').value = budget.category_id;
  document.getElementById('budgetLimit').value = budget.limit_amount;
  
  showModal('budgetModal');
}

async function deleteBudget(id) {
  if (!confirm('Are you sure you want to delete this budget?')) {
    return;
  }

  try {
    await apiDelete(`/budgets/${id}`);
    await loadBudgets();
    showSuccess('Budget deleted successfully');
  } catch (error) {
    console.error('[v0] Delete budget error:', error);
    showError(error.message);
  }
}
