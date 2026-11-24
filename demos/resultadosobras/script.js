// ===== DADOS FICTÍCIOS (valores em milhões de R$) =====
// [projeto, status, receita realizada, custo realizado, estoque, receita a realizar, custo a realizar]
const RESP=[
 ['Marina Duarte',[
   ['P01 - Residencial Aurora','A',42.6,35.1,0.8,12.4,9.9],
   ['P02 - Conjunto Horizonte','EP',27.3,24.8,0,3.2,2.6],
   ['P03 - Edifício Mirante','A',18.9,14.2,0.3,6.5,4.8],
   ['P04 - Vila das Palmeiras','A',9.4,8.7,0,0,0.3],
   ['P05 - Reforma Bloco C','A',1.6,2.3,0,0.4,0.2]
 ]],
 ['Rafael Moura',[
   ['P06 - Centro Comunitário','A',14.1,12.9,0.2,4.7,3.6],
   ['P07 - Escola Modelo','EP',11.8,13.4,0,2.1,1.5]
 ]],
 ['Camila Torres',[
   ['P08 - Unidade de Saúde','A',33.5,28.2,1.1,15.3,11.7],
   ['P09 - Galpão Logístico','A',21.7,17.6,0,8.9,7.2]
 ]]
];

// [projeto, coordenador, previsão, comprometido] (R$)
const OB=[
 ['P11 - Reforma Bloco A','Ana',3480000,3915500],
 ['P12 - Reforma Bloco B','Bruno',2150000,2042300],
 ['P13 - Quadra Esportiva','Ana',1275000,1468900],
 ['P14 - Praça do Lote 4','Carla',0,38700],
 ['P15 - Telhado Galpão 2','Bruno',412000,455800],
 ['P16 - Fachada Torre 1','Carla',690000,731200],
 ['P17 - Acessibilidade','Ana',985000,912400]
];

const MES=[
 ['out/26',6.2,4.1],
 ['nov/26',5.4,4.6],
 ['dez/26',7.1,3.8],
 ['jan/27',4.9,3.2],
 ['fev/27',6.6,2.7],
 ['mar/27',5.2,2.1],
 ['abr/27',3.8,1.6],
 ['mai/27',2.9,1.2]
];

const P90=[
 ['P11 - Reforma Bloco A',1248300],
 ['P08 - Unidade de Saúde',1105600],
 ['P13 - Quadra Esportiva',874200],
 ['P01 - Residencial Aurora',812900],
 ['P16 - Fachada Torre 1',566400],
 ['P09 - Galpão Logístico',431700],
 ['P15 - Telhado Galpão 2',198500]
];

const RB={
    'Tipo de Documento':[
        ['Medição',3.4e6],
        ['Fatura',2.7e6],
        ['Contrato',1.5e6],
        ['Outros',0.6e6]
    ],
    'Projeto':OB.map(o=>[o[0].slice(0,24),o[2]*.3])
};

// ===== FORMATAÇÃO =====
const $=s=>document.querySelector(s),
      M=1e6;

const R=v=>
    (v<0?'-':'')+
    'R$ '+
    Math.abs(Math.round(v)).toLocaleString('pt-BR');

const P=v=>
    isFinite(v)
        ? (v*100).toFixed(1).replace('.',',')+'%'
        : '';

const cl=v=>v<0?'neg':'',
      n0=v=>Math.round(v).toLocaleString('pt-BR');

document.querySelectorAll('.dt')
    .forEach(e=>e.textContent=new Date().toLocaleString('pt-BR'));

// ===== NAVEGAÇÃO =====
const app=$('.app');

function ir(p){
    document
        .querySelectorAll('.pg')
        .forEach(x=>x.classList.toggle('on',x.id==p));

    document
        .querySelectorAll('#nav button')
        .forEach(b=>b.classList.toggle('on',b.dataset.p==p));

    app.classList.toggle('c',p=='capa');
    app.classList.toggle('r',p=='res');
}

document
    .querySelectorAll('#nav button')
    .forEach(b=>b.onclick=()=>ir(b.dataset.p));

$('#flt').onclick=()=>app.classList.toggle('nf');

ir('capa');

// ===== RESULTADO DOS PROJETOS =====
const open=new Set([RESP[0][0]]);

const opt=a=>
    '<option>Todos</option>'+
    a.map(x=>`<option>${x}</option>`).join('');

fResp.innerHTML=opt(RESP.map(r=>r[0]));

fPr.innerHTML=opt(
    RESP.flatMap(r=>r[1].map(p=>p[0]))
);

const calc=a=>({
    n:a[0],
    st:a[1],
    rec:a[2]*M,
    cus:a[3]*M,
    est:a[4]*M,
    ra:a[5]*M,
    ca:a[6]*M
});

