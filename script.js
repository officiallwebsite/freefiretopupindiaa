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
   ELEMENT HELPERS
   ========================================= */

function get(id) {
    return document.getElementById(id);
}


/* =========================================
   FORMAT NUMBER
   ========================================= */

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

async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, CONFIG.FETCH_TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        return response;
    } finally {
        clearTimeout(timeout);
    }
}


/* =========================================
   NORMALIZE PLAYER DATA
   ========================================= */

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

    return {
        uid: String(
            basic.accountid ||
            basic.accountId ||
            data?.accountid ||
            data?.accountId ||
            uid
        ),

        nickname: String(
            basic.nickname ||
            data?.nickname ||
            data?.name ||
            "Player"
        ),

        level: Number(
            basic.level ||
            data?.level ||
            0
        ),

        region: String(
            basic.region ||
            data?.region ||
            "IND"
        ),

        likes: Number(
            basic.liked ??
            basic.likes ??
            data?.liked ??
            data?.likes ??
            0
        ),

        rank: Number(
            basic.rank ||
            data?.rank ||
            0
        ),

        clan: String(
            clan.clanname ||
            clan.name ||
            data?.clanname ||
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
   SHOW PLAYER MODAL
   ========================================= */

function showPlayerModal(player) {

    const overlay = get("modalOverlay");
    const modal = get("playerModal");

    if (!overlay || !modal) {
        console.error(
            "Player modal elements not found."
        );
        return;
    }

    get("pNick").textContent =
        player.nickname || "Player";

    get("pSub").textContent =
        "Congratulations — your account is ready!";

    get("pLevel").textContent =
        player.level;

    get("pRegion").textContent =
        player.region;

    get("pLikes").textContent =
        formatNumber(player.likes);

    get("pUid").textContent =
        player.uid;

    get("pClan").textContent =
        player.clan || "No Clan";

    const clanRow = get("rowClan");

    if (clanRow) {
        clanRow.style.display =
            player.clan ? "" : "none";
    }

    overlay.hidden = false;

    overlay.style.display = "flex";

    modal.classList.add("active");

    document.body.classList.add(
        "modal-open"
    );
}


/* =========================================
   CLOSE PLAYER MODAL
   ========================================= */

function closePlayerModal() {

    const overlay = get("modalOverlay");
    const modal = get("playerModal");

    if (!overlay) return;

    overlay.hidden = true;
    overlay.style.display = "none";

    if (modal) {
        modal.classList.remove("active");
    }

    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================
   VERIFY UID
   ========================================= */

async function verifyUID() {

    const input = get("uidInput");
    const button = get("verifyBtn");

    if (!input) {
        console.error(
            "uidInput not found."
        );
        return;
    }

    const uid = input.value.trim();

    if (!uid) {
        input.focus();
        showToast("Please enter your UID.");
        return;
    }

    if (!/^\d+$/.test(uid)) {
        input.focus();
        showToast(
            "UID must contain numbers only."
        );
        return;
    }

    if (uid.length < 6) {
        input.focus();
        showToast(
            "Please enter a valid UID."
        );
        return;
    }

    currentUID = uid;

    const buttonLabel =
        button?.querySelector(".btn-label");

    const spinner =
        button?.querySelector(".spinner");

    if (button) {
        button.disabled = true;
    }

    if (buttonLabel) {
        buttonLabel.textContent =
            "Verifying...";
    }

    if (spinner) {
        spinner.hidden = false;
    }

    try {

        const url =
            CONFIG.API_URL.replace(
                "{UID}",
                encodeURIComponent(uid)
            );

        console.log(
            "Calling UID API:",
            url
        );

        const response =
            await fetchWithTimeout(
                url,
                {
                    method: "GET",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );

        const text =
            await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            console.error(
                "API returned non-JSON:",
                text
            );

            throw new Error(
                "API returned invalid data."
            );
        }

        if (!response.ok) {

            throw new Error(
                data?.error ||
                "UID verification failed."
            );
        }

        console.log(
            "API response:",
            data
        );

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
            "UID verification error:",
            error
        );

        if (
            error.name ===
            "AbortError"
        ) {
            showToast(
                "Request timed out. Please try again."
            );
        } else {
            showToast(
                error.message ||
                "Unable to verify UID."
            );
        }

    } finally {

        if (button) {
            button.disabled = false;
        }

        if (buttonLabel) {
            buttonLabel.textContent =
                "Verify UID";
        }

        if (spinner) {
            spinner.hidden = true;
        }
    }
}


/* =========================================
   PROCEED TO STORE
   ========================================= */

function proceedToStore() {

    let uid = currentUID;

    if (!uid) {
        uid =
            localStorage.getItem(
                "ff_uid"
            ) || "";
    }

    if (!uid) {

        const saved =
            localStorage.getItem(
                "ff_player"
            );

        if (saved) {

            try {

                const player =
                    JSON.parse(saved);

                uid =
                    player.uid || "";

            } catch (error) {

                console.error(
                    error
                );
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

    const input =
        get("uidInput");

    if (input) {

        input.value = "";

        setTimeout(() => {
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

    window.__toastTimer =
        setTimeout(() => {

            toast.hidden = true;

        }, 3000);
}


/* =========================================
   UID FORM
   ========================================= */

function setupUIDForm() {

    const form = get("uidForm");

    if (!form) {
        console.error(
            "uidForm not found."
        );
        return;
    }

    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            verifyUID();
        }
    );
}


/* =========================================
   VERIFY BUTTON
   ========================================= */

function setupVerifyButton() {

    const button = get("verifyBtn");

    if (!button) return;

    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            verifyUID();
        }
    );
}


/* =========================================
   PROCEED BUTTON
   ========================================= */

function setupProceedButton() {

    const button = get("proceedBtn");

    if (!button) return;

    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            proceedToStore();
        }
    );
}


/* =========================================
   CLOSE BUTTONS
   ========================================= */

function setupModalButtons() {

    const close =
        get("modalClose");

    const notMe =
        get("notMeBtn");

    if (close) {

        close.addEventListener(
            "click",
            function() {
                closePlayerModal();
            }
        );
    }

    if (notMe) {

        notMe.addEventListener(
            "click",
            function() {
                reEnterUID();
            }
        );
    }
}


/* =========================================
   CLICK OUTSIDE MODAL
   ========================================= */

function setupOverlay() {

    const overlay =
        get("modalOverlay");

    if (!overlay) return;

    overlay.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                overlay
            ) {
                closePlayerModal();
            }
        }
    );
}


