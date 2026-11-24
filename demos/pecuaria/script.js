// Demo do app "Planejamento da Pecuária" (Power Apps) recriado em HTML/CSS/JS.
// Todos os dados são fictícios.
const $ = s => document.querySelector(s);

// ===== ÍCONES (traço, 24x24) =====
const ICON = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-.8-1.7-1.2-3-1.2-1.7 0-3 .8-3 2s1.3 1.6 3 2 3 .8 3 2-1.3 2-3 2c-1.3 0-2.4-.4-3-1.2M12 6.5V8M12 16v1.5"/>',
  stack: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  chart: '<path d="M3 17l5-5 4 4 8-9"/><path d="M15 7h5v5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  ok: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>'
};
const ic = (n, c = '') => `<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON[n]}</svg>`;
const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (v, d = 2) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

// ===== MENU =====
const GR = [
  { n: 'Cadastros', i: 'home', it: ['Centros de Custo', 'Unidades de Medida', 'Insumos e Serviços', 'Produtos de Nutrição Animal', 'Categorias de Animais', 'Grupo de contas financeiras', 'Contas financeiras'] },
  { n: 'Operações do Rebanho', i: 'bolt', it: ['Entradas', 'Estratégia Nutricional', 'Transferências', 'Saídas'] },
  { n: 'Financeiro', i: 'coin', it: [] },
  { n: 'Parâmetros Econômicos', i: 'stack', it: ['Preços de Mercado', 'Parâmetros de Compra', 'Parâmetros de Venda'] },
  { n: 'Análises', i: 'chart', it: [] },
  { n: 'Segurança', i: 'lock', it: [] }
];
const grupoDe = t => GR.find(g => g.it.includes(t)).n;

// ===== DADOS FICTÍCIOS =====
let cc = [
  { c: 1, f: 'Fazenda Exemplo Ipê', uf: 'GO', a: 980.4, t: 'Operacional', p: 'Própria', s: 'Ativo' },
  { c: 2, f: 'Fazenda Exemplo Aroeira', uf: 'TO', a: 615.2, t: 'Operacional', p: 'Terceiros', s: 'Ativo' },
  { c: 3, f: 'Fazenda Exemplo Jatobá', uf: 'MT', a: 340.8, t: 'Administrativo', p: 'Própria', s: 'Inativo' }
];
let ca = [
  [1, 'Bezerro [0-12]', 'Macho', 0, 12], [2, 'Garrote [13-24]', 'Macho', 13, 24], [3, 'Boi Gordo I [25-36]', 'Macho', 25, 36], [4, 'Boi Gordo II [>36]', 'Macho', 37, 999],
  [5, 'Bezerra [0-12]', 'Fêmea', 0, 12], [6, 'Novilha [13-24]', 'Fêmea', 13, 24], [7, 'Vaca Gorda I [25-36]', 'Fêmea', 25, 36], [8, 'Vaca Gorda II [>36]', 'Fêmea', 37, 999]
].map(([c, n, s, i, m]) => ({ c, n, s, i, m }));
const preco = { 1: 312.5, 3: 298 }; // R$/@ por código de categoria

// ===== ESTADO =====
let tela = 'Centros de Custo', abertos = new Set(['Cadastros']), res = null, editPreco = null, ultimoFoco = null;

// ===== NAVEGAÇÃO =====
function nav() {
  $('#nav').innerHTML = GR.map(g => {
    const on = abertos.has(g.n), ativo = g.it.includes(tela);
    return `<button type="button" class="g${ativo ? ' cur' : ''}" data-g="${g.n}" aria-expanded="${g.it.length ? on : false}">${ic(g.i)}<span>${g.n}</span>${ic('chev', 'cv' + (on ? ' up' : ''))}</button>` +
      (on && g.it.length ? `<div class="sub">${g.it.map(m => `<button type="button" data-m="${m}"${m == tela ? ' aria-current="page"' : ''}>${m}</button>`).join('')}</div>` : '');
  }).join('');
}
$('#nav').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.m) { tela = b.dataset.m; res = null; editPreco = null; go(); $('#main').focus(); return; }
  const g = GR.find(x => x.n == b.dataset.g);
  if (!g.it.length) { toast('Módulo disponível no app completo'); return; }
  abertos.has(g.n) ? abertos.delete(g.n) : abertos.add(g.n); nav();
});

const bc = extra => `<div class="bc"><h2>${grupoDe(tela)} <span aria-hidden="true">›</span> ${tela}</h2>${extra || ''}</div>`;
function go() {
  nav();
  if (tela == 'Centros de Custo') vCC();
  else if (tela == 'Categorias de Animais') vCA();
  else if (tela == 'Preços de Mercado') vPM();
  else $('#main').innerHTML = bc() + `<div class="vazio">Tela não incluída nesta demo.<br>Experimente <b>Centros de Custo</b>, <b>Categorias de Animais</b> ou <b>Preços de Mercado</b>.</div>`;
}

