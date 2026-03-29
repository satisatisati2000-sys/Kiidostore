import { APP_CONFIG, firebaseConfig } from './config.js';
import { LOCAL_SEED } from './seed.js';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const PAGE = document.body.dataset.page || 'home';
const CART_KEY = 'kiido_cart_v4';
const CURRENCY_KEY = APP_CONFIG.CURRENCY_STORAGE_KEY || 'kiido_selected_currency';
const COLLECTIONS = APP_CONFIG.COLLECTIONS;

let fb = {
  ready: false,
  app: null,
  db: null,
  auth: null,
  api: null,
  currentUser: null
};

const state = {
  settings: null,
  categories: [],
  products: [],
  sliders: [],
  banners: [],
  cards: [],
  reviews: [],
  currentCurrency: localStorage.getItem(CURRENCY_KEY) || APP_CONFIG.DEFAULT_CURRENCY,
  adminUnlocked: sessionStorage.getItem('kiido_admin_gate') === '1'
};

const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z"/></svg>',
  categories: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L20 7H7"/></svg>',
  login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 3h2a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-2"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>',
  insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 9 6 6 6-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',
};

function rel(path) {
  return PAGE === 'home' || PAGE === '404' ? `./${path}`.replace('././', './') : `../${path}`;
}

function settings() {
  return {
    storeName: state.settings?.storeName || APP_CONFIG.STORE_NAME,
    tagline: state.settings?.tagline || '',
    whatsappNumber: state.settings?.whatsappNumber || APP_CONFIG.WHATSAPP_NUMBER || '',
    instagramUrl: state.settings?.instagramUrl || APP_CONFIG.INSTAGRAM_URL || '',
    defaultCurrency: state.settings?.defaultCurrency || APP_CONFIG.DEFAULT_CURRENCY,
    heroTitle: state.settings?.heroTitle || APP_CONFIG.STORE_NAME,
    heroText: state.settings?.heroText || '',
    footerText: state.settings?.footerText || APP_CONFIG.STORE_NAME,
    bgColor: state.settings?.bgColor || APP_CONFIG.THEME.bg,
    bg2Color: state.settings?.bg2Color || APP_CONFIG.THEME.bg2,
    surfaceColor: state.settings?.surfaceColor || APP_CONFIG.THEME.surface,
    surface2Color: state.settings?.surface2Color || APP_CONFIG.THEME.surface2,
    primaryColor: state.settings?.primaryColor || APP_CONFIG.THEME.primary,
    primaryDarkColor: state.settings?.primaryDarkColor || APP_CONFIG.THEME.primaryDark,
    primaryLightColor: state.settings?.primaryLightColor || APP_CONFIG.THEME.primaryLight,
    maroonColor: state.settings?.maroonColor || APP_CONFIG.THEME.maroon,
    textColor: state.settings?.textColor || APP_CONFIG.THEME.text,
    text2Color: state.settings?.text2Color || APP_CONFIG.THEME.text2,
    mutedColor: state.settings?.mutedColor || APP_CONFIG.THEME.muted,
    active: state.settings?.active ?? true,
  };
}

function applyTheme() {
  const root = document.documentElement;
  root.style.setProperty("--bg", "#0f0204");
  root.style.setProperty("--bg-2", "#170305");
  root.style.setProperty("--surface", "#26070b");
  root.style.setProperty("--surface-2", "#32090f");
  root.style.setProperty("--card", "#26070b");
  root.style.setProperty("--card-strong", "#32090f");
  root.style.setProperty("--primary", "#ff2333");
  root.style.setProperty("--primary-dark", "#b3121d");
  root.style.setProperty("--primary-light", "#ff4b57");
  root.style.setProperty("--maroon", "#6f0d14");
  root.style.setProperty("--red", "#ff2333");
  root.style.setProperty("--red-2", "#b3121d");
  root.style.setProperty("--gold", "#ff2333");
  root.style.setProperty("--gold-2", "#ff4b57");
  root.style.setProperty("--text", "#ffffff");
  root.style.setProperty("--text-2", "#f1dfe1");
  root.style.setProperty("--muted", "#c8a8ad");
  root.style.setProperty("--line", "rgba(255,255,255,0.08)");
  root.style.setProperty("--line-strong", "rgba(255,255,255,0.08)");
  root.style.setProperty("--glow", "rgba(255,35,51,0.30)");
}


function activeItems(items = []) {
  return Array.isArray(items)
    ? items.filter(item => item && item.active !== false).sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    : [];
}

function mapById(items = []) {
  return new Map(items.map(item => [item.id, item]));
}

function currencyMeta(code = null) {
  const catalog = APP_CONFIG.CURRENCIES || {};
  return catalog[code || state.currentCurrency || settings().defaultCurrency] || catalog[APP_CONFIG.DEFAULT_CURRENCY] || Object.values(catalog)[0];
}

function setCurrency(code) {
  const meta = currencyMeta(code);
  state.currentCurrency = meta.code;
  localStorage.setItem(CURRENCY_KEY, meta.code);
  rerenderVisiblePage();
}

