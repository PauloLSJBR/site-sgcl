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
      html, body {
        max-width: 100%;
        overflow-x: hidden;
      }

      .site-menu > a.active:after,
      .site-menu > a.access-active:after {
        display: none !important;
        content: none !important;
      }

      .site-menu > a,
      .menu-dropdown-toggle {
        box-shadow: none !important;
        outline: 0 !important;
      }

      .site-menu > a.active,
      .site-menu > a.access-active,
      .menu-dropdown.is-current > .menu-dropdown-toggle {
        background: rgba(255,255,255,.1) !important;
        outline: 2px solid var(--yellow) !important;
        outline-offset: 2px !important;
        color: #fff !important;
      }

      .menu-dropdown:not(.is-current) > .menu-dropdown-toggle {
        outline: 0 !important;
        box-shadow: none !important;
      }

      .menu-dropdown-panel a.active {
        background: rgba(255,196,0,.16) !important;
        color: var(--blue-950) !important;
      }

      .quote-panel {
        min-height: 330px;
        justify-content: center !important;
        gap: 18px;
        background: linear-gradient(135deg, rgba(5,25,69,.98), rgba(8,47,125,.94)) !important;
      }

      .quote-panel strong {
        max-width: 420px;
      }

      .quote-panel p {
        max-width: 420px;
        font-size: 18px;
      }

      .quote-points {
        list-style: none;
        margin: 4px 0 0;
        padding: 0;
        display: grid;
        gap: 10px;
      }

      .quote-points li {
        position: relative;
        padding-left: 28px;
        color: rgba(255,255,255,.9);
        font-weight: 760;
        line-height: 1.35;
      }

      .quote-points li:before {
        content: "✓";
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(--yellow);
        color: var(--blue-950);
        font-size: 12px;
        font-weight: 950;
      }

      .footer-access-primary {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        width: fit-content;
        margin-top: 10px !important;
        margin-bottom: 12px !important;
        padding: 9px 13px;
        border-radius: 10px;
        background: var(--yellow);
        color: var(--blue-950) !important;
        font-weight: 900;
      }

      .footer-access-primary:hover {
        background: var(--yellow-2);
      }

      .footer-access-secondary {
        display: inline-flex !important;
        width: fit-content;
        color: var(--yellow) !important;
        font-weight: 800;
      }

      .footer-access-secondary:hover {
        color: var(--yellow-2) !important;
      }

      @media (max-width:820px) {
        .site-menu > a.active,
        .site-menu > a.access-active,
        .menu-dropdown.is-current > .menu-dropdown-toggle {
          outline: 0 !important;
          color: var(--yellow) !important;
          background: transparent !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function enhanceQuotePanel() {
    const quotePanel = document.querySelector('.quote-panel');
    if (!quotePanel || quotePanel.querySelector('.quote-points')) return;

    const points = document.createElement('ul');
    points.className = 'quote-points';
    points.innerHTML = `
      <li>Experiência real no setor lotérico.</li>
      <li>Produto focado na rotina da Casa Lotérica.</li>
      <li>Evolução contínua com suporte próximo.</li>
    `;
    quotePanel.appendChild(points);
  }

  function enhanceFooterAccess() {
    const footerAccess = document.querySelector('.site-footer .footer-grid > div:last-child');
    if (!footerAccess) return;

    footerAccess.innerHTML = `
      <h3>Acesso ao sistema</h3>
      <p class="small">Já utiliza o SGCL? Acesse o ambiente em nuvem pelo link principal.</p>
      <a class="footer-access-primary" href="https://sgcl.masterdaweb.net/" target="_blank" rel="noopener noreferrer" aria-label="Acessar o sistema SGCL agora">Acessar SGCL agora</a>
      <p class="small">Caso precise, consulte também a página com link alternativo de acesso.</p>
      <a class="footer-access-secondary" href="acesso-aplicativos.html" aria-label="Ver link alternativo de acesso ao SGCL">Ver link alternativo</a>
    `;
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

  function clearMenuState() {
    document.querySelectorAll('.site-menu > a[href^="#"]').forEach((link) => link.classList.remove('active'));
    document.querySelectorAll('.menu-dropdown-panel a[href^="#"]').forEach((link) => link.classList.remove('active'));
    if (dropdown) dropdown.classList.remove('is-current');
    if (dropdownToggle) dropdownToggle.classList.remove('active');
  }

  function setActiveMenu(current) {
    clearMenuState();

    if (current === '#recursos' || current === '#demonstracao') {
      if (dropdown) dropdown.classList.add('is-current');
      if (dropdownToggle) dropdownToggle.classList.add('active');
      const subLink = document.querySelector(`.menu-dropdown-panel a[href="${current}"]`);
      if (subLink) subLink.classList.add('active');
      return;
    }

    const topLink = document.querySelector(`.site-menu > a[href="${current}"]`);
    if (topLink) topLink.classList.add('active');
  }

  function getCurrentSectionByPosition() {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const currentY = window.scrollY + headerHeight + 42;
    const sectionIds = ['#inicio', '#recursos', '#sobre', '#indicacao', '#demonstracao', '#contato'];

    return sectionIds
      .map((id) => ({ id, element: document.querySelector(id) }))
      .filter((item) => item.element)
      .sort((a, b) => a.element.offsetTop - b.element.offsetTop)
      .reduce((current, item) => {
        if (item.element.offsetTop <= currentY) return item.id;
        return current;
      }, '#inicio');
  }

  function updateActiveLink(forcedHash) {
    const current = forcedHash || getCurrentSectionByPosition();
    setActiveMenu(current);

    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 560);
  }

  applyMenuStyleFix();
  enhanceQuotePanel();
  enhanceFooterAccess();

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