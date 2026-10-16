'use strict';

/* =====================================================================
   Tín Hiệu Lặn – toàn bộ logic của trang index
   Các phần: cấu hình · tiện ích · dữ liệu & lọc · render · popup ·
             ngăn kéo bộ lọc · header · khởi tạo
   ===================================================================== */

/* ---------- Cấu hình ---------- */
const SAVED_KEY = 'tinhieulan:saved';
const SEARCH_DEBOUNCE_MS = 250;
const PAGE_SIZE = 10;

const TIME_OPTIONS = [
  { value: 'all', label: 'Tất cả thời gian', maxDays: Infinity },
  { value: '1', label: '24 giờ qua', maxDays: 1 },
  { value: '7', label: '7 ngày qua', maxDays: 7 },
  { value: '30', label: '30 ngày qua', maxDays: 30 },
];
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Liên quan nhất' }, // chỉ hiện khi đang tìm kiếm
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'az', label: 'Tiêu đề A → Z' },
];
const MODES = ['title', 'content']; // tìm theo tiêu đề / tìm theo nội dung (tóm tắt + nội dung bài)
const MODE_PLACEHOLDER = { title: 'Nhập từ khóa trong tiêu đề…', content: 'Nhập từ khóa trong nội dung bài viết…' };

const DEFAULT_STATE = {
  q: '', mode: 'title', categories: [], time: 'all', sort: 'newest', savedOnly: false, page: 1,
};

/* ---------- Tiện ích DOM ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const SVG_NS = 'http://www.w3.org/2000/svg';

/** Tạo phần tử: attrs.class / attrs.text / attrs.onclick… ; children có thể là chuỗi, Node hoặc mảng. */
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  node.append(...children.flat().filter((c) => c != null && c !== false));
  return node;
}

function icon(name, cls = 'icon') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', cls);
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

/* ---------- Tiện ích văn bản / ngày ---------- */
/** Bỏ dấu tiếng Việt + hạ chữ thường. Giữ nguyên độ dài chuỗi (văn bản nguồn ở dạng NFC). */
const fold = (s) =>
  Array.from(s, (ch) => ch.normalize('NFD').replace(/\p{M}/gu, ''))
    .join('')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

/** Chuẩn hóa để so khớp theo từ: bỏ dấu, chỉ giữ chữ + số, bọc khoảng trắng hai đầu (để tìm " từ" = đầu từ). */
const normalize = (s) => ` ${fold(s).replace(/[^a-z0-9]+/g, ' ').trim()} `;

/** Tách từ khóa thành các từ đã chuẩn hóa, ví dụ "Cá hề!" -> ["ca", "he"]. */
const tokensOf = (q) => normalize(q).trim().split(' ').filter(Boolean);

