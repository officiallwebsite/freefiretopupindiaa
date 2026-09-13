"use strict";

/* =========================================
   FREE FIRE TOP UP
   UID VERIFICATION SCRIPT
   ========================================= */

const CONFIG = {
    API_URL: "https://free-fire-uid-apii.vercel.app/info?uid={UID}",
    FETCH_TIMEOUT: 15000
};

let currentUID = "";

/* =========================================
   HELPER
   ========================================= */

function get(id) {
    return document.getElementById(id);
}

function formatNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN");
}

/* =========================================
   FETCH WITH TIMEOUT
   ========================================= */

async function fetchWithTimeout(url) {
    const controller = new AbortController();

    const timer = setTimeout(function () {
        controller.abort();
    }, CONFIG.FETCH_TIMEOUT);

    try {
        return await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store",
            signal: controller.signal
        });
    } finally {
        clearTimeout(timer);
    }
}

/* =========================================
   NORMALIZE API DATA
   ========================================= */

function normalizePlayerData(data, uid) {
    const basic = data.basicinfo || {};
    const clan = data.clanbasicinfo || {};

    return {
        uid: String(
            basic.accountid ||
            basic.accountId ||
            uid
        ),

        nickname: String(
            basic.nickname ||
            data.nickname ||
            data.name ||
            "Player"
        ),

        level: Number(
            basic.level ||
            data.level ||
            0
        ),

        region: String(
            basic.region ||
            data.region ||
            "IND"
        ),

        likes: Number(
            basic.liked ??
            basic.likes ??
            data.liked ??
            data.likes ??
            0
        ),

        rank: Number(
            basic.rank ||
            data.rank ||
            0
        ),

        clan: String(
            clan.clanname ||
            clan.name ||
            data.clanname ||
            ""
        )
    };
}

/* =========================================
   SAVE PLAYER
   ========================================= */

function savePlayer(player) {
    localStorage.setItem(
        "ff_player",
        JSON.stringify(player)
    );

    localStorage.setItem(
        "ff_uid",
        player.uid
    );

    localStorage.setItem(
        "ff_nickname",
        player.nickname
    );

    localStorage.setItem(
        "ff_level",
        String(player.level)
    );

    localStorage.setItem(
        "ff_region",
        player.region
    );

    localStorage.setItem(
        "ff_likes",
        String(player.likes)
    );

    localStorage.setItem(
        "ff_rank",
        String(player.rank)
    );

    localStorage.setItem(
        "ff_clan",
        player.clan
    );
}

/* =========================================
   OPEN PLAYER MODAL
   ========================================= */

function showPlayerModal(player) {
    const overlay = get("modalOverlay");
    const modal = get("playerModal");

    if (!overlay || !modal) {
        alert("Player modal HTML not found.");
        return;
    }

    const pNick = get("pNick");
    const pSub = get("pSub");
    const pLevel = get("pLevel");
    const pRegion = get("pRegion");
    const pLikes = get("pLikes");
    const pUid = get("pUid");
    const pClan = get("pClan");
    const rowClan = get("rowClan");

    if (pNick) {
        pNick.textContent = player.nickname;
    }

    if (pSub) {
        pSub.textContent =
            "Congratulations — your account is ready!";
    }

    if (pLevel) {
        pLevel.textContent = player.level;
    }

    if (pRegion) {
        pRegion.textContent = player.region;
    }

    if (pLikes) {
        pLikes.textContent =
            formatNumber(player.likes);
    }

    if (pUid) {
        pUid.textContent = player.uid;
    }

    if (pClan) {
        pClan.textContent =
            player.clan || "No Clan";
    }

    if (rowClan) {
        rowClan.style.display =
            player.clan ? "" : "none";
    }

    overlay.hidden = false;
    overlay.style.display = "flex";

    modal.classList.add("active");

    document.body.classList.add("modal-open");
}

/* =========================================
   CLOSE PLAYER MODAL
   ========================================= */

function closePlayerModal() {
    const overlay = get("modalOverlay");
    const modal = get("playerModal");

    if (overlay) {
        overlay.hidden = true;
        overlay.style.display = "none";
    }

    if (modal) {
        modal.classList.remove("active");
    }

    document.body.classList.remove("modal-open");
}

/* =========================================
   VERIFY UID
   ========================================= */

async function verifyUID() {
    const input = get("uidInput");
    const button = get("verifyBtn");

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

    if (!/^[0-9]+$/.test(uid)) {
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

    let label = null;
    let spinner = null;

    if (button) {
        button.disabled = true;

        label = button.querySelector(".btn-label");
        spinner = button.querySelector(".spinner");

        if (label) {
            label.textContent = "Verifying...";
        }

        if (spinner) {
            spinner.hidden = false;
        }
    }

    const apiUrl =
        CONFIG.API_URL.replace(
            "{UID}",
            encodeURIComponent(uid)
        );

    try {
        console.log("Calling API:", apiUrl);

        const response =
            await fetchWithTimeout(apiUrl);

        const text =
            await response.text();

        console.log(
            "HTTP STATUS:",
            response.status
        );

        console.log(
            "API RESPONSE:",
            text
        );

        if (!response.ok) {
            throw new Error(
                "API returned HTTP " +
                response.status
            );
        }

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            throw new Error(
                "API returned invalid JSON."
            );
        }

        const player =
            normalizePlayerData(
                data,
                uid
            );

        if (
            !player.nickname ||
            player.nickname === "Player"
        ) {
            throw new Error(
                "Player information not found."
            );
        }

        savePlayer(player);

        showPlayerModal(player);

    } catch (error) {
        console.error(
            "UID verification failed:",
            error
        );

        if (
            error &&
            error.name === "AbortError"
        ) {
            alert(
                "Verification timed out. Please try again."
            );
        } else {
            alert(
                error.message ||
                "Unable to verify UID."
            );
        }

    } finally {
        if (button) {
            button.disabled = false;
        }

        if (label) {
            label.textContent = "Verify UID";
        }

        if (spinner) {
            spinner.hidden = true;
        }
    }
}

