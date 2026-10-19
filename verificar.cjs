// Executa a lógica real do HTML com um DOM mínimo, sem instalar dependências.
// Não substitui uma inspeção visual em navegador.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const json=html.match(/<script id="dataset" type="application\/json">([\s\S]*?)<\/script>/)[1];
const script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const data=JSON.parse(json),elements={};
for(const id of ['dataset','familia','grupoStatus','modelo','estado','cidade','anoVenda','anoModelo','pagamento','incluirCancelados','revenue','count','ticket','states','countNote','filterSummary','models','markets','payments','modelInsight','marketInsight','paymentInsight','invalidCount','qualityText','rows','reset','export'])elements[id]={value:'',checked:false,textContent:id==='dataset'?json:'',innerHTML:'',events:{},addEventListener(k,fn){this.events[k]=fn;}};
const ctx=vm.createContext({document:{getElementById:id=>elements[id]},Intl,Set,Map,console});
vm.runInContext(script,ctx);
const run=code=>vm.runInContext(code,ctx);
assert.equal(data.length,100);
assert.ok(data.every(r=>!('milhas' in r)));
assert.ok(data.every(r=>r.familia===r.modelo.split(' ')[0]));
assert.ok(data.every(r=>r.grupoStatus===(r.status==='Delivered'?'Entregue':r.status==='Cancelled'?'Cancelada':'Em andamento')));
assert.equal(run('total(DATA)'),12827800.5);
assert.equal(data.filter(r=>!r.data).length,24);
assert.equal(Number(elements.count.textContent),93);
assert.equal(run('total(current)'),data.filter(r=>r.status!=='Cancelled').reduce((s,r)=>s+Math.round(r.preco*100),0)/100);
elements.incluirCancelados.checked=true;run('render()');assert.equal(Number(elements.count.textContent),100);
assert.equal(run('total(current)'),12827800.5);
elements.estado.value='CA';run('render()');assert.equal(Number(elements.count.textContent),16);
assert.equal(run('total(current)'),data.filter(r=>r.estado==='CA').reduce((s,r)=>s+Math.round(r.preco*100),0)/100);
elements.anoVenda.value='Data inválida';run('render()');assert.equal(Number(elements.count.textContent),data.filter(r=>r.estado==='CA'&&!r.data).length);
elements.estado.value='XX';run('render()');assert.equal(Number(elements.count.textContent),0);assert.equal(elements.ticket.textContent,'—');assert.ok(!elements.payments.innerHTML.includes('NaN'));
elements.reset.events.click();assert.equal(Number(elements.count.textContent),93);
for(const key of ['familia','grupoStatus','modelo','estado','cidade','anoVenda','anoModelo','pagamento']){
 for(const v of new Set(data.map(r=>key==='anoVenda'?(r.data?r.data.slice(0,4):'Data inválida'):r[key]))){
  elements[key].value=String(v);run('render()');
  const expected=data.filter(r=>r.status!=='Cancelled'&&String(key==='anoVenda'?(r.data?r.data.slice(0,4):'Data inválida'):r[key])===String(v));
  assert.equal(Number(elements.count.textContent),expected.length);
  assert.equal(run('total(current)'),expected.reduce((s,r)=>s+Math.round(r.preco*100),0)/100);
  for(const dim of ['modelo','estado','pagamento'])assert.ok(Math.abs(run('grouped(current,"'+dim+'","valor").reduce((s,x)=>s+x.value,0)')-run('total(current)'))<0.001);
 }
 elements[key].value='';
}
assert.ok(!html.includes('customer_name'));assert.ok(!html.includes('salesperson'));
console.log('OK: 100 registros; total USD 12.827.800,50; 24 datas inválidas; 7 cancelados.');
console.log('OK: padrão sem cancelados; todas as opções dos oito filtros; totais e gráficos conciliados; recorte vazio; limpeza de filtros.');
console.log('Limite: DOM simulado. Layout, download CSV e interação visual precisam de conferência em navegador.');