const pad2 = (n) => String(n).padStart(2, '0');
const shortDate = (d) => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
const longDate = (d) => `${d.getDate()} tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function timeAgo(days) {
  if (days <= 0) return 'hôm nay';
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

/** Bọc các đoạn khớp từ khóa trong <mark>. Trả về chuỗi hoặc DocumentFragment. */
function highlight(text, tokens) {
  if (!tokens.length) return text;
  const folded = fold(text);
  if (folded.length !== text.length) return text;

  const ranges = [];
  for (const t of tokens) {
    for (let i = folded.indexOf(t); i !== -1; i = folded.indexOf(t, i + t.length)) {
      // Chỉ tô sáng khi khớp ở đầu từ, giống cách lọc bài viết.
      if (i === 0 || !/[a-z0-9]/.test(folded[i - 1])) ranges.push([i, i + t.length]);
    }
  }
  if (!ranges.length) return text;

  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [ranges[0]];
  for (const [start, end] of ranges.slice(1)) {
    const last = merged[merged.length - 1];
    if (start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }

  const frag = document.createDocumentFragment();
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) frag.append(text.slice(cursor, start));
    frag.append(el('mark', { text: text.slice(start, end) }));
    cursor = end;
  }
  if (cursor < text.length) frag.append(text.slice(cursor));
  return frag;
}

/* ---------- Trạng thái ---------- */
let posts = [];
const postById = new Map();
let categoryTree = []; // [{ name, children }] lấy từ CATEGORIES trong data.js
let categoryNames = []; // phẳng hóa categoryTree (cả cha lẫn con) – dùng để kiểm tra URL và đếm thống kê
let state = { ...DEFAULT_STATE, categories: [] };
let saved = new Set(loadSaved());
const categoryEls = new Map(); // tên danh mục (cha hoặc con) -> { input, count, li }
const subcatUI = new Map(); // tên danh mục cha có con -> { subList, toggle } – để tự mở khi có con đang được chọn

/** Danh mục cha trả về danh sách tên các con (giá trị thật nằm trong p.categories); danh mục không có con trả về chính nó. */
function leavesOf(name) {
  const node = categoryTree.find((c) => c.name === name);
  return node && node.children.length ? node.children : [name];
}

function loadSaved() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

function persistSaved() {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]));
  } catch { /* trình duyệt chặn lưu trữ: bỏ qua, trang vẫn dùng được */ }
}

/* ---------- Chuẩn bị dữ liệu (POSTS được khai báo trong data.js) ---------- */
function preparePosts() {
  if (typeof POSTS === 'undefined' || !Array.isArray(POSTS)) {
    throw new Error('Không tìm thấy mảng POSTS – kiểm tra data.js');
  }
  const raw = POSTS;

  const today = startOfToday();
  return raw.map((p) => {
    const item = {
      ...p,
      title: p.title.normalize('NFC'),
      author: p.author.normalize('NFC'),
      excerpt: p.excerpt.normalize('NFC'),
      tags: p.tags || [], // nhãn hiển thị trên thẻ
      categories: p.categories || [], // danh mục dùng để lọc ở sidebar
      content: p.content || [],
    };
    item.dateObj = new Date(`${item.date}T00:00:00`);
    item.days = Math.max(0, Math.round((today - item.dateObj) / 86400000));
    // Các chuỗi đã chuẩn hóa để tìm kiếm và chấm điểm liên quan.
    item._title = normalize(item.title);
    item._excerpt = normalize(item.excerpt);
    item._content = normalize(item.content.join(' '));
    item._body = item._excerpt + item._content; // vùng tìm của chế độ "nội dung"
    return item;
  });
}

function indexFacets() {
  // Khối "Danh mục" theo đúng cây khai báo trong CATEGORIES; nếu thiếu thì coi mỗi danh mục trên bài là một mục phẳng, không có con.
  if (typeof CATEGORIES !== 'undefined' && Array.isArray(CATEGORIES)) {
    categoryTree = CATEGORIES.map((c) => ({ name: c.name, children: Array.isArray(c.children) ? [...c.children] : [] }));
  } else {
    const names = [...new Set(posts.flatMap((p) => p.categories))].sort((a, b) => a.localeCompare(b, 'vi'));
    categoryTree = names.map((name) => ({ name, children: [] }));
  }
  categoryNames = categoryTree.flatMap((c) => [c.name, ...c.children]);
}

/* ---------- Lọc & sắp xếp ---------- */
/** `skipCategories` bỏ qua bộ lọc danh mục – dùng để đếm số bài cho từng danh mục ở sidebar. */
function matches(p, s, skipCategories = false) {
  if (!skipCategories && s.categories.length) {
    const leaves = s.categories.flatMap(leavesOf); // danh mục cha được gộp thành toàn bộ con của nó
    if (!leaves.some((c) => p.categories.includes(c))) return false;
  }
  if (s.savedOnly && !saved.has(p.id)) return false;

  const time = TIME_OPTIONS.find((o) => o.value === s.time);
  if (time && p.days > time.maxDays) return false;

  // Mọi từ khóa phải khớp ở đầu một từ nào đó trong vùng đang tìm: tiêu đề, hoặc tóm tắt + nội dung bài.
  const hay = s.mode === 'title' ? p._title : p._body;
  return tokensOf(s.q).every((t) => hay.includes(` ${t}`));
}

const countOf = (hay, needle) => hay.split(needle).length - 1;

/**
 * Điểm liên quan. Chế độ tiêu đề: cụm từ liền nhau được cộng thêm. Chế độ nội dung: đếm số lần từ khóa
 * xuất hiện, tóm tắt tính nặng hơn phần thân bài; cụm từ liền nhau cũng được cộng thêm.
 */
function relevance(p, tokens, mode) {
  if (!tokens.length) return 0;
  const phrase = ` ${tokens.join(' ')}`;
  if (mode === 'title') return p._title.includes(phrase) ? 10 : 0;

  let score = (p._excerpt.includes(phrase) ? 10 : 0) + (p._content.includes(phrase) ? 5 : 0);
  for (const t of tokens) score += countOf(p._excerpt, ` ${t}`) * 3 + countOf(p._content, ` ${t}`);
  return score;
}

function getFiltered() {
  const list = posts.filter((p) => matches(p, state));
  const newest = (a, b) => b.dateObj - a.dateObj || a.id - b.id;

  if (state.sort === 'relevance') {
    const tokens = tokensOf(state.q);
    const score = new Map(list.map((p) => [p.id, relevance(p, tokens, state.mode)]));
    return list.sort((a, b) => score.get(b.id) - score.get(a.id) || newest(a, b));
  }
  const by = {
    newest,
    oldest: (a, b) => a.dateObj - b.dateObj || a.id - b.id,
    az: (a, b) => a.title.localeCompare(b.title, 'vi'),
  }[state.sort];
  return list.sort(by);
}

/** Đổi từ khóa. Bắt đầu tìm thì tự chuyển sang "Liên quan nhất"; xóa hết từ khóa thì quay về "Mới nhất". */
function setQuery(q) {
  const had = Boolean(state.q.trim());
  const has = Boolean(q.trim());
  state.q = q;
  if (has && !had && state.sort === 'newest') state.sort = 'relevance';
  else if (!has && had && state.sort === 'relevance') state.sort = 'newest';
}

const hasActiveFilters = () =>
  Boolean(state.q.trim()) || state.categories.length || state.time !== 'all' || state.savedOnly;

/* ---------- URL ---------- */
function readURL() {
  const p = new URLSearchParams(location.search);
  const list = (key, allowed) => (p.get(key) || '').split(',').filter((v) => allowed.includes(v));
  const one = (key, allowed, fallback) => (allowed.includes(p.get(key)) ? p.get(key) : fallback);

  const q = p.get('q') || '';
  const autoSort = q.trim() ? 'relevance' : DEFAULT_STATE.sort;
  let sort = one('sort', SORT_OPTIONS.map((o) => o.value), autoSort);
  if (sort === 'relevance' && !q.trim()) sort = DEFAULT_STATE.sort;

  state = {
    q,
    mode: one('mode', MODES, DEFAULT_STATE.mode), // giá trị cũ như "author"/"all" bị bỏ qua
    categories: list('category', categoryNames),
    time: one('time', TIME_OPTIONS.map((o) => o.value), DEFAULT_STATE.time),
    sort,
    savedOnly: p.get('saved') === '1',
    page: Math.max(1, parseInt(p.get('page'), 10) || 1), // được giới hạn lại khi vẽ danh sách
  };
}

function writeURL() {
  const p = new URLSearchParams();
  if (state.q.trim()) p.set('q', state.q.trim());
  if (state.mode !== DEFAULT_STATE.mode) p.set('mode', state.mode);
  if (state.categories.length) p.set('category', state.categories.join(','));
  if (state.time !== DEFAULT_STATE.time) p.set('time', state.time);
  if (state.sort !== (state.q.trim() ? 'relevance' : DEFAULT_STATE.sort)) p.set('sort', state.sort);
  if (state.savedOnly) p.set('saved', '1');
  if (state.page > 1) p.set('page', String(state.page));
  const qs = p.toString();
  try {
    history.replaceState(null, '', qs ? `?${qs}${location.hash}` : location.pathname + location.hash);
  } catch { /* mở bằng file:// có thể bị chặn */ }
}

/* ---------- Render: thumbnail & thẻ bài viết ---------- */
/** `eager`: tải ảnh ngay (dùng cho popup); ảnh trong danh sách tải lười để trang mở nhanh. */
function makeThumb(p, extraClass = '', eager = false) {
  const [c1, c2] = p.colors || ['#0873b9', '#1592d4'];
  const box = el('div', { class: `thumb ${extraClass}`.trim(), 'aria-hidden': 'true' });
  box.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  const src = p.path || p.thumbnail; // "path" là trường chính thức; "thumbnail" vẫn được hỗ trợ cho dữ liệu cũ
  if (src) box.append(el('img', { src, alt: '', loading: eager ? 'eager' : 'lazy' }));
  else box.append(el('span', { class: 'emoji', text: p.icon || '🤿' }));
  return box;
}

function makeSaveButton(p, large = false) {
  const on = saved.has(p.id);
  const label = on ? 'Bỏ lưu bài viết' : 'Lưu bài viết';
  return el(
    'button',
    {
      type: 'button',
      class: `${large ? 'btn-save-lg' : 'card-save'}${on ? ' is-saved' : ''}`,
      'data-save-id': p.id,
      'aria-pressed': String(on),
      'aria-label': large ? null : label,
    },
    icon('heart'),
    large ? el('span', { class: 'save-label', text: on ? 'Đã lưu' : 'Lưu bài viết' }) : null,
  );
}

/** Chỉ tô sáng ở vùng đang được tìm: `area` là 'title' (chế độ tiêu đề) hoặc 'content' (tóm tắt và thân bài). */
const mark = (text, area, kw) => (state.mode === area ? highlight(text, kw) : text);

function makeCard(p, kw) {
  return el(
    'article',
    { class: 'card' },
    makeThumb(p),
    el(
      'div',
      { class: 'card-body' },
      el(
        'div',
        { class: 'card-top' },
        el('h3', { class: 'card-title' }, el('button', { type: 'button', class: 'card-open', 'data-open-id': p.id }, mark(p.title, 'title', kw))),
        el('span', { class: 'card-read', text: `${p.readTime} phút đọc` }),
      ),
      el('p', { class: 'card-author' }, el('span', { class: 'dot' }, icon('user')), el('span', { text: p.author })),
      el('p', { class: 'card-excerpt' }, mark(p.excerpt, 'content', kw)),
      el(
        'div',
        { class: 'card-foot' },
        el(
          'ul',
          { class: 'tag-list' },
          p.categories.map((c) => el('li', { class: 'tag is-cat', text: c })),
          p.tags.slice(0, 3).map((t) => el('li', { class: 'tag', text: t })),
        ),
        el('div', { class: 'card-meta' }, el('span', { text: `Đăng ${timeAgo(p.days)}` }), makeSaveButton(p)),
      ),
    ),
  );
}

/* ---------- Render: kết quả ---------- */
const listEl = $('#post-list');
const stateBox = $('#state-box');

function renderResults() {
  const list = getFiltered();
  const kw = tokensOf(state.q);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  state.page = Math.min(Math.max(1, state.page), totalPages);
  const start = (state.page - 1) * PAGE_SIZE;
  const pageItems = list.slice(start, start + PAGE_SIZE);

  renderHeading(list.length);
  $('#apply-filters').textContent = `Xem ${list.length} bài viết`;

  listEl.setAttribute('aria-busy', 'false');
  listEl.replaceChildren(...pageItems.map((p) => makeCard(p, kw)));
  renderPagination(list.length, totalPages, start, pageItems.length);

  if (list.length) {
    stateBox.hidden = true;
    return;
  }
  const emptySaved = state.savedOnly && !saved.size;
  showState({
    emoji: emptySaved ? '🤍' : '🔎',
    title: emptySaved ? 'Bạn chưa lưu bài viết nào' : 'Không tìm thấy bài viết phù hợp',
    text: emptySaved ? 'Bấm biểu tượng trái tim ở mỗi bài viết để lưu lại đọc sau.' : 'Thử đổi từ khóa hoặc bỏ bớt bộ lọc để xem thêm kết quả.',
    action: hasActiveFilters() ? { label: 'Xóa bộ lọc', run: resetFilters } : null,
  });
}

function renderHeading(count) {
  const title = $('#result-title');
  const q = state.q.trim();
  title.replaceChildren(
    ...[
      'Có ',
      el('strong', { text: `${count} bài viết` }),
      state.savedOnly ? ' đã lưu' : '',
      q ? [' cho từ khóa “', el('span', { class: 'kw', text: q }), '”'] : '',
    ].flat(),
  );

  const latest = posts.reduce((max, p) => (p.dateObj > max ? p.dateObj : max), new Date(0));
  $('#result-update').textContent = posts.length ? `[Cập nhật ${shortDate(latest)}]` : '';
}

/** Các số trang cần hiện: trang đầu, cuối, trang hiện tại ±1; khoảng hở lớn hơn 1 trang thì thay bằng "…". */
function pageWindow(current, total) {
  const pages = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out = [];
  pages.forEach((n, i) => {
    const prev = pages[i - 1];
    if (i && n - prev === 2) out.push(prev + 1);
    else if (i && n - prev > 2) out.push('…');
    out.push(n);
  });
  return out;
}

function renderPagination(total, totalPages, start, shown) {
  const nav = $('#pagination');
  nav.hidden = totalPages <= 1;
  if (totalPages <= 1) {
    nav.replaceChildren();
    return;
  }

  const btn = (page, content, { current = false, disabled = false, label = null } = {}) =>
    el(
      'li',
      {},
      el('button', {
        type: 'button',
        class: 'page-btn',
        'data-page': page,
        'aria-current': current ? 'page' : null,
        'aria-label': label,
        disabled,
        text: content,
      }),
    );

  const cur = state.page;
  nav.replaceChildren(
    el(
      'ul',
      { class: 'page-list' },
      btn(cur - 1, '‹', { disabled: cur === 1, label: 'Trang trước' }),
      pageWindow(cur, totalPages).map((n) =>
        n === '…' ? el('li', { class: 'page-gap', 'aria-hidden': 'true', text: '…' }) : btn(n, String(n), { current: n === cur, label: `Trang ${n}` }),
      ),
      btn(cur + 1, '›', { disabled: cur === totalPages, label: 'Trang sau' }),
    ),
    el('p', { class: 'page-info', text: `Hiển thị ${start + 1}–${start + shown} trong ${total} bài viết` }),
  );
}

function goToPage(page) {
  state.page = page;
  refresh({ keepPage: true });
  scrollToResults();
  $('.card-open')?.focus({ preventScroll: true });
}

function showState({ emoji, title, text, html, action }) {
  const box = stateBox;
  box.replaceChildren(
    el('div', { class: 'state-icon', 'aria-hidden': 'true', text: emoji }),
    el('h3', { text: title }),
    html || el('p', { text }),
    action ? el('button', { type: 'button', class: 'btn-primary', text: action.label, onclick: action.run }) : null,
  );
  box.hidden = false;
}

/* ---------- Render: các điều khiển ---------- */
function fillSelect(select, options) {
  select.replaceChildren(...options.map((o) => el('option', { value: o.value, text: o.label })));
}

function buildStaticControls() {
  fillSelect($('#f-time'), TIME_OPTIONS);
  fillSelect($('#f-sort'), SORT_OPTIONS);

  $('#year').textContent = new Date().getFullYear();
  $('#stats').replaceChildren(
    ...[
      [posts.length, 'bài viết'],
      [categoryTree.length, 'danh mục'],
      [new Set(posts.map((p) => p.author)).size, 'tác giả'],
    ].map(([n, label]) => el('li', {}, el('strong', { text: String(n) }), el('span', { text: label }))),
  );
}

/** Một hàng checkbox danh mục dùng chung cho cả danh mục cha và danh mục con. */
function categoryRow(name) {
  const input = el('input', { type: 'checkbox', value: name, 'data-category': name });
  const count = el('span', { class: 'count' });
  const label = el('label', {}, input, el('span', { class: 'name', text: name }), count);
  categoryEls.set(name, { input, count, li: null }); // li gắn lại ở nơi gọi, sau khi biết nó nằm trong <li> nào
  return { input, count, label };
}

/**
 * Sidebar chỉ có một khối "Danh mục": 4 danh mục lớn trong CATEGORIES (checkbox, chọn được nhiều).
 * Danh mục có danh mục con (hiện chỉ "Bộ ký hiệu tay") có thêm nút mũi tên để sổ/thu các con;
 * chọn danh mục cha lọc theo toàn bộ con của nó, chọn một con thì chỉ lọc đúng con đó.
 */
function buildSidebar() {
  const list = el('ul', { class: 'filter-list' });
  categoryTree.forEach((node) => {
    const { label } = categoryRow(node.name);

    if (!node.children.length) {
      const li = el('li', {}, label);
      categoryEls.get(node.name).li = li;
      list.append(li);
      return;
    }

    const subList = el(
      'ul',
      { class: 'subcat-list', hidden: true },
      node.children.map((child) => {
        const { label: subLabel } = categoryRow(child);
        const li = el('li', {}, subLabel);
        categoryEls.get(child).li = li;
        return li;
      }),
    );
    const toggle = el(
      'button',
      {
        type: 'button',
        class: 'subcat-toggle',
        'aria-expanded': 'false',
        'aria-label': `Hiện các danh mục con của "${node.name}"`,
        onclick: () => {
          subList.hidden = !subList.hidden;
          toggle.setAttribute('aria-expanded', String(!subList.hidden));
        },
      },
      icon('chevron', 'icon icon-sm'),
    );
    subcatUI.set(node.name, { subList, toggle });

    const li = el('li', { class: 'cat-parent' }, el('div', { class: 'cat-row' }, label, toggle), subList);
    categoryEls.get(node.name).li = li;
    list.append(li);
  });
  $('#filter-groups').replaceChildren(el('section', { class: 'filter-group' }, el('h3', { text: 'Danh mục' }), list));
}

/** Đồng bộ trạng thái checked và số bài của từng danh mục (cha lẫn con) theo `state`. */
function syncSidebar() {
  // Đếm theo các bộ lọc khác (từ khóa, thời gian…) nhưng không tính chính bộ lọc danh mục.
  const pool = posts.filter((p) => matches(p, state, true));

  categoryEls.forEach(({ input, count, li }, name) => {
    const checked = state.categories.includes(name);
    const leaves = leavesOf(name); // danh mục cha gộp đếm theo toàn bộ con
    const n = pool.filter((p) => leaves.some((c) => p.categories.includes(c))).length;
    input.checked = checked;
    count.textContent = `(${n})`;
    li.classList.toggle('is-empty', n === 0 && !checked);
  });

  // Tự sổ danh mục con ra nếu đang có một con được chọn (ví dụ mở thẳng bằng URL), không tự thu lại.
  subcatUI.forEach(({ subList, toggle }, parentName) => {
    const node = categoryTree.find((c) => c.name === parentName);
    const hasCheckedChild = node.children.some((child) => state.categories.includes(child));
    if (hasCheckedChild && subList.hidden) {
      subList.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
}

/** Đồng bộ các điều khiển ngoài sidebar (banner, chế độ tìm, sắp xếp, nút nổi). */
function syncControls() {
  const fq = $('#f-q');
  if (fq.value !== state.q) fq.value = state.q;
  fq.placeholder = MODE_PLACEHOLDER[state.mode];
  $$('input[name="mode"]').forEach((i) => {
    i.checked = i.value === state.mode;
  });
  $('#q-clear').hidden = !state.q;

  $('#f-time').value = state.time;
  // "Liên quan nhất" chỉ có nghĩa khi đang tìm kiếm nên ẩn đi lúc không có từ khóa.
  const relevanceOpt = $('#f-sort option[value="relevance"]');
  relevanceOpt.hidden = relevanceOpt.disabled = !state.q.trim();
  $('#f-sort').value = state.sort;

  const fab = $('#fab-saved');
  fab.setAttribute('aria-pressed', String(state.savedOnly));
  fab.setAttribute('aria-label', state.savedOnly ? 'Quay lại tất cả bài viết' : 'Xem bài viết đã lưu');
  $('#saved-count').textContent = String(saved.size);

  // Nút mở ngăn kéo (mobile) chỉ chứa bộ lọc danh mục nên chỉ đếm danh mục đã chọn.
  const badge = $('#filter-count');
  badge.hidden = state.categories.length === 0;
  badge.textContent = String(state.categories.length);
  $('#reset-filters').disabled = state.categories.length === 0;
}

/** Vẽ lại toàn bộ. Mặc định quay về trang 1 vì bộ lọc/từ khóa/sắp xếp vừa đổi; chỉ đổi trang thì truyền keepPage. */
function refresh({ keepPage = false } = {}) {
  if (!keepPage) state.page = 1;
  renderResults();
  syncSidebar();
  syncControls();
  writeURL();
}

function resetFilters() {
  state = { ...DEFAULT_STATE, categories: [], mode: state.mode, sort: state.sort === 'relevance' ? DEFAULT_STATE.sort : state.sort };
  refresh();
}

function clearCategories() {
  state.categories = [];
  refresh();
}

function scrollToResults() {
  $('#articles').scrollIntoView();
}

/* ---------- Lưu bài viết ---------- */
function toggleSaved(id) {
  if (saved.has(id)) saved.delete(id);
  else saved.add(id);
  persistSaved();

  if (state.savedOnly) {
    refresh({ keepPage: true }); // bài vừa bỏ lưu biến mất khỏi danh sách nhưng vẫn ở trang hiện tại
    return;
  }
  // Cập nhật tại chỗ để không làm mất focus của nút đang bấm.
  const on = saved.has(id);
  $$(`[data-save-id="${id}"]`).forEach((btn) => {
    btn.classList.toggle('is-saved', on);
    btn.setAttribute('aria-pressed', String(on));
    if (btn.classList.contains('card-save')) btn.setAttribute('aria-label', on ? 'Bỏ lưu bài viết' : 'Lưu bài viết');
    const label = $('.save-label', btn);
    if (label) label.textContent = on ? 'Đã lưu' : 'Lưu bài viết';
  });
  syncControls();
}

/* ---------- Popup bài viết ---------- */
const modal = $('#post-modal');
const modalBody = $('#modal-body');
let modalPostId = null;

function openPost(id) {
  const p = postById.get(id);
  if (!p) return;
  modalPostId = id;
  const kw = tokensOf(state.q);

  // Hai khối: ảnh bên trái, tiêu đề + nội dung bên phải.
  modalBody.replaceChildren(
    el('div', { class: 'modal-media' }, makeThumb(p, 'modal-hero', true)),
    el(
      'div',
      { class: 'modal-content' },
      p.categories.length ? el('div', { class: 'badge-row' }, p.categories.map((c) => el('span', { class: 'badge', text: c }))) : null,
      el('h2', { id: 'modal-title', class: 'modal-title' }, mark(p.title, 'title', kw)),
      el(
        'p',
        { class: 'modal-meta' },
        el('span', {}, icon('user', 'icon icon-sm'), p.author),
        el('span', {}, icon('clock', 'icon icon-sm'), `${p.readTime} phút đọc`),
        el('time', { datetime: p.date, text: longDate(p.dateObj) }),
      ),
      el('div', { class: 'modal-text' }, p.content.map((t) => el('p', {}, mark(t, 'content', kw)))),
      el('ul', { class: 'tag-list' }, p.tags.map((t) => el('li', { class: 'tag', text: t }))),
      el('div', { class: 'modal-actions' }, makeSaveButton(p, true)),
    ),
  );

  document.body.classList.add('modal-open');
  modal.showModal();
  modalBody.scrollTop = 0; // mobile: cả popup cuộn
  $('.modal-content', modal).scrollTop = 0; // desktop: chỉ khối bên phải cuộn
}

/** Dọn dẹp sau khi popup đóng. An toàn khi gọi nhiều lần (đóng bằng nút/nền gọi ngay, Esc đi qua sự kiện `close`). */
function onModalClosed() {
  if (modal.open) return; // sự kiện của lần đóng trước đến muộn, popup mới đã mở lại rồi
  document.body.classList.remove('modal-open');
  // Danh sách có thể đã được vẽ lại khi popup đang mở, nên tìm lại nút theo id.
  $(`.card-open[data-open-id="${modalPostId}"]`)?.focus();
  modalPostId = null;
}
function closeModal() {
  modal.close();
  onModalClosed();
}
modal.addEventListener('close', onModalClosed);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal(); // bấm vào nền mờ
});
$('#modal-close').addEventListener('click', closeModal);

/**
 * Màn hình "Khảo sát & Thử nghiệm": KHÔNG phải popup, mà thay chỗ banner + danh sách bằng nội dung
 * tĩnh lấy từ SURVEY_INFO (data.js). Chuyển qua lại bằng URL hash #survey, giống cách #top/#contact
 * đang dùng trong header — bấm nút ở header, hoặc "Quay lại danh sách", chỉ đổi hash; việc ẩn/hiện
 * do hashchange xử lý, nên mở thẳng link có #survey cũng hiển thị đúng ngay từ đầu.
 */
const bannerEl = $('#banner');
const mainEl = $('#articles');
const surveyView = $('#survey-view');
const surveyTitle = $('#survey-title');
const surveyBody = $('#survey-body');

function renderSurveyView() {
  if (typeof SURVEY_INFO === 'undefined' || surveyBody.children.length) return; // chưa có dữ liệu, hoặc đã dựng rồi thì không dựng lại
  surveyTitle.textContent = SURVEY_INFO.title;
  surveyBody.replaceChildren(
    ...SURVEY_INFO.sections.map((section) =>
      el(
        'section',
        {},
        el('h3', { text: section.heading }),
        section.paragraphs
          ? section.paragraphs.map((t) => el('p', { text: t }))
          : section.subsections.flatMap((sub) => [
              el('h4', { text: sub.subheading }),
              ...sub.paragraphs.map((t) => el('p', { text: t })),
            ]),
      ),
    ),
  );
}

function syncSurveyView() {
  const show = location.hash === '#survey';
  if (show) renderSurveyView();
  bannerEl.hidden = show;
  mainEl.hidden = show;
  surveyView.hidden = !show;
}
window.addEventListener('hashchange', syncSurveyView);

/* ---------- Ngăn kéo bộ lọc (mobile) ---------- */
const sidebar = $('#sidebar');
const drawerBackdrop = $('#drawer-backdrop');
const drawerMq = window.matchMedia('(max-width: 991px)');

function setDrawer(open) {
  sidebar.classList.toggle('open', open);
  drawerBackdrop.hidden = !open;
  document.body.classList.toggle('no-scroll', open);
  if (open) $('#close-filters').focus();
  else if (drawerMq.matches) $('#open-filters').focus();
}

/* ---------- Header: menu mobile, hiệu ứng cuộn ---------- */
const nav = $('#main-nav');
const navToggle = $('#nav-toggle');

function setNav(open) {
  nav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
}

function onScroll() {
  $('.site-header').classList.toggle('scrolled', window.scrollY > 4);
  $('#fab-top').hidden = window.scrollY < 400;
}

/* ---------- Gắn sự kiện ---------- */
function bindEvents() {
  const form = $('#search-form');
  const fq = $('#f-q');
  let timer;

  fq.addEventListener('input', () => {
    setQuery(fq.value);
    $('#q-clear').hidden = !fq.value;
    clearTimeout(timer);
    timer = setTimeout(refresh, SEARCH_DEBOUNCE_MS);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearTimeout(timer);
    setQuery(fq.value);
    refresh();
    scrollToResults();
  });
  $('#q-clear').addEventListener('click', () => {
    clearTimeout(timer);
    setQuery('');
    refresh();
    fq.focus();
  });

  $('#f-time').addEventListener('change', (e) => {
    state.time = e.target.value;
    refresh();
  });
  $('#f-sort').addEventListener('change', (e) => {
    state.sort = e.target.value;
    refresh();
  });
  $$('input[name="mode"]').forEach((i) =>
    i.addEventListener('change', () => {
      state.mode = i.value;
      refresh();
    }),
  );

  // Danh mục trong sidebar
  $('#filter-groups').addEventListener('change', (e) => {
    const category = e.target.dataset.category;
    if (category == null) return;
    state.categories = e.target.checked ? [...state.categories, category] : state.categories.filter((c) => c !== category);
    refresh();
  });
  $('#reset-filters').addEventListener('click', clearCategories);
  $('#apply-filters').addEventListener('click', () => {
    setDrawer(false);
    scrollToResults();
  });
  $('#open-filters').addEventListener('click', () => setDrawer(true));
  $('#close-filters').addEventListener('click', () => setDrawer(false));
  drawerBackdrop.addEventListener('click', () => setDrawer(false));
  drawerMq.addEventListener('change', (e) => {
    if (!e.matches && sidebar.classList.contains('open')) setDrawer(false);
  });

  // Mở bài viết, chuyển trang, lưu bài viết, đóng menu mobile (ủy quyền sự kiện)
  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open-id]');
    if (open) return openPost(Number(open.dataset.openId));

    const page = e.target.closest('[data-page]');
    if (page) return goToPage(Number(page.dataset.page));

    const save = e.target.closest('[data-save-id]');
    if (save) return toggleSaved(Number(save.dataset.saveId));

    if (e.target.closest('.main-nav a')) setNav(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || modal.open) return; // <dialog> tự xử lý Esc
    if (sidebar.classList.contains('open')) setDrawer(false);
    else if (nav.classList.contains('open')) {
      setNav(false);
      navToggle.focus();
    }
  });

  navToggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));

  // Nút nổi
  $('#fab-saved').addEventListener('click', () => {
    state.savedOnly = !state.savedOnly;
    refresh();
    if (state.savedOnly) scrollToResults();
  });
  $('#fab-top').addEventListener('click', () => window.scrollTo({ top: 0 }));

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Khởi tạo ---------- */
function init() {
  $('#year').textContent = new Date().getFullYear();
  bindEvents();
  syncSurveyView(); // xử lý cả trường hợp mở thẳng link có #survey; không phụ thuộc việc tải bài viết có thành công hay không

  try {
    posts = preparePosts();
  } catch (err) {
    console.error('Không đọc được dữ liệu bài viết:', err);
    listEl.replaceChildren();
    listEl.setAttribute('aria-busy', 'false');
    $('#result-title').textContent = 'Không hiển thị được bài viết';
    showState({
      emoji: '⚠️',
      title: 'Dữ liệu bài viết bị lỗi',
      html: el(
        'p',
        {},
        'Hãy kiểm tra file ',
        el('code', { text: 'data.js' }),
        ' có nằm cùng thư mục, được nạp trước ',
        el('code', { text: 'index.js' }),
        ' và khai báo đúng ',
        el('code', { text: 'const POSTS = [...]' }),
        '.',
      ),
      action: { label: 'Thử lại', run: () => location.reload() },
    });
    return;
  }

  posts.forEach((p) => postById.set(p.id, p));
  indexFacets();
  buildStaticControls();
  buildSidebar();
  readURL();
  refresh({ keepPage: true }); // giữ số trang lấy từ URL
}

init();
