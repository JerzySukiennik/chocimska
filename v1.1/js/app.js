/* SP Chocimska: single-page app (hash routing, no dependencies). */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var R=window.SP_ROOT||'';
var IMG=function(h){return R+'media/'+h+'.webp'};
var TH=function(h){return R+'media/t/'+h+'.webp'};
var fx=function(s){return R?s.replace(/(src|href|poster)="(media|files)\//g,'$1="'+R+'$2/'):s};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var MONTHS=['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];
var fmt=function(d){var p=d.split('-');return +p[2]+' '+MONTHS[+p[1]-1]+' '+p[0]};
var flat=function(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ł/g,'l')};
var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var cache={};
var J=function(u){return cache[u]||(cache[u]=fetch(u).then(function(r){if(!r.ok)throw new Error(u);return r.json()}))};

var NAV=[
 {t:'Aktualności',h:'#/aktualnosci'},
 {t:'Rekrutacja',h:'#/rekrutacja'},
 {t:'Szkoła',k:[['o-nas','O nas'],['metodyka','Metodyka'],['profil-absolwenta','Profil absolwenta'],['zasady-ogolne','Zasady ogólne'],['zielona-szkola','Zielona szkoła'],['dzialalnosc-spoleczna','Działalność społeczna'],['zajecia-dodatkowe','Zajęcia dodatkowe'],['doradztwo-zawodowe','Doradztwo zawodowe'],['oplaty','Opłaty'],['dokumenty','Dokumenty'],['ukraina','Ukraina'],['podziekowania','Podziękowania'],['ukraina-1','Galeria']]},
 {t:'Uczniowie',k:[['plan-lekcji','Plan lekcji'],['plan-lekcji-1','Bloki'],['konsultacjeu','Konsultacje'],['dobre-praktyki','Dobre praktyki'],['dla-osmoklasistow','Dla ósmoklasistów'],['podreczniki','Podręczniki']]},
 {t:'Rodzice',k:[['godziny-dostepnosci','Godziny dostępności nauczycieli'],['pomoc-psychologiczno-pedagogiczna','Pomoc psychologiczno-pedagogiczna'],['literatura','Polecana literatura'],['catering','Catering'],['laptop','Laptop dla czwartoklasistów'],['nauczyciele','Nauczyciele'],['faq','Pytania i odpowiedzi']]},
 {t:'Programy',k:[['erasmus','Erasmus+'],['tutoring','Tutoring'],['rozowa-skrzyneczka','Różowa skrzyneczka'],['nowe-horyzonty','Nowe Horyzonty'],['jestemzsos','#JestemzSOS'],['soc','Szkoła Odpowiedzialna Cyfrowo']]},
 {t:'Kontakt',h:'#/kontakt'}
];
var TITLES={};
NAV.forEach(function(n){(n.k||[]).forEach(function(k){TITLES[k[0]]=k[1]})});
TITLES['rekrutacja']='Rekrutacja';TITLES['kontakt']='Kontakt';TITLES['aktualnosci']='Aktualności';
var GROUP={};
NAV.forEach(function(n){(n.k||[]).forEach(function(k){GROUP[k[0]]=n.t})});
var ALIAS={'rekrutacja':'rekrutacja-1'};
var THEMES={szkolny:'#1b2150',lazura:'#f6f1fa',zeszyt:'#fbfbf4',minimal:'#0b0b0c'};
var HERO='9a2fd86a9b02';
var ARCH={'podreczniki':'Informacja archiwalna z roku szkolnego 2023/2024. Szkoła zaktualizuje listę przed wdrożeniem strony.','laptop':'Informacja archiwalna z roku szkolnego 2023/2024.','jestemzsos':'Informacja archiwalna z roku szkolnego 2022/2023.','rekrutacja-1':'Terminy dotyczą naboru na rok szkolny 2026/2027. Szkoła poda nowe przed kolejnym naborem.'};

