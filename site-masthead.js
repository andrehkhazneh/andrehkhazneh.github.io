(() => {
  const button = document.querySelector('.site-masthead .menu-toggle');
  const nav = document.getElementById('site-nav');
  const root = document.documentElement;
  const desktop = window.matchMedia('(min-width: 1024px)');

  function syncButton() {
    const expanded = desktop.matches
      ? !root.classList.contains('sidebar-collapsed')
      : nav.classList.contains('is-open');
    button.setAttribute('aria-expanded', String(expanded));
  }

  function closeMobileMenu() {
    nav.classList.remove('is-open');
    syncButton();
  }

  button.addEventListener('click', () => {
    if (desktop.matches) {
      root.classList.toggle('sidebar-collapsed');
    } else {
      nav.classList.toggle('is-open');
    }
    syncButton();
  });
  nav.addEventListener('click', event => {
    if (!desktop.matches && event.target.closest('a')) closeMobileMenu();
  });
  document.addEventListener('keydown', event => {
    if (desktop.matches || event.key !== 'Escape' || !nav.classList.contains('is-open')) return;
    closeMobileMenu();
    button.focus();
  });
  document.addEventListener('click', event => {
    if (!desktop.matches && !event.target.closest('.site-masthead')) closeMobileMenu();
  });
  desktop.addEventListener('change', closeMobileMenu);
  syncButton();
})();
