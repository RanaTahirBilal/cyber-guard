/* ==========================================================================
   Anil Yadav — sixteen scenes. Motion budget, and what each piece is for.

     the trace     · continuous. tells you where you are in the film.
     S06 scatter   · the shape of not knowing. does NOT resolve here.
     S07 fragments · a year compressed. accumulation, not triumph.
     S09 the line  · the signal from S01, revealed as a route.
     S11 the rings · one person becoming a number.
     S12 the sort  · S06 resolving, six scenes later. the payoff.

   Nothing else moves. Every animation has a fallback timer, because a
   scene that never arrives is worse than a scene that arrives unanimated.
   ========================================================================== */
(function(){
"use strict";

var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var HAS_IO  = 'IntersectionObserver' in window;

/* fire `fn` when `el` scrolls into view — with a guaranteed fallback */
function once(el, fn, threshold, fallbackMs){
  if(!el) return;
  if(REDUCED || !HAS_IO){ fn(); return; }
  var done = false;
  function go(){ if(done) return; done = true; fn(); }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ go(); io.disconnect(); } });
  }, {threshold: threshold || .25});
  io.observe(el);
  setTimeout(go, fallbackMs || 9000);
}

/* ---------- THE TRACE ---------------------------------------------------- */
(function(){
  var scenes = [].slice.call(document.querySelectorAll('.scene[data-scene]'));
  var fill = document.getElementById('tfill');
  var bar  = document.getElementById('tbar');
  var host = document.getElementById('tnodes');
  var nav  = document.getElementById('nav');
  if(!scenes.length) return;

  var nodes = [];
  if(host){
    scenes.forEach(function(s){
      var a = document.createElement('a');
      a.className = 'tnode';
      a.setAttribute('data-n', s.getAttribute('data-scene'));
      a.setAttribute('aria-hidden','true');
      a.setAttribute('tabindex','-1');
      a.href = s.id ? '#'+s.id : '#';
      host.appendChild(a);
      nodes.push({el:a, sec:s});
    });
  }

  /* the rail is a map of the document, so a node sits where its scene sits */
  function place(){
    var docH = document.documentElement.scrollHeight;
    var railH = window.innerHeight;
    if(docH <= 0) return;
    nodes.forEach(function(n){
      var mid = n.sec.offsetTop + n.sec.offsetHeight/2;
      n.el.style.top = Math.round((mid/docH) * railH) + 'px';
    });
  }

  var queued = false;
  function update(){
    queued = false;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    if(fill) fill.style.height = (p * window.innerHeight) + 'px';
    if(bar)  bar.style.width = (p * 100) + '%';
    if(nav)  nav.classList.toggle('lit', window.scrollY > 40);

    var mid = window.scrollY + window.innerHeight * 0.42, active = -1;
    nodes.forEach(function(n,i){
      var top = n.sec.offsetTop, bot = top + n.sec.offsetHeight;
      if(mid >= top && mid < bot) active = i;
    });
    nodes.forEach(function(n,i){
      n.el.classList.toggle('on', i === active);
      n.el.classList.toggle('past', active > -1 && i < active);
    });
  }

  place(); update();
  window.addEventListener('scroll', function(){
    if(!queued){ queued = true; requestAnimationFrame(update); }
  }, {passive:true});
  var rt;
  window.addEventListener('resize', function(){
    clearTimeout(rt); rt = setTimeout(function(){ place(); update(); }, 140);
  }, {passive:true});
  window.addEventListener('load', function(){ place(); update(); });
  /* images settling changes the document height, so re-place once they land */
  setTimeout(function(){ place(); update(); }, 1200);
  setTimeout(function(){ place(); update(); }, 3500);
})();

/* ---------- S06 / S12 — the twenty-three things ------------------------- */
/* The same list, rendered twice. Scattered in S06 (the problem), sequenced in
   S12 (the answer). Six scenes apart, which is the entire point — the reader
   has to hold the confusion long enough to feel the relief. */
