"use strict"
var sms_response;

function add_skill() {
    var textInput = document.getElementById("skill");  //getting text input
    var skill = textInput.value;   //getting value of text input element
    var p = document.getElementById("p");  //getting element <ul> to add element to
    if (skill.length > 3) {

        var li = '<ion-chip outline color="primary"><ion-icon name="build"></ion-icon><ion-label class="skill">' + skill + '</ion-label><ion-icon class="close" name="close-circle"></ion-icon></ion-chip>';  //creating li element to add
        p.insertAdjacentHTML('afterend', li);    //inserting text into newly created <li> element
        document.getElementById('skill').value = '';
    } else {
        create_ionic_alert("Error", "A skill must contain at least 3 characters. Please try again.", ["Okay"]);
    }
}

async function send_verification_sms(route) {
    try {
        var data = {
            verification_phone_number: document.getElementById('users_phone_number').value
        };

        //Perform server side processing
        const rawResponse = await fetch('http://serviceloopserver.ga/' + route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        //Extract the reponse as JSON
        const content = JSON.parse(await rawResponse.json());

        //if error is set to 'true', we show an error message
        if (content.status === "SUCCESS") {
            console.log(content)
            return content;
        } else {
            console.log(content)
            //window.location.href = "login.html";
            return content;
        }
    } catch (ex) {
        console.log(ex)
        create_ionic_alert("Error", ex, ["OK"]);
    }
}

async function verify_sms_code(token, code, verification_phone_number, currentModal) {
    try {
        var data = {
            verification_phone_number: verification_phone_number,
            verification_code: code,
            verification_token: token
        };

        //Perform server side processing
        const rawResponse = await fetch('http://serviceloopserver.ga/verify_code', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        //Extract the reponse as JSON
        const content = JSON.parse(await rawResponse.json());
        console.log(content)
        console.log(typeof content)
        //if error is set to 'true', we show an error message
        if (content.status === "SUCCESS") {
            return content;
        } else {
            console.log(content);
            //window.location.href = "login.html";
            return content;
        }
    } catch (ex) {
        create_ionic_alert("Error", ex, ["OK"], function () {
            return dismissModal(currentModal);
        });
    }
}

function sms_verification_errors(sms_response, currentModal = null) {
    switch (sms_response.message) {
        case "ERROR_INVALID_SECRET_KEY":
            create_ionic_alert("Incorrect key or application name", "Retrieve correct keys and domain/application name from site for specified application.", ["OK"]);
            break;
        case "ERROR_INVALID_APP_KEY":
            create_ionic_alert("Incorrect key or application name", "Retrieve correct keys and domain/application name from site for specified application.", ["OK"]);
            break;
        case "ERROR_INVALID_DOMAIN":
            create_ionic_alert("Incorrect key or application name", "Retrieve correct keys and domain/application name from site for specified application.", ["OK"]);
            break;
        case "ERROR_INVALID_API_KEY":
            create_ionic_alert("Incorrect key or application name", "Retrieve correct keys and domain/application name from site for specified application.", ["OK"]);
            break;
        case "ERROR_INTERNAL_SERVER_ERROR":
            create_ionic_alert("Error verifying SMS", "It's not you, it's us. There was an error sending your SMS, please wait a bit and try again.", ["OK"]);
            break;
        case "ERROR_DIRECT_API_ACCESS_NOT_AVAILABLE":
            if (currentModal !== null) {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"], function () {
                    return dismissModal(currentModal);
                });
            } else {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"]);
            }

            break;
        case "ERROR_WEB_ACCESS_NOT_AVAILABLE":
            if (currentModal !== null) {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"], function () {
                    return dismissModal(currentModal);
                });
            } else {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"]);
            }

            break;
        case "ERROR_MOBILE_ACCESS_NOT_AVAILABLE":
            if (currentModal !== null) {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"], function () {
                    return dismissModal(currentModal);
                });
            } else {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"]);
            }

            break;
        case "ERROR_INSTANT_VALIDATION_NOT_AVAILABLE":
            if (currentModal !== null) {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"], function () {
                    return dismissModal(currentModal);
                });
            } else {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"]);
            }

            break;
        case "ERROR_SERVICE_NOT_AVAILABLE":
            if (currentModal !== null) {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"], function () {
                    return dismissModal(currentModal);
                });
            } else {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"]);
            }

            break;
        case "ERROR_INVALID_SERVICE":
            if (currentModal !== null) {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"], function () {
                    return dismissModal(currentModal);
                });
            } else {
                create_ionic_alert("Error verifying SMS", "You are trying to access an inactive feature or the API incorrectly. Follow the docs on the features and API accordingly.", ["OK"]);
            }

            break;
        case "ERROR_INVALID_NUMBER":
            if (currentModal !== null) {
                create_ionic_alert("Error verifying SMS", "Your phone number is incorrect, please try again with a valid Irish number.", ["OK"], function () {
                    return dismissModal(currentModal);
                });
            } else {
                create_ionic_alert("Error verifying SMS", "Your phone number is incorrect, please try again with a valid Irish number.", ["OK"]);
            }

            break;
        case "ERROR_WAIT_TO_RETRY":
            if (currentModal !== null) {
                create_ionic_alert("Error verifying SMS", "You are retying to revalidate more often than is allowed. Please wait to retry. " + new Date(sms_response.retry_in * 1000).toISOString().substr(11, 8), ["OK"], function () {
                    return dismissModal(currentModal);
                });
            } else {
                create_ionic_alert("Error verifying SMS", "You are retying to revalidate more often than is allowed. Please wait to retry. " + new Date(sms_response.retry_in * 1000).toISOString().substr(11, 8), ["OK"]);
            }

            break;
        case "ERROR_MAX_ATTEMPTS_REACHED":
            create_ionic_alert("Error verifying SMS", "You have retried more times with the same active token or more frequently than is allowed. Please complete the verification or wait to try again.", ["OK"]);
            break;
        case "ERROR_MAX_VALIDATIONS_REACHED":
            create_ionic_alert("Error verifying SMS", "You have retried more times with the same active token or more frequently than is allowed. Please wait to try again.", ["OK"]);
            break;
        case "ERROR_INVALID_SESSION":
            create_ionic_alert("Error verifying SMS", "Your session has expired. Please wait to try again.", ["OK"]);
            break;
        case "ERROR_INVALID_PIN_CODE":
            create_ionic_alert("Error verifying SMS", "The code you entered is incorrect, please input the correct code or request a new one.", ["OK"]);
            break;
}
}

