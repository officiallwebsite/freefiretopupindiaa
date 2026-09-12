```javascript
let currentUID = "";
let currentPlayerName = "";
let currentPlayerAvatar = "";
let selectedPackage = "";
let selectedPrice = 0;


/* =========================
   VERIFY UID
========================= */

async function verifyUID() {

    const uid = document.getElementById("uidInput").value.trim();
    const error = document.getElementById("errorMessage");

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

        const response = await fetch(
            "https://free-fire-uid-apii.vercel.app/info?uid=" +
            encodeURIComponent(uid)
        );

        const data = await response.json();

        if (!response.ok || !data.basic_info) {
            error.innerText = "UID not found or API error.";
            return;
        }

        const player = data.basic_info;

        console.log("PLAYER DATA:", player);
        console.log("HEAD PIC:", player.head_pic);


        /* =========================
           PLAYER BASIC DATA
        ========================= */

        currentUID =
            player.account_id || uid;

        currentPlayerName =
            player.nickname || "Unknown Player";


        /* =========================
           PLAYER NAME
        ========================= */

        document.getElementById("playerUID").innerText =
            currentUID;

        document.getElementById("playerName").innerText =
            currentPlayerName;


        /* =========================
           PLAYER LEVEL
        ========================= */

        document.getElementById("playerLevel").innerText =
            player.level ?? "N/A";


        /* =========================
           PLAYER REGION
        ========================= */

        document.getElementById("playerRegion").innerText =
            player.region || "IND";


        /* =========================
           PLAYER LIKES
        ========================= */

        document.getElementById("playerLikes").innerText =
            player.liked ?? "0";


        /* =========================
           PLAYER RANK
        ========================= */

        document.getElementById("playerRank").innerText =
            player.rank ?? "N/A";


        /* =========================
           AVATAR
        ========================= */

        const avatar =
            document.getElementById("playerAvatar");

        const avatarFallback =
            document.getElementById("avatarFallback");


        /*
           head_pic is only an ID.
           It is NOT a direct image URL.

           So we don't create a fake URL.
           Instead, show the professional fallback avatar.
        */

        avatar.style.display = "none";

        if (avatarFallback) {
            avatarFallback.style.display = "flex";
        }


        /* =========================
           SHOW PLAYER POPUP
        ========================= */

        error.innerText = "";

        document.getElementById("playerModal").style.display =
            "flex";

    } catch (err) {

        console.error(err);

        error.innerText =
            "Unable to verify UID. Please try again.";
    }
}


/* =========================
   CLOSE PLAYER POPUP
========================= */

function closePlayerModal() {

    document.getElementById("playerModal").style.display =
        "none";
}


/* =========================
   GO TO STORE
========================= */

function goToStore() {

    closePlayerModal();

    document.getElementById("storePlayerName").innerText =
        currentPlayerName;

    document.getElementById("storePlayerUID").innerText =
        currentUID;


    document.querySelector(".verify-section").style.display =
        "none";

    document.getElementById("storeSection").style.display =
        "block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   BUY PACKAGE
========================= */

function buyPackage(packageName, price) {

    selectedPackage = packageName;
    selectedPrice = price;


    document.getElementById("orderPackage").innerText =
        packageName;


    document.getElementById("orderPrice").innerText =
        "₹" + price;


    document.getElementById("orderUID").innerText =
        currentUID;


    document.getElementById("orderModal").style.display =
        "flex";
}


/* =========================
   CLOSE ORDER POPUP
========================= */

function closeOrderModal() {

    document.getElementById("orderModal").style.display =
        "none";
}


/* =========================
   PROCEED TO PAYMENT
========================= */

function proceedToPay() {

    closeOrderModal();


    document.getElementById("paymentPackage").innerText =
        selectedPackage;


    document.getElementById("paymentPrice").innerText =
        "₹" + selectedPrice;


    document.getElementById("paymentUID").innerText =
        currentUID;


    const orderId =
        "FF" + Date.now().toString().slice(-8);


    document.getElementById("paymentOrderId").innerText =
        orderId;


    document.getElementById("paymentStatus").style.display =
        "none";


    document.getElementById("paymentStatus").innerText =
        "";


    document.getElementById("storeSection").style.display =
        "none";


    document.getElementById("paymentSection").style.display =
        "block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   COPY UPI
========================= */

function copyUPI() {

    const upi =
        document.getElementById("upiId").innerText;


    if (navigator.clipboard) {

        navigator.clipboard.writeText(upi).then(function() {

            alert("UPI ID copied!");

        }).catch(function() {

            alert("Unable to copy UPI ID.");

        });

    } else {

        alert("Copy not supported on this browser.");

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


    status.innerText =
        "Please pay first. Payment not received.";


    status.style.display =
        "block";


    button.disabled =
        true;


    button.innerText =
        "PAYMENT NOT RECEIVED";
}


/* =========================
   BACK TO STORE
========================= */

function backToStore() {

    document.getElementById("paymentSection").style.display =
        "none";


    document.getElementById("storeSection").style.display =
        "block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
```
