// API Base URL
const API_BASE = 'http://localhost:3000/api';

// Token Management
function setToken(token) {
  localStorage.setItem('token', token);
}

function getToken() {
  return localStorage.getItem('token');
}

function removeToken() {
  localStorage.removeItem('token');
}

function isAuthenticated() {
  return !!getToken();
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function removeUser() {
  localStorage.removeItem('user');
}

// API Calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
        removeUser();
        window.location.href = '/index.html';
      }
      const error = await response.json();
      throw new Error(error.error || 'API error');
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] API Error:', error);
    throw error;
  }
}

async function apiGet(endpoint) {
  return apiCall(endpoint, { method: 'GET' });
}

async function apiPost(endpoint, data) {
  return apiCall(endpoint, { method: 'POST', body: JSON.stringify(data) });
}

async function apiPut(endpoint, data) {
  return apiCall(endpoint, { method: 'PUT', body: JSON.stringify(data) });
}

async function apiDelete(endpoint) {
  return apiCall(endpoint, { method: 'DELETE' });
}

// UI Helpers
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function formatDateInput(date) {
  if (typeof date === 'string') {
    return date.split('T')[0];
  }
  return date.toISOString().split('T')[0];
}

function getCurrentDate() {
  return formatDateInput(new Date());
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

function showError(message) {
  alert('Error: ' + message);
}

function showSuccess(message) {
  alert(message);
}

// Navigation
function navigateTo(url) {
  window.location.href = url;
}

// Init Common Features
function initCommonFeatures() {
  if (!isAuthenticated()) {
    navigateTo('/index.html');
    return;
  }

  const user = getUser();
  if (user) {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');

    if (userAvatar) userAvatar.textContent = user.name.charAt(0).toUpperCase();
    if (userName) userName.textContent = user.name;
    if (userEmail) userEmail.textContent = user.email;
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      removeToken();
      removeUser();
      navigateTo('/index.html');
    });
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const sidebarNav = document.querySelector('.sidebar-nav');
  const sidebarFooter = document.querySelector('.sidebar-footer');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebarNav?.classList.toggle('open');
      sidebarFooter?.classList.toggle('open');
    });
  }

  // Close mobile menu when link clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebarNav?.classList.remove('open');
      sidebarFooter?.classList.remove('open');
    });
  });

  console.log('[v0] Common features initialized');
}

// Page load check
document.addEventListener('DOMContentLoaded', () => {
  // Only init common features if we're on an app page (not login)
  if (document.body.classList.contains('app-page')) {
    initCommonFeatures();
  }
});
