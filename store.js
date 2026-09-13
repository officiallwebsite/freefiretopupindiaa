'use strict';

(() => {
  const CONFIG = {
    COUPON: 'WEL67',
    DISCOUNT: 5,
    UPI_ID: 'raju.2501@ptyes',
    QR_IMAGE: './upi-qr.png.jpeg'
  };

  const PRODUCTS = {
    p1: {
      name: '100 Diamonds',
      amount: '100',
      sub: '+10 bonus',
      price: 39,
      old: 90,
      category: 'diamonds',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618130216_7f8d25.png',
      tag: ''
    },

    p2: {
      name: '310 Diamonds',
      amount: '310',
      sub: '+31 bonus',
      price: 99,
      old: 260,
      category: 'diamonds',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618130432_e4e517.png',
      tag: 'best'
    },

    p3: {
      name: '520 Diamonds',
      amount: '520',
      sub: '+52 bonus',
      price: 149,
      old: 440,
      category: 'diamonds',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618130756_687fd4.png',
      tag: 'best'
    },

    p4: {
      name: '1060 Diamonds',
      amount: '1060',
      sub: '+106 bonus',
      price: 299,
      old: 860,
      category: 'diamonds',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618131428_da9e7d.png',
      tag: 'hot'
    },

    p5: {
      name: '2180 Diamonds',
      amount: '2180',
      sub: '+218 bonus',
      price: 499,
      old: 1700,
      category: 'diamonds',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618131446_ae70d5.png',
      tag: 'best'
    },

    p6: {
      name: '5600 Diamonds',
      amount: '5600',
      sub: '+560 bonus',
      price: 799,
      old: 4300,
      category: 'diamonds',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618131503_e48bb6.png',
      tag: 'best'
    },

    p7: {
      name: 'Booyah Pass',
      amount: 'Booyah',
      sub: '+50% XP boost',
      price: 159,
      old: 299,
      category: 'passes',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618132321_6d00cf.png',
      tag: 'hot'
    },

    p8: {
      name: 'Booyah Pass+',
      amount: 'Booyah+',
      sub: '+100% XP + exclusive skins',
      price: 299,
      old: 599,
      category: 'passes',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618132415_969094.png',
      tag: 'best'
    },

    p9: {
      name: 'Weekly Pass',
      amount: 'Weekly',
      sub: '7 days of rewards',
      price: 99,
      old: 159,
      category: 'passes',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618133127_78497d.png',
      tag: ''
    },

    p10: {
      name: 'Monthly Pass',
      amount: 'Monthly',
      sub: '30 days premium',
      price: 299,
      old: 799,
      category: 'passes',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618144016_48b5e4.png',
      tag: 'best'
    },

    p11: {
      name: '30D Evo Pass',
      amount: '30D Evo',
      sub: 'Evolve with exclusive items',
      price: 259,
      old: 5999,
      category: 'passes',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618144137_8f687e.png',
      tag: 'hot'
    },

    p12: {
      name: 'Weekly Lite Pass',
      amount: 'Lite',
      sub: 'Budget friendly',
      price: 39,
      old: 120,
      category: 'passes',
      image: 'https://freefiretopupindia.site/gen/uploads/products/products_20260618132946_87d030.png',
      tag: ''
    }
  };

  const $ =
    (s, c = document) =>
      c.querySelector(s);

  const $$ =
    (s, c = document) =>
      [...c.querySelectorAll(s)];

  let COUPON =
    CONFIG.COUPON;

  let COUPON_DISCOUNT =
    CONFIG.DISCOUNT;

  try {
    const c =
      localStorage.getItem(
        'ff_coupon'
      );

    const d =
      parseFloat(
        localStorage.getItem(
          'ff_coupon_discount'
        )
      );

    if (c) {
      COUPON = c;
    }

    if (!isNaN(d) && d > 0) {
      COUPON_DISCOUNT = d;
    }
  } catch (_) {}

  const state = {
    player: null,
    order: null,
    quantity: 1,
    step: 'confirm',
    timer: 600,
    timerId: null
  };

  function getStorage(k) {
    try {
      return localStorage.getItem(k);
    } catch (_) {
      return null;
    }
  }

  function readPlayer() {
    try {
      const raw =
        localStorage.getItem(
          'ff_player'
        );

      if (raw) {
        return JSON.parse(raw);
      }
    } catch (_) {}

    return null;
  }

  function showToast(
    msg,
    type = ''
  ) {
    const toast =
      $('#toast');

    if (!toast) return;

    toast.textContent =
      msg;

    toast.className =
      `toast ${type}`;

    toast.classList.add(
      'show'
    );

    toast.classList.remove(
      'hidden'
    );

    clearTimeout(
      showToast._t
    );

    showToast._t =
      setTimeout(
        () => {
          toast.classList.remove(
            'show'
          );

          toast.classList.add(
            'hidden'
          );
        },
        3200
      );
  }

  function setTheme(dark) {
    document.documentElement.classList.toggle(
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

    const btn =
      $('#themeToggle');

    if (btn) {
      btn.textContent =
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

    $('#themeToggle')?.addEventListener(
      'click',
      () => {
        setTheme(
          !document.documentElement.classList.contains(
            'dark'
          )
        );
      }
    );
  }

  function initNav() {
    const toggle =
      $('#navToggle');

    const nav =
      $('#mainNav');

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener(
      'click',
      () =>
        nav.classList.toggle(
          'open'
        )
    );

    $$('a', nav).forEach(
      a =>
        a.addEventListener(
          'click',
          () =>
            nav.classList.remove(
              'open'
            )
        )
    );
  }

  function money(n) {
    const v =
      Math.round(
        Number(n) * 100
      ) / 100;

    return Math.abs(
      v - Math.round(v)
    ) < 0.001
      ? `₹${Math.round(v).toLocaleString('en-IN')}`
      : `₹${v.toFixed(2)}`;
  }

  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      c =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[c])
    );
  }

  function loadPlayer() {
    const saved =
      readPlayer();

    if (
      saved?.nickname &&
      saved?.uid
    ) {
      return saved;
    }

    const uid =
      getStorage(
        'ff_uid'
      );

    const nickname =
      getStorage(
        'ff_nick'
      );

    const level =
      getStorage(
        'ff_level'
      ) || '—';

    const region =
      getStorage(
        'ff_region'
      ) || '—';

    if (
      uid &&
      nickname
    ) {
      return {
        uid: String(uid),
        nickname,
        level,
        region,
        likes: null,
        clan: null
      };
    }

    return null;
  }

  function paintPlayer() {
    const p =
      state.player;

    if (!p) return;

    $('#vNick').textContent =
      p.nickname || '—';

    $('#vUid').textContent =
      p.uid || '—';

    $('#vLevel').textContent =
      p.level != null
        ? `Lvl ${p.level}`
        : '—';
  }

  function filterCategory(cat) {
    $$('.product').forEach(
      card => {
        card.style.display =
          card.dataset.category === cat
            ? ''
            : 'none';
      }
    );
  }

  function initTabs() {
    $$('.tab').forEach(
      tab => {
        tab.addEventListener(
          'click',
          () => {
            $$('.tab').forEach(
              t =>
                t.classList.remove(
                  'active'
                )
            );

            tab.classList.add(
              'active'
            );

            filterCategory(
              tab.dataset.cat
            );
          }
        );
      }
    );

    filterCategory(
      'diamonds'
    );
  }

  function renderProducts() {
    const grid =
      $('#productGrid');

    if (!grid) return;

    grid.innerHTML =
      Object.entries(
        PRODUCTS
      )
        .map(
          ([id, p]) => `
            <article
              class="product"
              data-category="${p.category}"
              data-id="${id}"
            >

              ${
                p.tag
                  ? `<span class="tag ${p.tag}">
                      ${
                        p.tag === 'best'
                          ? 'Best value'
                          : 'Hot'
                      }
                    </span>`
                  : ''
              }

              <div class="p-icon">
                <img
                  class="p-img"
                  src="${p.image}"
                  alt=""
                  loading="lazy"
                >
              </div>

              <div class="p-amount">
                ${escapeHtml(p.amount)}
              </div>

              <div class="p-name">
                ${escapeHtml(p.name)}
              </div>

              <div class="p-sub">
                ${escapeHtml(p.sub)}
              </div>

              <span class="p-stock">
                ${Math.floor(40 + Math.random() * 361)}
                in stock
              </span>

              <div class="p-foot">
                <div class="p-price-wrap">
                  <span class="p-price">
                    ${money(p.price)}
                    <span class="p-old">
                      ${money(p.old)}
                    </span>
                  </span>
                </div>

                <span class="p-buy">
                  Buy →
                </span>
              </div>

              <span class="p-coupon show">
                🏷️ ${escapeHtml(COUPON)}
                · ${COUPON_DISCOUNT}% OFF
              </span>

            </article>
          `
        )
        .join('');

    filterCategory(
      'diamonds'
    );
  }

  function initCoupon() {
    $$('[data-coupon-copy]').forEach(
      btn => {
        btn.addEventListener(
          'click',
          async () => {
            const original =
              btn.textContent;

            try {
              await navigator.clipboard.writeText(
                COUPON
              );

              btn.textContent =
                'COPIED ✓';

              btn.classList.add(
                'copied'
              );

              showToast(
                `🎉 Coupon ${COUPON} copied — ${COUPON_DISCOUNT}% OFF!`,
                'ok'
              );

            } catch (_) {
              showToast(
                `Coupon code: ${COUPON}`
              );
            }

            setTimeout(
              () => {
                btn.textContent =
                  original;

                btn.classList.remove(
                  'copied'
                );
              },
              2200
            );
          }
        );
      }
    );
  }

  function calc() {
    const subtotal =
      state.order.price *
      state.quantity;

    const discount =
      subtotal *
      (COUPON_DISCOUNT / 100);

    return {
      subtotal,
      discount,
      total:
        subtotal -
        discount
    };
  }

  function renderConfirm() {
    const p =
      state.player;

    const o =
      state.order;

    const t =
      calc();

    $('#cNick').textContent =
      p.nickname;

    $('#cUid').textContent =
      p.uid;

    $('#cQty').textContent =
      state.quantity;

    $('#cUnit').textContent =
      money(
        o.price
      );

    $('#cSubtotal').textContent =
      money(
        t.subtotal
      );

    $('#cDiscount').textContent =
      `−${money(
        t.discount
      )}`;

    $('#cTotal').textContent =
      money(
        t.total
      );

    $('#cCouponLabel').textContent =
      COUPON;

    $('#cDiscountPct').textContent =
      COUPON_DISCOUNT;

    const name =
      state.quantity > 1
        ? `${o.name} × ${state.quantity}`
        : o.name;

    $('#cItem').innerHTML =
      `
        <img
          src="${o.image}"
          alt=""
        >
        <span>
          ${escapeHtml(name)}
        </span>
      `;

    $(
      '#modalQtyControl [data-action="dec"]'
    ).disabled =
      state.quantity <= 1;

    $(
      '#modalQtyControl [data-action="inc"]'
    ).disabled =
      state.quantity >= 99;
  }

  function resetSteps() {
    $('#stepConfirm').style.display =
      'block';

    $('#stepPayment').style.display =
      'none';

    $('#stepUtr').style.display =
      'none';

    $('#stepResult').style.display =
      'none';
  }

  function openPayModal() {
    $('#payModal').classList.add(
      'open'
    );

    document.body.style.overflow =
      'hidden';

    resetSteps();
  }

  function closePayModal() {
    $('#payModal').classList.remove(
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

    state.order =
      null;

    state.quantity =
      1;

    resetSteps();

    const timer =
      $('#qrTimer');

    timer.textContent =
      '⏱️ QR valid for 10:00';

    timer.classList.remove(
      'expired'
    );
  }

  function updateTimer() {
    const m =
      String(
        Math.floor(
          state.timer / 60
        )
      ).padStart(
        2,
        '0'
      );

    const s =
      String(
        state.timer % 60
      ).padStart(
        2,
        '0'
      );

    const el =
      $('#qrTimer');

    el.textContent =
      state.timer > 0
        ? `⏱️ QR valid for ${m}:${s}`
        : '⏱️ QR expired';

    el.classList.toggle(
      'expired',
      state.timer <= 60
    );
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

            $('#paidBtn').disabled =
              true;

            showToast(
              'QR expired. Please restart.',
              'err'
            );
          }
        },
        1000
      );
  }

  function showConfirm(product) {
    state.order =
      product;

    state.quantity =
      1;

    renderConfirm();

    openPayModal();
  }

  function showPayment() {
    if (!state.order) {
      return;
    }

    const totals =
      calc();

    const name =
      state.quantity > 1
        ? `${state.order.name} × ${state.quantity}`
        : state.order.name;

    $('#pNick').textContent =
      state.player.nickname;

    $('#pUid').textContent =
      state.player.uid;

    $('#pItem').innerHTML =
      `
        <img
          src="${state.order.image}"
          alt=""
        >
        <span>
          ${escapeHtml(name)}
        </span>
      `;

    $('#pQty').textContent =
      state.quantity;

    $('#pOrder').textContent =
      state.order.orderId;

    $('#payAmount').textContent =
      money(
        totals.total
      );

    $('#payAmountNote').textContent =
      `after ${COUPON_DISCOUNT}% coupon discount`;

    $('#paySaved').textContent =
      `Saved ${money(
        totals.discount
      )}`;

    $('#payCouponLabel').textContent =
      COUPON;

    /*
      User's own QR image.
      No remote QR generator is used.
    */
    $('#qrImg').src =
      CONFIG.QR_IMAGE;

    $('#paidBtn').disabled =
      false;

    $('#paidBtn').textContent =
      '✓ I have paid';

    $('#stepConfirm').style.display =
      'none';

    $('#stepPayment').style.display =
      'block';

    $('#stepUtr').style.display =
      'none';

    $('#stepResult').style.display =
      'none';

    const demoNotice =
      $('#demoPaymentNotice');

    if (demoNotice) {
      demoNotice.textContent =
        'DEMO PAYMENT: This page does not verify or confirm a real payment automatically. Use the QR for your own test/demo flow.';
    }

    startTimer();
  }

  function showUtr() {
    if (
      state.timer <= 0
    ) {
      showToast(
        'QR expired. Restart the order.',
        'err'
      );

      return;
    }

    clearInterval(
      state.timerId
    );

    state.timerId =
      null;

    $('#stepPayment').style.display =
      'none';

    $('#stepUtr').style.display =
      'block';

    $('#utrNotice').classList.add(
      'show'
    );

    $('#utrInput').value =
      '';

    $('#utrInput').focus();
  }

  function showResult() {
    $('#stepUtr').style.display =
      'none';

    $('#stepResult').style.display =
      'block';

    $('#resultIcon').textContent =
      '🧪';

    $('#resultMsg').textContent =
      'Demo Submission Saved';

    $('#resultSub').textContent =
      'This demo does not verify payment or deliver items automatically.';

    showToast(
      'Demo UTR saved locally.',
      'ok'
    );
  }

  function saveDemoUTR(utr) {
    const totals =
      calc();

    const payload = {
      demo: true,

      order_id:
        state.order.orderId,

      uid:
        state.player.uid,

      nickname:
        state.player.nickname,

      item:
        state.order.name,

      quantity:
        state.quantity,

      unit_price:
        state.order.price,

      subtotal:
        Math.round(
          totals.subtotal * 100
        ) / 100,

      coupon:
        COUPON,

      discount_pct:
        COUPON_DISCOUNT,

      discount_amount:
        Math.round(
          totals.discount * 100
        ) / 100,

      amount:
        Math.round(
          totals.total * 100
        ) / 100,

      utr,

      upi:
        CONFIG.UPI_ID,

      timestamp:
        new Date().toISOString()
    };

    try {
      localStorage.setItem(
        `ff_demo_order_${state.order.orderId}`,
        JSON.stringify(
          payload
        )
      );

      return true;

    } catch (_) {
      return false;
    }
  }

  $('#changeAccount')?.addEventListener(
    'click',
    e => {
      e.preventDefault();

      try {
        [
          'ff_uid',
          'ff_nick',
          'ff_level',
          'ff_region',
          'ff_player'
        ].forEach(
          k => {
            localStorage.removeItem(
              k
            );

            sessionStorage.removeItem(
              k
            );
          }
        );
      } catch (_) {}

      location.href =
        'index.html';
    }
  );

  $('#modalClose')?.addEventListener(
    'click',
    closePayModal
  );

  $('#cancelConfirmBtn')?.addEventListener(
    'click',
    closePayModal
  );

  $('#cancelPayBtn')?.addEventListener(
    'click',
    closePayModal
  );

  $('#resultOkBtn')?.addEventListener(
    'click',
    closePayModal
  );

  $('#payModal')?.addEventListener(
    'click',
    e => {
      if (
        e.target ===
        $('#payModal')
      ) {
        closePayModal();
      }
    }
  );

  $('#modalQtyControl')?.addEventListener(
    'click',
    e => {
      const btn =
        e.target.closest(
          '[data-action]'
        );

      if (
        !btn ||
        !state.order
      ) {
        return;
      }

      state.quantity +=
        btn.dataset.action ===
        'inc'
          ? 1
          : -1;

      state.quantity =
        Math.max(
          1,
          Math.min(
            99,
            state.quantity
          )
        );

      renderConfirm();
    }
  );

  $('#confirmBtn')?.addEventListener(
    'click',
    showPayment
  );

  $('#paidBtn')?.addEventListener(
    'click',
    showUtr
  );

  $('#backToPayBtn')?.addEventListener(
    'click',
    () => {
      $('#stepUtr').style.display =
        'none';

      $('#stepPayment').style.display =
        'block';

      if (
        state.timer > 0
      ) {
        startTimer();
      }
    }
  );

  async function submitUtr() {
    const utr =
      $('#utrInput').value.trim();

    if (!utr) {
      showToast(
        '❌ Enter UTR.',
        'err'
      );

      $('#utrInput').focus();

      return;
    }

    if (
      utr.length < 6
    ) {
      showToast(
        '❌ UTR must be at least 6 characters.',
        'err'
      );

      $('#utrInput').focus();

      return;
    }

    const btn =
      $('#submitUtrBtn');

    btn.disabled =
      true;

    btn.textContent =
      'Saving...';

    const ok =
      saveDemoUTR(
        utr
      );

    if (ok) {
      showResult();

    } else {
      showToast(
        'Could not save demo order locally.',
        'err'
      );

      btn.disabled =
        false;

      btn.textContent =
        'Submit';
    }
  }

  $('#submitUtrBtn')?.addEventListener(
    'click',
    submitUtr
  );

  $('#utrInput')?.addEventListener(
    'keydown',
    e => {
      if (
        e.key ===
        'Enter'
      ) {
        submitUtr();
      }
    }
  );

  $('#downloadQrBtn')?.addEventListener(
    'click',
    () => {
      const a =
        document.createElement(
          'a'
        );

      a.href =
        CONFIG.QR_IMAGE;

      a.download =
        `UPI_QR_${
          state.order?.orderId ||
          'DEMO'
        }.png`;

      document.body.appendChild(
        a
      );

      a.click();

      a.remove();

      showToast(
        '⬇ QR download started.',
        'ok'
      );
    }
  );

  $('#productGrid')?.addEventListener(
    'click',
    e => {
      const card =
        e.target.closest(
          '.product'
        );

      if (!card) return;

      if (!state.player) {
        showToast(
          'Please verify your UID first.',
          'err'
        );

        return;
      }

      const p =
        PRODUCTS[
          card.dataset.id
        ];

      if (!p) return;

      showConfirm({
        ...p,

        orderId:
          `FT${Date.now()}${Math.floor(
            Math.random() * 1000
          )
            .toString()
            .padStart(
              3,
              '0'
            )}`
      });
    }
  );

  function initSalePopup() {
    const sale =
      $('.sale-popup');

    if (!sale) return;

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

  function initReveal() {
    const els =
      $$('.section-head,.product,.verified-bar');

    if (
      !(
        'IntersectionObserver'
        in window
      )
    ) {
      els.forEach(
        el =>
          el.classList.add(
            'in'
          )
      );

      return;
    }

    const io =
      new IntersectionObserver(
        entries => {
          entries.forEach(
            e => {
              if (
                e.isIntersecting
              ) {
                e.target.classList.add(
                  'in'
                );

                io.unobserve(
                  e.target
                );
              }
            }
          );
        },
        {
          threshold: 0.08
        }
      );

    els.forEach(
      el => {
        el.classList.add(
          'reveal'
        );

        io.observe(el);
      }
    );
  }

  async function boot() {
    state.player =
      loadPlayer();

    if (
      !state.player?.uid
    ) {
      showToast(
        'Please verify your UID first.',
        'err'
      );

      setTimeout(
        () => {
          location.href =
            'index.html';
        },
        1600
      );

      return;
    }

    paintPlayer();

    renderProducts();

    try {
      localStorage.setItem(
        'ff_coupon',
        COUPON
      );

      localStorage.setItem(
        'ff_coupon_discount',
        String(
          COUPON_DISCOUNT
        )
      );
    } catch (_) {}

    $('#year').textContent =
      new Date().getFullYear();
  }

  initTheme();
  initNav();
  initTabs();
  initCoupon();
  initSalePopup();
  initReveal();
  boot();

})();
