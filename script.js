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
    const input = document.getElementById("uidInput");
    const button = document.getElementById("verifyBtn");

    if (!input) {
        alert("uidInput not found");
        return;
    }

    const uid = input.value.trim();

    if (!uid) {
        alert("Please enter your UID");
        return;
    }

    if (!/^\d+$/.test(uid)) {
        alert("UID must contain numbers only");
        return;
    }

    if (uid.length < 6) {
        alert("UID must be at least 6 digits");
        return;
    }

    if (button) {
        button.disabled = true;

        const label = button.querySelector(".btn-label");
        const spinner = button.querySelector(".spinner");

        if (label) {
            label.textContent = "Verifying...";
        }

        if (spinner) {
            spinner.hidden = false;
        }
    }

    const apiUrl =
        "https://free-fire-uid-apii.vercel.app/info?uid=" +
        encodeURIComponent(uid);

    console.log("UID:", uid);
    console.log("API:", apiUrl);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        console.log("HTTP STATUS:", response.status);

        const text = await response.text();

        console.log("RAW API RESPONSE:", text);

        if (!response.ok) {
            alert(
                "API ERROR\n\nHTTP Status: " +
                response.status +
                "\n\n" +
                text.substring(0, 500)
            );
            return;
        }

        let data;

        try {
            data = JSON.parse(text);
        } catch (e) {
            alert(
                "API JSON ERROR\n\n" +
                text.substring(0, 500)
            );
            return;
        }

        console.log("API JSON:", data);

        const basic = data.basicinfo || {};
        const clan = data.clanbasicinfo || {};

        const nickname =
            basic.nickname ||
            data.nickname ||
            "Player";

        const level =
            basic.level ||
            data.level ||
            0;

        const region =
            basic.region ||
            data.region ||
            "IND";

        const likes =
            basic.liked ??
            basic.likes ??
            data.liked ??
            data.likes ??
            0;

        const clanName =
            clan.clanname ||
            clan.name ||
            "";

        const player = {
            uid: String(
                basic.accountid ||
                uid
            ),
            nickname: String(nickname),
            level: Number(level),
            region: String(region),
            likes: Number(likes),
            clan: String(clanName)
        };

        console.log(
            "FINAL PLAYER DATA:",
            player
        );

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
            "ff_clan",
            player.clan
        );

        /* PLAYER MODAL */

        const overlay =
            document.getElementById("modalOverlay");

        const modal =
            document.getElementById("playerModal");

        if (!overlay || !modal) {
            alert(
                "Player modal HTML not found.\n\n" +
                "modalOverlay = " +
                !!overlay +
                "\n" +
                "playerModal = " +
                !!modal
            );
            return;
        }

        document.getElementById("pNick").textContent =
            player.nickname;

        document.getElementById("pLevel").textContent =
            player.level;

        document.getElementById("pRegion").textContent =
            player.region;

        document.getElementById("pLikes").textContent =
            Number(player.likes).toLocaleString("en-IN");

        document.getElementById("pUid").textContent =
            player.uid;

        document.getElementById("pClan").textContent =
            player.clan || "No Clan";

        const clanRow =
            document.getElementById("rowClan");

        if (clanRow) {
            clanRow.style.display =
                player.clan ? "" : "none";
        }

        overlay.hidden = false;
        overlay.style.display = "flex";

        modal.classList.add("active");

        document.body.classList.add("modal-open");

        console.log("PLAYER MODAL OPENED");

    } catch (error) {

        console.error(
            "VERIFY UID ERROR:",
            error
        );

        alert(
            "VERIFY FAILED\n\n" +
            error.name +
            "\n\n" +
            error.message
        );

    } finally {

        if (button) {
            button.disabled = false;

            const label =
                button.querySelector(".btn-label");

            const spinner =
                button.querySelector(".spinner");

            if (label) {
                label.textContent = "Verify UID";
            }

            if (spinner) {
                spinner.hidden = true;
            }
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