/* =========================================
   ENTER KEY
   ========================================= */

function setupUIDEnter() {

    const input =
        get("uidInput");

    if (!input) return;

    input.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                verifyUID();
            }
        }
    );
}


/* =========================================
   ESC KEY
   ========================================= */

function setupEscape() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Escape"
            ) {

                closePlayerModal();
            }
        }
    );
}


/* =========================================
   YEAR
   ========================================= */

function setupYear() {

    const year =
        get("year");

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

    if (!button) return;

    button.addEventListener(
        "click",
        async function() {

            const code =
                "WEL67";

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
        document.querySelectorAll(
            ".acc-q"
        );

    questions.forEach(
        function(question) {

            question.addEventListener(
                "click",
                function() {

                    const item =
                        question.closest(
                            ".acc-item"
                        );

                    if (!item) return;

                    const answer =
                        item.querySelector(
                            ".acc-a"
                        );

                    const open =
                        item.classList.contains(
                            "active"
                        );

                    document
                        .querySelectorAll(
                            ".acc-item.active"
                        )
                        .forEach(
                            function(other) {

                                other.classList.remove(
                                    "active"
                                );

                                const otherAnswer =
                                    other.querySelector(
                                        ".acc-a"
                                    );

                                if (
                                    otherAnswer
                                ) {
                                    otherAnswer.style.maxHeight =
                                        null;
                                }
                            }
                        );

                    if (!open) {

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
    function() {

        setupUIDForm();
        setupVerifyButton();
        setupProceedButton();
        setupModalButtons();
        setupOverlay();
        setupUIDEnter();
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

window.verifyUID =
    verifyUID;

window.proceedToStore =
    proceedToStore;

window.closePlayerModal =
    closePlayerModal;

window.reEnterUID =
    reEnterUID;
