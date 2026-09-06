/* ==========================================================================
   Anil Yadav — motion.
   Two moments only, both narrative:
     · the twenty-three things he had to order for himself, finding their order
     · the line of his journey drawing itself, then fanning out to its audience
   Everything else fades in from a visible resting state and stays put.
   ========================================================================== */

/* ---------- the field ---------------------------------------------------- */
(function(){
  "use strict";
  var field = document.getElementById('field');
  if(!field) return;

  /* order 0 = things a beginner hears constantly that do not belong at the
     start. He reached them eventually. Not first. */
  var TOPICS = [
    {t:"Linux",o:1},{t:"Command line",o:2},{t:"Networking",o:3},{t:"TCP/IP",o:4},
    {t:"DNS",o:5},{t:"HTTP",o:6},{t:"Recon",o:7},{t:"Nmap",o:8},{t:"Enumeration",o:9},
    {t:"Web security",o:10},{t:"Sessions",o:11},{t:"Burp Suite",o:12},{t:"XSS",o:13},
    {t:"SQL injection",o:14},{t:"Authentication",o:15},{t:"Hashes",o:16},
    {t:"Exploitation",o:17},{t:"Post-exploitation",o:18},{t:"Reporting",o:19},
    {t:"OSCP",o:0},{t:"CEH",o:0},{t:"Bug bounty",o:0},{t:"SOC analyst",o:0}
  ];

  var seed = 20260906;
  function rnd(){ seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed/0x7fffffff; }

  var chips = TOPICS.map(function(o){
    var el = document.createElement('span');
    el.className = 'chip' + (o.o === 0 ? ' hold' : '');
    el.setAttribute('data-o', o.o);
    var n = document.createElement('span');
    n.className = 'n';
    n.textContent = o.o ? (o.o < 10 ? '0'+o.o : ''+o.o) : '—';
    el.appendChild(n);
    el.appendChild(document.createTextNode(o.t));
    field.appendChild(el);
    return el;
  });

  var spine  = field.querySelector('.spine');
  var stateEl = document.getElementById('fstate');
  var subEl   = document.getElementById('fsub');
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
    var w = field.clientWidth, narrow = w < 700;
    var x = narrow ? 42 : 70;
    var run = chips.filter(function(e){ return +e.getAttribute('data-o') > 0; })
                   .sort(function(a,b){ return a.getAttribute('data-o') - b.getAttribute('data-o'); });
    var held = chips.filter(function(e){ return +e.getAttribute('data-o') === 0; });
    var ch = chips[0].offsetHeight || 30;
    var step = ch + (narrow ? 4 : 6);
    var per = narrow ? run.length : Math.ceil(run.length / 2);
    var colW = narrow ? 0 : Math.min(250, Math.max(180, (w - x - 40) / 2));
    var runH = step * per, heldH = step * held.length;

    field.style.height = Math.max(narrow ? 560 : 420, runH + 28 + heldH + 10) + 'px';
    var top = Math.max(6, (parseInt(field.style.height) - (runH + 28 + heldH)) / 2);

    run.forEach(function(el,i){
      var c = Math.floor(i/per), r = i % per;
      el.style.left = Math.round(x + c*colW) + 'px';
      el.style.top  = Math.round(top + r*step) + 'px';
    });
    var base = top + runH + 28;
    held.forEach(function(el,i){
      el.style.left = x + 'px';
      el.style.top  = Math.round(base + i*step) + 'px';
    });
    if(spine){
      spine.style.left = (x-15)+'px';
      spine.style.top = Math.round(top)+'px';
      spine.style.height = Math.round(runH)+'px';
    }
  }

  requestAnimationFrame(scatter);

  function resolve(){
    if(sorted) return;
    sorted = true;
    field.classList.add('set');
    sort();
    if(stateEl) stateEl.textContent = 'Nineteen, in the order he found.';
    if(subEl)   subEl.textContent   = 'Four he reached later — not first. Working that out took years.';
  }

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ setTimeout(resolve, 900); io.disconnect(); } });
    }, {threshold:.4});
    io.observe(field);
    setTimeout(resolve, 12000);
  } else {
    setTimeout(resolve, 1200);
  }

  var rt;
  window.addEventListener('resize', function(){
    clearTimeout(rt); rt = setTimeout(function(){ sorted ? sort() : scatter(); }, 150);
  }, {passive:true});
})();

/* ---------- the journey line draws itself -------------------------------- */
(function(){
  "use strict";
  var sig = document.getElementById('sig');
  if(!sig) return;
  var path = document.getElementById('sigpath');
  /* a custom property needs a string with a unit; a bare number is dropped
     silently and the dash animation never arms */
  if(path && typeof path.getTotalLength === 'function'){
    try{
      var len = Math.ceil(path.getTotalLength());
      if(len > 0){ path.style.setProperty('--len', len + 'px'); }
    }catch(e){}
  }
  function go(){ sig.classList.add('go'); }
  if(!('IntersectionObserver' in window) ||
     (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches)){
    go(); return;
  }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ go(); io.disconnect(); } });
  }, {threshold:.3});
  io.observe(sig);
  setTimeout(go, 4000);   /* never leave the journey undrawn */
})();

/* ---------- reveals ------------------------------------------------------ */
(function(){
  "use strict";
  var root = document.documentElement;
  if(!('IntersectionObserver' in window)) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  var els = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  if(!els.length) return;
  root.classList.add('anim');

  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {rootMargin:'0px 0px -8% 0px', threshold:.05});

  els.forEach(function(el,i){
    var r = el.getBoundingClientRect();
    if(r.top < window.innerHeight * 1.3 && r.bottom > 0){ el.classList.add('in'); }
    else { el.style.transitionDelay = Math.min((i % 6) * 55, 280) + 'ms'; io.observe(el); }
  });

  /* a sweep on scroll, so nothing depends on the observer alone */
  function sweep(){
    els.forEach(function(el){
      if(!el.classList.contains('in') &&
         el.getBoundingClientRect().top < window.innerHeight * 1.3){ el.classList.add('in'); }
    });
  }
  window.addEventListener('scroll', sweep, {passive:true});
  window.addEventListener('pageshow', sweep);
  document.addEventListener('visibilitychange', sweep);

  setTimeout(function(){
    els.forEach(function(el){ el.style.transitionDelay='0ms'; el.classList.add('in'); });
  }, 6000);
})();