function formatCurrency(value, code = null) {
  const meta = currencyMeta(code);
  const amount = Number(value || 0) * Number(meta.rate || 1);
  return `${new Intl.NumberFormat('ar', { minimumFractionDigits: meta.decimals ?? 2, maximumFractionDigits: meta.decimals ?? 2 }).format(amount)} ${meta.symbol}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function imageSrc(value = '') {
  return value || APP_CONFIG.FALLBACK_IMAGE;
}

function toastWrap() {
  let wrap = $('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  return wrap;
}

function showToast(message, type = 'info') {
  const item = document.createElement('div');
  item.className = `toast ${type}`;
  item.textContent = message;
  toastWrap().appendChild(item);
  setTimeout(() => {
    item.classList.add('hide');
    setTimeout(() => item.remove(), 200);
  }, 2400);
}

function emptyState(title, text = '') {
  return `<div class="empty-state"><strong>${escapeHtml(title)}</strong>${text ? `<span>${escapeHtml(text)}</span>` : ''}</div>`;
}

function skeletonCards(count = 3, cls = '') {
  return `<div class="rail ${cls}">${Array.from({ length: count }).map(() => '<div class="skeleton-card skeleton"></div>').join('')}</div>`;
}

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}
function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadges();
}
function cartCount() {
  return readCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}
function updateCartBadges() {
  $$('[data-cart-count]').forEach(el => {
    const count = cartCount();
    el.textContent = String(count);
    el.classList.toggle('hidden', count === 0);
  });
}
function addToCart(product) {
  const cart = readCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ id: product.id, name: product.name, image: product.image, price: Number(product.price || 0), quantity: 1 });
  writeCart(cart);
}
function addToCartById(productId) {
  const product = state.products.find(item => item.id === productId);
  if (!product) return showToast('المنتج غير موجود', 'error');
  addToCart(product);
  showToast('تمت الإضافة إلى السلة', 'success');
}
function buyNowById(productId) {
  const product = state.products.find(item => item.id === productId);
  if (!product) return showToast('المنتج غير موجود', 'error');
  addToCart(product);
  goTo(rel('pages/checkout.html'));
}

function goTo(url) { window.location.href = url; }
function getParam(key) { return new URL(window.location.href).searchParams.get(key); }

function resolveTarget(item = {}) {
  if (item.customUrl) return item.customUrl;
  const type = item.targetType;
  const targetId = item.targetId || item.productId || item.subcategoryId || item.categoryId;
  if (type === 'product' || item.productId) return `${rel('pages/product.html')}?id=${encodeURIComponent(targetId)}`;
  if (type === 'subcategory') return `#categoryRailSection`;
  if (type === 'category') return `#categoryRailSection`;
  if (type === 'section' && item.sectionId) return `#${item.sectionId}`;
  return '#';
}

function buildSearchDrawer() {
  return `
    <div class="search-drawer hidden" id="searchDrawer">
      <div class="search-panel">
        <div class="search-head">
          <strong>بحث</strong>
          <button class="icon-btn" type="button" id="closeSearchBtn">${ICONS.close}</button>
        </div>
        <div class="search-input-wrap">
          <input id="searchInput" class="search-input" type="search" placeholder="ابحث عن منتج">
        </div>
        <div id="searchCount" class="search-count"></div>
        <div id="searchResults"></div>
      </div>
    </div>`;
}

function buildTopbar() {
  return `
    <header class="topbar">
      <div class="container topbar-inner">
        <a class="brand" href="${rel('index.html')}">
          <img src="${rel('images/logo.png')}" alt="KIIDO" class="brand-logo">
        </a>
        <div class="top-actions">
          <label class="currency-switcher">
            <span>${escapeHtml(currencyMeta().code)}</span>
            <select id="currencySelect" aria-label="اختر العملة">
              ${Object.values(APP_CONFIG.CURRENCIES).map(item => `<option value="${item.code}" ${item.code === state.currentCurrency ? 'selected' : ''}>${item.name}</option>`).join('')}
            </select>
          </label>
          <button class="icon-btn" id="openSearchBtn" type="button" aria-label="بحث">${ICONS.search}</button>
          <a class="icon-btn" href="${rel('pages/cart.html')}" aria-label="السلة">${ICONS.cart}<span class="cart-badge hidden" data-cart-count>0</span></a>
        </div>
      </div>
      ${buildSearchDrawer()}
    </header>`;
}

function buildBottomNav() {
  const items = [
    { key: 'home', href: rel('index.html'), label: 'الرئيسية', icon: ICONS.home },
    { key: 'category', href: '#categoryRailSection', label: 'التصنيفات', icon: ICONS.categories },
    { key: 'cart', href: rel('pages/cart.html'), label: 'السلة', icon: ICONS.cart, badge: true },
    { key: 'login', href: rel('pages/login.html'), label: 'الدخول', icon: ICONS.login },
    { key: 'insta', href: settings().instagramUrl || APP_CONFIG.INSTAGRAM_URL, label: 'انستا', icon: ICONS.insta, external: true }
  ];
  return `<nav class="bottom-nav"><div class="bottom-nav-inner">${items.map(item => `
    <a class="bottom-link ${PAGE === item.key ? 'active' : ''}" href="${item.href}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>
      ${item.icon}
      <span>${item.label}</span>
      ${item.badge ? '<span class="nav-badge hidden" data-cart-count>0</span>' : ''}
    </a>`).join('')}</div></nav>`;
}

function buildFooter() {
  return `<footer class="footer"><div class="container footer-inner">${escapeHtml(settings().footerText || settings().storeName)}</div></footer>`;
}

function renderChrome() {
  const topbarHost = $('#topbarHost');
  const bottomHost = $('#bottomNavHost');
  const footerHost = $('#footerHost');
  if (topbarHost) topbarHost.innerHTML = buildTopbar();
  if (bottomHost) bottomHost.innerHTML = buildBottomNav();
  if (footerHost) footerHost.innerHTML = buildFooter();
  bindChromeEvents();
  updateCartBadges();
}