// ===== CENTROS DE CUSTO =====
const radio = (n, l, v) => `<fieldset class="row"><legend>${l}:</legend><div class="ops">${v.map((x, i) => `<label class="o"><input type="radio" name="${n}" value="${x}"${i ? '' : ' checked'}>${x}</label>`).join('')}</div></fieldset>`;
function vCC() {
  $('#main').innerHTML = bc() + `<p class="sec">Parâmetros da consulta</p>
<div class="row"><label class="lb" for="fz">Fazenda:</label><div class="sel"><select id="fz"><option value="">Todas</option>${cc.map(x => `<option>${esc(x.f)}</option>`).join('')}</select>${ic('chev')}</div></div>
${radio('t', 'Tipo de Centro de Custo', ['Todos', 'Operacional', 'Administrativo'])}${radio('p', 'Propriedade', ['Todos', 'Própria', 'Terceiros'])}${radio('s', 'Situação', ['Todos', 'Ativo', 'Inativo'])}
<div class="btns"><button type="button" class="b" id="bn">Novo</button><button type="button" class="b" id="bl">Limpar</button><button type="button" class="b p" id="bq">Consultar</button></div>
<p class="sec">Resultado da consulta</p><div class="tb" id="tb"></div>`;
  const rd = n => document.querySelector(`[name=${n}]:checked`).value;
  $('#bq').onclick = () => { const f = $('#fz').value, t = rd('t'), p = rd('p'), s = rd('s'); res = cc.filter(x => (!f || x.f == f) && (t == 'Todos' || x.t == t) && (p == 'Todos' || x.p == p) && (s == 'Todos' || x.s == s)); tCC(); };
  $('#bl').onclick = () => { res = null; vCC(); };
  $('#bn').onclick = () => fCC();
  tCC();
}
function tCC() {
  const head = '<tr><th scope="col">Código</th><th scope="col">Fazenda</th><th scope="col">UF</th><th scope="col" class="n">Área produtiva (ha)</th><th scope="col">Tipo de centro de custo</th><th scope="col">Propriedade</th><th scope="col">Situação</th><th scope="col"><span class="sr">Ações</span></th></tr>';
  const body = !res ? '' : res.length ? res.map(x => `<tr><td>${x.c}</td><td>${esc(x.f)}</td><td>${esc(x.uf)}</td><td class="n">${num(x.a)}</td><td>${x.t}</td><td>${x.p}</td><td><span class="st ${x.s == 'Ativo' ? 'on' : ''}">${x.s}</span></td><td class="ac"><button type="button" class="ib" data-e="${x.c}" aria-label="Editar ${esc(x.f)}">${ic('pen')}</button></td></tr>`).join('')
    : '<tr><td colspan="8" class="nd">Nenhum registro encontrado.</td></tr>';
  $('#tb').innerHTML = `<table><thead>${head}</thead><tbody>${body}</tbody></table>${res ? '' : '<div class="dica">Defina os parâmetros e clique em <b>Consultar</b>.</div>'}`;
  $('#tb').onclick = e => { const b = e.target.closest('[data-e]'); if (b) fCC(cc.find(x => x.c == b.dataset.e)); };
}
function fCC(x) {
  form(x ? 'Editar centro de custo' : 'Novo centro de custo', [
    ['f', 'Fazenda', 'text', null, 'w2'], ['uf', 'UF', 'text'], ['a', 'Área produtiva (ha)', 'number'],
    ['t', 'Tipo', 'sel', ['Operacional', 'Administrativo']], ['p', 'Propriedade', 'sel', ['Própria', 'Terceiros']], ['s', 'Situação', 'sel', ['Ativo', 'Inativo']]
  ], x || { t: 'Operacional', p: 'Própria', s: 'Ativo' }, v => {
    if (!v.f.trim()) return 'Informe a fazenda.';
    v.a = +v.a || 0; v.uf = v.uf.toUpperCase().slice(0, 2);
    if (x) Object.assign(x, v); else cc.push({ c: Math.max(0, ...cc.map(i => i.c)) + 1, ...v });
    res = cc; vCC(); res = cc; tCC();
  }, x && (() => { cc = cc.filter(i => i != x); res = cc; vCC(); res = cc; tCC(); }));
}

