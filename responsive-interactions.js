/* Mobile-only interactions. Desktop is intentionally untouched. */
(function(){
  'use strict';

  function initMobileReviews(){
    if(!window.matchMedia('(max-width:700px)').matches) return;

    var wrap=document.querySelector('.section--reviews .reviews');
    if(!wrap || wrap.dataset.carouselReady==='1') return;

    var cards=Array.prototype.slice.call(wrap.querySelectorAll('.review'));
    if(cards.length<2) return;

    wrap.dataset.carouselReady='1';

    var ui=document.createElement('div');
    ui.className='reviews-ui';
    ui.innerHTML='<span class="reviews-ui__hint">Свайпайте, чтобы посмотреть отзывы</span>'+
      '<div class="reviews-ui__actions">'+
      '<button class="reviews-ui__button" type="button" aria-label="Предыдущий отзыв">←</button>'+
      '<div class="reviews-ui__dots"></div>'+ 
      '<button class="reviews-ui__button" type="button" aria-label="Следующий отзыв">→</button>'+ 
      '</div>';
    wrap.parentNode.insertBefore(ui,wrap.nextSibling);

    var dotsWrap=ui.querySelector('.reviews-ui__dots');
    var prev=ui.querySelector('.reviews-ui__button');
    var next=ui.querySelectorAll('.reviews-ui__button')[1];
    var dots=[];
    var index=0;
    var timer=null;
    var restartTimer=null;

    cards.forEach(function(card,i){
      var dot=document.createElement('button');
      dot.type='button';
      dot.className='reviews-ui__dot'+(i===0?' is-active':'');
      dot.setAttribute('aria-label','Показать отзыв '+(i+1));
      dot.addEventListener('click',function(){go(i,true);});
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function setActive(i){
      index=(i+cards.length)%cards.length;
      dots.forEach(function(dot,n){dot.classList.toggle('is-active',n===index);});
    }

    function go(i,manual){
      setActive(i);
      var target=cards[index];
      if(target){
        wrap.scrollTo({left:Math.max(0,target.offsetLeft-wrap.offsetLeft),behavior:'smooth'});
      }
      if(manual) restart();
    }

    function syncFromScroll(){
      var left=wrap.scrollLeft;
      var best=0;
      var dist=Infinity;
      cards.forEach(function(card,i){
        var d=Math.abs((card.offsetLeft-wrap.offsetLeft)-left);
        if(d<dist){dist=d;best=i;}
      });
      setActive(best);
    }

    function start(){
      clearInterval(timer);
      timer=setInterval(function(){go(index+1,false);},4500);
    }

    function restart(){
      clearInterval(timer);
      clearTimeout(restartTimer);
      restartTimer=setTimeout(start,6000);
    }

    prev.addEventListener('click',function(){go(index-1,true);});
    next.addEventListener('click',function(){go(index+1,true);});
    wrap.addEventListener('scroll',syncFromScroll,{passive:true});
    wrap.addEventListener('touchstart',function(){clearInterval(timer);},{passive:true});
    wrap.addEventListener('touchend',restart,{passive:true});
    wrap.addEventListener('mouseenter',function(){clearInterval(timer);});
    wrap.addEventListener('mouseleave',start);

    start();
  }

  function init(){
    initMobileReviews();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