function bindChromeEvents() {
  const currencySelect = $('#currencySelect');
  const drawer = $('#searchDrawer');
  $('#openSearchBtn')?.addEventListener('click', () => drawer?.classList.remove('hidden'));
  $('#closeSearchBtn')?.addEventListener('click', () => drawer?.classList.add('hidden'));
  currencySelect?.addEventListener('change', (e) => setCurrency(e.target.value));
  $('#searchInput')?.addEventListener('input', handleSearch);
  document.querySelectorAll('a[href="#categoryRailSection"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = document.getElementById('categoryRailSection') || document.getElementById('categoryRail');
      sec?.scrollIntoView({behavior:'smooth', block:'start'});
      const firstToggle = sec?.querySelector('.expand-toggle');
      if (firstToggle && firstToggle.getAttribute('aria-expanded') !== 'true') firstToggle.click();
    });
  });
}

function handleSearch(e) {
  const term = String(e.target.value || '').trim().toLowerCase();
  const results = !term ? [] : activeItems(state.products).filter(item => [item.name, item.description, item.badge].join(' ').toLowerCase().includes(term)).slice(0, 8);
  const count = $('#searchCount');
  const host = $('#searchResults');
  if (!count || !host) return;
  count.textContent = term ? `النتائج: ${results.length}` : '';
  host.innerHTML = !term ? '' : results.length ? `<div class="search-results">${results.map(renderSearchCard).join('')}</div>` : emptyState('لا توجد نتائج');
  bindProductButtons(host);
  bindAccordionCategoryTriggers(host);
}

function renderSearchCard(item) {
  return `<a class="search-card" href="${rel('pages/product.html')}?id=${encodeURIComponent(item.id)}">
    <img src="${escapeHtml(imageSrc(item.image))}" alt="${escapeHtml(item.name)}" class="search-thumb" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">
    <div><strong>${escapeHtml(item.name)}</strong><div class="muted">${escapeHtml(formatCurrency(item.price))}</div></div>
  </a>`;
}

function renderHero() {
  const host = $('#heroSection');
  if (!host) return;
  const slides = activeItems(state.sliders).slice(0, 5);
  if (!slides.length) {
    host.innerHTML = `<div class="hero-card">${emptyState('لا توجد عناصر')}</div>`;
    return;
  }
  host.innerHTML = `
    <div class="hero-card">
      <div class="slider-shell">${slides.map(item => `
        <a class="slide-item" href="${resolveTarget(item)}">
          <img class="slide-media" src="${escapeHtml(imageSrc(item.image))}" alt="${escapeHtml(item.title)}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">
          <div class="slide-overlay"></div>
          <div class="slide-content">
            <h1>${escapeHtml(item.title)}</h1>
            ${item.ctaLabel ? `<span class="slide-chip">${escapeHtml(item.ctaLabel)}</span>` : ''}
          </div>
        </a>`).join('')}</div>
    </div>`;
}

function renderBannerRail() {
  const host = $('#promoBanners');
  if (!host) return;
  const items = activeItems(state.banners);
  host.innerHTML = items.length ? `<div class="rail banner-rail">${items.map(item => `
    <a class="banner-card" href="${resolveTarget(item)}">
      <img class="banner-media" src="${escapeHtml(imageSrc(item.image))}" alt="${escapeHtml(item.title)}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">
      <div class="banner-overlay"></div>
      <div class="banner-title">${escapeHtml(item.title)}</div>
    </a>`).join('')}</div>` : emptyState('لا توجد عروض');
}

function topCategories() { return activeItems(state.categories).filter(item => !item.parentId); }
function childCategories(parentId) { return activeItems(state.categories).filter(item => item.parentId === parentId); }


function renderCategoryRail() {
  const host = $('#categoryRail');
  if (!host) return;
  const items = topCategories();
  host.innerHTML = items.length ? `<div class="rail category-rail" data-accordion-root>${items.map(item => {
    const childCount = childCategories(item.id).length;
    return `
      <div class="category-card-wrap">
        <button class="category-card expand-toggle" type="button" aria-expanded="false" data-parent-id="${item.id}" data-category-toggle="${item.id}">
          <span class="category-card-head">
            <img class="category-thumb" src="${escapeHtml(imageSrc(item.image))}" alt="${escapeHtml(item.name)}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">
            <strong>${escapeHtml(item.name)}</strong>
          </span>
          <span class="category-meta">
            <small>${childCount ? childCount + ' تفرعات' : 'بدون تفرعات'}</small>
            <span class="chev">${ICONS.chevron}</span>
          </span>
        </button>
        <div class="subcat-sheet hidden" id="subsheet-${item.id}">
          ${childCount ? childCategories(item.id).map(sub => `
            <button class="subcat-link" type="button" data-subcategory-select="${sub.id}">
              ${sub.image ? `<img class="subcat-thumb" src="${escapeHtml(imageSrc(sub.image))}" alt="${escapeHtml(sub.name)}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">` : ''}
              <span>${escapeHtml(sub.name)}</span>
            </button>`).join('') : '<span class="subcat-empty">لا توجد تفرعات</span>'}
        </div>
      </div>`;
  }).join('')}</div>` : emptyState('لا توجد تصنيفات');
  bindInlineCategorySelection(host);
}


function bindAccordion(scope=document) {
  $$('.expand-toggle,.tree-parent', scope).forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    const pid = btn.dataset.parentId;
    const panel = document.getElementById(`subsheet-${pid}`) || document.getElementById(`tree-${pid}`);
    panel?.classList.add('hidden');
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const root = btn.closest('[data-accordion-root]')?.parentElement || scope;
      $$('.subcat-sheet,.tree-children', root).forEach(el => el.classList.add('hidden'));
      $$('.expand-toggle,.tree-parent', root).forEach(el => el.setAttribute('aria-expanded', 'false'));
      if (!expanded) {
        panel?.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      }
    };
  });
}