(function(){
  var field  = document.getElementById('field');
  var sorted = document.getElementById('sorted');
  if(!field && !sorted) return;

  /* order 0 = things a beginner is told to chase that do not belong at the
     start. He reached them eventually. Not first. */
  var TOPICS = [
    {t:"Linux",o:1},{t:"Command line",o:2},{t:"Networking",o:3},{t:"TCP/IP",o:4},
    {t:"DNS",o:5},{t:"HTTP",o:6},{t:"Recon",o:7},{t:"Nmap",o:8},{t:"Enumeration",o:9},
    {t:"Web security",o:10},{t:"Sessions",o:11},{t:"Burp Suite",o:12},{t:"XSS",o:13},
    {t:"SQL injection",o:14},{t:"Authentication",o:15},{t:"Hashes",o:16},
    {t:"Exploitation",o:17},{t:"Post-exploitation",o:18},{t:"Reporting",o:19},
    {t:"OSCP",o:0},{t:"CEH",o:0},{t:"Bug bounty",o:0},{t:"SOC analyst",o:0}
  ];

  function chip(o, cls){
    var el = document.createElement('span');
    el.className = 'chip' + (o.o === 0 ? ' hold' : '') + (cls ? ' '+cls : '');
    var n = document.createElement('span');
    n.className = 'n';
    n.textContent = o.o ? (o.o < 10 ? '0'+o.o : ''+o.o) : '—';
    el.appendChild(n);
    el.appendChild(document.createTextNode(o.t));
    return el;
  }

  /* ---- S06: the scatter. It never resolves here. ---- */
  if(field){
    var seed = 20260907;
    function rnd(){ seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed/0x7fffffff; }

    var loose = TOPICS.map(function(o){
      var el = chip(o);
      field.appendChild(el);
      return el;
    });

    function scatter(){
      var w = field.clientWidth, h = field.clientHeight;
      seed = 20260907;
      loose.forEach(function(el){
        var cw = el.offsetWidth || 110, ch = el.offsetHeight || 30;
        el.style.left = Math.round(rnd() * Math.max(8, w - cw - 8)) + 'px';
        el.style.top  = Math.round(rnd() * Math.max(8, h - ch - 8)) + 'px';
      });
    }
    requestAnimationFrame(scatter);
    var st;
    window.addEventListener('resize', function(){
      clearTimeout(st); st = setTimeout(scatter, 150);
    }, {passive:true});
  }

  /* ---- S12: the same twenty-three, in sequence. The payoff. ---- */
  if(sorted){
    var run = TOPICS.filter(function(o){ return o.o > 0; })
                    .sort(function(a,b){ return a.o - b.o; });
    var held = TOPICS.filter(function(o){ return o.o === 0; });

    var flow = document.createElement('div');
    flow.className = 'sortrun';
    run.forEach(function(o,i){
      var el = chip(o, 'seq');
      el.style.transitionDelay = Math.min(i*45, 900) + 'ms';
      flow.appendChild(el);
    });
    sorted.appendChild(flow);

    var rule = document.createElement('p');
    rule.className = 'sortrule mono';
    rule.textContent = 'reached later';
    sorted.appendChild(rule);

    var late = document.createElement('div');
    late.className = 'sortlate';
    held.forEach(function(o,i){
      var el = chip(o, 'seq');
      el.style.transitionDelay = (900 + i*60) + 'ms';
      late.appendChild(el);
    });
    sorted.appendChild(late);

    once(sorted, function(){ sorted.classList.add('go'); }, .18, 12000);
  }
})();