function buildNav(){
  var h='';
  NAV.forEach(function(n,i){
    if(n.h){h+='<a class="nl" href="'+n.h+'">'+n.t+'</a>';return}
    h+='<div class="grp"><button class="nl nl-b" aria-expanded="false" aria-controls="sub'+i+'">'+n.t+'<svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button><ul id="sub'+i+'">';
    n.k.forEach(function(k){h+='<li><a href="#/'+k[0]+'">'+k[1]+'</a></li>'});
    h+='</ul></div>';
  });
  $('#nav').innerHTML=h;
}
function closeMenus(except){
  $$('.grp').forEach(function(g){if(g!==except){g.classList.remove('open');$('button',g).setAttribute('aria-expanded','false')}});
}
function navEvents(){
  var nav=$('#nav');
  nav.addEventListener('click',function(e){
    var b=e.target.closest('.nl-b');
    if(b){var g=b.parentNode,o=!g.classList.contains('open');closeMenus(g);g.classList.toggle('open',o);b.setAttribute('aria-expanded',o);return}
    if(e.target.closest('a')){closeMenus();setMobile(false)}
  });
  document.addEventListener('click',function(e){if(!e.target.closest('.grp'))closeMenus()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeMenus();setMobile(false)}});
  $$('.grp').forEach(function(g){
    g.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover) and (min-width:1000px)').matches){closeMenus(g);g.classList.add('open');$('button',g).setAttribute('aria-expanded','true')}});
    g.addEventListener('mouseleave',function(){if(matchMedia('(hover:hover) and (min-width:1000px)').matches){g.classList.remove('open');$('button',g).setAttribute('aria-expanded','false')}});
  });
  $('#menuBtn').addEventListener('click',function(){setMobile(!document.body.classList.contains('menu-open'))});
}
function setMobile(o){
  document.body.classList.toggle('menu-open',o);
  $('#menuBtn').setAttribute('aria-expanded',o);
}
function markNav(r){
  $$('#nav a').forEach(function(a){a.removeAttribute('aria-current')});
  $$('#nav .grp').forEach(function(g){g.classList.remove('cur')});
  var a=$('#nav a[href="#/'+r+'"]');
  if(a){a.setAttribute('aria-current','page');var g=a.closest('.grp');if(g)g.classList.add('cur')}
}