function renderCardsRail() {
  const host = $('#cardsSection');
  if (!host) return;
  const items = activeItems(state.cards).filter(item => item.cardKind !== 'section');
  host.innerHTML = items.length ? `<div class="rail cards-rail">${items.map(item => `
    <a class="mini-card" href="${resolveTarget(item)}">
      ${item.image ? `<img class="mini-card-media" src="${escapeHtml(imageSrc(item.image))}" alt="${escapeHtml(item.title)}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">` : '<div class="mini-card-media mini-card-fill"></div>'}
      <div class="mini-card-body">
        <span class="mini-card-icon">${escapeHtml(item.icon || '')}</span>
        <strong>${escapeHtml(item.title)}</strong>
      </div>
    </a>`).join('')}</div>` : emptyState('لا توجد أقسام');
}

function renderProductCard(item) {
  return `<article class="product-card">
    <a class="product-media-link" href="${rel('pages/product.html')}?id=${encodeURIComponent(item.id)}">
      <img class="product-media" src="${escapeHtml(imageSrc(item.image))}" alt="${escapeHtml(item.name)}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">
      ${item.badge ? `<span class="badge">${escapeHtml(item.badge)}</span>` : ''}
    </a>
    <div class="product-body">
      <h3 class="product-title">${escapeHtml(item.name)}</h3>
      <div class="price-row">
        <strong class="price-current">${escapeHtml(formatCurrency(item.price))}</strong>
        ${item.oldPrice ? `<span class="price-old">${escapeHtml(formatCurrency(item.oldPrice))}</span>` : ''}
      </div>
      <div class="product-actions">
        <button class="btn btn-primary" data-add-to-cart="${item.id}" type="button">أضف</button>
        <button class="btn btn-secondary" data-buy-now="${item.id}" type="button">شراء</button>
      </div>
    </div>
  </article>`;
}

function renderProductSections() {
  const host = $('#productSections');
  if (!host) return;
  const sections = activeItems(state.cards).filter(item => item.cardKind === 'section');
  if (!sections.length) {
    host.innerHTML = `<section class="section"><div class="section-head"><h2 class="section-title">المنتجات</h2></div><div class="rail product-rail">${activeItems(state.products).map(renderProductCard).join('')}</div></section>`;
    bindProductButtons(host);
  bindAccordionCategoryTriggers(host);
    return;
  }
  host.innerHTML = sections.map(section => {
    const products = activeItems(state.products).filter(item => item.categoryId === section.categoryId).slice(0, 8);
    return `<section class="section" id="${escapeHtml(section.sectionId || section.id)}">
      <div class="section-head">
        <h2 class="section-title">${escapeHtml(section.title)}</h2>
        <a class="link-inline" href="${rel('pages/category.html')}?category=${encodeURIComponent(section.categoryId)}">الكل</a>
      </div>
      ${products.length ? `<div class="rail product-rail">${products.map(renderProductCard).join('')}</div>` : emptyState('لا توجد منتجات')}
    </section>`;
  }).join('');
  bindProductButtons(host);
  bindAccordionCategoryTriggers(host);
}

function renderReviews() {
  const host = $('#reviewsSection');
  if (!host) return;
  const items = activeItems(state.reviews);
  host.innerHTML = `<div class="section-head"><h2 class="section-title">التقييمات</h2></div>${items.length ? `<div class="rail review-rail">${items.map(item => `<article class="review-card"><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.text)}</p></article>`).join('')}</div>` : emptyState('لا توجد تقييمات')}`;
}

function renderHomePage() {
  renderHero();
  renderBannerRail();
  renderCategoryRail();
  renderCardsRail();
  renderProductSections();
  renderReviews();
}

function renderCategoryPage() {
  const tree = $('#categoryTree');
  const list = $('#categoryList');
  const title = $('#categoryCurrentTitle');
  if (!tree || !list || !title) return;
  const top = topCategories();
  tree.innerHTML = top.map(item => `
    <div class="tree-item" data-accordion-root>
      <button class="tree-parent" data-parent-id="${item.id}" type="button" aria-expanded="false">
        <span class="tree-parent-main">
          ${item.image ? `<img class="tree-thumb" src="${escapeHtml(imageSrc(item.image))}" alt="${escapeHtml(item.name)}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">` : ''}
          <span>${escapeHtml(item.name)}</span>
        </span>
        <span>${ICONS.chevron}</span>
      </button>
      <div class="tree-children hidden" id="tree-${item.id}">
        ${childCategories(item.id).map(sub => `<a href="javascript:void(0)" data-subcategory-select="${sub.id}">${sub.image ? `<img class="tree-thumb small" src="${escapeHtml(imageSrc(sub.image))}" alt="${escapeHtml(sub.name)}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">` : ''}<span>${escapeHtml(sub.name)}</span></a>`).join('') || '<span class="subcat-empty">لا توجد تفرعات</span>'}
      </div>
    </div>`).join('');
  bindInlineCategorySelection(tree);
  const cat = getParam('category');
  const sub = getParam('subcategory');
  const currentSub = state.categories.find(item => item.id === sub);
  const currentCat = state.categories.find(item => item.id === (currentSub?.parentId || cat || currentSub?.id));
  title.textContent = currentSub?.name || currentCat?.name || 'كل المنتجات';
  let items = activeItems(state.products);
  if (sub) items = items.filter(item => item.subcategoryId === sub);
  else if (cat) items = items.filter(item => item.categoryId === cat);
  list.innerHTML = items.length ? `<div class="product-grid">${items.map(renderProductCard).join('')}</div>` : emptyState('لا توجد عناصر');
  bindProductButtons(list);
}

