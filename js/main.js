(function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-menu');
  const headerLinks = Array.from(document.querySelectorAll('.site-menu a[href^="#"]'));
  const dropdown = document.querySelector('.menu-dropdown');
  const dropdownToggle = document.querySelector('.menu-dropdown-toggle');
  const backToTop = document.querySelector('.back-to-top');
  const toast = document.querySelector('.toast');
  const form = document.querySelector('#leadForm');

  function applyMenuStyleFix() {
    if (document.querySelector('#sgcl-menu-active-fix')) return;
    const style = document.createElement('style');
    style.id = 'sgcl-menu-active-fix';
    style.textContent = `
      .site-menu > a.active:after {
        display: none !important;
        content: none !important;
      }

      .site-menu > a.active,
      .menu-dropdown-toggle.active,
      .menu-dropdown.is-current > .menu-dropdown-toggle {
        box-shadow: inset 0 -3px 0 var(--yellow);
      }

      .menu-dropdown-panel a.active {
        background: rgba(255,196,0,.14);
        color: var(--blue-950) !important;
      }

      @media (max-width:820px) {
        .site-menu > a.active,
        .menu-dropdown-toggle.active,
        .menu-dropdown.is-current > .menu-dropdown-toggle {
          box-shadow: none;
          color: var(--yellow);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 4200);
  }

  function closeDropdown() {
    if (dropdown && dropdownToggle) {
      dropdown.classList.remove('open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function closeMobileMenu() {
    if (menu && menuToggle) {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
  }

  function scrollToTarget(hash) {
    const target = document.querySelector(hash);
    const header = document.querySelector('.site-header');
    if (!target) return false;

    const headerHeight = header ? header.offsetHeight : 0;
    const extraGap = 16;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - extraGap;

    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    history.pushState(null, '', hash);
    updateActiveLink(hash);
    return true;
  }

  function setDropdownState(current) {
    if (!dropdown || !dropdownToggle) return;
    const inProducts = ['#recursos', '#demonstracao'].includes(current);
    dropdown.classList.toggle('is-current', inProducts);
    dropdownToggle.classList.toggle('active', inProducts);
    document.querySelectorAll('.menu-dropdown-panel a[href^="#"]').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });
  }

  function updateActiveLink(forcedHash) {
    const currentY = window.scrollY + 130;
    const sectionIds = Array.from(new Set([
      '#inicio',
      '#sobre',
      '#recursos',
      '#demonstracao',
      '#indicacao',
      '#contato'
    ]));

    let current = forcedHash || '#inicio';

    if (!forcedHash) {
      sectionIds.forEach((id) => {
        const section = document.querySelector(id);
        if (section && section.offsetTop <= currentY) current = id;
      });
    }

    document.querySelectorAll('.site-menu > a[href^="#"]').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });

    setDropdownState(current);

    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 560);
  }

  applyMenuStyleFix();

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      if (!isOpen) closeDropdown();
    });
  }

  if (dropdown && dropdownToggle) {
    dropdownToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = dropdown.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', String(isOpen));
    });

    dropdown.addEventListener('mouseleave', () => {
      if (window.innerWidth > 820) closeDropdown();
    });

    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) closeDropdown();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDropdown();
        closeMobileMenu();
      }
    });
  }

  headerLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        event.preventDefault();
        scrollToTarget(hash);
      }
      closeDropdown();
      closeMobileMenu();
    });
  });

  document.querySelectorAll('a[href^="#"]:not(.site-menu a)').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (hash && hash.length > 1 && document.querySelector(hash)) {
        event.preventDefault();
        scrollToTarget(hash);
      }
    });
  });

  window.addEventListener('scroll', () => updateActiveLink(), { passive: true });
  window.addEventListener('resize', () => {
    closeDropdown();
    if (window.innerWidth > 820) closeMobileMenu();
    updateActiveLink();
  });
  window.addEventListener('hashchange', () => updateActiveLink(window.location.hash || '#inicio'));
  updateActiveLink(window.location.hash || '#inicio');

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-subject]').forEach((button) => {
    button.addEventListener('click', () => {
      const subject = button.getAttribute('data-subject');
      const select = document.querySelector('select[name="assunto"]');
      if (select && subject) select.value = subject;
    });
  });

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = Array.from(form.querySelectorAll('input[required], textarea[required], select[required]'));
      let valid = true;

      fields.forEach((field) => {
        const isInvalid = !field.value.trim() || (field.type === 'email' && !field.checkValidity());
        field.classList.toggle('field-error', isInvalid);
        if (isInvalid) valid = false;
      });

      if (!valid) {
        showToast('Confira os campos obrigatórios antes de enviar.');
        return;
      }

      const data = new FormData(form);
      const nome = data.get('nome') || '';
      const email = data.get('email') || '';
      const telefone = data.get('telefone') || '';
      const loterica = data.get('loterica') || '';
      const assunto = data.get('assunto') || 'Solicitar Demonstração';
      const mensagem = data.get('mensagem') || '';
      const body = [
        `Nome: ${nome}`,
        `E-mail: ${email}`,
        `Telefone / WhatsApp: ${telefone}`,
        `Nome da lotérica: ${loterica}`,
        '',
        'Mensagem:',
        mensagem || 'Gostaria de receber mais informações sobre o SGCL.'
      ].join('\n');

      const mailto = `mailto:sgclloterica@sgcl.com.br?subject=${encodeURIComponent(String(assunto))}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      showToast('Abrindo seu aplicativo de e-mail para enviar a mensagem.');
    });

    form.querySelectorAll('input, textarea, select').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('field-error'));
    });
  }
})();
