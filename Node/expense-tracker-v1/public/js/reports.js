// Reports Page Script
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[v0] Reports page loading');
  
  try {
    setupEventListeners();
    await loadMonthlyReport();
    updateMonthDisplay();
    updateYearDisplay();
  } catch (error) {
    console.error('[v0] Reports init error:', error);
    showError(error.message);
  }
});

function setupEventListeners() {
  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      switchTab(tabName);
    });
  });

  // Monthly navigation
  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    updateMonthDisplay();
    loadMonthlyReport();
  });

  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
    updateMonthDisplay();
    loadMonthlyReport();
  });

  // Yearly navigation
  document.getElementById('prevYearBtn').addEventListener('click', () => {
    currentYear--;
    updateYearDisplay();
    loadYearlyReport();
  });

  document.getElementById('nextYearBtn').addEventListener('click', () => {
    currentYear++;
    updateYearDisplay();
    loadYearlyReport();
  });
}

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active class from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  const selectedTab = document.getElementById(tabName + 'Tab');
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Add active class to clicked button
  const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // Load report if needed
  if (tabName === 'yearly') {
    loadYearlyReport();
  } else {
    loadMonthlyReport();
  }
}

async function loadMonthlyReport() {
  try {
    const report = await apiGet(`/reports/monthly?month=${currentMonth}&year=${currentYear}`);
    
    // Update total
    document.getElementById('monthlyTotal').textContent = formatCurrency(report.total);

    // Render category table
    const tbody = document.getElementById('monthlyCategoryBody');
    if (report.byCategory.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center">No expenses this month</td></tr>';
      return;
    }

    const totalSpent = report.byCategory.reduce((sum, cat) => sum + parseFloat(cat.total), 0);

    tbody.innerHTML = report.byCategory.map(cat => {
      const percentage = ((cat.total / totalSpent) * 100).toFixed(1);
      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${cat.color};"></div>
              ${cat.name}
            </div>
          </td>
          <td>${formatCurrency(cat.total)}</td>
          <td>${percentage}%</td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('[v0] Load monthly report error:', error);
    showError(error.message);
  }
}

async function loadYearlyReport() {
  try {
    const report = await apiGet(`/reports/yearly?year=${currentYear}`);
    
    // Update total
    document.getElementById('yearlyTotal').textContent = formatCurrency(report.total);

    // Render category table
    const categoryBody = document.getElementById('yearlyCategoryBody');
    if (report.byCategory.length === 0) {
      categoryBody.innerHTML = '<tr><td colspan="3" class="text-center">No expenses this year</td></tr>';
    } else {
      const totalSpent = report.byCategory.reduce((sum, cat) => sum + parseFloat(cat.total), 0);

      categoryBody.innerHTML = report.byCategory.map(cat => {
        const percentage = ((cat.total / totalSpent) * 100).toFixed(1);
        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${cat.color};"></div>
                ${cat.name}
              </div>
            </td>
            <td>${formatCurrency(cat.total)}</td>
            <td>${percentage}%</td>
          </tr>
        `;
      }).join('');
    }

    // Render monthly breakdown
    const monthlyBody = document.getElementById('monthlyBreakdownBody');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (report.monthly.length === 0) {
      monthlyBody.innerHTML = '<tr><td colspan="2" class="text-center">No expenses this year</td></tr>';
    } else {
      monthlyBody.innerHTML = report.monthly.map(month => `
        <tr>
          <td>${monthNames[month.month - 1]} ${currentYear}</td>
          <td>${formatCurrency(month.total)}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('[v0] Load yearly report error:', error);
    showError(error.message);
  }
}

function updateMonthDisplay() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const display = `${monthNames[currentMonth - 1]} ${currentYear}`;
  document.getElementById('monthDisplay').textContent = display;
}

function updateYearDisplay() {
  document.getElementById('yearDisplay').textContent = currentYear;
}