function renderProductPage() {
  const host = $('#productPageHost');
  if (!host) return;
  const id = getParam('id');
  const item = state.products.find(product => product.id === id);
  if (!item) {
    host.innerHTML = emptyState('المنتج غير موجود');
    return;
  }
  const related = activeItems(state.products).filter(product => product.id !== item.id && product.categoryId === item.categoryId).slice(0, 6);
  host.innerHTML = `
    <section class="section product-page">
      <div class="product-page-media"><img src="${escapeHtml(imageSrc(item.image))}" alt="${escapeHtml(item.name)}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'"></div>
      <div class="product-page-body">
        <h1>${escapeHtml(item.name)}</h1>
        <div class="price-row big">
          <strong class="price-current">${escapeHtml(formatCurrency(item.price))}</strong>
          ${item.oldPrice ? `<span class="price-old">${escapeHtml(formatCurrency(item.oldPrice))}</span>` : ''}
        </div>
        ${item.deliveryText ? `<div class="muted">${escapeHtml(item.deliveryText)}</div>` : ''}
        ${item.description ? `<p class="product-copy">${escapeHtml(item.description)}</p>` : ''}
        <div class="product-actions">
          <button class="btn btn-primary" data-add-to-cart="${item.id}" type="button">أضف للسلة</button>
          <button class="btn btn-secondary" data-buy-now="${item.id}" type="button">شراء الآن</button>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2 class="section-title">مشابهة</h2></div>
      ${related.length ? `<div class="rail product-rail">${related.map(renderProductCard).join('')}</div>` : emptyState('لا توجد منتجات مشابهة')}
    </section>`;
  bindProductButtons(host);
  bindAccordionCategoryTriggers(host);
}

function renderCartPage() {
  const itemsHost = $('#cartItems');
  const summaryHost = $('#cartSummary');
  if (!itemsHost || !summaryHost) return;
  const cart = readCart();
  if (!cart.length) {
    itemsHost.innerHTML = emptyState('السلة فارغة');
    summaryHost.innerHTML = '';
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  itemsHost.innerHTML = `<div class="stack">${cart.map(item => `
    <article class="cart-card">
      <img class="cart-thumb" src="${escapeHtml(imageSrc(item.image))}" alt="${escapeHtml(item.name)}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">
      <div class="cart-copy">
        <strong>${escapeHtml(item.name)}</strong>
        <div class="muted">${escapeHtml(formatCurrency(item.price))}</div>
        <div class="qty-row">
          <button class="qty-btn" data-qty="minus" data-id="${item.id}" type="button">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-qty="plus" data-id="${item.id}" type="button">+</button>
          <button class="link-inline danger" data-remove="${item.id}" type="button">حذف</button>
        </div>
      </div>
    </article>`).join('')}</div>`;
  summaryHost.innerHTML = `<aside class="summary-card"><div class="summary-row"><span>الإجمالي</span><strong>${escapeHtml(formatCurrency(total))}</strong></div><a class="btn btn-primary full" href="${rel('pages/checkout.html')}">إتمام الطلب</a></aside>`;
  $$('[data-qty]').forEach(btn => btn.addEventListener('click', () => changeQty(btn.dataset.id, btn.dataset.qty === 'plus' ? 1 : -1)));
  $$('[data-remove]').forEach(btn => btn.addEventListener('click', () => removeFromCart(btn.dataset.remove)));
}

function changeQty(id, delta) {
  const cart = readCart();
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  writeCart(cart);
  renderCartPage();
}
function removeFromCart(id) {
  writeCart(readCart().filter(item => item.id !== id));
  renderCartPage();
}

function renderCheckoutPage() {
  const host = $('#checkoutHost');
  if (!host) return;
  const cart = readCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const channelHref = settings().whatsappNumber ? `https://wa.me/${settings().whatsappNumber.replace(/\D/g, '')}` : settings().instagramUrl;
  const channelLabel = settings().whatsappNumber ? 'واتساب' : 'إنستغرام';
  host.innerHTML = `<div class="checkout-card">
    <h1 class="section-title">إتمام الطلب</h1>
    ${cart.length ? `<div class="stack compact">${cart.map(item => `<div class="summary-row"><span>${escapeHtml(item.name)} × ${item.quantity}</span><strong>${escapeHtml(formatCurrency(item.price * item.quantity))}</strong></div>`).join('')}</div>` : emptyState('السلة فارغة')}
    <div class="summary-row total"><span>الإجمالي</span><strong>${escapeHtml(formatCurrency(total))}</strong></div>
    <a class="btn btn-primary full" href="${channelHref}" target="_blank" rel="noopener">إرسال عبر ${channelLabel}</a>
  </div>`;
}

function renderLoginPage() {
  const host = $('#loginPageHost');
  if (!host) return;
  host.innerHTML = `<div class="auth-card">
    <h1 class="section-title">تسجيل الدخول</h1>
    <form id="loginForm" class="form-grid">
      <input class="field" type="email" name="email" placeholder="البريد الإلكتروني" required>
      <input class="field" type="password" name="password" placeholder="كلمة المرور" required>
      <button class="btn btn-primary full" type="submit">دخول</button>
    </form>
    <div id="loginState" class="muted"></div>
  </div>`;
  $('#loginForm')?.addEventListener('submit', handleLogin);
}

async function handleLogin(event) {
  event.preventDefault();
  if (!fb.ready || !fb.api?.signInWithEmailAndPassword) return showToast('Firebase غير متاح الآن', 'error');
  const form = new FormData(event.currentTarget);
  try {
    await fb.api.signInWithEmailAndPassword(fb.auth, form.get('email'), form.get('password'));
    $('#loginState').textContent = 'تم تسجيل الدخول';
    setTimeout(() => goTo(rel('pages/admin.html')), 500);
  } catch (error) {
    $('#loginState').textContent = 'فشل تسجيل الدخول';
  }
}

function renderAdminGate() {
  const host = $('#adminGate');
  if (!host) return;
  host.innerHTML = !state.adminUnlocked ? `<div class="auth-card"><h1 class="section-title">الأدمن</h1><form id="gateForm" class="form-grid"><input class="field" type="password" name="pass" placeholder="كود الأدمن" required><button class="btn btn-primary full" type="submit">فتح</button></form></div>` : '';
  $('#gateForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const pass = new FormData(e.currentTarget).get('pass');
    if (pass === APP_CONFIG.ADMIN_PASS) {
      state.adminUnlocked = true;
      sessionStorage.setItem('kiido_admin_gate', '1');
      renderAdminPage();
    } else showToast('الكود غير صحيح', 'error');
  });
}

