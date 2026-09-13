/* =========================================================
   FREE FIRE TOP UP - MAIN SCRIPT
   ========================================================= */

const API_URL =
  "https://free-fire-uid-apii.vercel.app/info?uid={UID}";

let currentUID = "";
let selectedPackage = null;
let selectedPrice = 0;

/* =========================================================
   BASIC HELPERS
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}

function showElement(id) {
  const el = $(id);
  if (el) el.style.display = "";
}

function hideElement(id) {
  const el = $(id);
  if (el) el.style.display = "none";
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

/* =========================================================
   UID VERIFY
   ========================================================= */

async function verifyUID() {
  const input =
    $("uidInput") ||
    $("uid") ||
    document.querySelector('input[name="uid"]');

  if (!input) {
    alert("UID input not found.");
    return;
  }

  const uid = input.value.trim();

  if (!uid) {
    alert("Please enter your UID.");
    input.focus();
    return;
  }

  if (!/^\d+$/.test(uid)) {
    alert("UID must contain numbers only.");
    input.focus();
    return;
  }

  if (uid.length < 6) {
    alert("Please enter a valid UID.");
    input.focus();
    return;
  }

  currentUID = uid;

  const button =
    $("verifyBtn") ||
    $("verifyUIDBtn") ||
    document.querySelector('[onclick*="verifyUID"]');

  if (button) {
    button.disabled = true;
    button.dataset.oldText = button.textContent;
    button.textContent = "VERIFYING...";
  }

  try {
    const url = API_URL.replace("{UID}", encodeURIComponent(uid));

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || "Unable to verify UID."
      );
    }

    const player = normalizePlayerData(data, uid);

    if (!player.nickname) {
      throw new Error("Player data not found.");
    }

    /* Save player data */
    localStorage.setItem(
      "ff_player",
      JSON.stringify(player)
    );

    localStorage.setItem("ff_uid", player.uid);
    localStorage.setItem("ff_nickname", player.nickname);
    localStorage.setItem("ff_level", String(player.level));
    localStorage.setItem("ff_region", player.region);
    localStorage.setItem("ff_likes", String(player.likes));
    localStorage.setItem("ff_rank", String(player.rank));
    localStorage.setItem("ff_clan", player.clan);

    fillPlayerData(player);
    openPlayerModal();

  } catch (error) {
    console.error("UID verification error:", error);

    alert(
      error?.message ||
      "Unable to verify UID. Please try again."
    );

  } finally {
    if (button) {
      button.disabled = false;
      button.textContent =
        button.dataset.oldText || "VERIFY UID";
    }
  }
}

/* =========================================================
   NORMALIZE API DATA
   ========================================================= */

function normalizePlayerData(data, uid) {
  const basic =
    data?.basicinfo ||
    data?.basicInfo ||
    data?.player ||
    data?.data?.basicinfo ||
    data?.data?.basicInfo ||
    {};

  const clan =
    data?.clanbasicinfo ||
    data?.clanBasicInfo ||
    data?.data?.clanbasicinfo ||
    data?.data?.clanBasicInfo ||
    {};

  const nickname =
    basic.nickname ??
    data?.nickname ??
    data?.name ??
    data?.playername ??
    "";

  const level =
    basic.level ??
    data?.level ??
    0;

  const region =
    basic.region ??
    data?.region ??
    "IND";

  const likes =
    basic.liked ??
    basic.likes ??
    data?.liked ??
    data?.likes ??
    0;

  const rank =
    basic.rank ??
    data?.rank ??
    0;

  const clanName =
    clan.clanname ??
    clan.name ??
    data?.clanname ??
    "";

  const accountId =
    basic.accountid ??
    basic.accountId ??
    data?.accountid ??
    data?.accountId ??
    uid;

  return {
    uid: String(accountId || uid),
    nickname: String(nickname || ""),
    level: Number(level || 0),
    region: String(region || "IND"),
    likes: Number(likes || 0),
    rank: Number(rank || 0),
    clan: String(clanName || "")
  };
}