/* =========================================
   VERIFY BUTTON
   ========================================= */

function setupVerifyButton() {
    const button = get("verifyBtn");

    if (!button) {
        console.error("verifyBtn not found.");
        return;
    }

    button.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            event.stopPropagation();

            verifyUID();
        }
    );
}

/* =========================================
   PROCEED TO STORE
   ========================================= */

function proceedToStore() {
    let uid = currentUID;

    if (!uid) {
        uid =
            localStorage.getItem("ff_uid") ||
            "";
    }

    if (!uid) {
        const saved =
            localStorage.getItem("ff_player");

        if (saved) {
            try {
                const player =
                    JSON.parse(saved);

                uid = player.uid || "";
            } catch (error) {
                console.error(error);
            }
        }
    }

    if (!uid) {
        showToast(
            "Please verify your UID first."
        );
        return;
    }

    localStorage.setItem(
        "ff_uid",
        uid
    );

    window.location.href =
        "./store.html?uid=" +
        encodeURIComponent(uid);
}

/* =========================================
   RE-ENTER UID
   ========================================= */

function reEnterUID() {
    closePlayerModal();

    const input = get("uidInput");

    if (input) {
        input.value = "";

        setTimeout(function () {
            input.focus();
        }, 100);
    }
}

/* =========================================
   TOAST
   ========================================= */

function showToast(message) {
    const toast = get("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.hidden = false;

    clearTimeout(
        window.__toastTimer
    );

    window.__toastTimer = setTimeout(
        function () {
            toast.hidden = true;
        },
        3000
    );
}

/* =========================================
   MODAL BUTTONS
   ========================================= */

function setupModalButtons() {
    const closeButton = get("modalClose");
    const notMeButton = get("notMeBtn");
    const proceedButton = get("proceedBtn");

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                closePlayerModal();
            }
        );
    }

    if (notMeButton) {
        notMeButton.addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                reEnterUID();
            }
        );
    }

    if (proceedButton) {
        proceedButton.addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                proceedToStore();
            }
        );
    }
}

/* =========================================
   OVERLAY
   ========================================= */

function setupOverlay() {
    const overlay = get("modalOverlay");

    if (!overlay) {
        return;
    }

    overlay.addEventListener(
        "click",
        function (event) {
            if (event.target === overlay) {
                closePlayerModal();
            }
        }
    );
}

/* =========================================
   ESCAPE
   ========================================= */

function setupEscape() {
    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Escape") {
                closePlayerModal();
            }
        }
    );
}

/* =========================================
   YEAR
   ========================================= */

function setupYear() {
    const year = get("year");

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }
}

/* =========================================
   COPY COUPON
   ========================================= */

function setupCoupon() {
    const button =
        document.querySelector(
            "[data-coupon-copy]"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        async function () {
            const code = "WEL67";

            try {
                await navigator.clipboard.writeText(
                    code
                );

                showToast(
                    "Coupon copied: WEL67"
                );
            } catch (error) {
                showToast(
                    "Coupon: WEL67"
                );
            }
        }
    );
}

/* =========================================
   FAQ
   ========================================= */

function setupFAQ() {
    const questions =
        document.querySelectorAll(".acc-q");

    questions.forEach(
        function (question) {
            question.addEventListener(
                "click",
                function () {
                    const item =
                        question.closest(
                            ".acc-item"
                        );

                    if (!item) {
                        return;
                    }

                    const answer =
                        item.querySelector(
                            ".acc-a"
                        );

                    const wasOpen =
                        item.classList.contains(
                            "active"
                        );

                    document
                        .querySelectorAll(
                            ".acc-item.active"
                        )
                        .forEach(
                            function (openItem) {
                                openItem.classList.remove(
                                    "active"
                                );

                                const openAnswer =
                                    openItem.querySelector(
                                        ".acc-a"
                                    );

                                if (openAnswer) {
                                    openAnswer.style.maxHeight =
                                        null;
                                }
                            }
                        );

                    if (!wasOpen) {
                        item.classList.add(
                            "active"
                        );

                        if (answer) {
                            answer.style.maxHeight =
                                answer.scrollHeight +
                                "px";
                        }
                    }
                }
            );
        }
    );
}

/* =========================================
   PAGE LOAD
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        setupVerifyButton();
        setupModalButtons();
        setupOverlay();
        setupEscape();
        setupYear();
        setupCoupon();
        setupFAQ();

        console.log(
            "Free Fire Top Up script loaded successfully."
        );
    }
);

/* =========================================
   GLOBAL FUNCTIONS
   ========================================= */

window.verifyUID = verifyUID;
window.proceedToStore = proceedToStore;
window.closePlayerModal = closePlayerModal;
window.reEnterUID = reEnterUID;
