// Expenses Page Script
let categories = [];
let allExpenses = [];
let currentExpenseId = null;

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[v0] Expenses page loading');
  
  try {
    await loadCategories();
    await loadExpenses();
    setupEventListeners();
  } catch (error) {
    console.error('[v0] Expenses init error:', error);
    showError(error.message);
  }
});

async function loadCategories() {
  try {
    categories = await apiGet('/categories');
    populateCategoryFilters();
    populateCategorySelect();
  } catch (error) {
    console.error('[v0] Load categories error:', error);
  }
}

async function loadExpenses(filters = {}) {
  try {
    let url = '/expenses';
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }

    allExpenses = await apiGet(url);
    renderExpensesTable();
  } catch (error) {
    console.error('[v0] Load expenses error:', error);
    showError(error.message);
  }
}

function renderExpensesTable() {
  const tbody = document.getElementById('expensesTableBody');
  
  if (allExpenses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No expenses found</td></tr>';
    return;
  }

  tbody.innerHTML = allExpenses.map(expense => `
    <tr>
      <td>${formatDate(expense.expense_date)}</td>
      <td>${expense.description || 'N/A'}</td>
      <td>${expense.category_name}</td>
      <td>${formatCurrency(expense.amount)}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm" onclick="editExpense(${expense.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function populateCategoryFilters() {
  const select = document.getElementById('filterCategory');
  const options = categories.map(cat => 
    `<option value="${cat.id}">${cat.name}</option>`
  ).join('');
  select.innerHTML = '<option value="">All Categories</option>' + options;
}

function populateCategorySelect() {
  const select = document.getElementById('expenseCategory');
  const options = categories.map(cat => 
    `<option value="${cat.id}">${cat.name}</option>`
  ).join('');
  select.innerHTML = '<option value="">Select a category</option>' + options;
}

function setupEventListeners() {
  // Add expense button
  document.getElementById('addExpenseBtn').addEventListener('click', () => {
    currentExpenseId = null;
    document.getElementById('expenseModalTitle').textContent = 'Add Expense';
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseDate').value = getCurrentDate();
    showModal('expenseModal');
  });

  // Close modal
  document.getElementById('closeExpenseModal').addEventListener('click', () => {
    hideModal('expenseModal');
  });

  document.getElementById('cancelExpenseBtn').addEventListener('click', () => {
    hideModal('expenseModal');
  });

  // Form submission
  document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveExpense();
  });

  // Filter buttons
  document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
  document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

  // Close modal when clicking outside
  document.getElementById('expenseModal').addEventListener('click', (e) => {
    if (e.target.id === 'expenseModal') {
      hideModal('expenseModal');
    }
  });
}

async function saveExpense() {
  const categoryId = document.getElementById('expenseCategory').value;
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const expenseDate = document.getElementById('expenseDate').value;
  const description = document.getElementById('expenseDescription').value;

  try {
    if (currentExpenseId) {
      await apiPut(`/expenses/${currentExpenseId}`, {
        categoryId: parseInt(categoryId),
        amount,
        expenseDate,
        description
      });
    } else {
      await apiPost('/expenses', {
        categoryId: parseInt(categoryId),
        amount,
        expenseDate,
        description
      });
    }

    hideModal('expenseModal');
    await loadExpenses();
    showSuccess('Expense saved successfully');
  } catch (error) {
    console.error('[v0] Save expense error:', error);
    showError(error.message);
  }
}

async function editExpense(id) {
  try {
    const expense = await apiGet(`/expenses/${id}`);
    
    currentExpenseId = id;
    document.getElementById('expenseModalTitle').textContent = 'Edit Expense';
    document.getElementById('expenseCategory').value = expense.category_id;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseDate').value = expense.expense_date;
    document.getElementById('expenseDescription').value = expense.description || '';
    
    showModal('expenseModal');
  } catch (error) {
    console.error('[v0] Edit expense error:', error);
    showError(error.message);
  }
}

async function deleteExpense(id) {
  if (!confirm('Are you sure you want to delete this expense?')) {
    return;
  }

  try {
    await apiDelete(`/expenses/${id}`);
    await loadExpenses();
    showSuccess('Expense deleted successfully');
  } catch (error) {
    console.error('[v0] Delete expense error:', error);
    showError(error.message);
  }
}

function applyFilters() {
  const startDate = document.getElementById('filterStartDate').value;
  const endDate = document.getElementById('filterEndDate').value;
  const categoryId = document.getElementById('filterCategory').value;

  if (!startDate || !endDate) {
    showError('Please select both start and end dates');
    return;
  }

  const filters = {
    startDate,
    endDate,
    categoryId: categoryId ? categoryId : undefined
  };

  loadExpenses(filters);
}

function clearFilters() {
  document.getElementById('filterStartDate').value = '';
  document.getElementById('filterEndDate').value = '';
  document.getElementById('filterCategory').value = '';
  loadExpenses();
}