function route(){
  var h=location.hash.replace(/^#\/?/,'').replace(/\?.*$/,'');
  var p=h.split('/');
  return {name:p[0]||'home',arg:p[1]||''};
}
var cur=null;
function go(){
  var r=route();
  var run=function(){return render(r)};
  if(document.startViewTransition&&!document.documentElement.classList.contains('a11y-still')&&!matchMedia('(prefers-reduced-motion:reduce)').matches&&cur!==null){
    document.startViewTransition(run);
  }else run();
  cur=r;
}
function setTitle(t){document.title=t?t+' · SP Chocimska':'Szkoła Podstawowa Chocimska'}
function done(r,title){
  setTitle(title);
  markNav(r.name==='aktualnosci'?'aktualnosci':r.name);
  document.body.dataset.route=r.name;
  var m=$('#main');
  if(!r.keepScroll){window.scrollTo(0,0)}
  m.focus({preventScroll:true});
  enhance(m);
  observe(m);
}

function render(r){
  var n=r.name;
  document.body.classList.remove('menu-open');
  if(n==='home')return home(r);
  if(n==='aktualnosci')return r.arg?post(r):news(r);
  if(n==='kontakt')return kontakt(r);
  if(n==='polityka-prywatnosci'||n==='cookies'||n==='dostepnosc'||n==='regulamin-serwisu')return legal(r);
  return page(r);
}

function card(p,big){
  return '<a class="card rv'+(big?' big':'')+'" href="#/aktualnosci/'+p.id+'"><span class="card-img">'+(p.c?'<img src="'+TH(p.c)+'" alt="" loading="lazy" decoding="async" width="400" height="300">':'<span class="noimg"></span>')+'</span><span class="card-b"><time datetime="'+p.d+'">'+fmt(p.d)+'</time><strong>'+esc(p.t)+'</strong><span class="ex">'+esc(p.e)+'</span></span></a>';
}

function home(r){
  return J('data/posts.json').then(function(P){
    var latest=P.slice(0,6);
    var h='';
    h+='<section class="hero"><div class="hero-media"><img src="'+IMG(HERO)+'" alt="Uczniowie i nauczyciele szkoły na plaży nad jeziorem" fetchpriority="high" width="2000" height="1125"></div><div class="deco" aria-hidden="true"><i></i><i></i><i></i></div><div class="hero-copy"><p class="eyebrow">Prywatna szkoła podstawowa · Stary Mokotów</p><h1><span>Z małą szkołą</span> <em>w wielki świat</em></h1><p class="lead">Uczymy zgodnie z podstawą programową, a do tego dokładamy własne projekty nauczycieli. Inspiruje nas pedagogika waldorfska.</p><div class="cta"><a class="btn" href="#/rekrutacja">Rekrutacja</a><a class="btn ghost" href="#/o-nas">Poznaj szkołę</a></div></div></section>';
    h+='<section class="facts" aria-label="Szkoła w liczbach"><dl>'
      +'<div class="rv"><dt>od roku</dt><dd>2011</dd><dd class="sm">wpis do RSPO nr 53020</dd></div>'
      +'<div class="rv"><dt>w klasie zwykle</dt><dd>16</dd><dd class="sm">uczniów</dd></div>'
      +'<div class="rv"><dt>budynki</dt><dd>2</dd><dd class="sm">Chocimska 5 i Kielecka 44</dd></div>'
      +'<div class="rv"><dt>klasy</dt><dd>0–8</dd><dd class="sm">od zerówki do ósmej klasy</dd></div>'
      +'</dl></section>';
    h+='<section class="sec intro"><div class="wrap two"><div class="rv"><p class="kicker">Dlaczego Chocimska</p><h2>Ważniejszy jest proces niż tempo.</h2></div><div class="prose rv" id="introText"></div></div></section>';
    h+='<section class="sec news"><div class="wrap"><div class="sec-h rv"><div><p class="kicker">Życie szkoły</p><h2>Aktualności</h2></div><a class="more" href="#/aktualnosci">Wszystkie aktualności <span aria-hidden="true">→</span></a></div><div class="cards">'+latest.map(function(p,i){return card(p,i===0)}).join('')+'</div></div></section>';
    h+='<section class="sec film"><div class="wrap"><div class="sec-h rv"><div><p class="kicker">Film</p><h2>Film o naszej szkole</h2></div></div><div class="vid rv" data-vid="f69583c4-9eab-4b7d-96d0-b2ae6fd278b8" style="--ar:1.7777777777777777"></div></div></section>';
    h+='<section class="sec quick"><div class="wrap"><ul class="tiles">'
      +tile('#/rekrutacja','Rekrutacja','Terminy, ankieta, opłaty rekrutacyjne')
      +tile('#/plan-lekcji','Plan lekcji','Klasy 1–3 oraz 4–8')
      +tile('#/dokumenty','Dokumenty','Statut, regulaminy, kalendarz')
      +tile('#/oplaty','Opłaty i stypendia','Czesne, wpisowe, fundusz stypendialny')
      +'</ul></div></section>';
    h+='<section class="sec bld"><div class="wrap"><div class="sec-h rv"><div><p class="kicker">Dwa budynki</p><h2>Młodsi i starsi uczą się osobno</h2></div></div><div class="two-c">'
      +'<article class="rv"><h3>Chocimska 5</h3><p>Klasy 0–3. Sekretariat: <a href="tel:+48224688817">+48 22 468 88 17</a>, 8:00–15:30.</p><p class="addr">00-791 Warszawa</p></article>'
      +'<article class="rv"><h3>Kielecka 44</h3><p>Klasy 4–8. Sekretariat: <a href="tel:+48228518701">+48 22 851 87 01</a>, 7:30–14:00.</p><p class="addr">02-530 Warszawa</p></article>'
      +'</div></div></section>';
    h+='<section class="sec prog"><div class="wrap"><div class="sec-h rv"><div><p class="kicker">Programy</p><h2>Nie tylko podstawa programowa</h2></div></div><ul class="chips rv">'
      +NAV[5].k.map(function(k){return '<li><a href="#/'+k[0]+'">'+k[1]+'</a></li>'}).join('')+'</ul></div></section>';
    $('#main').innerHTML=h;
    $('#introText').innerHTML='<p>Chocimska to prywatna szkoła podstawowa na Starym Mokotowie. Realizujemy podstawę programową i dokładamy do niej projekty, które wymyślają nasi nauczyciele. Wiele z nich czerpie z pedagogiki waldorfskiej.</p><p>Młodsze dzieci uczą się przez obrazy, wyobraźnię i doświadczenie. Starsze coraz częściej same szukają wiedzy, bo traktujemy ją jako narzędzie, a nie cel. Rytm dnia pomaga w obu przypadkach.</p><p>Dużo uwagi poświęcamy językom obcym, zwłaszcza angielskiemu, oraz nauce na świeżym powietrzu. Oceny nie są dla nas najważniejsze, a wynik egzaminu ósmoklasisty nie jest głównym celem. Chcemy, żeby dziecko dobrze się czuło w szkole i wyszło z niej samodzielne.</p>';
    done(r,'');
  });
}
function tile(h,t,d){return '<li class="rv"><a href="'+h+'"><strong>'+t+'</strong><span>'+d+'</span><i aria-hidden="true">→</i></a></li>'}

var NS={q:'',y:'',n:24};
function news(r){
  return J('data/posts.json').then(function(P){
    var years={};P.forEach(function(p){years[p.d.slice(0,4)]=1});
    var ys=Object.keys(years).sort().reverse();
    var h='<section class="sec pg-h"><div class="wrap"><p class="kicker">Życie szkoły</p><h1>Aktualności</h1><p class="lead">'+P.length+' wpisów od '+P[P.length-1].d.slice(0,4)+' roku: zajęcia, wyjazdy, projekty, konkursy.</p>'
     +'<div class="tools"><label class="search"><span class="sr">Szukaj w aktualnościach</span><input type="search" id="nq" placeholder="Szukaj w aktualnościach" value="'+esc(NS.q)+'" autocomplete="off"></label>'
     +'<div class="years" role="group" aria-label="Rok"><button data-y="" aria-pressed="'+(NS.y===''?'true':'false')+'">Wszystkie</button>'+ys.map(function(y){return '<button data-y="'+y+'" aria-pressed="'+(NS.y===y?'true':'false')+'">'+y+'</button>'}).join('')+'</div></div></div></section>'
     +'<section class="sec"><div class="wrap"><p class="count" id="ncount" aria-live="polite"></p><div class="cards" id="nlist"></div><div class="center"><button class="btn" id="nmore">Pokaż więcej</button></div></div></section>';
    $('#main').innerHTML=h;
    var list=function(reset){
      if(reset)NS.n=24;
      var q=flat(NS.q.trim());
      var f=P.filter(function(p){return (!NS.y||p.d.slice(0,4)===NS.y)&&(!q||flat(p.t+' '+p.e).indexOf(q)>-1)});
      $('#nlist').innerHTML=f.slice(0,NS.n).map(function(p){return card(p)}).join('')||'<p class="empty">Nic nie znaleziono. Spróbuj innego słowa albo wybierz „Wszystkie”.</p>';
      $('#ncount').textContent='Wyniki: '+f.length;
      $('#nmore').hidden=f.length<=NS.n;
      enhance($('#nlist'));observe($('#nlist'));
    };
    var t;
    $('#nq').addEventListener('input',function(e){NS.q=e.target.value;clearTimeout(t);t=setTimeout(function(){list(true)},160)});
    $('.years').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;NS.y=b.dataset.y;$$('.years button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});list(true)});
    $('#nmore').addEventListener('click',function(){NS.n+=24;list(false)});
    list(true);
    done(r,'Aktualności');
  });
}

function post(r){
  return Promise.all([J('data/posts.json'),J('data/posts/'+r.arg+'.json')]).then(function(a){
    var P=a[0],d=a[1],i=P.findIndex(function(p){return p.id===d.id});
    var nx=P[i-1],pv=P[i+1];
    var h='<article class="sec post"><div class="wrap narrow"><a class="back" href="#/aktualnosci">← Aktualności</a><time datetime="'+d.d+'">'+fmt(d.d)+'</time><h1>'+esc(d.t)+'</h1><div class="prose">'+fx(d.b)+'</div>'
     +'<nav class="pn" aria-label="Sąsiednie wpisy">'+(pv?'<a href="#/aktualnosci/'+pv.id+'" rel="prev"><span>Starszy wpis</span>'+esc(pv.t)+'</a>':'<span></span>')+(nx?'<a href="#/aktualnosci/'+nx.id+'" rel="next"><span>Nowszy wpis</span>'+esc(nx.t)+'</a>':'<span></span>')+'</nav></div></article>';
    $('#main').innerHTML=h;
    done(r,d.t);
  }).catch(function(){notFound(r)});
}

function notFound(r){
  $('#main').innerHTML='<section class="sec pg-h"><div class="wrap narrow"><p class="kicker">Błąd 404</p><h1>Nie ma takiej strony</h1><p class="lead">Adres mógł się zmienić. Wróć na <a href="#/">stronę główną</a> albo zajrzyj do <a href="#/aktualnosci">aktualności</a>.</p></div></section>';
  done(r,'Nie znaleziono');
}

function page(r){
  var slug=ALIAS[r.name]||r.name;
  return J('data/pages.json').then(function(pg){
    if(!pg[slug]||slug==='home'||slug==='aktualnosci'||slug==='kontakt')return notFound(r);
    var title=TITLES[r.name]||TITLES[slug]||slug;
    var d=document.createElement('div');d.innerHTML=fx(pg[slug]);
    var f=d.firstElementChild;
    if(f&&/^H[1-6]$/.test(f.tagName)&&flat(f.textContent).replace(/[^a-z0-9]/g,'').indexOf(flat(title).replace(/[^a-z0-9]/g,'').slice(0,6))===0&&f.textContent.length<70)f.remove();
    var grp=GROUP[slug]||(slug==='rekrutacja-1'?'Rekrutacja':'');
    var h='<section class="sec pg-h"><div class="wrap narrow">'+(grp?'<p class="kicker">'+grp+'</p>':'')+'<h1>'+esc(title)+'</h1></div></section><section class="sec pg-b"><div class="wrap narrow">'+(ARCH[slug]?'<p class="note">'+ARCH[slug]+'</p>':'')+'<div class="prose pg-'+slug+'">'+d.innerHTML.replace(/\n\s*\n+/g,'\n')+'</div>'+(slug==='rekrutacja-1'?'<div class="cta-box"><strong>Masz pytania o rekrutację?</strong><span>Napisz na <a href="mailto:rekrutacja@chocimska.edu.pl">rekrutacja@chocimska.edu.pl</a> lub zadzwoń do sekretariatu.</span></div>':'')+'</div></section>';
    $('#main').innerHTML=h;
    if(slug==='faq')faq();
    done(r,title);
  });
}
function faq(){
  var p=$('.prose.pg-faq');var out=document.createElement('div');out.className='faq';
  var cur=null;
  $$(':scope > *',p).forEach(function(e){
    if(/^H[34]$/.test(e.tagName)){cur=document.createElement('details');var s=document.createElement('summary');s.textContent=e.textContent;cur.appendChild(s);out.appendChild(cur)}
    else if(cur)cur.appendChild(e.cloneNode(true));
  });
  if(out.children.length)p.replaceChildren(out);
}

function kontakt(r){
  var h='<section class="sec pg-h"><div class="wrap"><p class="kicker">Kontakt</p><h1>Napisz lub zadzwoń</h1><p class="lead">Szkoła Podstawowa Chocimska prowadzona jest przez spółkę Szkoła Podstawowa Chocimska I sp. z o.o. Wpis do RSPO od 1.9.2011 pod nr 53020.</p></div></section>'
   +'<section class="sec"><div class="wrap"><div class="two-c">'
   +'<article class="rv bcard"><p class="kicker">Klasy 0–3</p><h2>Chocimska 5</h2><address>ul. Chocimska 5<br>00-791 Warszawa</address><dl><dt>Telefon</dt><dd><a href="tel:+48224688817">+48 22 468 88 17</a><br><span>8:00–15:30</span></dd></dl><a class="more" href="https://www.openstreetmap.org/search?query=Chocimska%205%20Warszawa" target="_blank" rel="noopener">Pokaż na mapie <span aria-hidden="true">↗</span></a></article>'
   +'<article class="rv bcard"><p class="kicker">Klasy 4–8</p><h2>Kielecka 44</h2><address>ul. Kielecka 44<br>02-530 Warszawa</address><dl><dt>Telefon</dt><dd><a href="tel:+48228518701">+48 22 851 87 01</a><br><span>7:30–14:00</span></dd></dl><a class="more" href="https://www.openstreetmap.org/search?query=Kielecka%2044%20Warszawa" target="_blank" rel="noopener">Pokaż na mapie <span aria-hidden="true">↗</span></a></article>'
   +'</div><div class="mail rv"><div><p class="kicker">E-mail</p><a href="mailto:szkola@spchocimska.edu.pl">szkola@spchocimska.edu.pl</a></div><div><p class="kicker">Rekrutacja</p><a href="mailto:rekrutacja@chocimska.edu.pl">rekrutacja@chocimska.edu.pl</a></div><div><p class="kicker">Konto szkoły</p><span class="mono">56 1090 1043 0000 0001 2253 9652</span></div></div>'
   +'<p class="small rv">Mapy otwierają się w OpenStreetMap, dopiero po kliknięciu. Nie wczytujemy żadnych map zewnętrznych w tle.</p></div></section>';
  $('#main').innerHTML=h;
  done(r,'Kontakt');
}

function legal(r){
  var L=window.LEGAL&&window.LEGAL[r.name];
  if(!L)return notFound(r);
  $('#main').innerHTML='<section class="sec pg-h"><div class="wrap narrow"><p class="kicker">Informacje prawne</p><h1>'+L.t+'</h1><p class="small">'+L.upd+'</p></div></section><section class="sec pg-b"><div class="wrap narrow"><div class="prose legal">'+L.b+'</div></div></section>';
  done(r,L.t);
}

function footer(){
  var P=[['Liceum Miodowa','liceumchocimska.edu.pl','https://www.liceumchocimska.edu.pl'],['Liceum Chocimska Nova','chocimskanova.edu.pl','https://chocimskanova.edu.pl/'],['Przedszkole Raz Dwa Trzy My!','razdwatrzymy.edu.pl','http://www.razdwatrzymy.edu.pl'],['Szkoła Rozwojowa','terapeutyczna.chocimska.edu.pl','https://www.terapeutyczna.chocimska.edu.pl'],['Centrum Terapii i Rozwoju','seedscare.pl','https://seedscare.pl']];
  var ph='<section class="partners" aria-labelledby="partT"><div class="wrap"><p class="kicker">Współpracujemy z</p><h2 id="partT">Inne placówki wokół Chocimskiej</h2><ul>'+P.map(function(p){return '<li><a href="'+p[2]+'" target="_blank" rel="noopener"><strong>'+p[0]+'</strong><span>'+p[1]+' <i aria-hidden="true">↗</i></span></a></li>'}).join('')+'</ul></div></section>';
  $('#foot').innerHTML=ph+'<div class="wrap"><div class="foot-g">'
   +'<div><img class="flogo" src="img/logo.png" alt="Szkoła Podstawowa Chocimska" width="1137" height="222"><p class="small">Szkoła Podstawowa Chocimska I sp. z o.o.<br>Wpis do RSPO od 1.9.2011, nr 53020<br>Konto: 56 1090 1043 0000 0001 2253 9652</p></div>'
   +'<div><h2>Kontakt</h2><p>ul. Chocimska 5, 00-791 Warszawa<br><a href="tel:+48224688817">+48 22 468 88 17</a></p><p>ul. Kielecka 44, 02-530 Warszawa<br><a href="tel:+48228518701">+48 22 851 87 01</a></p><p><a href="mailto:szkola@spchocimska.edu.pl">szkola@spchocimska.edu.pl</a></p></div>'
   +'<div><h2>Szybkie linki</h2><ul><li><a href="#/rekrutacja">Rekrutacja</a></li><li><a href="#/dokumenty">Dokumenty i statut</a></li><li><a href="#/plan-lekcji">Plan lekcji</a></li><li><a href="#/oplaty">Opłaty</a></li><li><a href="#/faq">Pytania i odpowiedzi</a></li></ul></div>'
   +'<div><h2>Informacje prawne</h2><ul><li><a href="#/polityka-prywatnosci">Polityka prywatności</a></li><li><a href="#/cookies">Cookies i pamięć przeglądarki</a></li><li><a href="#/dostepnosc">Deklaracja dostępności</a></li><li><button class="lnk" data-open="privacy">Ustawienia prywatności</button></li><li><button class="lnk" data-open="a11y">Ustawienia dostępności</button></li></ul></div>'
   +'</div><div class="foot-b"><p class="soc"><a href="https://www.facebook.com/spchocimska" target="_blank" rel="noopener">Facebook</a> · <a href="https://www.instagram.com/sp_chocimska" target="_blank" rel="noopener">Instagram</a> · <a href="https://rspo.gov.pl/rspo/53020" target="_blank" rel="noopener">Szkoła w rejestrze RSPO</a></p></div></div>';
  document.addEventListener('click',function(e){var b=e.target.closest('[data-open]');if(b)$('#'+b.dataset.open).showModal()});
}

function enhance(root){
  $$('.prose ul',root).forEach(function(u){if(u.querySelector(':scope > li > img'))u.classList.add('people')});
  $$('.prose a[href^="files/"]',root).forEach(function(a){a.classList.add('file');a.dataset.ext=(a.getAttribute('href').split('.').pop()||'').toLowerCase().slice(0,4)});
  $$('.prose table',root).forEach(function(t){if(!t.parentNode.classList.contains('tw')){var w=document.createElement('div');w.className='tw';t.parentNode.insertBefore(w,t);w.appendChild(t)}});
  $$('.gal img',root).forEach(function(i){var m=i.getAttribute('src').match(/media\/(\w+)\.webp/);if(m&&!i.dataset.full){i.dataset.full=i.getAttribute('src');i.src=TH(m[1]);i.removeAttribute('width');i.removeAttribute('height')}});
  $$('.prose img',root).forEach(function(i){i.tabIndex=0;i.setAttribute('role','button');if(!i.alt)i.alt='Zdjęcie ze szkolnej galerii (powiększ)'});
  $$('.yt:not([data-ok])',root).forEach(ytFacade);
  $$('.vid:not([data-ok])',root).forEach(vidFacade);
}
function ytFacade(el){
  el.dataset.ok=1;var id=el.dataset.yt;
  var load=function(){el.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="Film z YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>'};
  el.innerHTML='<div class="yt-card"><span class="yt-ic" aria-hidden="true">▶</span><strong>Film z YouTube</strong><span class="yt-t">Po kliknięciu YouTube może zapisać własne pliki cookie i zobaczyć Twój adres IP. Do tego momentu nic nie jest ładowane.</span><span class="yt-a"><button class="btn">Odtwórz film</button><a href="https://www.youtube.com/watch?v='+id+'" target="_blank" rel="noopener">Otwórz w YouTube</a></span></div>';
  $('button',el).addEventListener('click',load);
  if(store.get('sp-yt')==='1')$('.yt-t',el).textContent='Ustawiłeś(-aś) automatyczne ładowanie filmów po kliknięciu.';
}
function vidFacade(el){
  el.dataset.ok=1;var id=el.dataset.vid;
  el.innerHTML='<video controls preload="none" playsinline poster="'+R+'media/v/'+id+'.jpg"><source src="'+R+'media/v/'+id+'.mp4" type="video/mp4"></video>';
  $('source',el).addEventListener('error',function(){el.remove()});
}

var io;
function observe(root){
  var els=$$('.rv:not(.in)',root);
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
  if(!io)io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.05});
  els.forEach(function(e){io.observe(e)});
}

var LB={set:[],i:0};
function lbOpen(img){
  var scope=img.closest('.prose')||img.parentNode;
  LB.set=$$('img',scope).map(function(i){return {s:i.dataset.full||i.currentSrc||i.src,a:i.alt}});
  LB.i=$$('img',scope).indexOf(img);
  lbShow();$('#lightbox').showModal();
}
function lbShow(){
  var d=LB.set[LB.i];if(!d)return;
  var im=$('#lightbox img');im.src=d.s;im.alt=d.a;
  $('#lightbox figcaption').textContent=(LB.i+1)+' / '+LB.set.length;
  var n=LB.set[LB.i+1];if(n){var pre=new Image();pre.src=n.s}
  $('.lb-p').hidden=$('.lb-n').hidden=LB.set.length<2;
}
function lbStep(d){LB.i=(LB.i+d+LB.set.length)%LB.set.length;lbShow()}
function lightbox(){
  var lb=$('#lightbox');
  document.addEventListener('click',function(e){var i=e.target.closest('.prose img');if(i)lbOpen(i)});
  document.addEventListener('keydown',function(e){
    if(e.target.matches&&e.target.matches('.prose img')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();lbOpen(e.target)}
    if(!lb.open)return;
    if(e.key==='ArrowRight')lbStep(1);
    if(e.key==='ArrowLeft')lbStep(-1);
  });
  $('.lb-x').addEventListener('click',function(){lb.close()});
  $('.lb-p').addEventListener('click',function(){lbStep(-1)});
  $('.lb-n').addEventListener('click',function(){lbStep(1)});
  lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});
  var x0=null;
  lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)lbStep(dx<0?1:-1);x0=null});
}

