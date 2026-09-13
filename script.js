let currentUID = "";
let currentPlayerName = "";
let selectedPackage = "";
let selectedPrice = 0;


/* =========================
   VERIFY UID
========================= */

async function verifyUID() {

    const uidInput =
        document.getElementById("uidInput");

    const error =
        document.getElementById("errorMessage");

    if (!uidInput || !error) {
        return;
    }

    const uid =
        uidInput.value.trim();


    /* EMPTY UID */

    if (uid === "") {

        error.innerText =
            "Please enter your UID.";

        return;
    }


    /* UID VALIDATION: 8-12 DIGITS */

    if (
        !/^[0-9]+$/.test(uid) ||
        uid.length < 8 ||
        uid.length > 12
    ) {

        error.innerText =
            "Please enter a valid UID (8-12 digits).";

        return;
    }


    /* =========================
       LOADING STATE
    ========================= */

    error.innerText =
        "Verifying UID...";


    const verifyBtn =
        document.getElementById("verifyBtn");

    const verifyBtnText =
        document.getElementById("verifyBtnText");

    const verifyLoader =
        document.getElementById("verifyLoader");

    const verifyArrow =
        document.getElementById("verifyArrow");


    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.classList.add("loading");
    }


    if (verifyBtnText) {
        verifyBtnText.innerText =
            "Verifying...";
    }


    if (verifyLoader) {
        verifyLoader.style.display =
            "block";
    }


    if (verifyArrow) {
        verifyArrow.style.display =
            "none";
    }


    try {

        const response =
            await fetch(
                "https://free-fire-uid-apii.vercel.app/info?uid=" +
                encodeURIComponent(uid)
            );


        const data =
            await response.json();


        console.log(
            "API RESPONSE:",
            data
        );


        /* API ERROR */

        if (
            !response.ok ||
            !data.basic_info
        ) {

            error.innerText =
                "UID not found or API error.";

            return;
        }


        const player =
            data.basic_info;


        console.log(
            "PLAYER:",
            player
        );


        /* =========================
           SAVE PLAYER DATA
        ========================= */

        currentUID =
            player.account_id || uid;


        currentPlayerName =
            player.nickname || "Unknown Player";
const playerNameBottom =
    document.getElementById("playerNameBottom");

if (playerNameBottom) {
    playerNameBottom.innerText =
        currentPlayerName;
}

        /* =========================
           PLAYER NAME
        ========================= */

        const playerName =
            document.getElementById(
                "playerName"
            );

        if (playerName) {

            playerName.innerText =
                currentPlayerName;
        }


        /* =========================
           PLAYER UID
        ========================= */

        const playerUID =
            document.getElementById(
                "playerUID"
            );

        if (playerUID) {

            playerUID.innerText =
                currentUID;
        }


        /* =========================
           LEVEL
        ========================= */

        const playerLevel =
            document.getElementById(
                "playerLevel"
            );

        if (playerLevel) {

            playerLevel.innerText =
                player.level ?? "N/A";
        }


        /* =========================
           REGION
        ========================= */

        const playerRegion =
            document.getElementById(
                "playerRegion"
            );

        if (playerRegion) {

            playerRegion.innerText =
                player.region || "IND";
        }


        /* =========================
           LIKES
        ========================= */

        const playerLikes =
            document.getElementById(
                "playerLikes"
            );

        if (playerLikes) {

            playerLikes.innerText =
                player.liked ?? "0";
        }


        /* =========================
           RANK
        ========================= */

        const playerRank =
            document.getElementById(
                "playerRank"
            );

        if (playerRank) {

            playerRank.innerText =
                player.rank ?? "N/A";
        }


        /* =========================
           CLEAR ERROR
        ========================= */

        error.innerText =
            "";


        /* =========================
           OPEN PLAYER MODAL
        ========================= */
const howSection =
    document.getElementById("howItWorks");

const faqSection =
    document.getElementById("faq");

if (howSection) {
    howSection.style.display = "none";
}

if (faqSection) {
    faqSection.style.display = "none";
}
        const playerModal =
            document.getElementById(
                "playerModal"
            );

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

    } finally {

        /* =========================
           RESET BUTTON
        ========================= */

        if (verifyBtn) {
            verifyBtn.disabled =
                false;

            verifyBtn.classList.remove(
                "loading"
            );
        }


        if (verifyBtnText) {
            verifyBtnText.innerText =
                "Verify UID";
        }


        if (verifyLoader) {
            verifyLoader.style.display =
                "none";
        }


        if (verifyArrow) {
            verifyArrow.style.display =
                "inline";
        }

    }

}