function adminSchema() {
  return {
    settings: [ ['storeName','text'], ['tagline','text'], ['instagramUrl','url'], ['whatsappNumber','text'], ['defaultCurrency','text'], ['heroTitle','text'], ['heroText','text'], ['footerText','text'], ['bgColor','text'], ['bg2Color','text'], ['surfaceColor','text'], ['surface2Color','text'], ['primaryColor','text'], ['primaryDarkColor','text'], ['primaryLightColor','text'], ['maroonColor','text'], ['textColor','text'], ['text2Color','text'], ['mutedColor','text'], ['active','checkbox'] ],
    sliders: [ ['title','text'], ['image','url'], ['ctaLabel','text'], ['targetType','text'], ['targetId','text'], ['categoryId','text'], ['subcategoryId','text'], ['productId','text'], ['customUrl','url'], ['order','number'], ['active','checkbox'] ],
    banners: [ ['title','text'], ['image','url'], ['targetType','text'], ['targetId','text'], ['categoryId','text'], ['subcategoryId','text'], ['productId','text'], ['customUrl','url'], ['order','number'], ['active','checkbox'] ],
    cards: [ ['title','text'], ['image','url'], ['icon','text'], ['cardKind','text'], ['sectionId','text'], ['categoryId','text'], ['subcategoryId','text'], ['targetType','text'], ['targetId','text'], ['customUrl','url'], ['order','number'], ['active','checkbox'] ],
    categories: [ ['name','text'], ['icon','text'], ['image','url'], ['subtitle','text'], ['description','text'], ['parentId','text'], ['order','number'], ['active','checkbox'] ],
    products: [ ['name','text'], ['price','number'], ['oldPrice','number'], ['badge','text'], ['image','url'], ['categoryId','text'], ['subcategoryId','text'], ['deliveryText','text'], ['description','text'], ['details','text'], ['order','number'], ['active','checkbox'] ],
    reviews: [ ['name','text'], ['text','text'], ['rating','number'], ['order','number'], ['active','checkbox'] ]
  };
}

async function renderAdminPage() {
  renderAdminGate();
  if (!state.adminUnlocked) return;
  const host = $('#adminHost');
  if (!host) return;
  const schema = adminSchema();
  host.innerHTML = `
    <div class="admin-card stack">
      <div class="admin-toolbar">
        <button class="btn btn-primary" id="seedBtn" type="button">Initialize Store</button>
        <button class="btn btn-secondary" id="logoutBtn" type="button">قفل الأدمن</button>
      </div>
      ${fb.ready ? '' : '<div class="muted">وضع المعاينة المحلي مفعل. يلزم Firebase للحفظ الدائم.</div>'}
    </div>
    <div class="admin-tabs">${Object.keys(schema).map(key => `<button class="tab-btn ${key==='settings'?'active':''}" data-tab="${key}" type="button">${key}</button>`).join('')}</div>
    ${Object.keys(schema).map(key => `<section class="admin-panel ${key==='settings'?'':'hidden'}" data-panel="${key}"></section>`).join('')}`;
  $$('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.tab-btn').forEach(x => x.classList.toggle('active', x === btn));
    $$('.admin-panel').forEach(panel => panel.classList.toggle('hidden', panel.dataset.panel !== btn.dataset.tab));
  }));
  $('#seedBtn')?.addEventListener('click', seedStore);
  $('#logoutBtn')?.addEventListener('click', () => { sessionStorage.removeItem('kiido_admin_gate'); state.adminUnlocked = false; renderAdminPage(); });
  Object.keys(schema).forEach(key => renderAdminPanel(key, schema[key]));
}

function getCollectionItems(key) {
  if (key === 'settings') return [settings()];
  return state[key] || [];
}

function renderAdminPanel(key, fields) {
  const host = $(`[data-panel="${key}"]`);
  const items = getCollectionItems(key);
  host.innerHTML = `<div class="admin-card stack"><div class="section-head"><h2 class="section-title">${key}</h2>${key === 'settings' ? '' : `<button class="btn btn-secondary" data-new="${key}" type="button">جديد</button>`}</div><div class="admin-list">${items.map(item => adminItemCard(key, item)).join('')}</div></div><div class="admin-card stack"><form class="form-grid" data-form="${key}">${fields.map(([name, type]) => formField(name, type)).join('')}<input type="hidden" name="id"><div class="preview-box hidden" data-preview-wrap><img data-preview-image alt="preview"></div><input class="field" type="file" accept="image/*" data-file-preview><button class="btn btn-primary full" type="submit">حفظ</button></form></div>`;
  host.querySelector(`[data-form="${key}"]`)?.addEventListener('submit', e => submitAdminForm(e, key, fields));
  $$('[data-edit]', host).forEach(btn => btn.addEventListener('click', () => fillAdminForm(key, btn.dataset.edit)));
  $$('[data-delete]', host).forEach(btn => btn.addEventListener('click', () => deleteRecord(key, btn.dataset.delete)));
  $('[data-new]', host)?.addEventListener('click', () => resetAdminForm(key));
  bindPreview(host);
  if (typeof window.Sortable !== 'undefined' && key !== 'settings') {
    window.Sortable.create($('.admin-list', host), {
      animation: 150,
      onEnd: async () => {
        if (!fb.ready) return showToast('الحفظ يحتاج Firebase', 'error');
        const ids = $$('.admin-item', host).map(el => el.dataset.id);
        await reorderCollection(key, ids);
      }
    });
  }
}