async function sms_verification_setup() {
    let currentModal = null;
    const controller = document.querySelector('ion-modal-controller');

    let modal_text = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>SMS Verification</ion-title>
              <ion-buttons slot="end">
                <ion-button id="modal_close">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
              <ion-list class="fields" style="text-align:center;">
            <p><strong>Verify your identity with SMS</strong></p>
            <p>Please input your 4 digit code sent by SMS. If you did not recieve one then please request a new one or request a resend.</p>
            
              </ion-list>
    
        <ion-list lines="full" class="ion-no-margin ion-no-padding fields">
            <ion-item class="line">
            </ion-item>
            
        <ion-item>
            <ion-label class="pass_label" align="center" position="stacked">4 digit code <ion-text color="danger">*</ion-text></ion-label>
            <ion-input align="center" placeholder="1234" id="4_digit_verifier" required type="number"></ion-input>
          </ion-item>

        <div class="ion-padding-top">
          <ion-button expand="block" type="button" class="ion-no-margin" id="verify_submit">Verify me</ion-button>
    <ion-button expand="block" type="button" class="ion-no-margin" id="resend_sms">Resend code</ion-button>
        </div>
            <p style="text-align: center; color: gray;">This is a security precaution to safeguard you from malicious users. We appreciate your patience and cooperation.</p>
          </ion-content>
        `;

    let modal_created = await createModal(controller, modal_text);

    modal_created.present().then(async () => {
        //This is the token created by the API when requesting a new SMS
        let token;

        currentModal = modal_created;

        //If the API does not respond with "SUCCESS", then we know something went wrong.
        if (sms_response.status !== "SUCCESS") {
            //Handle error
            sms_verification_errors(sms_response);
        }

        //If there is no error, then we assign a value to the token variable created by the API
        token = sms_response.token;

        /*
         Once the user has inputed his 4 digit code (NEED TO VERIFY INPUT!!!!) and clicks on "Verify me", 
         then we pass the 4 digit code and users phone number to the below function verify SMS
         */
        document.getElementById("verify_submit").addEventListener('click', async () => {
            //Wait for the function to finish checking on the server whether the code is correct
            let sms_verification_response = await verify_sms_code(token, document.getElementById('4_digit_verifier').value, document.getElementById('users_phone_number').value);
            console.log(sms_verification_response);
            console.log("^^^l^^^^")
            //If the status of the response is not "SUCCESS", that means an error has occured and we handle it in this function
            if (sms_verification_response.status !== "SUCCESS") {
                //Handle error
                sms_verification_errors(sms_verification_response);
            } else {
                create_new_user();
            }
        });

        //If the user loses their code, we can resend it
        document.getElementById("resend_sms").addEventListener('click', async () => {
            //We pass in a different route to resend code
            sms_response = await send_verification_sms("send_sms_verification");
            console.log(sms_response)

            if (sms_response.status !== "SUCCESS") {
                sms_verification_errors(sms_response);
            } else {
                token = sms_response.token;
            }
        });

        document.getElementById("modal_close").addEventListener('click', () => {
            dismissModal(currentModal);
        });
    });
}

function create_new_user() {
        var data = {
            users_full_name: document.getElementById('users_full_name').value,
            users_email: document.getElementById('users_email').value,
            users_phone_number: document.getElementById('users_phone_number').value,
            users_password: document.getElementById('users_password').value,
            users_password_confirm: document.getElementById('users_password_confirm').value
        }; 

        (async () => {
            //Get back the loading object so we can then dismiss it when our API call is done.
            let loading = await create_ionic_loading();

            //Perform server side processing
            const rawResponse = await fetch('http://serviceloopserver.ga/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            //Dismiss the loading indicator
            loading.dismiss();

            //Extract the reponse as JSON
            const content = JSON.parse(await rawResponse.json());
            console.log(content);

            //if error is set to 'true', we show an error message
            if (content.error) {
                create_ionic_alert("Error", content.response, ["OK"])
            } else {
                window.location.href = "login.html";
                return;
            }
        })();
}

async function verify_registration_input() {
    let skills_array = [];

    var data = {
        users_full_name: document.getElementById('users_full_name').value,
        users_email: document.getElementById('users_email').value,
        users_phone_number: document.getElementById('users_phone_number').value,
        users_password: document.getElementById('users_password').value,
        users_password_confirm: document.getElementById('users_password_confirm').value
    };

    skills_array = [];


    //Get back the loading object so we can then dismiss it when our API call is done.
    let loading = await create_ionic_loading();

    //Perform server side processing
    const rawResponse = await fetch('http://serviceloopserver.ga/verify_register_input', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    //Dismiss the loading indicator
    loading.dismiss();

    //Extract the reponse as JSON
    const content = JSON.parse(await rawResponse.json());
    console.log(content);

    //if error is set to 'true', we show an error message
    if (content.error) {
        create_ionic_alert("Error", content.response, ["OK"]);

        return false;
    } else {
        return true;
    }
}