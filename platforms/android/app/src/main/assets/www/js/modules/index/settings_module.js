"use strict"

async function encrypt_fingerprint(currentModal, email, password, ionic_loading) {
    try {
        let encryptConfig = {
            clientId: "Service Loop User",
            username: email,
            password: password
        };
        ionic_loading.dismiss();
        //Encrypt user details
        FingerprintAuth.encrypt(encryptConfig, successCallback, errorCallback);

        async function successCallback(result) {
            ionic_loading = await create_ionic_loading();

            console.log("successCallback(): " + JSON.stringify(result));
            let set_token_result = await set_secure_storage("service_loop_fingerprint_token", result.token);

            if (set_token_result === "Successfully stored string!") {
                document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "true");
                document.getElementById('fingerprint_message').innerText = "Turn off fingerprint login";
                localStorage.setItem("fingerprint_setup", "true");

                ionic_loading.dismiss();

                create_ionic_alert("Fingerprint configuration successful", "Congratulations! You have successfully setup fingerprint authentication.\n\
Now everytime you need to login, you can click on the fingerprint icon and login without entering email and password.", ["OK"], function () {
                    return dismissModal(currentModal);
                });
            } else {
                ionic_loading.dismiss();
                create_ionic_alert("Fingerprint configuration failed", set_token_result, ["OK"], function () {
                    return dismissModal(currentModal);
                });
            }
        }

        function errorCallback(error) {
            if (error !== FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                ionic_loading.dismiss();
                create_ionic_alert("Fingerprint configuration failed", error, ["OK"], function () {
                    return dismissModal(currentModal);
                });
            }
        }

    } catch (ex) {
        ionic_loading.dismiss();
        create_ionic_alert("Fingerprint configuration failed", ex, ["OK"], function () {
            return dismissModal(currentModal);
        });
    }

}

async function remove_fingerprint(currentModal, email) {
    let ionic_loading = await create_ionic_loading();
    //Check to see if the fingerprint functionality is available for the users phone
    let fingerprint_available = await is_fingerprint_available();
    //let fingerprint_available = true;

    //If the fingerprin functionality is present, we validate the users 
    if (fingerprint_available) {
        try { 
            let password = document.getElementById("fingerprint_password").value;

            //Check to see that user login details are correct
            let user_validated = await validate_user(email, password);

            //If user successfully authenticated, we encrypt
            if (user_validated) {
                FingerprintAuth.delete({
                    clientId: "Service Loop User",
                    username: email
                }, successCallback, errorCallback);

                async function successCallback(result) {
                    await remove_secure_storage("service_loop_fingerprint_token");

                    document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "false");
                    document.getElementById('fingerprint_message').innerText = "Turn on fingerprint login";
                    localStorage.removeItem("fingerprint_setup");

                    ionic_loading.dismiss();
                    create_ionic_alert("Fingerprint removed", "Fingerprint successfully deactivated, turn it on again in Settings.", ["OK"], function () {
                        return dismissModal(currentModal);
                    });
                }

                function errorCallback(error) {
                    ionic_loading.dismiss();
                    create_ionic_alert("Fingerprint removal failed", error, ["OK"], function () {
                        return dismissModal(currentModal);
                    });
                }
            } else {
                ionic_loading.dismiss();
                create_ionic_alert("Fingerprint removal failed", "Email or password supplied was incorrect!", ["OK"]);
            }
        } catch (ex) {
            ionic_loading.dismiss();
            create_ionic_alert("Fingerprint removal failed", ex, ["OK"], function () {
                return dismissModal(currentModal);
            });
        }

    } else {
        ionic_loading.dismiss();
        create_ionic_alert("Fingerprint removal failed", "Unfortunetly your device does not support fingerprint authentication, please \n\
            use your email and password instead.", ["OK"], function () {
            return dismissModal(currentModal);
        });
    }
}

async function setup_fingerprint(currentModal) {
    let ionic_loading = await create_ionic_loading();
    //Check to see if the fingerprint functionality is available for the users phone
    let fingerprint_available = await is_fingerprint_available();
    //let fingerprint_available = true;

    //If the fingerprin functionality is present, we validate the users 
    if (fingerprint_available) {
        try { 
            let password = document.getElementById("fingerprint_password").value;

            //Check to see that user login details are correct
            let user_validated = await validate_user(user.getEmail(), password);

            //If user successfully authenticated, we encrypt
            if (user_validated) {
                encrypt_fingerprint(currentModal, user.getEmail(), password, ionic_loading);
            } else {
                ionic_loading.dismiss();
                create_ionic_alert("Fingerprint configuration failed", "Email or password supplied was incorrect!", ["OK"]);
            }
        } catch (ex) {
            ionic_loading.dismiss();
            create_ionic_alert("Fingerprint configuration failed", ex, ["OK"], function () {
                return dismissModal(currentModal);
            });
        }

    } else {
        ionic_loading.dismiss();
        create_ionic_alert("Fingerprint configuration failed", "Unfortunetly your device does not support fingerprint authentication, please \n\
            use your email and password instead.", ["OK"], function () {
            return dismissModal(currentModal);
        });
    }
}

