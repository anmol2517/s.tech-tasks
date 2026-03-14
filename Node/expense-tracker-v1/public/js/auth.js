const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (!token || !user) window.location.href = '/login.html';

const avatarEl = document.getElementById('userAvatar');
const nameEl = document.getElementById('userName');
const emailEl = document.getElementById('userEmail');

if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
if (nameEl) nameEl.textContent = user.name;
if (emailEl) emailEl.textContent = user.email;

const menuToggle = document.getElementById('menuToggle');
const sidebarNav = document.querySelector('.sidebar-nav');
const sidebarFooter = document.querySelector('.sidebar-footer');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    sidebarNav?.classList.toggle('open');
    sidebarFooter?.classList.toggle('open');
  });
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
});