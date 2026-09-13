'use strict';

(() => {

  const CONFIG = {
    COUPON: 'WEL67',
    DISCOUNT: 5,
    UPI_ID: 'fftopupsite@axl',
    QR_IMAGE: './upi-qr.png.jpeg'
  };

  const $ = (s, c = document) =>
    c.querySelector(s);

  const $$ = (s, c = document) =>
    [...c.querySelectorAll(s)];


  /* =========================
     COUPON
     ========================= */

  let COUPON = CONFIG.COUPON;
  let COUPON_DISCOUNT = CONFIG.DISCOUNT;

  try {

    const savedCoupon =
      localStorage.getItem('ff_coupon');

    const savedDiscount =
      parseFloat(
        localStorage.getItem('ff_coupon_discount')
      );

    if (savedCoupon) {
      COUPON = savedCoupon;
    }

    if (
      !isNaN(savedDiscount) &&
      savedDiscount > 0
    ) {
      COUPON_DISCOUNT =
        savedDiscount;
    }

  } catch (_) {}


  /* =========================
     PRODUCTS
     ========================= */

  const PRODUCTS = {

    p1: {
      name: '100 Diamonds',
      amount: '100',
      price: 39,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618130216_7f8d25.png'
    },

    p2: {
      name: '310 Diamonds',
      amount: '310',
      price: 99,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618130432_e4e517.png'
    },

    p3: {
      name: '520 Diamonds',
      amount: '520',
      price: 149,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618130756_687fd4.png'
    },

    p4: {
      name: '1060 Diamonds',
      amount: '1060',
      price: 299,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618131428_da9e7d.png'
    },

    p5: {
      name: '2180 Diamonds',
      amount: '2180',
      price: 499,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618131446_ae70d5.png'
    },

    p6: {
      name: '5600 Diamonds',
      amount: '5600',
      price: 799,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618131503_e48bb6.png'
    },

    p7: {
      name: 'Booyah Pass',
      amount: 'Booyah',
      price: 159,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618132321_6d00cf.png'
    },

    p8: {
      name: 'Booyah Pass+',
      amount: 'Booyah+',
      price: 299,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618132415_969094.png'
    },

    p9: {
      name: 'Weekly Pass',
      amount: 'Weekly',
      price: 99,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618133127_78497d.png'
    },

    p10: {
      name: 'Monthly Pass',
      amount: 'Monthly',
      price: 299,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618144016_48b5e4.png'
    },

    p11: {
      name: '30D Evo Pass',
      amount: '30D Evo',
      price: 259,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618144137_8f687e.png'
    },

    p12: {
      name: 'Weekly Lite Pass',
      amount: 'Lite',
      price: 39,
      image:
        'https://freefiretopupindia.site/gen/uploads/products/products_20260618132946_87d030.png'
    }

  };


  /* =========================
     STATE
     ========================= */

  const state = {

    player: null,

    quantity: 1,

    timer: 600,

    timerId: null

  };


  let currentOrder = null;


  /* =========================
     LOCAL STORAGE
     ========================= */

  function lsGet(key) {

    try {

      return localStorage.getItem(key);

    } catch (_) {

      return null;

    }

  }


  function readPlayer() {

    try {

      const raw =
        localStorage.getItem('ff_player');

      if (raw) {

        const player =
          JSON.parse(raw);

        if (
          player &&
          player.nickname &&
          player.uid
        ) {

          return player;

        }

      }

    } catch (_) {}


    const uid =
      lsGet('ff_uid');

    const nick =
      lsGet('ff_nick');

    if (uid && nick) {

      return {

        uid: String(uid),

        nickname: nick,

        level:
          lsGet('ff_level') || '—',

        region:
          lsGet('ff_region') || ''

      };

    }

    return null;

  }


  /* =========================
     TOAST
     ========================= */

  function showToast(
    message,
    duration = 3000
  ) {

    const toast =
      $('#toast');

    if (!toast) return;

    toast.textContent =
      message;

    toast.classList.remove(
      'hidden'
    );

    toast.classList.add(
      'show'
    );

    clearTimeout(
      showToast._timer
    );

    showToast._timer =
      setTimeout(
        () => {

          toast.classList.remove(
            'show'
          );

          toast.classList.add(
            'hidden'
          );

        },
        duration
      );

  }


  /* =========================
     THEME
     ========================= */

  function setTheme(dark) {

    document.documentElement
      .classList
      .toggle(
        'dark',
        dark
      );

    try {

      localStorage.setItem(
        'ff_theme',
        dark
          ? 'dark'
          : 'light'
      );

    } catch (_) {}

    const button =
      $('#themeToggle');

    if (button) {

      button.textContent =
        dark
          ? '☀️'
          : '🌙';

    }

  }


  function initTheme() {

    let dark = false;

    try {

      dark =
        localStorage.getItem(
          'ff_theme'
        ) === 'dark';

    } catch (_) {}

    setTheme(dark);

    const button =
      $('#themeToggle');

    if (button) {

      button.addEventListener(
        'click',
        () => {

          setTheme(
            !document.documentElement
              .classList
              .contains('dark')
          );

        }
      );

    }

  }


  /* =========================
     NAV
     ========================= */

  function initNav() {

    const navToggle =
      $('#navToggle');

    const mainNav =
      $('#mainNav');

    if (
      !navToggle ||
      !mainNav
    ) {
      return;
    }

    navToggle.addEventListener(
      'click',
      () => {

        mainNav.classList.toggle(
          'open'
        );

      }
    );

    mainNav
      .querySelectorAll('a')
      .forEach(
        link => {

          link.addEventListener(
            'click',
            () => {

              mainNav.classList.remove(
                'open'
              );

            }
          );

        }
      );

  }


  /* =========================
     COUPON BUTTONS
     ========================= */

  function initCoupon() {

    $$('[data-coupon-copy]')
      .forEach(
        button => {

          button.addEventListener(
            'click',
            async () => {

              const original =
                button.textContent;

              try {

                await navigator
                  .clipboard
                  .writeText(
                    COUPON
                  );

                button.textContent =
                  'COPIED ✓';

                button.classList.add(
                  'copied'
                );

                showToast(
                  `🎉 Coupon ${COUPON} copied — ${COUPON_DISCOUNT}% OFF on every product!`,
                  3200
                );

              } catch (_) {

                showToast(
                  `Coupon code: ${COUPON} (${COUPON_DISCOUNT}% OFF)`,
                  3200
                );

              }

              setTimeout(
                () => {

                  button.textContent =
                    original;

                  button.classList.remove(
                    'copied'
                  );

                },
                2200
              );

            }
          );

        }
      );


    $$('[data-coupon-badge]')
      .forEach(
        element => {

          element.textContent =
            `🏷️ ${COUPON} · ${COUPON_DISCOUNT}% OFF applied`;

          element.classList.add(
            'show'
          );

        }
      );

  }


  /* =========================
     VERIFIED PLAYER BAR
     ========================= */

  function paintBar(player) {

    const nick =
      $('#vNick');

    const uid =
      $('#vUid');

    const level =
      $('#vLevel');

    if (nick) {

      nick.textContent =
        player.nickname || '—';

    }

    if (uid) {

      uid.textContent =
        player.uid || '—';

    }

    if (level) {

      level.textContent =
        'Lvl ' +
        (player.level ?? '—');

    }

  }


  function recoverPlayer() {

    const player =
      readPlayer();

    if (player) {

      paintBar(player);

      return player;

    }

    return null;

  }


  /* =========================
     CHANGE ACCOUNT
     ========================= */

  const changeAccount =
    $('#changeAccount');

  if (changeAccount) {

    changeAccount.addEventListener(
      'click',
      event => {

        event.preventDefault();

        try {

          [
            'ff_uid',
            'ff_nick',
            'ff_level',
            'ff_region',
            'ff_player'
          ].forEach(
            key => {

              localStorage.removeItem(
                key
              );

              sessionStorage.removeItem(
                key
              );

            }
          );

        } catch (_) {}

        location.href =
          'index.html';

      }
    );

  }


  /* =========================
     CATEGORY TABS
     ========================= */

  const tabs =
    $$('.tab');

  const products =
    $$('.product');


  function filterCategory(category) {

    products.forEach(
      product => {

        product.style.display =
          product.dataset.category ===
          category
            ? ''
            : 'none';

      }
    );

  }


  tabs.forEach(
    tab => {

      tab.addEventListener(
        'click',
        function () {

          tabs.forEach(
            item =>
              item.classList.remove(
                'active'
              )
          );

          this.classList.add(
            'active'
          );

          filterCategory(
            this.dataset.cat
          );

        }
      );

    }
  );


  filterCategory(
    'diamonds'
  );


  /* =========================
     MODAL ELEMENTS
     ========================= */

  const processing =
    $('#processingOverlay');

  const modal =
    $('#payModal');

  const stepConfirm =
    $('#stepConfirm');

  const stepPayment =
    $('#stepPayment');

  const stepUtr =
    $('#stepUtr');

  const stepResult =
    $('#stepResult');


  const cNick =
    $('#cNick');

  const cUid =
    $('#cUid');

  const cItem =
    $('#cItem');

  const cQty =
    $('#cQty');

  const cUnit =
    $('#cUnit');

  const cSubtotal =
    $('#cSubtotal');

  const cDiscount =
    $('#cDiscount');

  const cTotal =
    $('#cTotal');


  const pNick =
    $('#pNick');

  const pUid =
    $('#pUid');

  const pItem =
    $('#pItem');

  const pQty =
    $('#pQty');

  const pOrder =
    $('#pOrder');


  const payAmount =
    $('#payAmount');

  const payAmountNote =
    $('#payAmountNote');

  const paySaved =
    $('#paySaved');

  const payCouponLabel =
    $('#payCouponLabel');

  const qrImg =
    $('#qrImg');

  const qrTimer =
    $('#qrTimer');


  /* =========================
     FORMAT MONEY
     ========================= */

  function formatINR(value) {

    const number =
      Math.round(
        value * 100
      ) / 100;

    const rounded =
      Math.round(number);

    if (
      Math.abs(
        number - rounded
      ) < 0.001
    ) {

      return (
        '₹' +
        rounded.toLocaleString(
          'en-IN'
        )
      );

    }

    return (
      '₹' +
      number.toFixed(2)
    );

  }


  /* =========================
     TOTALS
     ========================= */

  function totals() {

    if (!currentOrder) {

      return {

        subtotal: 0,

        discount: 0,

        total: 0

      };

    }


    const subtotal =
      currentOrder.price *
      currentOrder.quantity;


    const discount =
      subtotal *
      (
        COUPON_DISCOUNT /
        100
      );


    return {

      subtotal,

      discount,

      total:
        subtotal -
        discount

    };

  }


  /* =========================
     RENDER CONFIRM ORDER
     ========================= */

  function renderConfirm() {

    if (!currentOrder) {
      return;
    }


    const t =
      totals();


    if (cQty) {

      cQty.textContent =
        currentOrder.quantity;

    }


    if (cUnit) {

      cUnit.textContent =
        formatINR(
          currentOrder.price
        );

    }


    if (cSubtotal) {

      cSubtotal.textContent =
        formatINR(
          t.subtotal
        );

    }


    if (cDiscount) {

      cDiscount.textContent =
        '−' +
        formatINR(
          t.discount
        );

    }


    if (cTotal) {

      cTotal.textContent =
        formatINR(
          t.total
        );

    }


    const couponLabel =
      $('#cCouponLabel');

    const discountPct =
      $('#cDiscountPct');


    if (couponLabel) {

      couponLabel.textContent =
        COUPON;

    }


    if (discountPct) {

      discountPct.textContent =
        COUPON_DISCOUNT;

    }


    const itemName =
      currentOrder.quantity > 1

        ? `${currentOrder.name} × ${currentOrder.quantity}`

        : currentOrder.name;


    if (cItem) {

      cItem.innerHTML =
        `
          <img
            src="${currentOrder.image}"
            alt=""
          >
          <span>
            ${itemName}
          </span>
        `;

    }


    const decrease =
      $('#modalQtyControl [data-action="dec"]');

    const increase =
      $('#modalQtyControl [data-action="inc"]');


    if (decrease) {

      decrease.disabled =
        currentOrder.quantity <= 1;

    }


    if (increase) {

      increase.disabled =
        currentOrder.quantity >= 99;

    }

  }


  /* =========================
     CLOSE MODAL
     ========================= */

  function closeModal() {

    if (!modal) {
      return;
    }


    modal.classList.remove(
      'open'
    );


    document.body.style.overflow =
      '';


    clearInterval(
      state.timerId
    );

    state.timerId =
      null;

    state.timer =
      600;

    currentOrder =
      null;


    if (stepConfirm) {
      stepConfirm.style.display =
        'block';
    }

    if (stepPayment) {
      stepPayment.style.display =
        'none';
    }

    if (stepUtr) {
      stepUtr.style.display =
        'none';
    }

    if (stepResult) {
      stepResult.style.display =
        'none';
    }


    if (qrTimer) {

      qrTimer.textContent =
        '⏱️ QR valid for 10:00';

      qrTimer.classList.remove(
        'expired'
      );

    }

  }


  /* =========================
     SHOW CONFIRM MODAL
     ========================= */

  function showConfirm(data) {

    currentOrder = {

      ...data,

      quantity: 1,

      orderId:
        'FT' +
        Date.now() +
        Math.floor(
          Math.random() *
          1000
        )
          .toString()
          .padStart(
            3,
            '0'
          )

    };


    if (processing) {

      processing.classList.add(
        'show'
      );

    }


    setTimeout(
      () => {

        if (processing) {

          processing.classList.remove(
            'show'
          );

        }


        if (state.player) {

          if (cNick) {

            cNick.textContent =
              state.player.nickname;

          }

          if (cUid) {

            cUid.textContent =
              state.player.uid;

          }

        }


        renderConfirm();


        if (stepConfirm) {

          stepConfirm.style.display =
            'block';

        }


        if (stepPayment) {

          stepPayment.style.display =
            'none';

        }


        if (stepUtr) {

          stepUtr.style.display =
            'none';

        }


        if (stepResult) {

          stepResult.style.display =
            'none';

        }


        if (modal) {

          modal.classList.add(
            'open'
          );

          document.body.style.overflow =
            'hidden';

        }

      },
      500
    );

  }


  /* =========================
     QUANTITY
     ========================= */

  const qtyControl =
    $('#modalQtyControl');

  if (qtyControl) {

    qtyControl
      .querySelectorAll(
        '[data-action]'
      )
      .forEach(
        button => {

          button.addEventListener(
            'click',
            () => {

              if (!currentOrder) {
                return;
              }


              const change =
                button.dataset.action ===
                'inc'
                  ? 1
                  : -1;


              currentOrder.quantity =
                Math.max(
                  1,
                  Math.min(
                    99,
                    currentOrder.quantity +
                      change
                  )
                );


              renderConfirm();

            }
          );

        }
      );

  }


  /* =========================
     PROCEED TO PAY
     ========================= */

  document.addEventListener(
    'click',
    event => {

      const button =
        event.target.closest(
          '#confirmBtn'
        );


      if (!button) {
        return;
      }


      event.preventDefault();
      event.stopPropagation();


      console.log(
        'Proceed to Pay clicked'
      );


      if (!currentOrder) {

        console.log(
          'currentOrder is null'
        );

        showToast(
          'Please select a product again.',
          2500
        );

        return;

      }


      const t =
        totals();


      /* Demo signature */

      currentOrder.signature =
        'demo_' +
        Date.now();


      /* Player */

      if (pNick) {

        pNick.textContent =
          currentOrder.nick ||
          '—';

      }


      if (pUid) {

        pUid.textContent =
          currentOrder.uid ||
          '—';

      }


      /* Item */

      const itemName =
        currentOrder.quantity > 1

          ? `${currentOrder.name} × ${currentOrder.quantity}`

          : currentOrder.name;


      if (pItem) {

        pItem.innerHTML =
          `
            <img
              src="${currentOrder.image}"
              alt=""
            >
            <span>
              ${itemName}
            </span>
          `;

      }


      /* Quantity */

      if (pQty) {

        pQty.textContent =
          currentOrder.quantity;

      }


      /* Order ID */

      if (pOrder) {

        pOrder.textContent =
          currentOrder.orderId;

      }


      /* Amount */

      if (payAmount) {

        payAmount.textContent =
          formatINR(
            t.total
          );

      }


      if (payAmountNote) {

        payAmountNote.textContent =
          `after ${COUPON_DISCOUNT}% coupon discount`;

      }


      if (paySaved) {

        paySaved.textContent =
          `Saved ${formatINR(t.discount)}`;

      }


      if (payCouponLabel) {

        payCouponLabel.textContent =
          COUPON;

      }


      /* QR */

      if (qrImg) {

        qrImg.src =
          CONFIG.QR_IMAGE;

      }


      /* Switch screens */

      if (stepConfirm) {

        stepConfirm.style.display =
          'none';

      }


      if (stepPayment) {

        stepPayment.style.display =
          'block';

      }


      if (stepUtr) {

        stepUtr.style.display =
          'none';

      }


      if (stepResult) {

        stepResult.style.display =
          'none';

      }


      /* Paid button */

      const paidButton =
        $('#paidBtn');


      if (paidButton) {

        paidButton.disabled =
          false;

        paidButton.textContent =
          '✓ I have paid';

      }


      /* Start QR timer */

      startTimer();


      console.log(
        'Payment screen opened'
      );

    }
  );


  /* =========================
     QR TIMER
     ========================= */

  function updateTimer() {

    if (!qrTimer) {
      return;
    }


    const minutes =
      String(
        Math.floor(
          state.timer / 60
        )
      ).padStart(
        2,
        '0'
      );


    const seconds =
      String(
        state.timer % 60
      ).padStart(
        2,
        '0'
      );


    if (
      state.timer > 0
    ) {

      qrTimer.textContent =
        `⏱️ QR valid for ${minutes}:${seconds}`;

    } else {

      qrTimer.textContent =
        '⏱️ QR expired';

    }


    if (
      state.timer <= 60
    ) {

      qrTimer.classList.add(
        'expired'
      );

    } else {

      qrTimer.classList.remove(
        'expired'
      );

    }

  }


  function startTimer() {

    clearInterval(
      state.timerId
    );


    state.timer =
      600;


    updateTimer();


    state.timerId =
      setInterval(
        () => {

          state.timer--;

          updateTimer();


          if (
            state.timer <= 0
          ) {

            clearInterval(
              state.timerId
            );

            state.timerId =
              null;


            const paidButton =
              $('#paidBtn');


            if (paidButton) {

              paidButton.disabled =
                true;

            }


            showToast(
              'QR expired. Please restart.',
              4000
            );

          }

        },
        1000
      );

  }


  /* =========================
     I HAVE PAID
     ========================= */

  const paidBtn =
    $('#paidBtn');


  if (paidBtn) {

    paidBtn.addEventListener(
      'click',
      () => {

        if (
          state.timer <= 0
        ) {

          showToast(
            'QR expired. Restart.',
            3000
          );

          return;

        }


        clearInterval(
          state.timerId
        );

        state.timerId =
          null;


        if (stepPayment) {

          stepPayment.style.display =
            'none';

        }


        if (stepUtr) {

          stepUtr.style.display =
            'block';

        }


        const input =
          $('#utrInput');


        if (input) {

          input.focus();

        }

      }
    );

  }


  /* =========================
     BACK TO PAYMENT
     ========================= */

  const backToPayBtn =
    $('#backToPayBtn');


  if (backToPayBtn) {

    backToPayBtn.addEventListener(
      'click',
      () => {

        if (stepUtr) {

          stepUtr.style.display =
            'none';

        }


        if (stepPayment) {

          stepPayment.style.display =
            'block';

        }


        if (
          state.timer > 0
        ) {

          startTimer();

        }

      }
    );

  }


  /* =========================
     DOWNLOAD QR
     ========================= */

  const downloadQrBtn =
    $('#downloadQrBtn');


  if (downloadQrBtn) {

    downloadQrBtn.addEventListener(
      'click',
      () => {

        const link =
          document.createElement(
            'a'
          );


        link.href =
          CONFIG.QR_IMAGE;


        link.download =
          `QR_${
            currentOrder?.orderId ||
            'payment'
          }.png`;


        document.body.appendChild(
          link
        );


        link.click();


        link.remove();


        showToast(
          '⬇ QR downloaded!',
          2000
        );

      }
    );

  }


  /* =========================
     UTR SUBMIT
     ========================= */

  function submitUtr() {

    if (!currentOrder) {
      return;
    }


    const input =
      $('#utrInput');


    if (!input) {
      return;
    }


    const utr =
      input.value.trim();


    if (!utr) {

      showToast(
        '❌ Enter UTR.',
        2500
      );

      return;

    }


    if (
      utr.length < 6
    ) {

      showToast(
        '❌ UTR: min 6 chars.',
        2500
      );

      return;

    }


    const t =
      totals();


    const payload = {

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
          t.subtotal * 100
        ) / 100,

      coupon:
        COUPON,

      discount_pct:
        COUPON_DISCOUNT,

      discount_amount:
        Math.round(
          t.discount * 100
        ) / 100,

      amount:
        Math.round(
          t.total * 100
        ) / 100,

      utr:
        utr,

      upi:
        CONFIG.UPI_ID,

      timestamp:
        new Date().toISOString()

    };


    try {

      localStorage.setItem(
        `ff_order_${currentOrder.orderId}`,
        JSON.stringify(
          payload
        )
      );

    } catch (_) {}


    if (stepUtr) {

      stepUtr.style.display =
        'none';

    }


    if (stepResult) {

      stepResult.style.display =
        'block';

    }


    const resultIcon =
      $('#resultIcon');

    const resultMsg =
      $('#resultMsg');

    const resultSub =
      $('#resultSub');


    if (resultIcon) {

      resultIcon.textContent =
        '✅';

    }


    if (resultMsg) {

      resultMsg.textContent =
        'Payment Submitted!';

    }


    if (resultSub) {

      resultSub.textContent =
        'Order information has been saved in this browser.';

    }

  }


  const submitUtrBtn =
    $('#submitUtrBtn');


  if (submitUtrBtn) {

    submitUtrBtn.addEventListener(
      'click',
      submitUtr
    );

  }


  const utrInput =
    $('#utrInput');


  if (utrInput) {

    utrInput.addEventListener(
      'keydown',
      event => {

        if (
          event.key ===
          'Enter'
        ) {

          submitUtr();

        }

      }
    );

  }


  /* =========================
     MODAL BUTTONS
     ========================= */

  const modalClose =
    $('#modalClose');


  if (modalClose) {

    modalClose.addEventListener(
      'click',
      closeModal
    );

  }


  const cancelConfirmBtn =
    $('#cancelConfirmBtn');


  if (cancelConfirmBtn) {

    cancelConfirmBtn.addEventListener(
      'click',
      closeModal
    );

  }


  const cancelPayBtn =
    $('#cancelPayBtn');


  if (cancelPayBtn) {

    cancelPayBtn.addEventListener(
      'click',
      closeModal
    );

  }


  const resultOkBtn =
    $('#resultOkBtn');


  if (resultOkBtn) {

    resultOkBtn.addEventListener(
      'click',
      closeModal
    );

  }


  /* =========================
     MODAL BACKDROP
     ========================= */

  if (modal) {

    modal.addEventListener(
      'click',
      event => {

        if (
          event.target ===
          modal
        ) {

          closeModal();

        }

      }
    );

  }


  /* =========================
     ESC KEY
     ========================= */

  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key ===
        'Escape'
      ) {

        closeModal();

      }

    }
  );


  /* =========================
     PRODUCT CLICK
     ========================= */

  const productGrid =
    $('#productGrid');


  if (productGrid) {

    productGrid.addEventListener(
      'click',
      event => {

        const card =
          event.target.closest(
            '.product'
          );


        if (!card) {
          return;
        }


        if (!state.player) {

          showToast(
            'Please verify your UID first.',
            2500
          );

          return;

        }


        const product =
          PRODUCTS[
            card.dataset.id
          ];


        if (!product) {
          return;
        }


        showConfirm({

          name:
            product.name,

          amount:
            product.amount,

          price:
            product.price,

          image:
            product.image,

          nick:
            state.player.nickname,

          uid:
            state.player.uid

        });

      }
    );

  }


  /* =========================
     SALE POPUP
     ========================= */

  const sale =
    document.querySelector(
      '.sale-popup'
    );


  if (sale) {

    setTimeout(
      () => {

        sale.removeAttribute(
          'hidden'
        );

      },
      4000
    );


    setTimeout(
      () => {

        sale.setAttribute(
          'hidden',
          ''
        );

      },
      19000
    );

  }


  /* =========================
     YEAR
     ========================= */

  const year =
    $('#year');


  if (year) {

    year.textContent =
      new Date()
        .getFullYear();

  }


  /* =========================
     INIT
     ========================= */

  initTheme();

  initNav();

  initCoupon();


  state.player =
    recoverPlayer();


  if (
    !state.player?.uid
  ) {

    showToast(
      'Please verify your UID first.',
      2500
    );


    setTimeout(
      () => {

        location.href =
          'index.html';

      },
      1800
    );

  }


  /* =========================
     UPI COPY
     ========================= */

  const copyButton =
    document.getElementById(
      'copyUpiBtn'
    );

  const upiId =
    document.getElementById(
      'upiId'
    );


  if (
    copyButton &&
    upiId
  ) {

    copyButton.addEventListener(
      'click',
      async function () {

        const text =
          upiId.textContent.trim();


        try {

          await navigator
            .clipboard
            .writeText(
              text
            );


          copyButton.textContent =
            'COPIED';


          setTimeout(
            function () {

              copyButton.textContent =
                'COPY';

            },
            1500
          );


        } catch (_) {

          alert(
            'UPI ID: ' +
            text
          );

        }

      }
    );

  }


})();
