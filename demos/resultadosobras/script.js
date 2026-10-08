// ===== DADOS FICTÍCIOS (valores em milhões de R$) =====
// [projeto, status, receita realizada, custo realizado, estoque, receita a realizar, custo a realizar]
const RESP=[
 ['Marina Duarte',[
   ['0020 - PVT.17 - Vale Verde','A',196.8,170.9,3.5,59.5,26.8],
   ['0021 - LIC.18 - Conjunto Alfa (For...','EP',146.8,101.7,0,0,.2],
   ['0022 - LIC.22 - Residencial Sol','A',196.8,139.7,.01,4.9,1.8],
   ['0023 - LIC.23 - Torres Norte','A',48.7,30.9,0,0,.04],
   ['0024 - LIC.22 - Parque Leste','A',45.4,41,0,0,.07],
   ['0025 - LIC.23 - Cubatão Sul','A',178.5,143.7,.05,0,1],
   ['0085 - LIC.24 - Vila Nova','A',82.2,55.3,1.2,15.8,9.7],
   ['0095 - Obras Qualit - Reforma','A',.7,6.2,0,0,.2],
   ['0107 - LIC.26 - Vice-Prefeitura','A',.1,10.8,0,128.7,97.8]
 ]],
 ['Rafael Moura',[
   ['0030 - LIC.20 - Centro Cívico','A',32.5,40.2,0,1.3,5.2],
   ['0031 - ATA.21 - Escola Modelo','EP',35,44.3,0,1.3,5.2]
 ]],
 ['Camila Torres',[
   ['0040 - LIC.24 - Hospital Regional','A',250,220,1.2,90,40],
   ['0041 - PVT.19 - Distrito Industrial','A',164.7,144.7,0,49.2,26.3]
 ]]
];

// [projeto, coordenador, previsão, comprometido] (R$)
const OB=[
 ['0036 - PVT.23 - UNO','Ana',18725018,21882349],
 ['0043 - LIC.24 - Escola Sul','Bruno',4935254,6665664],
 ['0042 - LIC.23 - Saúde','Ana',13342670,13951254],
 ['0111 - ATA.26 - Praça Central (Lote...','Carla',0,22400],
 ['0039 - ATA.23 - Centro Sul / ...','Bruno',49498,66287],
 ['0038 - ATA.23 - Avaré / Botu...','Carla',58345,73255],
 ['0097 - ATA.25 - Mogi Mirim','Ana',14594511,13747206]
];

const MES=[
 ['out/26',18.1,13.5],
 ['nov/26',15.1,11.3],
 ['dez/26',14.1,10.4],
 ['jan/27',15.6,8],
 ['fev/27',19,6.6],
 ['mar/27',13.7,4],
 ['abr/27',9.2,3.1],
 ['mai/27',6.4,2.2]
];

const P90=[
 ['0106 - ATA.25 - Sul 2 - Progre...',5122811],
 ['0099 - ATA.25 - Leste 3 - S...',5069257],
 ['0097 - ATA.25 - Mogi Mirim)',4630252],
 ['0108 - ATA.26 - São João da B...',4612586],
 ['0105 - ATA.25 - Avaré / Botuc...',4587142],
 ['0098 - ATA.25 - Limeira - Cam...',4388357],
 ['0109 - ATA.25 - C. Climatiza-L...',2948460]
];

const RB={
    'Tipo de Documento':[
        ['Medição',9.8e6],
        ['Fatura',6.3e6],
        ['Contrato',3.9e6],
        ['Outros',1.2e6]
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
                <div><b>-8,2%</b><small>Overhead s/ receita</small></div>
                <div><b>-8,8%</b><small>Overhead s/ custo</small></div>
                <div><b>412</b><small>Número de obras</small></div>
                <div><b>980</b><small>UH vendidas</small></div>
                <div><b>96</b><small>UH disponíveis</small></div>
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
        ['Valor comprometido','R$ 200.335.266'],
        ['Valor realizado','R$ 61.700.190'],
        30.8,
        '#b5c6ea'
    )+

    kb(
        '✕',
        '#f4b8bd',
        'CUSTOS &amp; DESPESAS',
        ['Valor comprometido','R$ 133.603.624'],
        ['Valor realizado','R$ 71.664.321'],
        53.6,
        '#f1c4ca'
    )+

    `<div class="kp">
        <h3>
            <span class="ic" style="background:#bfe5c9">↗</span>
            RESULTADO &amp; MARGEM
        </h3>

        <small>Resultado &amp; margem projetado</small>
        <span class="v">R$ 66.731.642</span>

        <div class="pc2">33,3%</div>

        <hr>

        <small>Resultado &amp; margem atual</small>
        <span class="s" style="font-size:13px;margin-left:4px">
            R$ -9.964.132
        </span>

        <div class="pc2">-16,1%</div>
    </div>`;

// ===== RECEBIMENTOS E PAGAMENTOS =====
const mx=20;

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
                                    6,
                                    76,
                                    110,
                                    ${opacidade.toFixed(2)}
                                );
                                color:#064c6e;
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
                            ${(p[1]/5.2e6*.75).toFixed(2)}
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