function adminItemCard(key, item) {
  const title = item.name || item.title || item.storeName || 'عنصر';
  const img = item.image ? `<img class="admin-thumb" src="${escapeHtml(imageSrc(item.image))}" onerror="this.onerror=null;this.src='${APP_CONFIG.FALLBACK_IMAGE}'">` : '';
  return `<article class="admin-item" data-id="${escapeHtml(item.id || 'store')}">${img}<div class="admin-copy"><strong>${escapeHtml(title)}</strong><div class="admin-actions"><button class="btn btn-secondary" data-edit="${escapeHtml(item.id || 'store')}" type="button">تعديل</button>${key==='settings' ? '' : `<button class="btn btn-secondary" data-delete="${escapeHtml(item.id)}" type="button">حذف</button>`}</div></div></article>`;
}

function formField(name, type) {
  if (type === 'checkbox') return `<label class="toggle-row"><span>${name}</span><input type="checkbox" name="${name}" checked></label>`;
  return `<input class="field" type="${type === 'number' ? 'number' : 'text'}" name="${name}" placeholder="${name}">`;
}

function fillAdminForm(key, id) {
  const form = $(`[data-form="${key}"]`);
  const item = key === 'settings' ? settings() : state[key].find(entry => entry.id === id);
  if (!form || !item) return;
  form.reset();
  Object.entries(item).forEach(([name, value]) => {
    const field = form.elements[name];
    if (!field) return;
    if (field.type === 'checkbox') field.checked = Boolean(value);
    else field.value = value ?? '';
  });
  if (form.elements.id) form.elements.id.value = item.id || 'store';
  const imgField = form.elements.image;
  if (imgField?.value) showPreview(form, imgField.value);
}

function resetAdminForm(key) {
  const form = $(`[data-form="${key}"]`);
  form?.reset();
  if (form?.elements.id) form.elements.id.value = '';
  form?.querySelector('[data-preview-wrap]')?.classList.add('hidden');
}

function bindPreview(scope) {
  const urlField = scope.querySelector('input[name="image"]');
  const fileField = scope.querySelector('[data-file-preview]');
  const form = scope.querySelector('form');
  urlField?.addEventListener('input', () => showPreview(form, urlField.value));
  fileField?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => showPreview(form, reader.result);
    reader.readAsDataURL(file);
  });
}

function showPreview(form, src) {
  if (!form) return;
  const wrap = form.querySelector('[data-preview-wrap]');
  const img = form.querySelector('[data-preview-image]');
  if (!wrap || !img || !src) return;
  img.src = src;
  wrap.classList.remove('hidden');
}

async function submitAdminForm(event, key) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!fb.ready) return showToast('الحفظ يحتاج Firebase', 'error');
  const data = Object.fromEntries(new FormData(form).entries());
  const schema = adminSchema()[key];
  const payload = {};
  schema.forEach(([name, type]) => {
    if (type === 'checkbox') payload[name] = form.elements[name].checked;
    else if (type === 'number') payload[name] = Number(form.elements[name].value || 0);
    else payload[name] = String(form.elements[name].value || '').trim();
  });
  const id = data.id || (key === 'settings' ? APP_CONFIG.SETTINGS_DOC_ID : `${key}_${Date.now()}`);
  await saveRecord(key, id, payload);
  showToast('تم الحفظ', 'success');
  await loadRemoteContent();
  rerenderVisiblePage();
  renderAdminPage();
}

async function deleteRecord(key, id) {
  if (!fb.ready) return showToast('الحذف يحتاج Firebase', 'error');
  await fb.api.deleteDoc(fb.api.doc(fb.db, COLLECTIONS[key], id));
  await loadRemoteContent();
  renderAdminPage();
}

async function saveRecord(key, id, payload) {
  const ref = fb.api.doc(fb.db, COLLECTIONS[key], id);
  await fb.api.setDoc(ref, payload, { merge: true });
}

async function reorderCollection(key, ids) {
  const batch = fb.api.writeBatch(fb.db);
  ids.forEach((id, index) => batch.update(fb.api.doc(fb.db, COLLECTIONS[key], id), { order: index + 1 }));
  await batch.commit();
  await loadRemoteContent();
  rerenderVisiblePage();
  renderAdminPage();
}

async function seedStore() {
  if (!fb.ready) return showToast('يتطلب Firebase', 'error');
  const batch = fb.api.writeBatch(fb.db);
  batch.set(fb.api.doc(fb.db, COLLECTIONS.settings, APP_CONFIG.SETTINGS_DOC_ID), LOCAL_SEED.settings.data, { merge: true });
  for (const key of ['categories', 'products', 'sliders', 'banners', 'cards', 'reviews']) {
    for (const item of LOCAL_SEED[key]) {
      const { id, ...payload } = item;
      batch.set(fb.api.doc(fb.db, COLLECTIONS[key], id), payload, { merge: true });
    }
  }
  await batch.commit();
  showToast('تم إنشاء البيانات', 'success');
  await loadRemoteContent();
  rerenderVisiblePage();
  renderAdminPage();
}