/* ---------- S07 — a year, compressed ------------------------------------ */
(function(){
  var host = document.getElementById('frags');
  if(!host) return;

  var BITS = [
    ['ifconfig',0],['02:41',1],['attempt 12',0],['nmap -sV',0],['no reply',0],
    ['chmod +x',0],['read it again',1],['404 pages of docs',0],['still wrong',0],
    ['03:15',1],['try the other flag',0],['man tcpdump',0],['it worked',1],
    ['rebuild the lab',0],['subnet mask',0],['why',1],['attempt 40',0],
    ['one more hour',1],['grep -r',0],['start over',0],['01:58',1],['permission denied',0]
  ];

  var seed = 71;
  function rnd(){ seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed/0x7fffffff; }

  var els = BITS.map(function(b){
    var el = document.createElement('span');
    el.className = 'frag' + (b[1] ? ' hot' : '');
    el.textContent = b[0];
    el.style.opacity = '0';
    host.appendChild(el);
    return el;
  });

  /* rows with occupancy tracking, so two fragments never land on top of each
     other. The jitter inside each row keeps it reading as scatter, not a table. */
  function place(){
    var w = host.clientWidth, h = host.clientHeight;
    if(w <= 0) return;
    seed = 71;

    var rowH = 34;
    var band = Math.max(rowH * 3, h * 0.44);   /* the copy owns the bottom half */
    var rows = Math.max(3, Math.floor(band / rowH));
    var used = [];
    for(var i = 0; i < rows; i++) used.push(0);

    els.forEach(function(el){
      var ew = el.offsetWidth || 90;
      var best = -1, bestFree = -1;
      for(var t = 0; t < 5; t++){                  /* a few candidates, take the roomiest */
        var r = Math.floor(rnd() * rows);
        var free = w - used[r];
        if(free > bestFree){ bestFree = free; best = r; }
      }
      var x = used[best] + 14 + Math.round(rnd() * 44);
      if(x + ew > w - 8){                          /* row full — wrap to the emptiest */
        best = used.indexOf(Math.min.apply(null, used));
        x = used[best] + 14;
      }
      if(x + ew > w - 8) x = Math.max(6, w - ew - 8);
      used[best] = x + ew;
      el.style.left = Math.round(x) + 'px';
      el.style.top  = Math.round(8 + best * rowH + rnd() * 7) + 'px';
    });
  }
  function reveal(){
    els.forEach(function(el,i){
      el.style.transition = 'opacity .9s ease ' + Math.min(i*62, 1300) + 'ms';
      el.style.opacity = '1';
    });
  }

  requestAnimationFrame(place);
  once(host, reveal, .2, 9000);

  var rt;
  window.addEventListener('resize', function(){
    clearTimeout(rt); rt = setTimeout(place, 160);
  }, {passive:true});
})();

/* ---------- S09 — the line draws itself --------------------------------- */
(function(){
  var sig = document.getElementById('sig');
  if(!sig) return;
  var path = document.getElementById('sigpath');
  /* a custom property needs a UNIT. a bare number is dropped silently and
     the dash animation never arms — this cost an hour once. */
  if(path && typeof path.getTotalLength === 'function'){
    try{
      var len = Math.ceil(path.getTotalLength());
      if(len > 0) path.style.setProperty('--len', len + 'px');
    }catch(e){}
  }
  once(sig, function(){ sig.classList.add('go'); }, .3, 6000);
})();

/* ---------- S11 — one person becomes a number --------------------------- */
(function(){
  var rings = document.getElementById('rings');
  if(!rings) return;
  once(rings, function(){ rings.classList.add('go'); }, .3, 7000);
})();

/* ---------- reveals: from a visible resting state ----------------------- */
(function(){
  var els = [].slice.call(document.querySelectorAll('.rv'));
  if(!els.length) return;
  if(REDUCED || !HAS_IO) return;      /* leave them at their resting state */
  document.documentElement.classList.add('anim');

  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {rootMargin:'0px 0px -8% 0px', threshold:.05});

  els.forEach(function(el,i){
    var r = el.getBoundingClientRect();
    if(r.top < window.innerHeight * 1.3 && r.bottom > 0){ el.classList.add('in'); }
    else { el.style.transitionDelay = Math.min((i % 6) * 55, 280) + 'ms'; io.observe(el); }
  });

  function sweep(){
    els.forEach(function(el){
      if(!el.classList.contains('in') &&
         el.getBoundingClientRect().top < window.innerHeight * 1.3){ el.classList.add('in'); }
    });
  }
  window.addEventListener('scroll', sweep, {passive:true});
  window.addEventListener('pageshow', sweep);
  document.addEventListener('visibilitychange', sweep);

  /* nothing stays invisible. ever. */
  setTimeout(function(){
    els.forEach(function(el){ el.style.transitionDelay = '0ms'; el.classList.add('in'); });
  }, 7000);
})();

/* ---------- housekeeping ------------------------------------------------ */
(function(){
  var y = document.getElementById('yr');
  if(y) y.textContent = new Date().getFullYear();
})();

})();