const sum=l=>
    l.reduce((s,p)=>{
        for(const k of ['rec','cus','est','ra','ca'])
            s[k]+=p[k];

        return s;
    },{
        rec:0,
        cus:0,
        est:0,
        ra:0,
        ca:0
    });

const fin=s=>{
    s.res=s.rec-s.cus;
    s.mg=s.res/s.rec;

    s.rc=s.rec+s.ra-s.cus-s.ca;
    s.mc=s.rc/(s.rec+s.ra);

    s.orc=(s.rec+s.ra)*.96;
    s.ocu=(s.cus+s.ca)*.83;

    s.ores=s.orc-s.ocu;
    s.omg=s.ores/s.orc;

    s.rar=s.ra-s.ca;
    s.mar=s.rar/s.ra;

    return s;
};

const cel=(v,pct)=>
    `<td class="${cl(v)}">${
        v===0&&!pct
            ?''
            :pct
                ?P(v)
                :R(v)
    }</td>`;

const rowN=s=>
    cel(s.rec)+
    cel(s.cus)+
    cel(s.est)+
    cel(s.res)+
    cel(s.mg,1)+
    cel(s.ra)+
    cel(s.ca)+
    cel(s.rc)+
    cel(s.mc,1);

const card=(ic,bg,t,v,sub,rows,w)=>
    `<div class="kp">
        <h3>
            <span class="ic" style="background:${bg}">${ic}</span>
            ${t}
        </h3>
        <span class="v ${cl(v)}">${v}</span>
        <small>${sub}</small>
        <hr>
        ${rows}
    </div>`;

function resumo(){

    const fr=fResp.value,
          fs=fSt.value,
          fp=fPr.value,
          all=[],
          gr=[];

    RESP.forEach(([n,ps])=>{

        if(fr!='Todos'&&fr!=n)
            return;

        const l=ps
            .filter(p=>
                (fs=='Todos'||p[1]==fs)&&
                (fp=='Todos'||p[0]==fp)
            )
            .map(calc);

        if(l.length){
            gr.push([n,l]);
            all.push(...l);
        }
    });

    const t=fin(sum(all));

    const rw=(a,b)=>
        `<div class="r">${a}: <b>${b}</b></div>`;

    $('#kpis').innerHTML=

        card(
            '$',
            '#b8c9ee',
            'RECEITAS',
            R(t.rec),
            'Realizado',
            rw('Orçado',R(t.orc))+
            rw('A realizar',R(t.ra))+
            rw('Comprom',R(t.rec+t.ra))
        )+

        card(
            '✕',
            '#f4b8bd',
            'CUSTOS &amp; DESPESAS',
            R(t.cus),
            'Realizado',
            rw('Orçado',R(t.ocu))+
            rw('A realizar',R(t.ca))+
            rw('Comprom',R(t.cus+t.ca))
        )+

        card(
            '▤',
            '#f6cfae',
            'ESTOQUE DE INSUMOS',
            R(t.est),
            'Total',
            ''
        )+

        card(
            '↗',
            '#bfe5c9',
            'RESULTADO',
            R(t.res),
            'Realizado',
            rw('Orçado',R(t.ores))+
            rw('A realizar',R(t.rar))+
            rw('Comprom',R(t.rc))
        )+

        card(
            '%',
            '#fbe9a6',
            'MARGEM',
            P(t.mg),
            'Realizada',
            rw('Orçado',P(t.omg))+
            rw('A realizar',P(t.mar))+
            rw('Comprom',P(t.mc))
        )+

        `<div class="kp">
            <h3>
                <span class="ic" style="background:#f4b8bd">☻</span>
                INDICADORES
            </h3>

            <div class="ind">
                <div><b>${all.length}</b><small>Número de projetos</small></div>
                <div><b>-5,4%</b><small>Overhead s/ receita</small></div>
                <div><b>-6,1%</b><small>Overhead s/ custo</small></div>
                <div><b>57</b><small>Número de obras</small></div>
                <div><b>318</b><small>UH vendidas</small></div>
                <div><b>42</b><small>UH disponíveis</small></div>
            </div>
        </div>`;

    $('#mx').innerHTML=

        `<thead>
            <tr>
                <th>Responsável</th>
                <th>Sta-<br>tus</th>
                <th>Receitas<br>Realizadas</th>
                <th>Custos &amp; Desp.<br>Realizadas</th>
                <th>Estoque</th>
                <th>Resultado<br>Realizado</th>
                <th>Margem<br>Realizada</th>
                <th>Receitas a<br>Realizar</th>
                <th>Custos &amp; Desp.<br>a Realizar</th>
                <th>Resultado<br>Comprom.</th>
                <th>Margem<br>Comprom.</th>
            </tr>
        </thead>
        <tbody>`+

        gr.map(([n,l])=>
            `<tr class="g">
                <td>
                    <span class="ex" data-n="${n}">
                        ${open.has(n)?'⊟':'⊞'}
                    </span>
                    ${n}
                </td>
                <td></td>
                ${rowN(fin(sum(l)))}
            </tr>`+

            (
                open.has(n)
                    ?l.map(p=>
                        `<tr class="p">
                            <td>
                                <span class="ex">⊞</span>
                                ${p.n}
                            </td>
                            <td class="st${p.st}">${p.st}</td>
                            ${rowN(fin(p))}
                        </tr>`
                    ).join('')
                    :''
            )
        ).join('')+

        `<tr class="t">
            <td>
                <span class="ex" style="visibility:hidden">⊞</span>
                Total
            </td>
            <td></td>
            ${rowN(t)}
        </tr>
        </tbody>`;
}

