try {
  if (localStorage.getItem('ff_theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}

window.PRODUCTS = window.PRODUCTS || {
  diamonds: [
    {
      id: 'diamond_100',
      name: '100 Diamonds',
      amount: '100',
      sub: 'Instant delivery',
      price: 80,
      old: 100,
      icon: '💎',
      stock: 999,
      tag: 'best',
      image: 'uploads/products/products_20260618131428_da9e7d.png'
    },
    {
      id: 'diamond_310',
      name: '310 Diamonds',
      amount: '310',
      sub: 'Instant delivery',
      price: 230,
      old: 280,
      icon: '💎',
      stock: 999
    },
    {
      id: 'diamond_520',
      name: '520 Diamonds',
      amount: '520',
      sub: 'Instant delivery',
      price: 380,
      old: 450,
      icon: '💎',
      stock: 999,
      tag: 'hot'
    },
    {
      id: 'diamond_1060',
      name: '1060 Diamonds',
      amount: '1060',
      sub: 'Instant delivery',
      price: 720,
      old: 850,
      icon: '💎',
      stock: 999,
      tag: 'best'
    },
    {
      id: 'diamond_2180',
      name: '2180 Diamonds',
      amount: '2180',
      sub: 'Instant delivery',
      price: 1450,
      old: 1700,
      icon: '💎',
      stock: 999
    }
  ],

  passes: [
    {
      id: 'booyah_pass',
      name: 'Booyah Pass',
      amount: 'Season',
      sub: 'All rewards',
      price: 499,
      old: 599,
      icon: '🎟️',
      stock: 999
    },
    {
      id: 'elite_pass',
      name: 'Elite Pass',
      amount: 'Season',
      sub: 'Premium tier',
      price: 799,
      old: 999,
      icon: '✨',
      stock: 999
    }
  ],

  membership: [
    {
      id: 'weekly_membership',
      name: 'Weekly Membership',
      amount: '7 days',
      sub: 'Daily rewards',
      price: 129,
      old: 160,
      icon: '👑',
      stock: 999
    },
    {
      id: 'monthly_membership',
      name: 'Monthly Membership',
      amount: '30 days',
      sub: 'Daily rewards',
      price: 499,
      old: 600,
      icon: '👑',
      stock: 999
    }
  ],

  special: [
    {
      id: 'special_bundle',
      name: 'Starter Bundle',
      amount: 'Bundle',
      sub: 'Best value pack',
      price: 99,
      old: 200,
      icon: '✨',
      stock: 999,
      tag: 'hot'
    }
  ]
};

(function () {
  'use strict';

  const CONFIG = {
    USE_MOCK: false,
    API_URL: 'https://free-fire-uid-apii.vercel.app/info?uid={UID}',
    API_HEADERS: {},
    API_BASE: 'api/',
    CURRENCY: '₹',
    FETCH_TIMEOUT: 15000
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const money = (n) =>
    `${CONFIG.CURRENCY}${Number(n).toLocaleString('en-IN')}`;

  /* ============================================================
     PLAYER API
     ============================================================ */

  async function fetchPlayerInfo(uid) {
    if (CONFIG.USE_MOCK) return mockPlayerInfo(uid);
    return await fetchPlayerFrom(CONFIG.API_URL, uid);
  }

  async function fetchPlayerFrom(urlTemplate, uid) {
    const url = urlTemplate.replace(
      '{UID}',
      encodeURIComponent(uid)
    );

    const ctrl =
      typeof AbortController !== 'undefined'
        ? new AbortController()
        : null;

    const timer = setTimeout(() => {
      if (ctrl) ctrl.abort();
    }, CONFIG.FETCH_TIMEOUT);

    let res;

    try {
      res = await fetch(url, {
        headers: CONFIG.API_HEADERS,
        cache: 'no-store',
        signal: ctrl ? ctrl.signal : undefined
      });
    } catch (e) {
      clearTimeout(timer);

      const err = new Error(
        e && e.name === 'AbortError'
          ? 'timeout'
          : 'network'
      );

      err.code = err.message;
      throw err;
    }

    clearTimeout(timer);

    if (!res.ok) {
      const e = new Error(`http_${res.status}`);
      e.code = `http_${res.status}`;
      throw e;
    }

    let data;

    try {
      data = await res.json();
    } catch (_) {
      const e = new Error('no_data');
      e.code = 'no_data';
      throw e;
    }

    const player = normalizePlayer(data, uid);

    if (!player) {
      const e = new Error('no_data');
      e.code = 'no_data';
      throw e;
    }

    return player;
  }

  function pickField(obj, keys) {
    if (!obj || typeof obj !== 'object') {
      return undefined;
    }

    for (const k of keys) {
      const v = obj[k];

      if (
        v !== undefined &&
        v !== null &&
        v !== ''
      ) {
        return v;
      }
    }

    return undefined;
  }

  function normalizePlayer(data, uid) {
    if (!data || typeof data !== 'object') {
      return null;
    }

    const d =
      data.data && typeof data.data === 'object'
        ? data.data
        : data;

    const info =
      data.basicinfo ||
      data.basicInfo ||
      d.basicInfo ||
      d.basicinfo ||
      d.AccountInfo ||
      d.account ||
      d.profile ||
      d.player ||
      d;

    const clan =
      data.clanbasicinfo ||
      data.clanBasicInfo ||
      d.clanBasicInfo ||
      d.ClanInfo ||
      d.clan ||
      {};

    const nickname =
      pickField(info, [
        'nickname',
        'name',
        'AccountName',
        'username',
        'nick'
      ]) ||
      pickField(data, [
        'nickname',
        'name',
        'AccountName'
      ]);

    if (!nickname) {
      return null;
    }

    const accountId =
      pickField(info, [
        'accountid',
        'accountId',
        'AccountId',
        'uid',
        'id',
        'AccountUID'
      ]) ||
      pickField(data, [
        'accountid',
        'accountId',
        'uid',
        'id'
      ]);

    const level = pickField(info, [
      'level',
      'AccountLevel',
      'lvl'
    ]);

    const region = pickField(info, [
      'region',
      'AccountRegion',
      'Region'
    ]);

    const liked = pickField(info, [
      'liked',
      'likes',
      'AccountLikes',
      'like'
    ]);

    const elite = pickField(info, [
      'haselitepass',
      'hasElitePass',
      'elitePass',
      'ElitePass'
    ]);

    const clanName = pickField(clan, [
      'clanname',
      'clanName',
      'ClanName',
      'name'
    ]);

    if (
      accountId != null &&
      String(accountId) !== String(uid)
    ) {
      const e = new Error('uid_mismatch');
      e.code = 'uid_mismatch';
      throw e;
    }

    return {
      nickname: String(nickname),
      uid:
        accountId != null
          ? String(accountId)
          : String(uid),
      level:
        level != null
          ? level
          : '—',
      region:
        region || '—',
      likes:
        typeof liked === 'number'
          ? liked
          : liked != null && !isNaN(+liked)
          ? +liked
          : null,
      clan:
        clanName
          ? String(clanName).trim()
          : null,
      elitePass: !!elite
    };
  }

  function mockPlayerInfo(uid) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!/^\d{6,12}$/.test(uid)) {
          reject(new Error('no_data'));
          return;
        }

        const names = [
          'ShadowSlayer',
          'BooyahKing',
          'PhantomX',
          'GhostRider',
          'NoScopeRaj',
          'DesiGamerz',
          'ProBunny',
          'IcyBlaze',
          'VortexFF',
          'LegendAryan'
        ];

        const regions = [
          'IND',
          'SG',
          'BR',
          'ID',
          'ME'
        ];

        const seed = [...uid].reduce(
          (a, c) => a + +c,
          0
        );

        resolve({
          nickname:
            names[seed % names.length] +
            (seed % 97),
          uid,
          level: 20 + (seed % 60),
          region: regions[seed % regions.length],
          likes: seed * 7,
          clan: null,
          elitePass: seed % 2 === 0
        });
      }, 900);
    });
  }

  /* ============================================================
     Player persistence
     ============================================================ */

  const PLAYER_KEY = 'ff_player';

  const savePlayer = (p) => {
    const v = JSON.stringify(p);

    try {
      sessionStorage.setItem(
        PLAYER_KEY,
        v
      );
    } catch (_) {}

    try {
      localStorage.setItem(
        PLAYER_KEY,
        v
      );
    } catch (_) {}
  };

  const loadPlayer = () => {
    try {
      const s =
        sessionStorage.getItem(
          PLAYER_KEY
        );

      if (s) return JSON.parse(s);
    } catch (_) {}

    try {
      const l =
        localStorage.getItem(
          PLAYER_KEY
        );

      return l
        ? JSON.parse(l)
        : null;
    } catch (_) {
      return null;
    }
  };

  const clearPlayer = () => {
    try {
      sessionStorage.removeItem(
        PLAYER_KEY
      );
    } catch (_) {}

    try {
      localStorage.removeItem(
        PLAYER_KEY
      );
    } catch (_) {}
  };

  const state = {
    player: loadPlayer()
  };

  function premiumEmoji(el = document.body) {
    if (window.twemoji) {
      twemoji.parse(el, {
        folder: 'svg',
        ext: '.svg',
        base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/'
      });
    }
  }

  /* ============================================================
     Toast
     ============================================================ */

  function toast(msg, type = '') {
    const t = $('#toast');

    if (!t) return;

    t.textContent = msg;
    t.className = `toast ${type}`;
    t.hidden = false;

    requestAnimationFrame(() => {
      t.classList.add('show');
    });

    clearTimeout(toast._t);

    toast._t = setTimeout(() => {
      t.classList.remove('show');

      setTimeout(() => {
        t.hidden = true;
      }, 300);
    }, 3400);
  }

  /* ============================================================
     Modal helpers
     ============================================================ */

  function openModal(el) {
    if (!el) return;

    el.hidden = false;

    void el.offsetWidth;

    el.classList.add('open');

    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
  }

  function closeModal(el) {
    if (!el) return;

    el.classList.remove('open');

    document.body.style.overflow = '';

    setTimeout(() => {
      el.hidden = true;
    }, 400);

    if (!$$('.modal-overlay.open').length) {
      document.body.classList.remove(
        'modal-open'
      );
    }
  }

  function initModals() {
    $$('.modal-overlay').forEach(
      (ov) => {
        ov.addEventListener(
          'click',
          (e) => {
            if (e.target === ov) {
              closeModal(ov);
            }
          }
        );
      }
    );

    window.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Escape') {
          $$('.modal-overlay.open').forEach(
            closeModal
          );
        }
      }
    );
  }

  /* ============================================================
     Theme
     ============================================================ */

  function initTheme() {
    const btn = $('#themeToggle');

    if (!btn) return;

    const root =
      document.documentElement;

    const setIcon = () => {
      btn.textContent =
        root.classList.contains('dark')
          ? '☀️'
          : '🌙';
    };

    setIcon();

    btn.addEventListener(
      'click',
      () => {
        root.classList.toggle('dark');

        try {
          localStorage.setItem(
            'ff_theme',
            root.classList.contains('dark')
              ? 'dark'
              : 'light'
          );
        } catch (_) {}

        setIcon();
      }
    );
  }

  /* ============================================================
     Navigation
     ============================================================ */

  function initNav() {
    const navToggle = $('#navToggle');
    const mainNav = $('#mainNav');

    if (!navToggle || !mainNav) {
      return;
    }

    navToggle.addEventListener(
      'click',
      () => {
        mainNav.classList.toggle(
          'open'
        );

        navToggle.classList.toggle(
          'open'
        );
      }
    );

    $$('.main-nav a').forEach(
      (a) => {
        a.addEventListener(
          'click',
          () => {
            mainNav.classList.remove(
              'open'
            );

            navToggle.classList.remove(
              'open'
            );
          }
        );
      }
    );
  }

  /* ============================================================
     Reveal on scroll
     ============================================================ */

  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add(
                  'in'
                );

                io.unobserve(e.target);
              }
            });
          },
          {
            threshold: 0.15
          }
        )
      : null;

  function initReveal() {
    $$('.section-head, .step, .uid-card, .acc-item')
      .forEach((el) => {
        el.classList.add('reveal');

        if (io) {
          io.observe(el);
        } else {
          el.classList.add('in');
        }
      });
  }

  /* ============================================================
     Carousel
     ============================================================ */

  function initCarousel() {
    const track =
      $('#carouselTrack');

    if (!track) return;

    const slides =
      $$('.slide', track);

    const dotsWrap =
      $('#carouselDots');

    const total = slides.length;

    let index = 0;
    let timer = null;

    const INTERVAL = 4000;

    dotsWrap.innerHTML =
      slides
        .map(
          (_, i) =>
            `<button role="tab" aria-label="Go to slide ${
              i + 1
            }"${
              i === 0
                ? ' class="active"'
                : ''
            }></button>`
        )
        .join('');

    const dots =
      $$('button', dotsWrap);

    function go(i) {
      index =
        (i + total) % total;

      track.style.transform =
        `translateX(-${index * 100}%)`;

      dots.forEach(
        (d, di) => {
          d.classList.toggle(
            'active',
            di === index
          );
        }
      );
    }

    const next = () =>
      go(index + 1);

    const prev = () =>
      go(index - 1);

    const stop = () => {
      if (timer) {
        clearInterval(timer);
      }
    };

    const start = () => {
      stop();

      timer = setInterval(
        next,
        INTERVAL
      );
    };

    $('#carNext').addEventListener(
      'click',
      () => {
        next();
        start();
      }
    );

    $('#carPrev').addEventListener(
      'click',
      () => {
        prev();
        start();
      }
    );

    dots.forEach(
      (d, i) => {
        d.addEventListener(
          'click',
          () => {
            go(i);
            start();
          }
        );
      }
    );

    const carousel = $('#home');

    carousel.addEventListener(
      'mouseenter',
      stop
    );

    carousel.addEventListener(
      'mouseleave',
      start
    );

    document.addEventListener(
      'visibilitychange',
      () => {
        document.hidden
          ? stop()
          : start();
      }
    );

    let startX = 0;
    let dx = 0;

    track.addEventListener(
      'touchstart',
      (e) => {
        startX =
          e.touches[0].clientX;

        dx = 0;
        stop();
      },
      {
        passive: true
      }
    );

    track.addEventListener(
      'touchmove',
      (e) => {
        dx =
          e.touches[0].clientX -
          startX;
      },
      {
        passive: true
      }
    );

    track.addEventListener(
      'touchend',
      () => {
        if (Math.abs(dx) > 50) {
          dx < 0
            ? next()
            : prev();
        }

        start();
      }
    );

    go(0);
    start();
  }

  /* ============================================================
     UID Flow
     ============================================================ */

  function initUidFlow() {
    const uidForm =
      $('#uidForm');

    if (!uidForm) return;

    const uidInput =
      $('#uidInput');

    const uidHint =
      $('#uidHint');

    const verifyBtn =
      $('#verifyBtn');

    const modalOverlay =
      $('#modalOverlay');

    let busy = false;

    const setLoading = (on) => {
      busy = on;

      verifyBtn.disabled = on;

      $('.btn-label', verifyBtn).textContent =
        on
          ? 'Verifying…'
          : 'Verify UID';

      $('.spinner', verifyBtn).hidden =
        !on;
    };

    const showWarning = (msg) => {
      $('.input-wrap')
        .classList.add(
          'invalid'
        );

      uidHint.classList.add(
        'error'
      );

      uidHint.textContent = msg;
    };

    const clearWarning = () => {
      $('.input-wrap')
        .classList.remove(
          'invalid'
        );

      uidHint.classList.remove(
        'error'
      );

      uidHint.textContent =
        'Your UID is shown on your in-game profile.';
    };

    uidInput.addEventListener(
      'input',
      () => {
        uidInput.value =
          uidInput.value.replace(
            /\D/g,
            ''
          );

        clearWarning();
      }
    );

    async function submit() {
      if (busy) return;

      const uid =
        uidInput.value.trim();

      if (!/^\d{6,12}$/.test(uid)) {
        showWarning(
          'Please enter a valid UID (6–12 digits).'
        );

        uidInput.focus();

        return;
      }

      setLoading(true);
      clearWarning();

      try {
        const player =
          await fetchPlayerInfo(
            uid
          );

        state.player =
          player;

        savePlayer(
          player
        );

        try {
          localStorage.setItem(
            'ff_uid',
            player.uid
          );

          localStorage.setItem(
            'ff_nick',
            player.nickname
          );

          localStorage.setItem(
            'ff_level',
            String(player.level)
          );

          localStorage.setItem(
            'ff_region',
            player.region
          );

          localStorage.setItem(
            'ff_coupon',
            'WEL67'
          );

          localStorage.setItem(
            'ff_coupon_discount',
            '5'
          );
        } catch (_) {}

        showPlayerModal(
          player
        );
      } catch (err) {
        console.error(
          'Verify error:',
          err
        );

        showWarning(
          mapErr(err)
        );
      } finally {
        setLoading(false);
      }
    }

    uidForm.addEventListener(
      'submit',
      (e) => {
        e.preventDefault();
        submit();
      }
    );

    verifyBtn.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        submit();
      }
    );

    function setRow(
      rowSel,
      valSel,
      value
    ) {
      const row =
        $(rowSel);

      if (
        value === null ||
        value === undefined ||
        value === ''
      ) {
        row.hidden = true;
        return;
      }

      row.hidden = false;

      $(valSel).textContent =
        value;
    }

    function showPlayerModal(p) {
      $('#pNick').textContent =
        p.nickname;

      $('#pUid').textContent =
        p.uid;

      $('#pLevel').textContent =
        p.level;

      $('#pRegion').textContent =
        p.region;

      $('#pLikes').textContent =
        p.likes != null
          ? p.likes.toLocaleString(
              'en-IN'
            )
          : '—';

      setRow(
        '#rowClan',
        '#pClan',
        p.clan
      );

      $('#pSub').innerHTML =
        p.elitePass
          ? 'Congratulations — <b style="color:var(--brand-2)">Elite Pass ✨</b> holder!'
          : 'Congratulations — your account is ready!';

      openModal(
        modalOverlay
      );

      premiumEmoji(
        $('#playerModal')
      );

      launchConfetti();
    }

    $('#modalClose').addEventListener(
      'click',
      () => {
        closeModal(
          modalOverlay
        );
      }
    );

    $('#notMeBtn').addEventListener(
      'click',
      () => {
        closeModal(
          modalOverlay
        );

        state.player =
          null;

        clearPlayer();

        try {
          [
            'ff_uid',
            'ff_nick',
            'ff_level',
            'ff_region'
          ].forEach((k) =>
            localStorage.removeItem(
              k
            )
          );
        } catch (_) {}

        uidInput.value = '';

        setTimeout(
          () => uidInput.focus(),
          450
        );
      }
    );

    $('#proceedBtn').addEventListener(
      'click',
      () => {
        const verified =
          state.player;

        if (
          !verified ||
          !verified.uid
        ) {
          closeModal(
            modalOverlay
          );

          uidInput.focus();

          showWarning(
            'Please verify your UID again.'
          );

          return;
        }

        const target =
          new URL(
            './store.html',
            window.location.href
          );

        target.searchParams.set(
          'uid',
          String(
            verified.uid
          )
        );

        target.searchParams.set(
          '_v',
          String(Date.now())
        );

        closeModal(
          modalOverlay
        );

        setTimeout(
          () =>
            window.location.assign(
              target.href
            ),
          200
        );
      }
    );
  }

  function mapErr(err) {
    const code =
      err &&
      (err.code ||
        err.message);

    return code === 'uid_mismatch'
      ? 'Server returned a different account. Please try again.'
      : code === 'timeout'
      ? 'Request timed out. Check your connection and try again.'
      : code === 'network'
      ? 'Network problem. Check your connection and retry.'
      : code === 'http_429'
      ? 'Too many requests. Wait a minute and try again.'
      : code === 'no_data'
      ? 'This UID was not found on Free Fire.'
      : 'Could not verify UID. Please try again.';
  }

  /* ============================================================
     Confetti
     ============================================================ */

  function launchConfetti() {
    const box =
      $('#confetti');

    if (!box) return;

    box.innerHTML = '';

    const colors = [
      '#ff7a18',
      '#ff3d3d',
      '#7b5cff',
      '#22d3ee',
      '#22c55e',
      '#ffd700'
    ];

    for (
      let i = 0;
      i < 60;
      i++
    ) {
      const c =
        document.createElement(
          'i'
        );

      c.style.left =
        Math.random() * 100 +
        '%';

      c.style.background =
        colors[
          i % colors.length
        ];

      c.style.animationDuration =
        1.5 +
        Math.random() * 1.5 +
        's';

      c.style.animationDelay =
        Math.random() * 0.4 +
        's';

      c.style.transform =
        `rotate(${Math.random() * 360}deg)`;

      box.appendChild(c);
    }

    setTimeout(
      () => {
        box.innerHTML = '';
      },
      3500
    );
  }

  /* ============================================================
     FAQ
     ============================================================ */

  function initFaq() {
    $$('.acc-q').forEach(
      (q) => {
        q.addEventListener(
          'click',
          () => {
            const item =
              q.parentElement;

            const open =
              item.classList.contains(
                'open'
              );

            $$('.acc-item').forEach(
              (i) => {
                i.classList.remove(
                  'open'
                );

                const a =
                  $('.acc-a', i);

                if (a) {
                  a.style.maxHeight =
                    null;
                }
              }
            );

            if (!open) {
              item.classList.add(
                'open'
              );

              const a =
                $('.acc-a', item);

              if (a) {
                a.style.maxHeight =
                  a.scrollHeight +
                  'px';
              }
            }
          }
        );
      }
    );

    const first =
      $('.acc-item');

    if (first) {
      first.classList.add(
        'open'
      );

      const a =
        $('.acc-a', first);

      if (a) {
        a.style.maxHeight =
          a.scrollHeight +
          'px';
      }
    }
  }

  /* ============================================================
     Sale popup
     ============================================================ */

  function initSalePops() {
    const names = [
      'Rahul',
      'Aman',
      'Arjun',
      'Karan',
      'Rohit',
      'Vikram',
      'Sahil',
      'Aditya',
      'Dev',
      'Kabir',
      'Ishaan',
      'Sanjay',
      'Aryan',
      'Rohan',
      'Akash',
      'Manish',
      'Nikhil',
      'Yash',
      'Harsh',
      'Raj',
      'Ankit',
      'Varun',
      'Siddharth',
      'Gaurav',
      'Priya',
      'Sneha',
      'Neha',
      'Ananya',
      'Riya'
    ];

    const states = [
      'Delhi',
      'Maharashtra',
      'Uttar Pradesh',
      'Karnataka',
      'Tamil Nadu',
      'West Bengal',
      'Gujarat',
      'Rajasthan',
      'Punjab',
      'Bihar',
      'Madhya Pradesh',
      'Haryana',
      'Kerala',
      'Telangana',
      'Andhra Pradesh',
      'Assam',
      'Odisha',
      'Jharkhand',
      'Chhattisgarh',
      'Goa'
    ];

    const rand = (a) =>
      a[
        Math.floor(
          Math.random() *
            a.length
        )
      ];

    let products =
      Object.values(
        window.PRODUCTS || {}
      ).flat();

    fetch(
      CONFIG.API_BASE +
        'products.php',
      {
        cache: 'no-store'
      }
    )
      .then((r) =>
        r.json()
      )
      .then((d) => {
        if (
          d &&
          d.ok &&
          Array.isArray(
            d.categories
          )
        ) {
          const items =
            d.categories.flatMap(
              (c) =>
                c.items || []
            );

          if (items.length) {
            products =
              items;
          }
        }
      })
      .catch(() => {});

    const pop =
      document.createElement(
        'div'
      );

    pop.className =
      'sale-pop';

    pop.hidden = true;

    document.body.appendChild(
      pop
    );

    const scheduleNext = () =>
      setTimeout(
        show,
        8000 +
          Math.random() * 6000
      );

    function show() {
      if (!products.length) {
        scheduleNext();
        return;
      }

      const p =
        rand(products);

      const mins =
        1 +
        Math.floor(
          Math.random() * 12
        );

      const icon =
        p.image
          ? `<img src="${esc(
              p.image
            )}" alt="">`
          : p.icon || '🎮';

      pop.innerHTML =
        `<div class="sp-icon">${icon}</div>` +
        `<div class="sp-body">` +
        `<strong>${rand(
          names
        )} <span class="sp-state">from ${rand(
          states
        )}</span></strong>` +
        `<span>just bought <b>${esc(
          p.name
        )}</b></span>` +
        `<small><i class="sp-dot"></i>${mins} min ago · Verified ✓</small>` +
        `</div>`;

      premiumEmoji(pop);

      pop.hidden = false;

      requestAnimationFrame(
        () => {
          pop.classList.add(
            'show'
          );
        }
      );

      setTimeout(
        hide,
        4500
      );
    }

    function hide() {
      pop.classList.remove(
        'show'
      );

      setTimeout(
        () => {
          pop.hidden = true;
        },
        500
      );

      scheduleNext();
    }

    setTimeout(
      show,
      5000
    );
  }

  function esc(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[c])
    );
  }

  /* ============================================================
     Coupon copy
     ============================================================ */

  function initCouponCopy() {
    const COUPON = 'WEL67';
    const PCT = 5;

    try {
      localStorage.setItem(
        'ff_coupon',
        COUPON
      );

      localStorage.setItem(
        'ff_coupon_discount',
        String(PCT)
      );
    } catch (_) {}

    $$('[data-coupon-copy]').forEach(
      (btn) => {
        btn.addEventListener(
          'click',
          () => {
            const orig =
              btn.textContent;

            const done = () => {
              btn.textContent =
                'COPIED ✓';

              btn.classList.add(
                'copied'
              );

              toast(
                `🎉 Coupon ${COUPON} copied — ${PCT}% OFF on every product!`
              );
            };

            const fail = () =>
              toast(
                `Coupon code: ${COUPON} (${PCT}% OFF)`
              );

            const reset = () =>
              setTimeout(
                () => {
                  btn.textContent =
                    orig;

                  btn.classList.remove(
                    'copied'
                  );
                },
                2200
              );

            if (
              navigator.clipboard &&
              window.isSecureContext
            ) {
              navigator.clipboard
                .writeText(
                  COUPON
                )
                .then(done)
                .catch(fail)
                .finally(reset);
            } else {
              try {
                const ta =
                  document.createElement(
                    'textarea'
                  );

                ta.value =
                  COUPON;

                ta.style.position =
                  'fixed';

                ta.style.opacity =
                  '0';

                document.body.appendChild(
                  ta
                );

                ta.select();

                document.execCommand(
                  'copy'
                );

                document.body.removeChild(
                  ta
                );

                done();
              } catch (_) {
                fail();
              }

              reset();
            }
          }
        );
      }
    );
  }

  /* ============================================================
     Boot
     ============================================================ */

  function init() {
    initTheme();
    initNav();
    initModals();
    initCarousel();
    initUidFlow();
    initFaq();
    initSalePops();
    initCouponCopy();
    initReveal();
    premiumEmoji();

    const y =
      $('#year');

    if (y) {
      y.textContent =
        new Date().getFullYear();
    }
  }

  init();
})();
