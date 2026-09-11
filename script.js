let currentUID = "";
let selectedPackage = "";
let selectedPrice = 0;

function verifyUID() {

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

    currentUID = uid;

    document.getElementById("playerUID").innerText = uid;
    document.getElementById("playerName").innerText = "Demo Player";
    document.getElementById("playerLevel").innerText = "70";
    document.getElementById("playerRegion").innerText = "IND";
    document.getElementById("playerLikes").innerText = "12.5K";

    document.getElementById("playerModal").style.display = "flex";
}

function closePlayerModal() {
    document.getElementById("playerModal").style.display = "none";
}

function goToStore() {

    closePlayerModal();

    document.getElementById("storePlayerName").innerText = "Demo Player";
    document.getElementById("storePlayerUID").innerText = currentUID;

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

    document.getElementById("orderPackage").innerText = packageName;
    document.getElementById("orderPrice").innerText = "₹" + price;
    document.getElementById("orderUID").innerText = currentUID;

    document.getElementById("orderModal").style.display = "flex";
}

function closeOrderModal() {

    document.getElementById("orderModal").style.display = "none";
}

function proceedToPay() {

    closeOrderModal();

    document.getElementById("paymentPackage").innerText = selectedPackage;

    document.getElementById("paymentPrice").innerText =
        "₹" + selectedPrice;

    document.getElementById("paymentUID").innerText = currentUID;

    document.getElementById("paymentStatus").style.display = "none";

    document.getElementById("paymentStatus").innerText = "";

    document.getElementById("storeSection").style.display = "none";

    document.getElementById("paymentSection").style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function copyUPI() {

    const upi = document.getElementById("upiId").innerText;

    navigator.clipboard.writeText(upi).then(function() {

        alert("UPI ID copied!");

    });

}
function paymentSubmitted() {

    const status = document.getElementById("paymentStatus");

    status.innerText =
    "Please pay first. Payment not received.";

    status.style.display = "block";
}


function backToStore() {

    document.getElementById("paymentSection").style.display = "none";

    document.getElementById("storeSection").style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
