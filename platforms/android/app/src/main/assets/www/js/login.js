"use strict"
var localhost = false;
/*
 ******************************************************************************************************************
 ******************************************************************************************************************
 **************************************************DOM STARTS******************************************************
 ******************************************************************************************************************
 ******************************************************************************************************************
 */

//DOMContentLoaded 
//deviceready
if (localStorage.getItem("fingerprint_setup") !== null) {
    document.getElementById("fingerprint_footer").style.display = "block";
}

document.addEventListener("deviceready", function () {
    //Hide splashscreen
    if (!localhost) {
        navigator.splashscreen.hide();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    if (sessionStorage.getItem('session_timeout') !== null) {
        sessionStorage.removeItem('session_timeout');
        
        let toast_buttons = [
            {
                side: 'end',
                text: 'Close',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
        ];
        create_toast("Session has timed out", "dark", 2000, toast_buttons);
    }

    let pass_reset = (sessionStorage.getItem("pass_reset") === "true");

    if (pass_reset) {
        sessionStorage.removeItem("pass_reset");

        let toast_buttons = [
            {
                side: 'end',
                text: 'Close',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
        ];
        create_toast("Password has been reset", "dark", 2000, toast_buttons);
    }

    let fingerprint_active = false;

    document.getElementById('login').addEventListener('click', () => {
        device_feedback();
    });

    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        document.getElementById('login').disabled = true;

        login_user(document.getElementById('users_email').value, document.getElementById('users_password').value);
    });

    //Login using fingerprint
    document.getElementById("fingerprint").addEventListener('click', async () => {
        device_feedback();

        if (!fingerprint_active) {
            fingerprint_active = true;
            let fingerprint_available = await is_fingerprint_available();
            //let fingerprint_available = true;
            let finger_print_set_up = localStorage.getItem("fingerprint_setup");

            //Is the fingerprint functionality available?
            if (fingerprint_available) {
                //Check to see if fingerprint authentication has been set up by the user
                if (finger_print_set_up !== null) {
                    decrypt_fingerprint();
                } else {
                    create_ionic_alert("Fingerprint authentication failed", "Please setup fingerprint authentication in the Settings page first.", ["OK"]);
                }
            } else {
                create_ionic_alert("Fingerprint authentication failed", "Unfortunately your device does not support fingerprint authentication, please \n\
            use your email and password instead.", ["OK"]);
            }

            setTimeout(function () {
                fingerprint_active = false;
            }, 1000);
        }
    });
}, false);