/* =========================================================
   PLAYER MODAL
   ========================================================= */

function fillPlayerData(player) {
  setText("playerName", player.nickname || "Player");
  setText("playerNickname", player.nickname || "Player");

  setText("playerUID", player.uid);
  setText("uidValue", player.uid);

  setText("playerLevel", player.level);
  setText("levelValue", player.level);

  setText("playerRegion", player.region);
  setText("regionValue", player.region);

  setText(
    "playerLikes",
    formatNumber(player.likes)
  );

  setText(
    "likesValue",
    formatNumber(player.likes)
  );

  setText(
    "playerRank",
    formatNumber(player.rank)
  );

  setText(
    "rankValue",
    formatNumber(player.rank)
  );

  setText(
    "playerClan",
    player.clan || "No Clan"
  );

  setText(
    "clanValue",
    player.clan || "No Clan"
  );
}

function formatNumber(number) {
  const value = Number(number);

  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString("en-IN");
}

function openPlayerModal() {
  const modal =
    $("playerModal") ||
    document.querySelector(".player-modal");

  if (!modal) return;

  modal.style.display = "flex";
  modal.classList.add("active");

  document.body.classList.add("modal-open");
}

function closePlayerModal() {
  const modal =
    $("playerModal") ||
    document.querySelector(".player-modal");

  if (!modal) return;

  modal.style.display = "none";
  modal.classList.remove("active");

  document.body.classList.remove("modal-open");
}

/* =========================================================
   PROCEED TO STORE
   ========================================================= */

function proceedToStore() {
  let uid = currentUID;

  if (!uid) {
    uid = localStorage.getItem("ff_uid") || "";
  }

  if (!uid) {
    const player = localStorage.getItem("ff_player");

    if (player) {
      try {
        const parsed = JSON.parse(player);
        uid = parsed.uid || "";
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (!uid) {
    alert("Please verify your UID first.");
    return;
  }

  localStorage.setItem("ff_uid", uid);

  window.location.href =
    "store.html?uid=" +
    encodeURIComponent(uid);
}

/* =========================================================
   OPEN STORE
   ========================================================= */

function openStore() {
  proceedToStore();
}

/* =========================================================
   CAROUSEL
   ========================================================= */

let currentSlide = 0;

function setupCarousel() {
  const slides = Array.from(
    document.querySelectorAll(".slide")
  );

  if (!slides.length) return;

  function showSlide(index) {
    currentSlide =
      (index + slides.length) %
      slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle(
        "active",
        i === currentSlide
      );
    });
  }

  window.nextSlide = function () {
    showSlide(currentSlide + 1);
  };

  window.prevSlide = function () {
    showSlide(currentSlide - 1);
  };

  showSlide(0);

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
}

/* =========================================================
   FAQ
   ========================================================= */

function setupFAQ() {
  const questions = document.querySelectorAll(
    ".faq-question"
  );

  questions.forEach(question => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");

      if (!item) return;

      const answer =
        item.querySelector(".faq-answer");

      const isOpen =
        item.classList.contains("active");

      document
        .querySelectorAll(".faq-item.active")
        .forEach(openItem => {
          openItem.classList.remove("active");

          const openAnswer =
            openItem.querySelector(".faq-answer");

          if (openAnswer) {
            openAnswer.style.maxHeight = null;
          }
        });

      if (!isOpen) {
        item.classList.add("active");

        if (answer) {
          answer.style.maxHeight =
            answer.scrollHeight + "px";
        }
      }
    });
  });
}

/* =========================================================
   COUPON
   ========================================================= */

function applyCoupon() {
  const input =
    $("couponInput") ||
    document.querySelector(
      'input[name="coupon"]'
    );

  const result =
    $("couponResult");

  if (!input) return;

  const code =
    input.value
      .trim()
      .toUpperCase();

  if (code === "WEL67") {
    localStorage.setItem(
      "ff_coupon",
      code
    );

    if (result) {
      result.textContent =
        "Coupon applied successfully - 5% OFF";
      result.style.color = "#00ff88";
    }

    return;
  }

  localStorage.removeItem("ff_coupon");

  if (result) {
    result.textContent =
      "Invalid coupon code.";
    result.style.color = "#ff3b30";
  }
}

