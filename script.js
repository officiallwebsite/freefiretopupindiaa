let currentUID = "";
let currentPlayerName = "";
let selectedPackage = "";
let selectedPrice = 0;

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

        currentUID = player.account_id || uid;
        currentPlayerName = player.nickname || "Unknown Player";

        document.getElementById("playerUID").innerText =
            currentUID;

        document.getElementById("playerName").innerText =
            currentPlayerName;

        document.getElementById("playerLevel").innerText =
            player.level ?? "N/A";

        document.getElementById("playerRegion").innerText =
            player.region || "IND";

        document.getElementById("playerLikes").innerText =
            player.liked ?? "0";

        error.innerText = "";

        document.getElementById("playerModal").style.display = "flex";

    } catch (err) {

        console.error(err);

        error.innerText =
            "Unable to verify UID. Please try again.";
    }
}


function closePlayerModal() {

    document.getElementById("playerModal").style.display = "none";
}


function goToStore() {

    closePlayerModal();

    document.getElementById("storePlayerName").innerText =
        currentPlayerName;

    document.getElementById("storePlayerUID").innerText =
        currentUID;

    document.querySelector(".verify-section").style.display = "none";

    document.getElementById("storeSection").style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


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


function closeOrderModal() {

    document.getElementById("orderModal").style.display =
        "none";
}


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


function copyUPI() {

    const upi =
        document.getElementById("upiId").innerText;

    navigator.clipboard.writeText(upi).then(function() {

        alert("UPI ID copied!");

    });
}


function paymentSubmitted() {

    const status =
        document.getElementById("paymentStatus");

    const button =
        document.getElementById("paidButton");

    status.innerText =
        "Please pay first. Payment not received.";

    status.style.display =
        "block";

    button.disabled = true;

    button.innerText =
        "PAYMENT NOT RECEIVED";
}


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
