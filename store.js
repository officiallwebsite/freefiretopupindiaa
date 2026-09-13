'use strict';

(() => {
  const CONFIG = {
    COUPON: 'WEL67',
    DISCOUNT: 5,
    UPI_ID: 'raju.2501@ptyes',
    QR_IMAGE: './upi-qr.png.jpeg'
  };

  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>[...c.querySelectorAll(s)];

  let COUPON = CONFIG.COUPON;
  let COUPON_DISCOUNT = CONFIG.DISCOUNT;

  try {
    const sc = localStorage.getItem('ff_coupon');
    const sp = parseFloat(localStorage.getItem('ff_coupon_discount'));
    if (sc) COUPON = sc;
    if (!isNaN(sp) && sp > 0) COUPON_DISCOUNT = sp;
  } catch (_) {}

  const PRODUCTS = {
    p1:{name:'100 Diamonds',amount:'100',price:39,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618130216_7f8d25.png'},
    p2:{name:'310 Diamonds',amount:'310',price:99,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618130432_e4e517.png'},
    p3:{name:'520 Diamonds',amount:'520',price:149,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618130756_687fd4.png'},
    p4:{name:'1060 Diamonds',amount:'1060',price:299,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618131428_da9e7d.png'},
    p5:{name:'2180 Diamonds',amount:'2180',price:499,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618131446_ae70d5.png'},
    p6:{name:'5600 Diamonds',amount:'5600',price:799,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618131503_e48bb6.png'},
    p7:{name:'Booyah Pass',amount:'Booyah',price:159,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618132321_6d00cf.png'},
    p8:{name:'Booyah Pass+',amount:'Booyah+',price:299,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618132415_969094.png'},
    p9:{name:'Weekly Pass',amount:'Weekly',price:99,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618133127_78497d.png'},
    p10:{name:'Monthly Pass',amount:'Monthly',price:299,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618144016_48b5e4.png'},
    p11:{name:'30D Evo Pass',amount:'30D Evo',price:259,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618144137_8f687e.png'},
    p12:{name:'Weekly Lite Pass',amount:'Lite',price:39,image:'https://freefiretopupindia.site/gen/uploads/products/products_20260618132946_87d030.png'}
  };

  const state = {
    player: null,
    order: null,
    quantity: 1,
    timer: 600,
    timerId: null
  };

  function lsGet(k){
    try{return localStorage.getItem(k)}
    catch(_){return null}
  }

  function readPlayer(){
    try{
      const raw=localStorage.getItem('ff_player');

      if(raw){
        const p=JSON.parse(raw);
        if(p && p.nickname && p.uid) return p;
      }
    }catch(_){}

    const uid=lsGet('ff_uid');
    const nick=lsGet('ff_nick');

    if(uid && nick){
      return {
        uid:String(uid),
        nickname:nick,
        level:lsGet('ff_level')||'—',
        region:lsGet('ff_region')||''
      };
    }

    return null;
  }

  function showToast(msg,dur=3000){
    const toast=$('#toast');
    if(!toast)return;

    toast.textContent=msg;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    clearTimeout(showToast._t);

    showToast._t=setTimeout(()=>{
      toast.classList.remove('show');
      toast.classList.add('hidden');
    },dur);
  }

  function setTheme(dark){
    const html=document.documentElement;

    html.classList.toggle(
      'dark',
      dark
    );

    try{
      localStorage.setItem(
        'ff_theme',
        dark?'dark':'light'
      );
    }catch(_){}

    const b=$('#themeToggle');

    if(b){
      b.textContent=
        dark?'☀️':'🌙';
    }
  }

  function initTheme(){
    let dark=false;

    try{
      dark=
        localStorage.getItem(
          'ff_theme'
        )==='dark';
    }catch(_){}

    setTheme(dark);

    $('#themeToggle')?.addEventListener(
      'click',
      ()=>{
        setTheme(
          !document.documentElement.classList.contains('dark')
        );
      }
    );
  }

  function initNav(){
    const navToggle=$('#navToggle');
    const mainNav=$('#mainNav');

    if(!navToggle||!mainNav)return;

    navToggle.addEventListener(
      'click',
      ()=>{
        mainNav.classList.toggle('open');
      }
    );

    mainNav.querySelectorAll('a').forEach(
      a=>{
        a.addEventListener(
          'click',
          ()=>{
            mainNav.classList.remove('open');
          }
        );
      }
    );
  }

  function initCoupon(){
    $$('[data-coupon-copy]').forEach(
      btn=>{
        btn.addEventListener(
          'click',
          async()=>{
            const orig=btn.textContent;

            try{
              await navigator.clipboard.writeText(COUPON);

              btn.textContent='COPIED ✓';
              btn.classList.add('copied');

              showToast(
                `🎉 Coupon ${COUPON} copied — ${COUPON_DISCOUNT}% OFF on every product!`,
                3200
              );
            }catch(_){
              showToast(
                `Coupon code: ${COUPON} (${COUPON_DISCOUNT}% OFF)`,
                3200
              );
            }

            setTimeout(
              ()=>{
                btn.textContent=orig;
                btn.classList.remove('copied');
              },
              2200
            );
          }
        );
      }
    );

    $$('[data-coupon-badge]').forEach(
      el=>{
        el.textContent=
          `🏷️ ${COUPON} · ${COUPON_DISCOUNT}% OFF applied`;

        el.classList.add('show');
      }
    );
  }

  function paintBar(p){
    $('#vNick').textContent=
      p.nickname||'—';

    $('#vUid').textContent=
      p.uid||'—';

    $('#vLevel').textContent=
      'Lvl '+(p.level??'—');
  }

  function recoverPlayer(){
    const p=readPlayer();

    if(p){
      paintBar(p);
      return p;
    }

    return null;
  }

  $('#changeAccount').addEventListener(
    'click',
    e=>{
      e.preventDefault();

      try{
        [
          'ff_uid',
          'ff_nick',
          'ff_level',
          'ff_region',
          'ff_player'
        ].forEach(
          k=>{
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
          }
        );
      }catch(_){}

      location.href='index.html';
    }
  );

  const tabs=$$('.tab');
  const products=$$('.product');

  function filterCategory(cat){
    products.forEach(
      p=>{
        p.style.display=
          p.dataset.category===cat
            ? ''
            : 'none';
      }
    );
  }

  tabs.forEach(
    tab=>{
      tab.addEventListener(
        'click',
        function(){
          tabs.forEach(
            t=>t.classList.remove('active')
          );

          this.classList.add('active');

          filterCategory(
            this.dataset.cat
          );
        }
      );
    }
  );

  filterCategory('diamonds');

  const processing=$('#processingOverlay');
  const modal=$('#payModal');

  const stepConfirm=$('#stepConfirm');
  const stepPayment=$('#stepPayment');
  const stepUtr=$('#stepUtr');
  const stepResult=$('#stepResult');

  const cNick=$('#cNick');
  const cUid=$('#cUid');
  const cItem=$('#cItem');
  const cQty=$('#cQty');
  const cUnit=$('#cUnit');
  const cSubtotal=$('#cSubtotal');
  const cDiscount=$('#cDiscount');
  const cTotal=$('#cTotal');

  const pNick=$('#pNick');
  const pUid=$('#pUid');
  const pItem=$('#pItem');
  const pQty=$('#pQty');
  const pOrder=$('#pOrder');

  const payAmount=$('#payAmount');
  const payAmountNote=$('#payAmountNote');
  const paySaved=$('#paySaved');
  const payCouponLabel=$('#payCouponLabel');
  const qrImg=$('#qrImg');
  const qrTimer=$('#qrTimer');

  let currentOrder=null;
  let isProcessing=false;

  function formatINR(n){
    const v=
      Math.round(n*100)/100;

    const r=
      Math.round(v);

    if(
      Math.abs(v-r)<0.001
    ){
      return '₹'+r.toLocaleString('en-IN');
    }

    return '₹'+v.toFixed(2);
  }

  function totals(){
    if(!currentOrder){
      return {
        subtotal:0,
        discount:0,
        total:0
      };
    }

    const subtotal=
      currentOrder.price *
      currentOrder.quantity;

    const discount=
      subtotal *
      (COUPON_DISCOUNT/100);

    return {
      subtotal,
      discount,
      total:
        subtotal-discount
    };
  }

  function renderConfirm(){
    if(!currentOrder)return;

    const t=totals();

    cQty.textContent=
      currentOrder.quantity;

    cUnit.textContent=
      formatINR(
        currentOrder.price
      );

    cSubtotal.textContent=
      formatINR(
        t.subtotal
      );

    cDiscount.textContent=
      '−'+
      formatINR(
        t.discount
      );

    cTotal.textContent=
      formatINR(
        t.total
      );

    $('#cCouponLabel').textContent=
      COUPON;

    $('#cDiscountPct').textContent=
      COUPON_DISCOUNT;

    const name=
      currentOrder.quantity>1
        ? `${currentOrder.name} × ${currentOrder.quantity}`
        : currentOrder.name;

    cItem.innerHTML=
      `<img src="${currentOrder.image}" alt=""><span>${name}</span>`;

    $('#modalQtyControl [data-action="dec"]').disabled=
      currentOrder.quantity<=1;

    $('#modalQtyControl [data-action="inc"]').disabled=
      currentOrder.quantity>=99;
  }

  function closeModal(){
    modal.classList.remove('open');

    document.body.style.overflow='';

    clearInterval(
      state.timerId
    );

    state.timerId=null;
    state.timer=600;
    currentOrder=null;

    stepConfirm.style.display='block';
    stepPayment.style.display='none';
    stepUtr.style.display='none';
    stepResult.style.display='none';

    qrTimer.textContent=
      '⏱️ QR valid for 10:00';

    qrTimer.classList.remove(
      'expired'
    );
  }

  function showConfirm(data){
    currentOrder={
      ...data,
      quantity:1,
      orderId:
        'FT'+
        Date.now()+
        Math.floor(
          Math.random()*1000
        )
          .toString()
          .padStart(
            3,
            '0'
          )
    };

    isProcessing=true;

    processing.classList.add(
      'show'
    );

    setTimeout(
      ()=>{
        processing.classList.remove(
          'show'
        );

        isProcessing=false;

        cNick.textContent=
          state.player.nickname;

        cUid.textContent=
          state.player.uid;

        renderConfirm();

        stepConfirm.style.display=
          'block';

        stepPayment.style.display=
          'none';

        stepUtr.style.display=
          'none';

        stepResult.style.display=
          'none';

        modal.classList.add(
          'open'
        );

        document.body.style.overflow=
          'hidden';
      },
      700
    );
  }

  function updateTimer(){
    const m=
      String(
        Math.floor(
          state.timer/60
        )
      ).padStart(
        2,
        '0'
      );

    const s=
      String(
        state.timer%60
      ).padStart(
        2,
        '0'
      );

    qrTimer.textContent=
      state.timer>0
        ? `⏱️ QR valid for ${m}:${s}`
        : '⏱️ QR expired';

    if(
      state.timer<=60
    ){
      qrTimer.classList.add(
        'expired'
      );
    }else{
      qrTimer.classList.remove(
        'expired'
      );
    }
  }

  function startTimer(){
    clearInterval(
      state.timerId
    );

    state.timer=600;

    updateTimer();

    state.timerId=
      setInterval(
        ()=>{
          state.timer--;

          updateTimer();

          if(
            state.timer<=0
          ){
            clearInterval(
              state.timerId
            );

            state.timerId=null;

            $('#paidBtn').disabled=
              true;

            showToast(
              'QR expired. Please restart.',
              4000
            );
          }
        },
        1000
      );
  }

  $('#modalQtyControl')
    .querySelectorAll(
      '[data-action]'
    )
    .forEach(
      btn=>{
        btn.addEventListener(
          'click',
          ()=>{
            if(
              !currentOrder
            )return;

            const d=
              btn.dataset.action===
              'inc'
                ? 1
                : -1;

            currentOrder.quantity=
              Math.max(
                1,
                Math.min(
                  99,
                  currentOrder.quantity+d
                )
              );

            renderConfirm();
          }
        );
      }
    );

  $('#confirmBtn').addEventListener(
    'click',
    ()=>{
      if(!currentOrder)return;

      const t=totals();

      const name=
        currentOrder.quantity>1
          ? `${currentOrder.name} × ${currentOrder.quantity}`
          : currentOrder.name;

      pNick.textContent=
        currentOrder.nick;

      pUid.textContent=
        currentOrder.uid;

      pItem.innerHTML=
        `<img src="${currentOrder.image}" alt=""><span>${name}</span>`;

      pQty.textContent=
        currentOrder.quantity;

      pOrder.textContent=
        currentOrder.orderId;

      payAmount.textContent=
        formatINR(
          t.total
        );

      payAmountNote.textContent=
        `after ${COUPON_DISCOUNT}% coupon discount`;

      paySaved.textContent=
        `Saved ${formatINR(t.discount)}`;

      payCouponLabel.textContent=
        COUPON;

      qrImg.src=
        CONFIG.QR_IMAGE;

      stepConfirm.style.display=
        'none';

      stepPayment.style.display=
        'block';

      stepUtr.style.display=
        'none';

      stepResult.style.display=
        'none';

      $('#paidBtn').disabled=
        false;

      $('#paidBtn').innerHTML=
        '✓ I have paid';

      startTimer();
    }
  );

  $('#paidBtn').addEventListener(
    'click',
    ()=>{
      if(
        state.timer<=0
      ){
        showToast(
          'QR expired. Restart.',
          3000
        );
        return;
      }

      clearInterval(
        state.timerId
      );

      state.timerId=null;

      stepPayment.style.display=
        'none';

      stepUtr.style.display=
        'block';

      $('#utrInput').focus();
    }
  );

  $('#backToPayBtn').addEventListener(
    'click',
    ()=>{
      stepUtr.style.display=
        'none';

      stepPayment.style.display=
        'block';

      if(
        state.timer>0
      ){
        startTimer();
      }
    }
  );

  $('#downloadQrBtn').addEventListener(
    'click',
    ()=>{
      const a=
        document.createElement('a');

      a.href=
        CONFIG.QR_IMAGE;

      a.download=
        `QR_${
          currentOrder?.orderId||
          'payment'
        }.png`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      showToast(
        '⬇ QR downloaded!',
        2000
      );
    }
  );

  function submitUtr(){
    if(
      !currentOrder
    )return;

    const utr=
      $('#utrInput')
        .value
        .trim();

    if(!utr){
      showToast(
        '❌ Enter UTR.',
        2500
      );
      return;
    }

    if(
      utr.length<6
    ){
      showToast(
        '❌ UTR: min 6 chars.',
        2500
      );
      return;
    }

    const t=totals();

    const payload={
      order_id:
        currentOrder.orderId,

      uid:
        currentOrder.uid,

      nickname:
        currentOrder.nick,

      item:
        currentOrder.name,

      quantity:
        currentOrder.quantity,

      unit_price:
        currentOrder.price,

      subtotal:
        Math.round(
          t.subtotal*100
        )/100,

      coupon:
        COUPON,

      discount_pct:
        COUPON_DISCOUNT,

      discount_amount:
        Math.round(
          t.discount*100
        )/100,

      amount:
        Math.round(
          t.total*100
        )/100,

      utr,

      upi:
        CONFIG.UPI_ID,

      timestamp:
        new Date().toISOString()
    };

    try{
      localStorage.setItem(
        `ff_order_${currentOrder.orderId}`,
        JSON.stringify(payload)
      );
    }catch(_){}

    stepUtr.style.display=
      'none';

    stepResult.style.display=
      'block';

    $('#resultIcon').textContent=
      '✅';

    $('#resultMsg').textContent=
      'Payment Submitted!';

    $('#resultSub').textContent=
      'Order information has been saved in this browser.';
  }

  $('#submitUtrBtn').addEventListener(
    'click',
    submitUtr
  );

  $('#utrInput').addEventListener(
    'keydown',
    e=>{
      if(
        e.key==='Enter'
      ){
        submitUtr();
      }
    }
  );

  $('#modalClose').addEventListener(
    'click',
    closeModal
  );

  $('#cancelConfirmBtn').addEventListener(
    'click',
    closeModal
  );

  $('#cancelPayBtn').addEventListener(
    'click',
    closeModal
  );

  $('#resultOkBtn').addEventListener(
    'click',
    closeModal
  );

  modal.addEventListener(
    'click',
    e=>{
      if(
        e.target===modal
      ){
        closeModal();
      }
    }
  );

  $('#productGrid').addEventListener(
    'click',
    e=>{
      const card=
        e.target.closest(
          '.product'
        );

      if(!card)return;

      if(!state.player){
        showToast(
          'Please verify your UID first.',
          2500
        );

        return;
      }

      const p=
        PRODUCTS[
          card.dataset.id
        ];

      if(!p)return;

      showConfirm({
        name:p.name,
        amount:p.amount,
        price:p.price,
        image:p.image,
        nick:state.player.nickname,
        uid:state.player.uid
      });
    }
  );

  document.addEventListener(
    'keydown',
    e=>{
      if(
        e.key==='Escape'
      ){
        closeModal();
      }
    }
  );

  const sale=
    document.querySelector(
      '.sale-popup'
    );

  if(sale){
    setTimeout(
      () =>
        sale.removeAttribute(
          'hidden'
        ),
      4000
    );

    setTimeout(
      () =>
        sale.setAttribute(
          'hidden',
          ''
        ),
      19000
    );
  }

  const year=
    $('#year');

  if(year){
    year.textContent=
      new Date().getFullYear();
  }

  initTheme();
  initNav();
  initCoupon();

  state.player=
    recoverPlayer();

  if(
    !state.player?.uid
  ){
    showToast(
      'Please verify your UID first.',
      2500
    );

    setTimeout(
      () =>
        location.href=
          'index.html',
      1800
    );
  }

})();
