function verifyUID() {

    const uid = document.getElementById("uidInput").value.trim();
    const error = document.getElementById("errorMessage");

    error.innerText = "";

    if (uid === "") {
        error.innerText = "Please enter your UID.";
        return;
    }

    if (!/^[0-9]+$/.test(uid)) {
        error.innerText = "Please enter a valid UID.";
        return;
    }

    if (uid.length < 6) {
        error.innerText = "Please enter a valid UID.";
        return;
    }

    // Temporary demo player information
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

    alert("Top Up Centre will be added next.");

}