// ===== CATEGORIAS DE ANIMAIS =====
function vCA() {
  $('#main').innerHTML = bc(`<button type="button" class="b p" id="bn">${ic('plus')}Novo</button>`) + `<div class="tb"><table><thead><tr><th scope="col">Código</th><th scope="col">Categoria animal</th><th scope="col">Sexo</th><th scope="col" class="n">Idade mínima (meses)</th><th scope="col" class="n">Idade máxima (meses)</th><th scope="col"><span class="sr">Ações</span></th></tr></thead><tbody>${ca.map(x => `<tr><td>${x.c}</td><td>${esc(x.n)}</td><td>${x.s}</td><td class="n">${x.i}</td><td class="n">${x.m >= 999 ? '—' : x.m}</td><td class="ac"><button type="button" class="ib" data-e="${x.c}" aria-label="Editar ${esc(x.n)}">${ic('pen')}</button></td></tr>`).join('')}</tbody></table></div>`;
  $('#bn').onclick = () => fCA();
  $('.tb').onclick = e => { const b = e.target.closest('[data-e]'); if (b) fCA(ca.find(x => x.c == b.dataset.e)); };
}
function fCA(x) {
  form(x ? 'Editar categoria de animal' : 'Nova categoria de animal', [
    ['n', 'Categoria animal', 'text', null, 'w2'], ['s', 'Sexo', 'sel', ['Macho', 'Fêmea']], ['i', 'Idade mínima (meses)', 'number'], ['m', 'Idade máxima (meses)', 'number']
  ], x || { s: 'Macho' }, v => {
    if (!v.n.trim()) return 'Informe a categoria.';
    v.i = +v.i; v.m = +v.m;
    if (v.m < v.i) return 'A idade máxima não pode ser menor que a mínima.';
    if (x) Object.assign(x, v); else ca.push({ c: Math.max(0, ...ca.map(i => i.c)) + 1, ...v });
    vCA();
  }, x && (() => { ca = ca.filter(i => i != x); vCA(); }));
}

// ===== PREÇOS DE MERCADO (edição na linha) =====
function vPM() {
  $('#main').innerHTML = bc() + `<div class="tb"><table><thead><tr><th scope="col">Código</th><th scope="col">Descrição</th><th scope="col" class="n">Valor (R$/@)</th><th scope="col"><span class="sr">Ações</span></th></tr></thead><tbody>${ca.map(x => {
    const v = preco[x.c];
    if (editPreco == x.c) return `<tr class="ed"><td>${x.c}</td><td>${esc(x.n)}</td><td class="n"><label class="sr" for="pv">Valor de ${esc(x.n)}</label><input id="pv" type="number" step="0.01" min="0" value="${v ?? ''}"></td><td class="ac"><button type="button" class="ib ok" data-ok="${x.c}" aria-label="Salvar valor">${ic('ok')}</button><button type="button" class="ib no" data-no aria-label="Cancelar edição">${ic('x')}</button></td></tr>`;
    return `<tr><td>${x.c}</td><td>${esc(x.n)}</td><td class="n">${v != null ? num(v) : '<span class="mut">Não possui preço cadastrado</span>'}</td><td class="ac"><button type="button" class="ib" data-e="${x.c}" aria-label="Editar preço de ${esc(x.n)}">${ic('pen')}</button></td></tr>`;
  }).join('')}</tbody></table></div>`;
  const inp = $('#pv'); if (inp) { inp.focus(); inp.onkeydown = e => { if (e.key == 'Enter') $('[data-ok]').click(); if (e.key == 'Escape') $('[data-no]').click(); }; }
  $('.tb').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.e) { editPreco = +b.dataset.e; vPM(); }
    else if (b.dataset.ok) { const v = $('#pv').value; if (v === '' || +v < 0) { toast('Informe um valor válido.'); return; } preco[b.dataset.ok] = +v; editPreco = null; vPM(); toast('Preço salvo'); }
    else if ('no' in b.dataset) { editPreco = null; vPM(); }
  };
}

// ===== FORMULÁRIO (modal) =====
function form(t, F, d, save, del) {
  ultimoFoco = document.activeElement;
  $('#mt').textContent = t;
  $('#mf').innerHTML = F.map(([k, l, ty, o, w]) => `<div class="fd ${w || ''}"><label for="f_${k}">${l}</label>` + (ty == 'sel'
    ? `<div class="sel"><select id="f_${k}" data-k="${k}">${o.map(z => `<option${d[k] == z ? ' selected' : ''}>${z}</option>`).join('')}</select>${ic('chev')}</div>`
    : `<input id="f_${k}" type="${ty}" data-k="${k}" value="${esc(d[k])}">`) + '</div>').join('');
  $('#mb').innerHTML = (del ? '<button type="button" class="b d" id="mdel">Excluir</button>' : '') + '<button type="button" class="b" id="mc">Cancelar</button><button type="button" class="b p" id="ms">Salvar</button>';
  $('#mx').innerHTML = ic('x');
  $('#mo').hidden = false; $('#mf [data-k]').focus();
  const fechar = () => { $('#mo').hidden = true; ultimoFoco && ultimoFoco.isConnected && ultimoFoco.focus(); };
  $('#mc').onclick = $('#mx').onclick = fechar;
  $('#mo').onkeydown = e => { if (e.key == 'Escape') fechar(); };
  if (del) $('#mdel').onclick = () => { del(); fechar(); toast('Registro excluído'); };
  $('#ms').onclick = () => {
    const v = {}; $('#mf').querySelectorAll('[data-k]').forEach(e => v[e.dataset.k] = e.value);
    const er = save(v); if (er) toast(er); else { fechar(); toast('Registro salvo'); }
  };
}
let tt; function toast(m) { const t = $('#ts'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2000); }

$('#main').tabIndex = -1;
go();
