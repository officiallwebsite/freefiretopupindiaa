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

    alert("UID verification system is ready.");

}
