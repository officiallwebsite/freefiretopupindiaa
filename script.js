"use strict";

/* =====================================================
   FREE FIRE TOP UP - UID VERIFICATION
   ===================================================== */

if (!window.__FF_UID_SCRIPT_STARTED__) {

    window.__FF_UID_SCRIPT_STARTED__ = true;

    let currentUID = "";

    const API_URL =
        "https://free-fire-uid-apii.vercel.app/info?uid=";


    /* =================================================
       HELPER
       ================================================= */

    function get(id) {
        return document.getElementById(id);
    }


    function formatNumber(value) {
        const n = Number(value);

        if (!Number.isFinite(n)) {
            return "0";
        }

        return n.toLocaleString("en-IN");
    }


    /* =================================================
       UID VERIFICATION
       ================================================= */

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

        if (button) {
            button.disabled = true;

            const label =
                button.querySelector(".btn-label");

            const spinner =
                button.querySelector(".spinner");

            if (label) {
                label.textContent = "Verifying...";
            }

            if (spinner) {
                spinner.hidden = false;
            }
        }

        const apiUrl =
            API_URL +
            encodeURIComponent(uid);

        console.log(
            "Calling API:",
            apiUrl
        );

        try {

            const response =
                await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Accept":
                            "application/json"
                    },
                    cache: "no-store"
                });

            console.log(
                "HTTP STATUS:",
                response.status
            );

            const text =
                await response.text();

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
            } catch (e) {
                throw new Error(
                    "Invalid JSON received from API."
                );
            }

            console.log(
                "PARSED API DATA:",
                data
            );


            /* =========================================
               PLAYER DATA
               ========================================= */

            const basic =
                data &&
                data.basicinfo
                    ? data.basicinfo
                    : {};

            const clan =
                data &&
                data.clanbasicinfo
                    ? data.clanbasicinfo
                    : {};

            const player = {

                uid: String(
                    basic.accountid ||
                    uid
                ),

                nickname: String(
                    basic.nickname ||
                    "Player"
                ),

                level: Number(
                    basic.level || 0
                ),

                region: String(
                    basic.region ||
                    "IND"
                ),

                likes: Number(
                    basic.liked || 0
                ),

                rank: Number(
                    basic.rank || 0
                ),

                clan: String(
                    clan.clanname || ""
                )
            };


            console.log(
                "PLAYER DATA:",
                player
            );


            /* =========================================
               SAVE PLAYER
               ========================================= */

            try {

                localStorage.setItem(
                    "ff_player",
                    JSON.stringify(player)
                );

                localStorage.setItem(
                    "ff_uid",
                    player.uid
                );

            } catch (storageError) {

                console.warn(
                    "localStorage unavailable:",
                    storageError
                );
            }


            /* =========================================
               PLAYER MODAL
               ========================================= */

            const overlay =
                get("modalOverlay");

            const modal =
                get("playerModal");

            const pNick =
                get("pNick");

            const pLevel =
                get("pLevel");

            const pRegion =
                get("pRegion");

            const pLikes =
                get("pLikes");

            const pUid =
                get("pUid");

            const pClan =
                get("pClan");

            const rowClan =
                get("rowClan");


            if (!overlay || !modal) {

                alert(
                    "Player modal was not found in index.html."
                );

                return;
            }


            /* Fill modal */

            if (pNick) {
                pNick.textContent =
                    player.nickname;
            }

            if (pLevel) {
                pLevel.textContent =
                    player.level;
            }

            if (pRegion) {
                pRegion.textContent =
                    player.region;
            }

            if (pLikes) {
                pLikes.textContent =
                    formatNumber(
                        player.likes
                    );
            }

            if (pUid) {
                pUid.textContent =
                    player.uid;
            }

            if (pClan) {
                pClan.textContent =
                    player.clan ||
                    "No Clan";
            }

            if (rowClan) {
                rowClan.style.display =
                    player.clan
                        ? ""
                        : "none";
            }


            /* Open modal */

            overlay.hidden = false;

            overlay.style.display =
                "flex";

            overlay.classList.add("open");
            

            document.body.classList.add(
                "modal-open"
            );


            console.log(
                "PLAYER MODAL OPENED"
            );

        } catch (error) {

            console.error(
                "UID VERIFY ERROR:",
                error
            );

            alert(
                "UID verification failed:\n\n" +
                error.message
            );

        } finally {

            if (button) {

                button.disabled =
                    false;

                const label =
                    button.querySelector(
                        ".btn-label"
                    );

                const spinner =
                    button.querySelector(
                        ".spinner"
                    );

                if (label) {
                    label.textContent =
                        "Verify UID";
                }

                if (spinner) {
                    spinner.hidden =
                        true;
                }
            }
        }
    }


    /* =================================================
       CLOSE MODAL
       ================================================= */

    function closePlayerModal() {

        const overlay =
            get("modalOverlay");

        const modal =
            get("playerModal");

        if (overlay) {

            overlay.hidden = true;

            overlay.style.display =
                "none";
        }

        if (modal) {

            overlay.classList.remove("open");
        }

        document.body.classList.remove(
            "modal-open"
        );
    }


    /* =================================================
       PROCEED TO STORE
       ================================================= */

    function proceedToStore() {

        let uid =
            currentUID ||
            localStorage.getItem(
                "ff_uid"
            ) ||
            "";

        if (!uid) {

            alert(
                "Please verify your UID first."
            );

            return;
        }

        window.location.href =
            "./store.html?uid=" +
            encodeURIComponent(uid);
    }


    /* =================================================
       RE-ENTER UID
       ================================================= */

    function reEnterUID() {

        closePlayerModal();

        const input =
            get("uidInput");

        if (input) {

            input.value = "";

            setTimeout(
                function () {
                    input.focus();
                },
                100
            );
        }
    }


    /* =================================================
       MAIN EVENT SETUP
       ================================================= */

    function setup() {

        const form =
            get("uidForm");

        const verifyButton =
            get("verifyBtn");

        const proceedButton =
            get("proceedBtn");

        const closeButton =
            get("modalClose");

        const notMeButton =
            get("notMeBtn");

        const overlay =
            get("modalOverlay");


        /* =============================================
           FORM
           ============================================= */

        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    verifyUID();
                }
            );
        }


        /* =============================================
           VERIFY BUTTON
           ============================================= */

        if (verifyButton) {

            verifyButton.type =
                "button";

            verifyButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    verifyUID();
                }
            );
        }


        /* =============================================
           PROCEED
           ============================================= */

        if (proceedButton) {

            proceedButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    proceedToStore();
                }
            );
        }


        /* =============================================
           CLOSE
           ============================================= */

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    closePlayerModal();
                }
            );
        }


        /* =============================================
           NOT MY ACCOUNT
           ============================================= */

        if (notMeButton) {

            notMeButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    reEnterUID();
                }
            );
        }


        /* =============================================
           CLICK OUTSIDE
           ============================================= */

        if (overlay) {

            overlay.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        overlay
                    ) {

                        closePlayerModal();
                    }
                }
            );
        }


        /* =============================================
           ENTER KEY
           ============================================= */

        const uidInput =
            get("uidInput");

        if (uidInput) {

            uidInput.addEventListener(
                "keydown",
                function (event) {

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


        /* =============================================
           ESC
           ============================================= */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closePlayerModal();
                }
            }
        );


        /* =============================================
           YEAR
           ============================================= */

        const year =
            get("year");

        if (year) {

            year.textContent =
                new Date().getFullYear();
        }


        console.log(
            "Free Fire Top Up script loaded successfully."
        );
    }


    /* =================================================
       START
       ================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            setup,
            {
                once: true
            }
        );

    } else {

        setup();
    }


    /* =================================================
       GLOBAL
       ================================================= */

    window.verifyUID =
        verifyUID;

    window.proceedToStore =
        proceedToStore;

    window.closePlayerModal =
        closePlayerModal;

    window.reEnterUID =
        reEnterUID;
}
