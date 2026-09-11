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

    alert(
        "Selected: " +
        packageName +
        "\nPrice: ₹" +
        price
    );
}