async function logout(logout_button) {
    try {
        await remove_secure_storage("jwt_session");

        window.location.href = "login.html";
    } catch (ex) {
        create_ionic_alert("Logout failed", ex, ["OK"], function () {
            logout_button.disabled = false;
            window.location.href = "login.html";
        });
    }
}


/*
 ******************************************************************************************************************
 ******************************************************************************************************************
 **************************************************DOM STARTS******************************************************
 ******************************************************************************************************************
 ******************************************************************************************************************
 */
if (localStorage.getItem("fingerprint_setup") !== null) {
    document.getElementById('fingerprint_message').innerText = "Turn off fingerprint login";
    document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "true");
} else {
    document.getElementById('fingerprint_message').innerText = "Turn on fingerprint login";
    document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "false");
}

let logout_button = document.getElementById("logout");

logout_button.addEventListener('click', () => {
    let logout_button_state = logout_button.hasAttribute("disabled");

    if (logout_button_state)
    {
        logout_button.disabled = false;
    } else
    {
        logout_button.disabled = true;
    }

    logout(logout_button);
});

let currentModal = null;
const controller = document.querySelector('ion-modal-controller');

document.getElementById('fingerprint_toggle').addEventListener('click', async () => {
    let modal_text;

    //This if statement prevents toggle from changing
    if (localStorage.getItem("fingerprint_setup") !== null) {
        document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "true");

        modal_text = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>Fingerprint</ion-title>
              <ion-buttons slot="end">
                <ion-button id="modal_close">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
              <ion-list class="fields" style="text-align:center;">
            <p><strong>Turn off fingerprint login</strong></p>
            <p>You are about to disable fingerprint login, are you sure you want to do this?</p>
            
              </ion-list>
    
        <ion-list lines="full" class="ion-no-margin ion-no-padding fields">
            <ion-item class="line">
            </ion-item>
            
          <ion-item>
            <ion-label class="pass_label" align="center" position="stacked">Enter your password <ion-text color="danger">*</ion-text></ion-label>
            <ion-input align="center" placeholder="********" id="fingerprint_password" required type="password"></ion-input>
          </ion-item>

        <div class="ion-padding-top">
          <ion-button expand="block" type="button" class="ion-no-margin" color="danger" id="fingerprint_disable_submit">Disable fingerprint</ion-button>
        </div>
            <p style="text-align: center; color: gray;">If you disable fingerprint login you will have to manually turn it on again in the settings!</p>
          </ion-content>
        `;

        let modal_created = await createModal(controller, modal_text);

        modal_created.present().then(() => {
            currentModal = modal_created;

            document.getElementById("fingerprint_disable_submit").addEventListener('click', async () => {
                remove_fingerprint(currentModal, user.getEmail());
            });

            document.getElementById("modal_close").addEventListener('click', () => {
                dismissModal(currentModal);
            });
        });

    } else {
        document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "false");

        modal_text = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>Fingerprint</ion-title>
              <ion-buttons slot="end">
                <ion-button id="modal_close">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
              <ion-list class="fields" style="text-align:center;">
            <p><strong>Turn on fingerprint login</strong></p>
            <p>You will be able to log in without entering your password</p>
            
              </ion-list>
        <ion-list lines="full" class="ion-no-margin ion-no-padding fields">
            <ion-item class="line">
            </ion-item>
            
          <ion-item>
            <ion-label class="pass_label" align="center" position="stacked">Enter your password <ion-text color="danger">*</ion-text></ion-label>
            <ion-input align="center" placeholder="********" id="fingerprint_password" required type="password"></ion-input>
          </ion-item>

        <div class="ion-padding-top">
          <ion-button expand="block" type="button" class="ion-no-margin" id="fingerprint_toggle_submit">Enable fingerprint</ion-button>
        </div>
            <p style="text-align: center; color: gray;">If you change your password then you will have to re-enable this feature!</p>

          </ion-content>
        `;


        let modal_created = await createModal(controller, modal_text);

        modal_created.present().then(() => {
            currentModal = modal_created;

            document.getElementById("fingerprint_toggle_submit").addEventListener('click', async () => {
                setup_fingerprint(currentModal);
            });

            document.getElementById("modal_close").addEventListener('click', () => {
                dismissModal(currentModal);
            });
        });
    }
});