$('#mx').onclick=e=>{
    const n=e.target.dataset.n;

    if(n){
        open.has(n)
            ?open.delete(n)
            :open.add(n);

        resumo();
    }
};

fResp.onchange=
fSt.onchange=
fPr.onchange=
resumo;

resumo();

// ===== CUSTOS DAS OBRAS =====
fPj.innerHTML=opt(OB.map(o=>o[0]));

fCo.innerHTML=opt(
    [...new Set(OB.map(o=>o[1]))]
);

const heat=(p,a)=>
    `rgba(226,110,122,${Math.min(
        a+Math.abs(p)*2.6,
        .85
    ).toFixed(2)})`;

function obras(){

    const l=OB.filter(o=>
        (fPj.value=='Todos'||o[0]==fPj.value)&&
        (fCo.value=='Todos'||o[1]==fCo.value)
    );

    const tp=l.reduce((s,o)=>s+o[2],0),
          tc=l.reduce((s,o)=>s+o[3],0);

    $('#dv').innerHTML=
        `<thead>
            <tr>
                <th>Projeto</th>
                <th>Previsão</th>
                <th>Compro-<br>metido</th>
                <th>Δ $<br>▾</th>
                <th>Δ %</th>
            </tr>
        </thead>
        <tbody>`+

        l.map(o=>{

            const d=o[3]-o[2],
                  p=o[2]?d/o[2]:1,
                  pp=Math.min(p,1);

            return `
                <tr>
                    <td>
                        <span class="ex">⊞</span>
                        ${o[0]}
                    </td>

                    <td>${n0(o[2])}</td>
                    <td>${n0(o[3])}</td>

                    <td class="h">
                        <div class="hc"
                             style="background:${
                                 d>0
                                     ?heat(pp,.35)
                                     :'transparent'
                             }">
                            <span>${n0(d)}</span>
                            <span class="${d>0?'up':'dn'}">
                                ${d>0?'🡅':'🡇'}
                            </span>
                        </div>
                    </td>

                    <td class="h">
                        <div class="hc"
                             style="background:${
                                 d>0
                                     ?heat(pp,.2)
                                     :'transparent'
                             }">
                            ${P(p)}
                        </div>
                    </td>
                </tr>`;
        }).join('')+

        `<tr class="t">
            <td>&nbsp;&nbsp;&nbsp;&nbsp;Total</td>
            <td>${n0(tp)}</td>
            <td>${n0(tc)}</td>
            <td>${n0(tc-tp)}</td>
            <td>${P((tc-tp)/tp)}</td>
        </tr>
        </tbody>`;
}

fPj.onchange=
fCo.onchange=
obras;

obras();

// ===== KPIs DAS OBRAS =====
const kb=(ic,bg,t,a,b,pc,col)=>
    `<div class="kp">
        <h3>
            <span class="ic" style="background:${bg}">${ic}</span>
            ${t}
        </h3>

        <small>${a[0]}</small>
        <span class="v">${a[1]}</span>

        <hr>

        <small>${b[0]}</small>
        <span class="s" style="font-size:13px;margin-left:4px">
            ${b[1]}
        </span>

        <div style="margin:5px 0 4px 4px">
            <span class="bar">
                <i style="width:${pc}%;background:${col}"></i>
            </span>
            <span class="bp">
                ${pc.toFixed(1).replace('.',',')}%
            </span>
        </div>
    </div>`;