/* =========================
   CLOSE PLAYER MODAL
========================= */

function closePlayerModal() {

    const modal =
        document.getElementById(
            "playerModal"
        );

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


    /* MAIN PLAYER INFO */

    const storePlayerName =
        document.getElementById(
            "storePlayerName"
        );

    const storePlayerUID =
        document.getElementById(
            "storePlayerUID"
        );


    if (storePlayerName) {

        storePlayerName.innerText =
            currentPlayerName;
    }


    if (storePlayerUID) {

        storePlayerUID.innerText =
            currentUID;
    }


    /* RIGHT SIDE SUMMARY */

    const summaryPlayerName =
        document.getElementById(
            "summaryPlayerName"
        );

    const summaryUID =
        document.getElementById(
            "summaryUID"
        );


    if (summaryPlayerName) {

        summaryPlayerName.innerText =
            currentPlayerName;
    }


    if (summaryUID) {

        summaryUID.innerText =
            currentUID;
    }


    /* HIDE VERIFY SECTION */

    const verifySection =
        document.querySelector(
    ".uid-section"
);

    if (verifySection) {

        verifySection.style.display =
            "none";
    }


    /* SHOW STORE */

    const storeSection =
        document.getElementById(
            "storeSection"
        );


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

function buyPackage(
    packageName,
    price
) {

    selectedPackage =
        packageName;

    selectedPrice =
        price;


    const orderPackage =
        document.getElementById(
            "orderPackage"
        );

    const orderPrice =
        document.getElementById(
            "orderPrice"
        );

    const orderUID =
        document.getElementById(
            "orderUID"
        );


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


    /* OPEN ORDER MODAL */

    const orderModal =
        document.getElementById(
            "orderModal"
        );


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
        document.getElementById(
            "orderModal"
        );


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
        document.getElementById(
            "paymentPackage"
        );

    const paymentPrice =
        document.getElementById(
            "paymentPrice"
        );

    const paymentUID =
        document.getElementById(
            "paymentUID"
        );


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


    /* ORDER ID */

    const orderId =
        "FF" +
        Date.now()
            .toString()
            .slice(-8);


    const paymentOrderId =
        document.getElementById(
            "paymentOrderId"
        );


    if (paymentOrderId) {

        paymentOrderId.innerText =
            orderId;
    }


    /* RESET PAYMENT STATUS */

    const paymentStatus =
        document.getElementById(
            "paymentStatus"
        );


    if (paymentStatus) {

        paymentStatus.innerText =
            "";

        paymentStatus.style.display =
            "none";
    }


    /* RESET PAID BUTTON */

    const paidButton =
        document.getElementById(
            "paidButton"
        );


    if (paidButton) {

        paidButton.disabled =
            false;

        paidButton.innerText =
            "I HAVE PAID";
    }


    /* HIDE STORE */

    const storeSection =
        document.getElementById(
            "storeSection"
        );


    if (storeSection) {

        storeSection.style.display =
            "none";
    }


    /* SHOW PAYMENT */

    const paymentSection =
        document.getElementById(
            "paymentSection"
        );


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
        document.getElementById(
            "upiId"
        );


    if (!upiElement) {
        return;
    }


    const upi =
        upiElement.innerText;


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(upi)

            .then(function () {

                alert(
                    "UPI ID copied!"
                );

            })

            .catch(function () {

                alert(
                    "Unable to copy UPI ID."
                );

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
        document.getElementById(
            "paymentStatus"
        );

    const button =
        document.getElementById(
            "paidButton"
        );


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
        document.getElementById(
            "paymentSection"
        );

    const storeSection =
        document.getElementById(
            "storeSection"
        );


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