function bindAccordionCategoryTriggers(scope=document) {
  $$('.expand-toggle,[data-category-toggle],.tree-parent', scope).forEach((btn) => {
    if (!btn) return;
    const parentId = btn.dataset.parentId || btn.dataset.categoryToggle || btn.getAttribute('data-parent-id');
    if (!parentId) return;
    btn.setAttribute('aria-expanded', 'false');
    const panel = document.getElementById(`subsheet-${parentId}`) || document.getElementById(`tree-${parentId}`);
    panel?.classList.add('hidden');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetPanel = document.getElementById(`subsheet-${parentId}`) || document.getElementById(`tree-${parentId}`);
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const wrap = btn.closest('[data-accordion-root]') || scope;
      $$('.subcat-sheet,.tree-children', wrap).forEach((el) => el.classList.add('hidden'));
      $$('.expand-toggle,.tree-parent,[data-category-toggle]', wrap).forEach((el) => el.setAttribute('aria-expanded', 'false'));
      if (!expanded) {
        targetPanel?.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        targetPanel?.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function bindInlineCategorySelection(scope=document) {
  $$('.expand-toggle,.tree-parent', scope).forEach(btn => {
    const pid = btn.dataset.parentId || btn.dataset.categoryToggle;
    if (!pid) return;
    btn.setAttribute('aria-expanded', 'false');
    const panel = document.getElementById(`subsheet-${pid}`) || document.getElementById(`tree-${pid}`);
    panel?.classList.add('hidden');
    btn.onclick = (e) => {
      e.preventDefault();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const wrap = btn.closest('[data-accordion-root]') || scope;
      $$('.subcat-sheet,.tree-children', wrap).forEach(el => el.classList.add('hidden'));
      $$('.expand-toggle,.tree-parent', wrap).forEach(el => el.setAttribute('aria-expanded', 'false'));
      if (!expanded) {
        panel?.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      }
    };
  });

  $$('[data-subcategory-select]', scope).forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      const subId = link.dataset.subcategorySelect;
      if (!subId) return;
      if (typeof state !== "undefined") {
        state.selectedSubcategoryId = subId;
      }
      if (typeof renderHomePage === "function" && detectPage() === "home") renderHomePage();
      if (typeof renderCategoryPage === "function" && detectPage() === "category") renderCategoryPage();
      const target = document.getElementById("products-section") || document.getElementById("productsSection");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  });
}

function getVisibleProductsByInlineSelection(products = []) {
  if (typeof state === "undefined") return products;
  const subId = state.selectedSubcategoryId || null;
  if (subId) return products.filter(p => (p.subcategoryId || "") === subId);
  return products;
}

function bindProductButtons(scope = document) {
  $$('[data-add-to-cart]', scope).forEach(btn => btn.addEventListener('click', () => addToCartById(btn.dataset.addToCart)));
  $$('[data-buy-now]', scope).forEach(btn => btn.addEventListener('click', () => buyNowById(btn.dataset.buyNow)));
}

async function loadFirebaseSdk() {
  try {
    const appMod = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js');
    const dbMod = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
    const authMod = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js');
    fb.api = { ...dbMod, ...authMod, ...appMod };
    return true;
  } catch (error) {
    console.warn('Firebase SDK unavailable; local preview mode active.', error);
    return false;
  }
}

async function initFirebase() {
  const ok = await loadFirebaseSdk();
  if (!ok) return false;
  const { initializeApp, getApps, getApp, getFirestore, getAuth } = fb.api;
  fb.app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  fb.db = getFirestore(fb.app);
  fb.auth = getAuth(fb.app);
  fb.ready = true;
  fb.api.onAuthStateChanged?.(fb.auth, user => { fb.currentUser = user; });
  return true;
}

function applySeed(seed) {
  state.settings = seed.settings?.data || seed.settings || null;
  state.categories = seed.categories || [];
  state.products = seed.products || [];
  state.sliders = seed.sliders || [];
  state.banners = seed.banners || [];
  state.cards = seed.cards || [];
  state.reviews = seed.reviews || [];
}

async function loadRemoteContent() {
  if (!fb.ready) return false;
  try {
    const settingsDoc = await fb.api.getDoc(fb.api.doc(fb.db, COLLECTIONS.settings, APP_CONFIG.SETTINGS_DOC_ID));
    if (settingsDoc.exists()) state.settings = settingsDoc.data();
    for (const key of ['categories', 'products', 'sliders', 'banners', 'cards', 'reviews']) {
      const snap = await fb.api.getDocs(fb.api.query(fb.api.collection(fb.db, COLLECTIONS[key]), fb.api.orderBy('order', 'asc')));
      state[key] = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    }
    return true;
  } catch (error) {
    console.warn('Remote content unavailable; keeping local data.', error);
    return false;
  }
}

function renderPageSkeletons() {
  if (PAGE === 'home') {
    $('#heroSection')?.insertAdjacentHTML('beforeend', '<div class="hero-card">'+skeletonCards(2)+'</div>');
    $('#promoBanners')?.insertAdjacentHTML('beforeend', skeletonCards(2));
    $('#categoryRail')?.insertAdjacentHTML('beforeend', skeletonCards(3));
    $('#cardsSection')?.insertAdjacentHTML('beforeend', skeletonCards(3));
    $('#productSections')?.insertAdjacentHTML('beforeend', skeletonCards(3));
  }
}

function rerenderVisiblePage() {
  applyTheme();
  renderChrome();
  if (PAGE === 'home') renderHomePage();
  if (PAGE === 'category') renderCategoryPage();
  if (PAGE === 'product') renderProductPage();
  if (PAGE === 'cart') renderCartPage();
  if (PAGE === 'checkout') renderCheckoutPage();
  if (PAGE === 'login') renderLoginPage();
  if (PAGE === 'admin') renderAdminPage();
}

async function init() {
  applySeed(LOCAL_SEED);
  applyTheme();
  renderChrome();
  renderPageSkeletons();
  rerenderVisiblePage();
  updateCartBadges();
  const firebaseOk = await initFirebase();
  if (firebaseOk) {
    await loadRemoteContent();
    applyTheme();
    rerenderVisiblePage();
  }
}

document.addEventListener('DOMContentLoaded', init);


document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-no-nav="true"]');
  if (a) {
    e.preventDefault();
  }
});
