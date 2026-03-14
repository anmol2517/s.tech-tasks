let expenses = [];
let categoryChart = null;
let trendChart = null;
let editingId = null;

document.getElementById('toggle-form-btn').addEventListener('click', () => {
  editingId = null;
  document.getElementById('form-title').textContent = 'Add New Expense';
  document.getElementById('submit-btn').textContent = 'Add Expense';
  document.getElementById('form-container').classList.toggle('hidden');
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').value = '';
  document.getElementById('date').value = '';
  document.getElementById('form-error').textContent = '';
});

document.getElementById('cancel-btn').addEventListener('click', () => {
  document.getElementById('form-container').classList.add('hidden');
  editingId = null;
});

document.getElementById('submit-btn').addEventListener('click', async () => {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const errorDiv = document.getElementById('form-error');

  if (!description || !amount || !category || !date) {
    errorDiv.textContent = 'All fields required';
    return;
  }

  try {
    const url = editingId ? `/api/expenses/${editingId}` : '/api/expenses';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ description, amount, category, date })
    });
    const data = await res.json();
    if (!res.ok) { errorDiv.textContent = data.error || 'Failed'; return; }
    document.getElementById('form-container').classList.add('hidden');
    editingId = null;
    errorDiv.textContent = '';
    await fetchExpenses();
  } catch {
    errorDiv.textContent = 'An error occurred';
  }
});

document.getElementById('search-input').addEventListener('input', renderExpenses);
document.getElementById('category-filter').addEventListener('change', renderExpenses);

async function fetchExpenses() {
  try {
    const res = await fetch('/api/expenses', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.status === 401) { window.location.href = '/login.html'; return; }
    expenses = await res.json();
    renderExpenses();
    updateStats();
    updateCharts();
  } catch (err) {
    console.error(err);
  }
}

function renderExpenses() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const cat = document.getElementById('category-filter').value;
  const filtered = expenses.filter(e => e.description.toLowerCase().includes(search) && (cat === 'all' || e.category === cat));
  const list = document.getElementById('expenses-list');

  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state"><p>No expenses found</p></div>';
    return;
  }

  list.innerHTML = filtered.map(e => `
    <div class="expense-item">
      <div class="expense-details">
        <div class="expense-header">
          <span class="category-badge category-${e.category}">${e.category}</span>
          <span class="expense-description">${e.description}</span>
        </div>
        <div class="expense-date">${new Date(e.date).toLocaleDateString()}</div>
      </div>
      <span class="expense-amount">₹${parseFloat(e.amount).toFixed(2)}</span>
      <div class="expense-actions">
        <button onclick="editExpense(${e.id})">Edit</button>
        <button class="delete-btn" onclick="deleteExpense(${e.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function editExpense(id) {
  const e = expenses.find(x => x.id === id);
  if (!e) return;
  editingId = id;
  document.getElementById('form-title').textContent = 'Edit Expense';
  document.getElementById('submit-btn').textContent = 'Update Expense';
  document.getElementById('description').value = e.description;
  document.getElementById('amount').value = e.amount;
  document.getElementById('category').value = e.category;
  document.getElementById('date').value = e.date.split('T')[0];
  document.getElementById('form-container').classList.remove('hidden');
  document.getElementById('form-error').textContent = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;
  try {
    const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) { alert('Failed to delete'); return; }
    await fetchExpenses();
  } catch { alert('An error occurred'); }
}

function updateStats() {
  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  const avg = expenses.length ? total / expenses.length : 0;
  document.getElementById('total-spent').textContent = total.toFixed(2);
  document.getElementById('avg-amount').textContent = avg.toFixed(2);
  document.getElementById('total-count').textContent = expenses.length;
}

function updateCharts() {
  if (!expenses.length) {
    document.getElementById('charts-container').classList.add('hidden');
    return;
  }
  document.getElementById('charts-container').classList.remove('hidden');

  const catData = {};
  const dateData = {};

  expenses.forEach(e => {
    const amt = parseFloat(e.amount);
    catData[e.category] = (catData[e.category] || 0) + amt;
    const d = e.date.split('T')[0];
    dateData[d] = (dateData[d] || 0) + amt;
  });

  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(document.getElementById('category-chart').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(catData),
      datasets: [{ data: Object.values(catData), backgroundColor: ['#fecaca','#bfdbfe','#d8b4fe','#fbcfe8','#fde68a','#86efac','#93c5fd','#e5e7eb'] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });

  const sorted = Object.keys(dateData).sort();
  if (trendChart) trendChart.destroy();
  trendChart = new Chart(document.getElementById('trend-chart').getContext('2d'), {
    type: 'line',
    data: {
      labels: sorted.map(d => new Date(d).toLocaleDateString()),
      datasets: [{ label: 'Daily Spending', data: sorted.map(d => dateData[d]), borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', tension: 0.4, fill: true }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

fetchExpenses();