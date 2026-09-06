/* ==========================================================================
   Cyber Guard — motion.
   One rule: if a movement does not carry something from disorder to order,
   it does not ship. There is exactly one large animation on this page.
   ========================================================================== */

/* ---------- the field: 23 topics, scattered, then sequenced ------------- */
(function(){
  "use strict";
  var field = document.getElementById('field');
  if(!field) return;

  /* order 0 = real topic a beginner hears about constantly, but which does not
     belong at the start. Holding them back is the point of the graphic.      */
  var TOPICS = [
    {t:"Linux",              o:1},
    {t:"Command line",       o:2},
    {t:"Networking",         o:3},
    {t:"TCP/IP",             o:4},
    {t:"DNS",                o:5},
    {t:"HTTP",               o:6},
    {t:"Recon",              o:7},
    {t:"Nmap",               o:8},
    {t:"Enumeration",        o:9},
    {t:"Web security",       o:10},
    {t:"Sessions",           o:11},
    {t:"Burp Suite",         o:12},
    {t:"XSS",                o:13},
    {t:"SQL injection",      o:14},
    {t:"Authentication",     o:15},
    {t:"Hashes",             o:16},
    {t:"Exploitation",       o:17},
    {t:"Post-exploitation",  o:18},
    {t:"Reporting",          o:19},
    {t:"OSCP",               o:0},
    {t:"CEH",                o:0},
    {t:"Bug bounty",         o:0},
    {t:"SOC analyst",        o:0}
  ];

  /* deterministic pseudo-random, so the "before" is the same disorder every
     time and can be reasoned about rather than being a lottery */
  var seed = 20260906;
  function rnd(){ seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

  var chips = TOPICS.map(function(o){
    var el = document.createElement('span');
    el.className = 'chip' + (o.o === 0 ? ' hold' : '');
    el.setAttribute('data-o', o.o);
    var n = document.createElement('span');
    n.className = 'n';
    n.textContent = o.o ? (o.o < 10 ? '0' + o.o : '' + o.o) : '—';
    el.appendChild(n);
    el.appendChild(document.createTextNode(o.t));
    field.appendChild(el);
    return el;
  });

  var spine = field.querySelector('.spine');
  var stateEl = document.getElementById('fieldstate');
  var subEl = document.getElementById('fieldsub');
  var sorted = false;

  function scatter(){
    var w = field.clientWidth, h = field.clientHeight;
    seed = 20260906;
    chips.forEach(function(el){
      var cw = el.offsetWidth || 110, ch = el.offsetHeight || 30;
      el.style.left = Math.round(rnd() * Math.max(8, w - cw - 8)) + 'px';
      el.style.top  = Math.round(rnd() * Math.max(8, h - ch - 8)) + 'px';
    });
  }

  function sort(){
    /* Two columns on anything but a phone. Nineteen stacked chips is 780px of
       column — taller than the container and taller than a reader's patience.
       Ten and nine side by side reads as a sequence and fits the frame. */
    var w = field.clientWidth;
    var narrow = w < 700;
    var x = narrow ? 42 : 70;
    var run = chips.filter(function(e){ return +e.getAttribute('data-o') > 0; })
                   .sort(function(a,b){ return a.getAttribute('data-o') - b.getAttribute('data-o'); });
    var held = chips.filter(function(e){ return +e.getAttribute('data-o') === 0; });
    var ch = chips[0].offsetHeight || 30;
    var step = ch + (narrow ? 4 : 6);
    var cols = narrow ? 1 : 2;
    var per = Math.ceil(run.length / cols);
    var colW = narrow ? 0 : Math.min(240, Math.max(180, (w - x - 30) / 2));

    var runH = step * per;
    var heldH = step * held.length;
    var need = runH + 26 + heldH + 8;
    field.style.height = Math.max(narrow ? 560 : 420, need) + 'px';

    var top = Math.max(6, (parseInt(field.style.height) - (narrow ? runH + 26 + heldH : Math.max(runH, 0) + 26 + heldH)) / 2);

    run.forEach(function(el,i){
      var c = Math.floor(i / per), r = i % per;
      el.style.left = Math.round(x + c * colW) + 'px';
      el.style.top  = Math.round(top + r * step) + 'px';
    });
    var base = top + runH + 26;
    held.forEach(function(el,i){
      el.style.left = x + 'px';
      el.style.top  = Math.round(base + i * step) + 'px';
    });

    if(spine){
      spine.style.left = (x - 15) + 'px';
      spine.style.top = Math.round(top) + 'px';
      spine.style.bottom = 'auto';
      spine.style.height = Math.round(runH) + 'px';
    }
  }

  function apply(){ sorted ? sort() : scatter(); }

  /* start scattered and visible — the page at rest is already the argument */
  requestAnimationFrame(function(){ scatter(); });

  function resolve(){
    if(sorted) return;
    sorted = true;
    field.classList.add('set');
    sort();
    if(stateEl) stateEl.textContent = '19 in sequence.';
    if(subEl)  subEl.textContent = 'Four held back — not yet, not never. That is what direction means.';
  }

  /* The scattered state IS the argument, so it has to be experienced. The
     field sits in the hero and is in view on load — resolving immediately
     would mean the reader never sees the problem. It waits for the first
     sign of engagement instead. */
  function onFirstScroll(){
    if(window.scrollY > 40){
      window.removeEventListener('scroll', onFirstScroll);
      setTimeout(resolve, 260);
    }
  }
  window.addEventListener('scroll', onFirstScroll, {passive:true});
  setTimeout(resolve, 5200);   /* and resolves on its own if they just watch */

  var rt;
  window.addEventListener('resize', function(){
    clearTimeout(rt); rt = setTimeout(apply, 150);
  }, {passive:true});
})();

/* ---------- reveals: from a visible resting state, never from nothing ---- */
(function(){
  "use strict";
  var root = document.documentElement;
  if(!('IntersectionObserver' in window)) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  var targets = ['.split .splitrow','.absences li','.loop .step','.versus .vs',
                 '.route .rstage .rbody','.ev .evc','.wall .rev','.anat .part','.creds li'];
  var els = [];
  targets.forEach(function(sel){
    Array.prototype.forEach.call(document.querySelectorAll(sel), function(el){
      el.classList.add('rv'); els.push(el);
    });
  });
  if(!els.length) return;
  root.classList.add('anim');

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {rootMargin:'0px 0px -8% 0px', threshold:.05});

  els.forEach(function(el, i){
    var r = el.getBoundingClientRect();
    if(r.top < window.innerHeight && r.bottom > 0){ el.classList.add('in'); }
    else { el.style.transitionDelay = Math.min((i % 6) * 55, 280) + 'ms'; io.observe(el); }
  });

  /* fails open: nothing stays hidden, whatever happens */
  setTimeout(function(){
    els.forEach(function(el){ el.style.transitionDelay = '0ms'; el.classList.add('in'); });
  }, 14000);
})();