/* =========================================================
   REVEAL ANIMATIONS
   ========================================================= */

function setupReveal() {
  const elements =
    document.querySelectorAll(
      ".reveal, .fade-in, .scroll-reveal"
    );

  if (!elements.length) return;

  if (
    "IntersectionObserver" in window
  ) {
    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "visible",
                "active",
                "show"
              );

              observer.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.12
        }
      );

    elements.forEach(el =>
      observer.observe(el)
    );
  } else {
    elements.forEach(el =>
      el.classList.add(
        "visible",
        "active",
        "show"
      )
    );
  }
}

/* =========================================================
   SALE POPUP
   ========================================================= */

function setupSalePopup() {
  const popup =
    $("salePopup") ||
    document.querySelector(".sale-popup");

  if (!popup) return;

  const closeBtn =
    popup.querySelector(
      ".close, .close-btn, [data-close]"
    );

  if (closeBtn) {
    closeBtn.addEventListener(
      "click",
      () => {
        popup.classList.remove("active");
        popup.style.display = "none";
      }
    );
  }

  setTimeout(() => {
    popup.classList.add("active");
  }, 3000);
}

/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function setupSmoothScroll() {
  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(link => {
      link.addEventListener(
        "click",
        event => {
          const targetId =
            link.getAttribute("href");

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(
              targetId
            );

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      );
    });
}

/* =========================================================
   BUTTON EVENTS
   ========================================================= */

function setupButtons() {
  document.addEventListener(
    "click",
    event => {
      const target =
        event.target.closest(
          "[data-action]"
        );

      if (!target) return;

      const action =
        target.dataset.action;

      if (action === "verify") {
        verifyUID();
      }

      if (action === "store") {
        proceedToStore();
      }

      if (action === "close-player") {
        closePlayerModal();
      }

      if (action === "coupon") {
        applyCoupon();
      }
    }
  );
}

/* =========================================================
   ENTER KEY FOR UID
   ========================================================= */

function setupUIDEnter() {
  const input =
    $("uidInput") ||
    $("uid");

  if (!input) return;

  input.addEventListener(
    "keydown",
    event => {
      if (event.key === "Enter") {
        event.preventDefault();
        verifyUID();
      }
    }
  );
}

/* =========================================================
   MODAL OUTSIDE CLICK
   ========================================================= */

function setupModalClose() {
  const modal =
    $("playerModal");

  if (!modal) return;

  modal.addEventListener(
    "click",
    event => {
      if (
        event.target === modal
      ) {
        closePlayerModal();
      }
    }
  );
}

/* =========================================================
   CLOSE WITH ESC
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {
    if (event.key !== "Escape") {
      return;
    }

    closePlayerModal();
  }
);

/* =========================================================
   LOAD SAVED PLAYER
   ========================================================= */

function loadSavedPlayer() {
  const saved =
    localStorage.getItem(
      "ff_player"
    );

  if (!saved) return;

  try {
    const player =
      JSON.parse(saved);

    if (!player || !player.uid) {
      return;
    }

    currentUID = player.uid;

    fillPlayerData(player);
  } catch (error) {
    console.error(
      "Saved player error:",
      error
    );
  }
}

/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    setupCarousel();
    setupFAQ();
    setupReveal();
    setupSalePopup();
    setupSmoothScroll();
    setupButtons();
    setupUIDEnter();
    setupModalClose();
    loadSavedPlayer();
  }
);

/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.verifyUID = verifyUID;
window.proceedToStore = proceedToStore;
window.openStore = openStore;
window.openPlayerModal = openPlayerModal;
window.closePlayerModal = closePlayerModal;
window.applyCoupon = applyCoupon;
window.nextSlide =
  window.nextSlide || function () {};
window.prevSlide =
  window.prevSlide || function () {};

/* =========================================================
   END
   ========================================================= */