$('#kpo').innerHTML=

    kb(
        '$',
        '#b8c9ee',
        'RECEITAS',
        ['Valor comprometido','R$ 48.250.000'],
        ['Valor realizado','R$ 21.430.500'],
        44.4,
        '#b5c6ea'
    )+

    kb(
        '✕',
        '#f4b8bd',
        'CUSTOS &amp; DESPESAS',
        ['Valor comprometido','R$ 36.910.200'],
        ['Valor realizado','R$ 19.875.300'],
        53.8,
        '#f1c4ca'
    )+

    `<div class="kp">
        <h3>
            <span class="ic" style="background:#bfe5c9">↗</span>
            RESULTADO &amp; MARGEM
        </h3>

        <small>Resultado &amp; margem projetado</small>
        <span class="v">R$ 11.339.800</span>

        <div class="pc2">23,5%</div>

        <hr>

        <small>Resultado &amp; margem atual</small>
        <span class="s" style="font-size:13px;margin-left:4px">
            R$ 1.555.200
        </span>

        <div class="pc2">7,3%</div>
    </div>`;

// ===== RECEBIMENTOS E PAGAMENTOS =====
const mx=8;

const fm=v=>
    'R$ '+
    (v*M).toLocaleString('pt-BR',{
        maximumFractionDigits:0
    });

$('#ch').innerHTML=
    MES.map(m=>
        `<span>${m[0]}</span>

        <div class="aw">
            <div class="a"
                 style="width:${m[1]/mx*100}%">
                ${fm(m[1])}
            </div>
        </div>

        <div class="bw">
            <div class="b ${m[2]<4.5?'o':''}"
                 style="width:${m[2]/mx*100}%">
                ${fm(m[2])}
            </div>
        </div>`
    ).join('');

// =========================================================
// RECEBIMENTOS EM ABERTO
// =========================================================

function rb(){

    const k=$('#vv').value;

    // Dados da seleção atual
    const dados=RB[k].map(r=>[
        r[0],
        r[1]
    ]);

    // Guarda o valor original para o filtro
    dados.forEach(r=>{
        r[2]=r[1];
    });

    renderRB(dados);
}

function renderRB(dados){

    /*
        Encontra o menor e o maior valor da tabela.

        menor = azul bem claro
        maior = azul mais forte
    */
    const valores=dados.map(r=>r[1]);

    const menor=Math.min(...valores);
    const maior=Math.max(...valores);

    $('#rb').innerHTML=
        `<thead>
            <tr>
                <th>${$('#vv').value}</th>
                <th>Recebtos em<br>Aberto</th>
            </tr>
        </thead>
        <tbody>`+

        dados.map(r=>{

            const valor=r[1];

            // Percentual entre o menor e o maior
            const p=
                maior===menor
                    ?1
                    :(valor-menor)/(maior-menor);

            /*
                Azul claro → azul forte.

                0.10 = menor
                0.55 = maior
            */
            const opacidade=
                0.10+(p*0.45);

            return `
                <tr>
                    <td>${r[0]}</td>

                    <td class="h">
                        <div class="hc"
                             style="
                                background:rgba(
                                    45,
                                    105,
                                    98,
                                    ${opacidade.toFixed(2)}
                                );
                                color:#1f4a44;
                                font-weight:600;
                             ">
                            ${R(valor)}
                        </div>
                    </td>
                </tr>`;
        }).join('')+

        `</tbody>`;
}

// Inicializa
rb();


// =========================================================
// FILTRO DOS RECEBIMENTOS
// =========================================================

$('#vv').onchange=()=>{
    rb();
};

$('#vt').onchange=()=>{

    const f={
        Tudo:1,
        Vencidos:.35,
        'A vencer':.65
    }[$('#vt').value];

    const k=$('#vv').value;

    /*
        Cria uma nova lista sem alterar os dados originais.
    */
    const dados=RB[k].map(r=>[
        r[0],
        r[1]*f
    ]);

    renderRB(dados);
};


// ===== CONFIGURAÇÃO DOS RECEBIMENTOS =====
$('#gr').onclick=()=>{
    $('#ov').classList.add('on');
};

$('#px').onclick=()=>{
    $('#ov').classList.remove('on');
};


// =========================================================
// PAGO DOS PRÓXIMOS 90 DIAS
// =========================================================

$('#pg').innerHTML=
    `<thead>
        <tr>
            <th>Projeto</th>
            <th>Pagtos em<br>Aberto ▾</th>
        </tr>
    </thead>

    <tbody>`+

    P90.map(p=>
        `<tr>
            <td>${p[0]}</td>

            <td class="h">
                <div class="hc"
                     style="
                        background:rgba(
                            226,
                            110,
                            122,
                            ${(p[1]/1.3e6*.75).toFixed(2)}
                        )">
                    ${R(p[1])}
                </div>
            </td>
        </tr>`
    ).join('')+

    `<tr class="t">
        <td style="font-weight:700">Total</td>
        <td style="font-weight:700">
            ${R(P90.reduce((s,p)=>s+p[1],0))}
        </td>
    </tr>
    </tbody>`;