function themes(){
  var set=function(t,anim){
    var apply=function(){
      document.documentElement.dataset.theme=t;store.set('sp-theme',t);
      $$('#themebar button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.t===t)});
      $('meta[name=theme-color]').content=THEMES[t];
    };
    if(anim&&document.startViewTransition&&!document.documentElement.classList.contains('a11y-still')&&!matchMedia('(prefers-reduced-motion:reduce)').matches)document.startViewTransition(apply);else apply();
  };
  $('#themebar').addEventListener('click',function(e){var b=e.target.closest('button');if(b)set(b.dataset.t,true)});
  set(document.documentElement.dataset.theme,false);
}

function a11y(){
  var s=JSON.parse(store.get('sp-a11y')||'{}');
  var map={aBig:['big','a11y-big'],aContrast:['contrast','a11y-contrast'],aStill:['still','a11y-still']};
  Object.keys(map).forEach(function(id){
    var c=$('#'+id);c.checked=!!s[map[id][0]];
    c.addEventListener('change',function(){s[map[id][0]]=c.checked;document.documentElement.classList.toggle(map[id][1],c.checked);store.set('sp-a11y',JSON.stringify(s))});
  });
  var y=$('#ytAlways');y.checked=store.get('sp-yt')==='1';
  y.addEventListener('change',function(){store.set('sp-yt',y.checked?'1':'0')});
  $$('dialog.dlg').forEach(function(d){d.addEventListener('click',function(e){if(e.target===d)d.close()})});
}

function notice(){
  if(store.get('sp-notice')==='1')return;
  var n=document.createElement('div');n.className='notice';n.setAttribute('role','region');n.setAttribute('aria-label','Informacja o cookies');
  n.innerHTML='<p><strong>Cookies i prywatność.</strong> Ta strona nie używa reklam ani analityki. Zapisujemy w przeglądarce tylko wybrany wygląd i ustawienia dostępności, a filmy z YouTube włączają się dopiero po kliknięciu. <a href="#/cookies">Szczegóły</a></p><div class="notice-a"><button class="btn" data-ok>Rozumiem</button><button class="btn ghost" data-set>Ustawienia</button></div>';
  document.body.appendChild(n);
  requestAnimationFrame(function(){n.classList.add('in')});
  var close=function(){store.set('sp-notice','1');n.classList.remove('in');setTimeout(function(){n.remove()},400)};
  $('[data-ok]',n).addEventListener('click',close);
  $('[data-set]',n).addEventListener('click',function(){$('#privacy').showModal()});
  $('#privacy').addEventListener('close',function(){if(document.body.contains(n))close()});
}
function progress(){
  var bar=$('.progress i'),t=false;
  var u=function(){t=false;var h=document.documentElement.scrollHeight-innerHeight;var p=h>0?Math.min(1,scrollY/h):0;document.documentElement.style.setProperty('--p',p.toFixed(4));bar.style.transform='scaleX('+p+')'};
  addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(u)}},{passive:true});
  var top=$('#top');
  addEventListener('scroll',function(){top.classList.toggle('stuck',scrollY>40)},{passive:true});
}

document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.closest('#main')){var p=t.parentNode;t.remove();if(p&&p.classList&&p.classList.contains('card-img'))p.classList.add('empty-img')}},true);
notice();
buildNav();navEvents();footer();themes();a11y();lightbox();progress();
addEventListener('hashchange',go);
go();
})();
