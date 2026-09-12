```javascript
let currentUID = "";
let currentPlayerName = "";
let selectedPackage = "";
let selectedPrice = 0;


/* =========================
   VERIFY UID
========================= */

async function verifyUID() {

    const uidInput = document.getElementById("uidInput");
    const error = document.getElementById("errorMessage");

    if (!uidInput || !error) {
        alert("Page error: UID elements not found.");
        return;
    }

    const uid = uidInput.value.trim();

    error.innerText = "";

    if (uid === "") {
        error.innerText = "Please enter your UID.";
        return;
    }

    if (!/^[0-9]+$/.test(uid) || uid.length < 6) {
        error.innerText = "Please enter a valid UID.";
        return;
    }

    error.innerText = "Verifying UID...";

    try {

        const apiURL =
            "https://free-fire-uid-apii.vercel.app/info?uid=" +
            encodeURIComponent(uid);

        const response = await fetch(apiURL);

        const data = await response.json();

        console.log("API RESPONSE:", data);

        if (!response.ok || !data.basic_info) {
            error.innerText =
                "UID not found or API error.";
            return;
        }

        const player = data.basic_info;

        console.log("PLAYER:", player);


        /* =========================
           SAVE PLAYER DATA
        ========================= */

        currentUID =
            player.account_id || uid;

        currentPlayerName =
            player.nickname || "Unknown Player";


        /* =========================
           UID
        ========================= */

        const playerUID =
            document.getElementById("playerUID");

        if (playerUID) {
            playerUID.innerText =
                currentUID;
        }


        /* =========================
           NAME
        ========================= */

        const playerName =
            document.getElementById("playerName");

        if (playerName) {
            playerName.innerText =
                currentPlayerName;
        }


        /* =========================
           LEVEL
        ========================= */

        const playerLevel =
            document.getElementById("playerLevel");

        if (playerLevel) {
            playerLevel.innerText =
                player.level ?? "N/A";
        }


        /* =========================
           REGION
        ========================= */

        const playerRegion =
            document.getElementById("playerRegion");

        if (playerRegion) {
            playerRegion.innerText =
                player.region || "IND";
        }


        /* =========================
           LIKES
        ========================= */

        const playerLikes =
            document.getElementById("playerLikes");

        if (playerLikes) {
            playerLikes.innerText =
                player.liked ?? "0";
        }


        /* =========================
           RANK
        ========================= */

        const playerRank =
            document.getElementById("playerRank");

        if (playerRank) {
            playerRank.innerText =
                player.rank ?? "N/A";
        }


        /* =========================
           AVATAR FALLBACK
        ========================= */

        const avatar =
            document.getElementById("playerAvatar");

        const avatarFallback =
            document.getElementById("avatarFallback");

        if (avatar) {
            avatar.style.display = "none";
        }

        if (avatarFallback) {

            let initials = "FF";

            const cleanName =
                currentPlayerName
                    .replace(/[^a-zA-Z0-9]/g, "");

            if (cleanName.length >= 2) {

                initials =
                    cleanName
                        .substring(0, 2)
                        .toUpperCase();
            }

            avatarFallback.innerText =
                initials;

            avatarFallback.style.display =
                "flex";
        }


        /* =========================
           CLEAR ERROR
        ========================= */

        error.innerText = "";
```
