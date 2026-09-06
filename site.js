(function(){
  var root=document.documentElement;
  if(!('IntersectionObserver' in window)) return;
  try{
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{rootMargin:'0px 0px -8% 0px',threshold:.06});
    ['.figs','.cards','.arc','.certgrid','.cgrid'].forEach(function(sel){
      Array.prototype.forEach.call(document.querySelectorAll(sel),function(g){
        Array.prototype.forEach.call(g.children,function(c,i){ c.style.transitionDelay=Math.min(i*65,390)+'ms'; });
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.rv'),function(el){io.observe(el);});
    root.classList.add('anim');
    requestAnimationFrame(function(){
      Array.prototype.forEach.call(document.querySelectorAll('.hero .rv'),function(el,i){
        el.style.transitionDelay=(i*85)+'ms'; el.classList.add('in');
      });
    });
    function sweep(){
      Array.prototype.forEach.call(document.querySelectorAll('.rv:not(.in)'),function(el){
        if(el.getBoundingClientRect().top < window.innerHeight*1.35) el.classList.add('in');
      });
    }
    document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='visible'){sweep();setTimeout(sweep,120);} });
    window.addEventListener('pageshow',sweep);
    var n=0,iv=setInterval(function(){ sweep(); if(++n>16) clearInterval(iv); },1200);
    setTimeout(function(){ Array.prototype.forEach.call(document.querySelectorAll('.rv:not(.in)'),
      function(el){ el.style.transitionDelay='0ms'; el.classList.add('in'); }); },22000);
  }catch(err){ root.classList.remove('anim'); }
})();

/* drawer */
(function(){
  var b=document.querySelector('.burger'), d=document.getElementById('drawer');
  if(!b||!d) return;
  var c=d.querySelector('.close');
  function open(){ d.classList.add('on'); b.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
  function shut(){ d.classList.remove('on'); b.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
  b.addEventListener('click',function(){ d.classList.contains('on')?shut():open(); });
  if(c) c.addEventListener('click',shut);
  d.addEventListener('click',function(e){ if(e.target===d) shut(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') shut(); });
  Array.prototype.forEach.call(d.querySelectorAll('a'),function(a){a.addEventListener('click',shut);});
})();
