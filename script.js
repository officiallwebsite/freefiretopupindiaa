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


        /* =========================
           OPEN PLAYER MODAL
        ========================= */

        const playerModal =
            document.getElementById("playerModal");

        if (playerModal) {
            playerModal.style.display =
                "flex";
        }

    } catch (err) {

        console.error(
            "VERIFY UID ERROR:",
            err
        );

        error.innerText =
            "Unable to verify UID. Please try again.";
    }
}


/* =========================
   CLOSE PLAYER MODAL
========================= */

function closePlayerModal() {

    const modal =
        document.getElementById("playerModal");

    if (modal) {
        modal.style.display =
            "none";
    }
}


/* =========================
   GO TO STORE
========================= */

function goToStore() {

    closePlayerModal();

    const storePlayerName =
        document.getElementById("storePlayerName");

    const storePlayerUID =
        document.getElementById("storePlayerUID");

    if (storePlayerName) {
        storePlayerName.innerText =
            currentPlayerName;
    }

    if (storePlayerUID) {
        storePlayerUID.innerText =
            currentUID;
    }

    const verifySection =
        document.querySelector(".verify-section");

    const storeSection =
        document.getElementById("storeSection");

    if (verifySection) {
        verifySection.style.display =
            "none";
    }

    if (storeSection) {
        storeSection.style.display =
            "block";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   BUY PACKAGE
========================= */

function buyPackage(packageName, price) {

    selectedPackage =
        packageName;

    selectedPrice =
        price;

    const orderPackage =
        document.getElementById("orderPackage");

    const orderPrice =
        document.getElementById("orderPrice");

    const orderUID =
        document.getElementById("orderUID");

    if (orderPackage) {
        orderPackage.innerText =
            packageName;
    }

    if (orderPrice) {
        orderPrice.innerText =
            "₹" + price;
    }

    if (orderUID) {
        orderUID.innerText =
            currentUID;
    }

    const orderModal =
        document.getElementById("orderModal");

    if (orderModal) {
        orderModal.style.display =
            "flex";
    }
}


/* =========================
   CLOSE ORDER MODAL
========================= */

function closeOrderModal() {

    const modal =
        document.getElementById("orderModal");

    if (modal) {
        modal.style.display =
            "none";
    }
}


/* =========================
   PROCEED TO PAYMENT
========================= */

function proceedToPay() {

    closeOrderModal();

    const paymentPackage =
        document.getElementById("paymentPackage");

    const paymentPrice =
        document.getElementById("paymentPrice");

    const paymentUID =
        document.getElementById("paymentUID");

    if (paymentPackage) {
        paymentPackage.innerText =
            selectedPackage;
    }

    if (paymentPrice) {
        paymentPrice.innerText =
            "₹" + selectedPrice;
    }

    if (paymentUID) {
        paymentUID.innerText =
            currentUID;
    }

    const orderId =
        "FF" +
        Date.now()
            .toString()
            .slice(-8);

    const paymentOrderId =
        document.getElementById("paymentOrderId");

    if (paymentOrderId) {
        paymentOrderId.innerText =
            orderId;
    }

    const paymentStatus =
        document.getElementById("paymentStatus");

    if (paymentStatus) {

        paymentStatus.style.display =
            "none";

        paymentStatus.innerText =
            "";
    }

    const paidButton =
        document.getElementById("paidButton");

    if (paidButton) {

        paidButton.disabled =
            false;

        paidButton.innerText =
            "I HAVE PAID";
    }

    const storeSection =
        document.getElementById("storeSection");

    const paymentSection =
        document.getElementById("paymentSection");

    if (storeSection) {
        storeSection.style.display =
            "none";
    }

    if (paymentSection) {
        paymentSection.style.display =
            "block";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   COPY UPI
========================= */

function copyUPI() {

    const upiElement =
        document.getElementById("upiId");

    if (!upiElement) {
        return;
    }

    const upi =
        upiElement.innerText;

    if (navigator.clipboard) {

        navigator.clipboard
            .writeText(upi)
            .then(function () {

                alert("UPI ID copied!");

            })
            .catch(function () {

                alert("Unable to copy UPI ID.");

            });

    } else {

        alert(
            "Copy not supported on this browser."
        );
    }
}


/* =========================
   PAYMENT SUBMITTED
========================= */

function paymentSubmitted() {

    const status =
        document.getElementById("paymentStatus");

    const button =
        document.getElementById("paidButton");

    if (status) {

        status.innerText =
            "Please pay first. Payment not received.";

        status.style.display =
            "block";
    }

    if (button) {

        button.disabled =
            true;

        button.innerText =
            "PAYMENT NOT RECEIVED";
    }
}


/* =========================
   BACK TO STORE
========================= */

function backToStore() {

    const paymentSection =
        document.getElementById("paymentSection");

    const storeSection =
        document.getElementById("storeSection");

    if (paymentSection) {
        paymentSection.style.display =
            "none";
    }

    if (storeSection) {
        storeSection.style.display =
            "block";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
```
