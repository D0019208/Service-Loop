"use strict"
var localhost = false;
/*
 ******************************************************************************************************************
 ******************************************************************************************************************
 **************************************************DOM STARTS******************************************************
 ******************************************************************************************************************
 ******************************************************************************************************************
 */
document.addEventListener("deviceready", function () {
    //Hide splashscreen
    if (!localhost) {
        navigator.splashscreen.hide();
    }
});

document.addEventListener("DOMContentLoaded", function () { 
    let register_button = document.getElementById("registration_button");
    let sms_sent = false;

//We add a quick function here to test wether the user has agreed to the Terms & Conditions
    document.getElementById('terms_and_conditions').addEventListener("click", function () {
        let registration_button_state = register_button.hasAttribute("disabled");

        if (registration_button_state) {
            register_button.disabled = false;
        } else {
            register_button.disabled = true;
        }
        
        device_feedback();
    });

    document.getElementById('registration_form').addEventListener("submit", async function (event) {
        if (document.getElementById('terms_and_conditions').checked) {
            event.preventDefault();

            //We check to see if the users registration data meets all our criteria
            let user_data_correct = await verify_registration_input();

            if (user_data_correct) {
                if (!sms_sent) {
                    sms_sent = true;

                    //Send a verification code, this function takes a parameter that specifies the path.
                    //Function can be used for re-sending SMS by changing route
                    //
                    //Consider adding check to see if session timed out LATER
                    sms_response = await send_verification_sms("send_sms_verification");
                    if (sms_response.status !== "ERROR") {
                        sms_verification_setup(sms_response);
                    } else {
                        sms_sent = false;

                        if (sms_response.status === "ERROR") {
                            sms_verification_errors(sms_response);
                        }

                    }
                } else {
                    if (sms_response.status !== "ERROR") {
                        sms_verification_setup(sms_response);
                    } else {
                        create_ionic_alert("Error", "Your phone number is invalid, please try again.", ["OK"]);
                    }
                }
            }
        } else {
            alert('Please indicate that you have read and agree to the Terms and Conditions');
            event.preventDefault();
        }
    });
});