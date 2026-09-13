'use strict';

(() => {
  const CONFIG = {
    API_URL: 'https://free-fire-uid-apii.vercel.app/info?uid={UID}',
    FETCH_TIMEOUT: 15000,
    COUPON: 'WEL67',
    DISCOUNT: 5
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const modalOverlay = $('#modalOverlay');
  const state = { player: loadPlayer() };

  try {
    if (localStorage.getItem('ff_theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (_) {}

  function savePlayer(p) {
    const raw = JSON.stringify(p);
    try { sessionStorage.setItem('ff_player', raw); } catch (_) {}
    try { localStorage.setItem('ff_player', raw); } catch (_) {}
  }

  function loadPlayer() {
    try {
      const s = sessionStorage.getItem('ff_player');
      if (s) return JSON.parse(s);
    } catch (_) {}

    try {
      const s = localStorage.getItem('ff_player');
      return s ? JSON.parse(s) : null;
    } catch (_) {
      return null;
    }
  }

  function clearPlayer() {
    try { sessionStorage.removeItem('ff_player'); } catch (_) {}
    try { localStorage.removeItem('ff_player'); } catch (_) {}
  }

  function toast(msg, type = '') {
    const t = $('#toast');
    if (!t) return;

    t.textContent = msg;
    t.className = `toast ${type}`;
    t.hidden = false;

    requestAnimationFrame(() => t.classList.add('show'));

    clearTimeout(toast._t);

    toast._t = setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => {
        t.hidden = true;
      }, 300);
    }, 3200);
  }

  function openModal(el) {
    if (!el) return;

    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('open');

    document.body.style.overflow = 'hidden';
  }

  function closeModal(el) {
    if (!el) return;

    el.classList.remove('open');
    document.body.style.overflow = '';

    setTimeout(() => {
      el.hidden = true;
    }, 400);
  }

  function pickField(obj, keys) {
    if (!obj || typeof obj !== 'object') return undefined;

    for (const key of keys) {
      const value = obj[key];

      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        return value;
      }
    }

    return undefined;
  }

  function normalizePlayer(data, uid) {
    if (!data || typeof data !== 'object') {
      return null;
    }

    const d =
      data.data &&
      typeof data.data === 'object'
        ? data.data
        : data;

    const info =
      data.basicinfo ||
      data.basicInfo ||
      d.basicinfo ||
      d.basicInfo ||
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
          : (
              liked != null &&
              !isNaN(+liked)
            )
            ? +liked
            : null,
      clan:
        clanName
          ? String(clanName).trim()
          : null,
      elitePass: !!elite
    };
  }

  async function fetchPlayer(uid) {
    const url =
      CONFIG.API_URL.replace(
        '{UID}',
        encodeURIComponent(uid)
      );

    const controller =
      typeof AbortController !== 'undefined'
        ? new AbortController()
        : null;

    const timer = setTimeout(() => {
      if (controller) {
        controller.abort();
      }
    }, CONFIG.FETCH_TIMEOUT);

    try {
      const res = await fetch(url, {
        cache: 'no-store',
        signal: controller
          ? controller.signal
          : undefined
      });

      if (!res.ok) {
        const e = new Error(
          `http_${res.status}`
        );
        e.code = `http_${res.status}`;
        throw e;
      }

      const data = await res.json();

      const player =
        normalizePlayer(data, uid);

      if (!player) {
        const e = new Error('no_data');
        e.code = 'no_data';
        throw e;
      }

      return player;

    } catch (e) {
      const err = new Error(
        e?.name === 'AbortError'
          ? 'timeout'
          : (
              e?.code ||
              'network'
            )
      );

      err.code = err.message;
      throw err;

    } finally {
      clearTimeout(timer);
    }
  }

  function mapError(err) {
    switch (
      err?.code ||
      err?.message
    ) {
      case 'uid_mismatch':
        return 'Server returned a different account. Please try again.';

      case 'timeout':
        return 'Request timed out. Check your connection and try again.';

      case 'network':
        return 'Network problem. Check your connection and retry.';

      case 'http_429':
        return 'Too many requests. Wait a minute and try again.';

      case 'no_data':
        return 'This UID was not found.';

      default:
        return 'Could not verify UID. Please try again.';
    }
  }

  function showPlayer(player) {
    $('#pNick').textContent =
      player.nickname;

    $('#pUid').textContent =
      player.uid;

    $('#pLevel').textContent =
      player.level;

    $('#pRegion').textContent =
      player.region;

    $('#pLikes').textContent =
      player.likes != null
        ? player.likes.toLocaleString('en-IN')
        : '—';

    const clanRow =
      $('#rowClan');

    if (player.clan) {
      clanRow.hidden = false;
      $('#pClan').textContent =
        player.clan;
    } else {
      clanRow.hidden = true;
    }

    $('#pSub').textContent =
      player.elitePass
        ? 'Congratulations — Elite Pass holder!'
        : 'Congratulations — your account is ready!';

    openModal(
      modalOverlay
    );

    launchConfetti();
  }

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
      const piece =
        document.createElement(
          'i'
        );

      piece.style.left =
        `${Math.random() * 100}%`;

      piece.style.background =
        colors[
          i % colors.length
        ];

      piece.style.animationDuration =
        `${1.5 + Math.random() * 1.5}s`;

      piece.style.animationDelay =
        `${Math.random() * 0.4}s`;

      piece.style.transform =
        `rotate(${Math.random() * 360}deg)`;

      box.appendChild(
        piece
      );
    }

    setTimeout(() => {
      box.innerHTML = '';
    }, 3500);
  }

  function initTheme() {
    const btn =
      $('#themeToggle');

    if (!btn) return;

    const setIcon = () => {
      btn.textContent =
        document.documentElement.classList.contains('dark')
          ? '☀️'
          : '🌙';
    };

    setIcon();

    btn.addEventListener(
      'click',
      () => {
        document.documentElement.classList.toggle(
          'dark'
        );

        try {
          localStorage.setItem(
            'ff_theme',
            document.documentElement.classList.contains('dark')
              ? 'dark'
              : 'light'
          );
        } catch (_) {}

        setIcon();
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
      () => {
        nav.classList.toggle(
          'open'
        );
      }
    );

    $$('.main-nav a').forEach(
      a =>
        a.addEventListener(
          'click',
          () => {
            nav.classList.remove(
              'open'
            );
          }
        )
    );
  }

  function initCarousel() {
    const track =
      $('#carouselTrack');

    if (!track) return;

    const slides =
      $$('.slide', track);

    const dotsWrap =
      $('#carouselDots');

    let index = 0;
    let timer = null;

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

    const go = i => {
      index =
        (i + slides.length) %
        slides.length;

      track.style.transform =
        `translateX(-${index * 100}%)`;

      dots.forEach(
        (d, n) => {
          d.classList.toggle(
            'active',
            n === index
          );
        }
      );
    };

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

      timer =
        setInterval(
          next,
          4000
        );
    };

    $('#carNext')?.addEventListener(
      'click',
      () => {
        next();
        start();
      }
    );

    $('#carPrev')?.addEventListener(
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

    $('#home')?.addEventListener(
      'mouseenter',
      stop
    );

    $('#home')?.addEventListener(
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
      e => {
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
      e => {
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
        if (
          Math.abs(dx) > 50
        ) {
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

  function initFAQ() {
    $$('.acc-q').forEach(
      q => {
        q.addEventListener(
          'click',
          () => {
            const item =
              q.parentElement;

            const wasOpen =
              item.classList.contains(
                'open'
              );

            $$('.acc-item').forEach(
              i => {
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

            if (!wasOpen) {
              item.classList.add(
                'open'
              );

              const a =
                $('.acc-a', item);

              if (a) {
                a.style.maxHeight =
                  `${a.scrollHeight}px`;
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
          `${a.scrollHeight}px`;
      }
    }
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
                CONFIG.COUPON
              );

              btn.textContent =
                'COPIED ✓';

              btn.classList.add(
                'copied'
              );

              toast(
                `🎉 Coupon ${CONFIG.COUPON} copied — ${CONFIG.DISCOUNT}% OFF!`,
                'ok'
              );

            } catch (_) {
              toast(
                `Coupon code: ${CONFIG.COUPON} (${CONFIG.DISCOUNT}% OFF)`
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

  function initReveal() {
    const elements =
      $$('.section-head,.step,.uid-card,.acc-item');

    if (
      !('IntersectionObserver' in window)
    ) {
      elements.forEach(
        el => el.classList.add('in')
      );

      return;
    }

    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(
            entry => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  'in'
                );

                observer.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.15
        }
      );

    elements.forEach(
      el => {
        el.classList.add(
          'reveal'
        );

        observer.observe(el);
      }
    );
  }

  function initSalePopup() {
    const pop =
      document.querySelector(
        '.sale-popup'
      );

    if (!pop) return;

    setTimeout(
      () =>
        pop.removeAttribute(
          'hidden'
        ),
      4000
    );

    setTimeout(
      () =>
        pop.setAttribute(
          'hidden',
          ''
        ),
      19000
    );
  }

  function initUID() {
    const form =
      $('#uidForm');

    if (!form) return;

    const input =
      $('#uidInput');

    const hint =
      $('#uidHint');

    const button =
      $('#verifyBtn');

    let busy = false;

    const loading =
      on => {
        busy = on;

        button.disabled =
          on;

        $('.btn-label', button).textContent =
          on
            ? 'Verifying…'
            : 'Verify UID';

        $('.spinner', button).hidden =
          !on;
      };

    const warn =
      msg => {
        $('.input-wrap')
          .classList.add(
            'invalid'
          );

        hint.classList.add(
          'error'
        );

        hint.textContent =
          msg;
      };

    const clearWarn =
      () => {
        $('.input-wrap')
          .classList.remove(
            'invalid'
          );

        hint.classList.remove(
          'error'
        );

        hint.textContent =
          'Your UID is shown on your in-game profile.';
      };

    input.addEventListener(
      'input',
      () => {
        input.value =
          input.value.replace(
            /\D/g,
            ''
          );

        clearWarn();
      }
    );

    form.addEventListener(
      'submit',
      async e => {
        e.preventDefault();

        if (busy) return;

        const uid =
          input.value.trim();

        if (
          !/^\d{6,12}$/.test(uid)
        ) {
          warn(
            'Please enter a valid UID (6–12 digits).'
          );

          input.focus();

          return;
        }

        loading(true);
        clearWarn();

        try {
          const player =
            await fetchPlayer(uid);

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
              CONFIG.COUPON
            );

            localStorage.setItem(
              'ff_coupon_discount',
              String(CONFIG.DISCOUNT)
            );
          } catch (_) {}

          showPlayer(
            player
          );

        } catch (err) {
          console.error(err);
          warn(
            mapError(err)
          );

        } finally {
          loading(false);
        }
      }
    );
  }

  $('#modalClose')?.addEventListener(
    'click',
    () =>
      closeModal(
        modalOverlay
      )
  );

  $('#notMeBtn')?.addEventListener(
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
        ].forEach(
          k =>
            localStorage.removeItem(k)
        );
      } catch (_) {}

      const input =
        $('#uidInput');

      if (input) {
        input.value = '';

        setTimeout(
          () =>
            input.focus(),
          450
        );
      }
    }
  );

  $('#proceedBtn')?.addEventListener(
    'click',
    () => {
      if (!state.player?.uid) {
        closeModal(
          modalOverlay
        );

        toast(
          'Please verify your UID again.',
          'err'
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
          state.player.uid
        )
      );

      target.searchParams.set(
        '_v',
        String(
          Date.now()
        )
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

  document.addEventListener(
    'keydown',
    e => {
      if (e.key === 'Escape') {
        closeModal(
          modalOverlay
        );
      }
    }
  );

  const year =
    $('#year');

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

  initTheme();
  initNav();
  initCarousel();
  initFAQ();
  initCoupon();
  initReveal();
  initSalePopup();
  initUID();

})();
