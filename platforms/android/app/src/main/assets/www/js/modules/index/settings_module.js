"use strict"
const nav_settings = document.getElementById('nav-settings');

customElements.define('nav-settings', class NavSettings extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.innerHTML = `
          <ion-header translucent>
                    <ion-toolbar>
                        <ion-buttons onclick="device_feedback()" slot="start">
                            <ion-back-button></ion-back-button>
                        </ion-buttons>
                        <ion-buttons onclick="device_feedback()" slot="end">
                            <ion-menu-button></ion-menu-button>
                        </ion-buttons>
                        <ion-title>
                            <h1 style="margin-left: 8%;">Settings</h1>
                        </ion-title>
                    </ion-toolbar>
                </ion-header>

                <ion-content fullscreen>

                    <ion-list>
                        <ion-list-header>
                            ACCOUNT SETTINGS
                        </ion-list-header><!--<p>Manage information about you...</p>-->
                        <ion-list id="personal_info" class="ion-activatable ripple">
                            <ion-item lines='none' >
                                <ion-avatar slot="start">
                                    <img src="images/i_person.png">
                                </ion-avatar>
                                <ion-label>
                                    <h2>Personal Information</h2>
                                    <p>Update your phone number</p>
                                </ion-label>

                            </ion-item>
                            <ion-ripple-effect></ion-ripple-effect>
                        </ion-list>
                        <ion-list class="ion-activatable ripple" id="slides">
                            <ion-item lines='none'>
                                <ion-avatar slot="start">
                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">  <image id="image0" width="40" height="40" x="0" y="0"    href="data:image/png;base64,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" /></svg>
                                </ion-avatar>
                                <ion-label>
                                    <h2>Slides</h2>
                                    <p>Tutorial Slides</p>
                                </ion-label>
                                <ion-toggle slot="end" name="slides_toggle"></ion-toggle>
                            </ion-item>
                            <ion-ripple-effect></ion-ripple-effect>
                        </ion-list>
                    </ion-list>
                    <div class='space'></div>
                    <ion-list>
                        <ion-list-header>
                            SECURITY
                        </ion-list-header>
                        <ion-list id="change_pass" class="ion-activatable ripple">
                            <ion-item lines='none'>
                                <ion-avatar slot="start">
                                    <img src="images/i_lock.png">
                                </ion-avatar>
                                <ion-label>
                                    <h2>Change Password</h2>
                                </ion-label>
                            </ion-item>
                            <ion-ripple-effect></ion-ripple-effect>
                        </ion-list>
                        <ion-list class="ion-activatable ripple" id="fingerprint_toggle">
                            <ion-item lines='none'>
                                <ion-avatar slot="start">
                                    <img src="images/i_finger.png">
                                </ion-avatar>
                                <ion-label>
                                    <h2>Fingerprint</h2>
                                    <p id="fingerprint_message">Toggle fingerprint login</p>
                                </ion-label>
                                <ion-toggle slot="end" name="fingerprint_toggle"></ion-toggle>
                            </ion-item>
                            <ion-ripple-effect></ion-ripple-effect>
                        </ion-list>
                    </ion-list>
                    <div class='space'></div>
                    <ion-list>
                        <ion-list-header>
                            LEGAL AND POLICIES
                        </ion-list-header>
                        <ion-list id="terms_and_conditons" class="ion-activatable ripple">
                            <ion-item lines='none'>
                                <ion-avatar slot="start">
                                    <img src="images/i_terms.png">
                                </ion-avatar>
                                <ion-label>
                                    <h2>Terms And Conditions</h2>
                                    <p>Legal agreement between user and service provider</p>
                                </ion-label>
                            </ion-item>
                            <ion-ripple-effect></ion-ripple-effect>
                        </ion-list>
                        <ion-list id="privacy_policy" class="ion-activatable ripple">
                            <ion-item lines='none'>
                                <ion-avatar slot="start">
                                    <img src="images/i_privacy.png">
                                </ion-avatar>
                                <ion-label>
                                    <h2>Privacy Policy</h2>
                                    <p>Declares policy on collecting information</p>
                                </ion-label>
                            </ion-item>
                            <ion-ripple-effect></ion-ripple-effect>
                        </ion-list>
                    </ion-list>
                    <div class='space'></div>
                    <ion-list>
                        <ion-item lines='none'>
                            <ion-button id='logout' size='default' expand="block" color="danger">Logout</ion-button>
                        </ion-item> 

                    </ion-list>
                </ion-content>
                <ion-modal-controller></ion-modal-controller>
        `;

    }
});

//Set slides togle
let tutorial_slides_status = localStorage.getItem("tutorial_slides");
if (tutorial_slides_status !== "false")
{
    document.querySelector('ion-toggle[name="slides_toggle"]').setAttribute("checked", "true");
} else
{
    document.querySelector('ion-toggle[name="slides_toggle"]').setAttribute("checked", "false");
}

document.querySelector('ion-toggle[name="slides_toggle"]').addEventListener('click', () => {
    if (document.querySelector('ion-toggle[name="slides_toggle"]').checked) {
        document.querySelector('ion-toggle[name="slides_toggle"]').setAttribute("checked", "false");
        localStorage.setItem("tutorial_slides", "false");
    } else {
        document.querySelector('ion-toggle[name="slides_toggle"]').setAttribute("checked", "true");
        localStorage.setItem("tutorial_slides", "true");
    }
});

document.getElementById("slides").addEventListener('click', () => {
    device_feedback();
    if (document.querySelector('ion-toggle[name="slides_toggle"]').checked) {
        document.querySelector('ion-toggle[name="slides_toggle"]').setAttribute("checked", "false");
        localStorage.setItem("tutorial_slides", "false");
    } else {
        document.querySelector('ion-toggle[name="slides_toggle"]').setAttribute("checked", "true");
        localStorage.setItem("tutorial_slides", "true");
    }
});

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

            let set_token_result = await set_secure_storage("service_loop_fingerprint_token", result.token);

            if (set_token_result === "Successfully stored string!") {
                document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "true");
                document.getElementById('fingerprint_message').innerText = "Turn off fingerprint login";
                localStorage.setItem("fingerprint_setup", "true");
                localStorage.setItem("fingerprint_user", email);

                ionic_loading.dismiss();

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

                create_toast("Fingerprint enabled", "dark", 2000, toast_buttons);
                currentModal = dismissModal(currentModal);
            } else {
                ionic_loading.dismiss();

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

                create_toast("Fingerprint failed", "dark", 2000, toast_buttons);
                currentModal = dismissModal(currentModal);
            }
        }

        function errorCallback(error) {
            if (error !== FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                ionic_loading.dismiss();

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

                create_toast("Fingerprint failed", "dark", 2000, toast_buttons);
                currentModal = dismissModal(currentModal);
            }
        }

    } catch (ex) {
        ionic_loading.dismiss();

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

        create_toast("Fingerprint failed", "dark", 2000, toast_buttons);
        currentModal = dismissModal(currentModal);
    }

}

async function delete_fingerprint(email) {
    let fingerprint_available = await is_fingerprint_available();

    if (fingerprint_available) {
        try {
            FingerprintAuth.delete({
                clientId: "Service Loop User",
                username: email
            }, successCallback, errorCallback);

            async function successCallback(result) {
                if (!localhost) {
                    await remove_secure_storage("service_loop_fingerprint_token");
                }

                document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "false");
                document.getElementById('fingerprint_message').innerText = "Turn on fingerprint login";
                localStorage.removeItem("fingerprint_setup");
                localStorage.removeItem("fingerprint_user");
            }

            function errorCallback(error) {
                create_ionic_alert("Fingerprint removal failed", error, ["OK"]);
            }
        } catch (ex) {
            create_ionic_alert("Fingerprint removal failed", ex, ["OK"]);
        }

    } else {
        create_ionic_alert("Fingerprint", "Your device does not support fingerprint authentication", ["OK"]);
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
            if (user_validated.password_matches) {
                FingerprintAuth.delete({
                    clientId: "Service Loop User",
                    username: email
                }, successCallback, errorCallback);

                async function successCallback(result) {
                    await remove_secure_storage("service_loop_fingerprint_token");

                    document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "false");
                    document.getElementById('fingerprint_message').innerText = "Turn on fingerprint login";
                    localStorage.removeItem("fingerprint_setup");
                    localStorage.removeItem("fingerprint_user");

                    ionic_loading.dismiss();

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

                    create_toast("Fingerprint disabled", "dark", 2000, toast_buttons);
                    currentModal = dismissModal(currentModal);
                }

                function errorCallback(error) {
                    ionic_loading.dismiss();

                    create_ionic_alert("Fingerprint removal failed", error, ["OK"], function () {
                        currentModal = dismissModal(currentModal);
                    });
                    currentModal = dismissModal(currentModal);
                }
            } else {
                ionic_loading.dismiss();

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

                create_toast("Password is incorrect", "dark", 2000, toast_buttons);
            }
        } catch (ex) {
            ionic_loading.dismiss();

            create_ionic_alert("Fingerprint removal failed", ex, ["OK"], function () {
                currentModal = dismissModal(currentModal);
            });
        }

    } else {
        ionic_loading.dismiss();

        create_ionic_alert("Fingerprint", "Your device does not support fingerprint authentication", ["OK"]);

        currentModal = dismissModal(currentModal);
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
            if (user_validated.password_matches) {
                encrypt_fingerprint(currentModal, user.getEmail(), password, ionic_loading);
            } else {
                ionic_loading.dismiss();

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

                create_toast("Password is incorrect", "dark", 2000, toast_buttons);
            }
        } catch (ex) {
            ionic_loading.dismiss();

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

            create_toast(ex, "dark", 2000, toast_buttons);
            currentModal = dismissModal(currentModal);
        }

    } else {
        ionic_loading.dismiss();

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

        create_toast("Your device does not support fingerprint authentication", "dark", 2000, toast_buttons);
        currentModal = dismissModal(currentModal);
    }
}

async function logout(logout_button) {
    try {
        await remove_secure_storage("jwt_session");

        window.location.href = "login.html";
    } catch (ex) {

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

        create_toast("Your device does not support fingerprint authentication", "dark", 2000, toast_buttons);
        logout_button.disabled = false;
        window.location.href = "login.html";
    }
}


/*
 ******************************************************************************************************************
 ******************************************************************************************************************
 **************************************************DOM STARTS******************************************************
 ******************************************************************************************************************
 ******************************************************************************************************************
 */
active_nav = nav_settings;

if (localStorage.getItem("fingerprint_setup") !== null && localStorage.getItem("fingerprint_user") === user.getEmail()) {
    document.getElementById('fingerprint_message').innerText = "Turn off fingerprint login";
    document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "true");
} else {
    document.getElementById('fingerprint_message').innerText = "Turn on fingerprint login";
    document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "false");
}

let logout_button = document.getElementById("logout");

logout_button.addEventListener('click', () => {
    device_feedback();
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
    device_feedback();
    let modal_text;

    //This if statement prevents toggle from changing
    if (localStorage.getItem("fingerprint_setup") !== null && localStorage.getItem("fingerprint_user") === user.getEmail()) {
        document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "true");

        modal_text = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>Fingerprint</ion-title>
              <ion-buttons onclick="device_feedback()" slot="end">
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
            <ion-label class="pass_label" align="center" position="stacked">Enter password <ion-text color="danger">*</ion-text></ion-label>
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
                device_feedback();
                remove_fingerprint(currentModal, user.getEmail());
            });

            document.getElementById("modal_close").addEventListener('click', () => {
                currentModal = dismissModal(currentModal);
            });
        });

    } else {
        document.querySelector('ion-toggle[name="fingerprint_toggle"]').setAttribute("checked", "false");

        modal_text = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>Fingerprint</ion-title>
              <ion-buttons onclick="device_feedback()" slot="end">
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
                device_feedback();
                setup_fingerprint(currentModal);
            });

            document.getElementById("modal_close").addEventListener('click', () => {
                dismissModal(currentModal);
            });
        });
    }
});

document.getElementById('personal_info').addEventListener('click', async () => {
    device_feedback();
    let modal_text;

    modal_text = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>Personal Information</ion-title>
              <ion-buttons onclick="device_feedback()" slot="end">
                <ion-button id="modal_close">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
              <ion-list class="fields" style="text-align:center;">
            <p><strong>Personal Information</strong></p>
            <p>Bellow you can change your personal information.</p>
            
              </ion-list>
        <ion-list lines="full" class="ion-no-margin ion-no-padding fields">
            <ion-item class="line">
            </ion-item>
            
        <!--<ion-item>
            <ion-label class="pass_label" align="center" position="stacked">Full Name</ion-label>
            <ion-input align="center" placeholder="John Wick" id="new_full_name" type="text" ></ion-input>
        </ion-item>

        <ion-item>
            <ion-label class="pass_label" align="center" position="stacked">Student Email</ion-label>
            <ion-input align="center" placeholder="example@gmail.com" id="new_email" type="email" ></ion-input>
        </ion-item>-->

        <ion-item>
            <ion-label class="pass_label" align="center" position="stacked">Phone Number<ion-text color="danger">*</ion-text></ion-label>
            <ion-input align="center" placeholder="1234567890" id="new_phone_number" type="tel" ></ion-input>
        </ion-item>

        <div class="ion-padding-top">
          <ion-button expand="block" type="button" class="ion-no-margin" id="update_info">Update Information</ion-button>
        </div>
            <p style="text-align: center; color: gray;">The value you enter will be used in case you forget your password. Make sure it's correct!</p>

          </ion-content>
        `;

    let modal_created = await createModal(controller, modal_text);

    modal_created.present().then(() => {
        currentModal = modal_created;

        document.getElementById("modal_close").addEventListener('click', () => {
            dismissModal(currentModal);
        });
        document.getElementById("update_info").addEventListener('click', () => {
            update_info(currentModal);
        });
    });
});

document.getElementById('change_pass').addEventListener('click', async () => {
    device_feedback();
    let modal_text;

    modal_text = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>Change Password</ion-title>
              <ion-buttons onclick="device_feedback()" slot="end">
                <ion-button id="modal_close">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
              <ion-list class="fields" style="text-align:center;">
            <p><strong>Change Password</strong></p>
            <p>To change your password, please enter old password and new password twice.</p>
            
              </ion-list>
        <ion-list lines="full" class="ion-no-margin ion-no-padding fields">
            <ion-item class="line">
            </ion-item>
            
          <ion-item>
            <ion-label class="pass_label" align="center" position="stacked">Old password <ion-text color="danger">*</ion-text></ion-label>
            <ion-input align="center" placeholder="********" id="old_password" required type="password"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label class="pass_label" align="center" position="stacked">New password <ion-text color="danger">*</ion-text></ion-label>
            <ion-input align="center" placeholder="********" id="new_password" required type="password"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label class="pass_label" align="center" position="stacked">Confirm password <ion-text color="danger">*</ion-text></ion-label>
            <ion-input align="center" placeholder="********" id="conf_new_password" required type="password"></ion-input>
          </ion-item>

        <div class="ion-padding-top">
          <ion-button expand="block" type="button" class="ion-no-margin" id="change_password">Change Password</ion-button>
        </div>
            <p style="text-align: center; color: gray;">You cannot undo this action!</p>

          </ion-content>
        `;

    let modal_created = await createModal(controller, modal_text);

    modal_created.present().then(() => {
        currentModal = modal_created;

        document.getElementById("modal_close").addEventListener('click', () => {
            dismissModal(currentModal);
        });
        document.getElementById("change_password").addEventListener('click', () => {
            device_feedback();
            change_pass(modal_created);
        });
    });
});

document.getElementById('terms_and_conditons').addEventListener('click', async () => {
    device_feedback();

    show_terms_conditions();
});


document.getElementById('privacy_policy').addEventListener('click', async () => {
    device_feedback();
    let modal_text;

    modal_text = `
          <ion-header translucent>
                            <ion-toolbar>
                                <ion-title>Privacy Policy</ion-title>
                                <ion-buttons onclick="device_feedback()" slot="end">
                <ion-button id="modal_close">Close</ion-button>
              </ion-buttons>
                            </ion-toolbar>
                        </ion-header>
                
                        <ion-content fullscreen>
        <ion-list class="terms">
            <p><strong style="opacity: 0.7;">Last Updated&nbsp;30&nbsp;January&nbsp;2020&nbsp;</strong>&nbsp;</p>
            <p>Thank you for choosing to be part of our community at&nbsp;<strong>Service Loop</strong>. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at&nbsp;<strong>info@serviceloop.com</strong>.</p>
            <p>When you visit our&nbsp;and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy policy that you do not agree with, please discontinue use of our&nbsp;and our services.</p>
            <p>This privacy policy applies to all information collected through our&nbsp;and/or any related services, sales, marketing or events (we refer to them collectively in this privacy policy as the "<strong>Sites</strong>").&nbsp;</p>
            <p><strong>Please read this privacy policy carefully as it will help you make informed decisions about sharing your personal information with us.&nbsp;</strong>&nbsp;</p>
            <p><strong>TABLE OF CONTENTS</strong><strong>&nbsp;</strong>&nbsp;</p>
            <ol>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_1"> WHAT INFORMATION DO WE COLLECT?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_2"> WILL YOUR INFORMATION BE SHARED WITH ANYONE?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_3"> DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_4"> HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_5"> IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_6"> WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_7"> HOW LONG DO WE KEEP YOUR INFORMATION?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_8"> HOW DO WE KEEP YOUR INFORMATION SAFE?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_9"> DO WE COLLECT INFORMATION FROM MINORS?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_10"> WHAT ARE YOUR PRIVACY RIGHTS?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_11"> CONTROLS FOR DO-NOT-TRACK FEATURES</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_12"> DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_13"> DO WE MAKE UPDATES TO THIS POLICY?</a></span></li>
            <li><span style="color: #000000;"><a style="color: #000000;" href="#privacy_policy_14"> HOW CAN YOU CONTACT US ABOUT THIS POLICY?</a></span></li>
            </ol>
            <p><strong>1. WHAT INFORMATION DO WE COLLECT?</strong></p>
            <p><strong>Personal information you disclose to us</strong>&nbsp;</p>
            <p><strong><em>In Short:</em></strong><strong>&nbsp;</strong><em>We collect personal information that you provide to us such as name, contact information, passwords and security data.</em>&nbsp;&nbsp;</p>
            <p>We collect personal information that you voluntarily provide to us when&nbsp;registering at the&nbsp;&nbsp;expressing an interest in obtaining information about us or our products and services, when participating in activities on the&nbsp;(such as posting messages in our online forums or entering competitions, contests or giveaways)&nbsp;or otherwise contacting us.&nbsp;</p>
            <p>The personal information that we collect depends on the context of your interactions with us and the&nbsp;, the choices you make and the products and features you use. The personal information we collect can include the following:</p>
            <p><strong>Name and Contact Data.</strong>&nbsp;We collect your first and last name, email address, postal address, phone number, and other similar contact data.</p>
            <p><strong>Credentials.</strong>&nbsp;We collect passwords, password hints, and similar security information used for authentication and account access.</p>
            <p>All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.&nbsp;&nbsp;</p>
            <p><strong>Information automatically collected</strong>&nbsp;</p>
            <p><strong><em>In Short:</em></strong><strong>&nbsp;</strong><em>Some information &ndash; such as IP address and/or browser and device characteristics &ndash; is collected automatically when you visit our&nbsp;.</em></p>
            <p>We automatically collect certain information when you visit, use or navigate the&nbsp;. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our&nbsp;and other technical information. This information is primarily needed to maintain the security and operation of our&nbsp;, and for our internal analytics and reporting purposes.&nbsp;</p>
            <p>Like many businesses, we also collect information through cookies and similar technologies.&nbsp;&nbsp;</p>
            <p><strong>2. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>We only share information with your consent, to comply with laws, to protect your rights, or to fulfill business obligations.&nbsp;</em>&nbsp;&nbsp;</p>
            <p>We may process or share data based on the following legal basis:</p>
            <ul>
            <li><strong>Consent:</strong>&nbsp;We may process your data if you have given us specific consent to use your personal information in a specific purpose.<br /> </li>
            <li><strong>Legitimate Interests:</strong>&nbsp;We may process your data when it is reasonably necessary to achieve our legitimate business interests.&nbsp;<br /><br /></li>
            <li><strong>Performance of a Contract:&nbsp;</strong>Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.&nbsp;<br /> </li>
            <li><strong>Legal Obligations:</strong>&nbsp;We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements).&nbsp;<br /> </li>
            <li><strong>Vital Interests:</strong>&nbsp;We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
            </ul>
            <p>More specifically, we may need to process your data or share your personal information in the following situations:&nbsp;&nbsp;&nbsp;</p>
            <ul>
            <li><strong>Vendors, Consultants and Other Third-Party Service Providers.</strong>&nbsp;We may share your data with third party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include: payment processing, data analysis, email delivery, hosting services, customer service and marketing efforts. We may allow selected third parties to use tracking technology on the&nbsp;, which will enable them to collect data about how you interact with the&nbsp;over time. This information may be used to, among other things, analyze and track data, determine the popularity of certain content and better understand online activity. Unless described in this Policy, we do not share, sell, rent or trade any of your information with third parties for their promotional purposes.&nbsp;&nbsp;</li>
            <li><strong>Affiliates.</strong>&nbsp;We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy policy. Affiliates include our parent company and any subsidiaries, joint venture partners or other companies that we control or that are under common control with us.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li>
            <li><strong>Business Partners.</strong>&nbsp;We may share your information with our business partners to offer you certain products, services or promotions.&nbsp;&nbsp;&nbsp;</li>
            <li><strong>Other Users.</strong>&nbsp;When you share personal information&nbsp;or otherwise interact with public areas of the&nbsp;, such personal information may be viewed by all users and may be publicly distributed outside the&nbsp;in perpetuity.&nbsp;If you interact with other users of our&nbsp;and register through a social network (such as Facebook), your contacts on the social network will see your name, profile photo, and descriptions of your activity.&nbsp;Similarly, other users will be able to view descriptions of your activity, communicate with you within our&nbsp;, and view your profile.&nbsp; &nbsp;</li>
            </ul>
            <p><strong>3. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>We may use cookies and other tracking technologies to collect and store your information.</em>&nbsp;&nbsp;</p>
            <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.</p>
            <p><strong>4. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>If you choose to register or log in to our websites using a social media account, we may have access to certain information about you.</em>&nbsp;&nbsp;</p>
            <p>Our&nbsp;offer you the ability to register and login using your third party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile Information we receive may vary depending on the social media provider concerned, but will often include your name, e-mail address, friends list, profile picture as well as other information you choose to make public.&nbsp;&nbsp;</p>
            <p>We will use the information we receive only for the purposes that are described in this privacy policy or that are otherwise made clear to you on the&nbsp;. Please note that we do not control, and are not responsible for, other uses of your personal information by your third party social media provider. We recommend that you review their privacy policy to understand how they collect, use and share your personal information, and how you can set your privacy preferences on their sites and apps.&nbsp;&nbsp;</p>
            <p><strong>5. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>We do not transfer, store, and process your information in countries other than your own.</em>&nbsp;&nbsp;</p>
            <p>Our servers are located in. If you are accessing our&nbsp;from outside, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by those third parties with whom we may share your personal information (see "<a href="https://app.termly.io/dashboard/website/339115/privacy-policy#infoshare">WILL YOUR INFORMATION BE SHARED WITH ANYONE?</a>" above), in&nbsp;and other countries.&nbsp;</p>
            <p>If you are a resident in the European Economic Area, then these countries may not have data protection or other laws as comprehensive as those in your country. We will however take all necessary measures to protect your personal information in accordance with this privacy policy and applicable law.&nbsp;&nbsp;</p>
            <p><strong>6. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>We are not responsible for the safety of any information that you share with third-party providers who advertise, but are not affiliated with, our websites.&nbsp;</em>&nbsp;</p>
            <p>The&nbsp;may contain advertisements from third parties that are not affiliated with us and which may link to other websites, online services or mobile applications. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy policy. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services or applications that may be linked to or from the&nbsp;. You should review the policies of such third parties and contact them directly to respond to your questions.&nbsp;</p>
            <p><strong>7. HOW LONG DO WE KEEP YOUR INFORMATION?</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law.</em>&nbsp;&nbsp;</p>
            <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this policy will require us keeping your personal information for longer than&nbsp;your account exists.</p>
            <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
            <p><strong>8. HOW DO WE KEEP YOUR INFORMATION SAFE?&nbsp;</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>We aim to protect your personal information through a system of organisational and technical security measures.</em>&nbsp;</p>
            <p>We have implemented appropriate technical and organisational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our&nbsp;is at your own risk. You should only access the services within a secure environment.&nbsp;</p>
            <p><strong>9. DO WE COLLECT INFORMATION FROM MINORS?</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>We do not knowingly collect data from or market to children under 18 years of age.</em></p>
            <p>We do not knowingly solicit data from or market to children under 18 years of age. By using the&nbsp;, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent&rsquo;s use of the&nbsp;. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we have collected from children under age 18, please contact us at&nbsp;<strong>info@serviceloop.com</strong>.&nbsp;</p>
            <p><strong>10. WHAT ARE YOUR PRIVACY RIGHTS?</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>In some regions, such as the European Economic Area, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</em></p>
            <p>In some regions (like the European Economic Area), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. To make such a request, please use the&nbsp;<a href="https://app.termly.io/dashboard/website/339115/privacy-policy#contact">contact details</a>&nbsp;provided below. We will consider and act upon any request in accordance with applicable data protection laws.&nbsp;</p>
            <p>If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. Please note however that this will not affect the lawfulness of the processing before its withdrawal.</p>
            <p>If you are resident in the European Economic Area and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here:&nbsp;<a href="http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm">http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm</a>&nbsp;</p>
            <p><strong>Account Information</strong>&nbsp;</p>
            <p>If you would at any time like to review or change the information in your account or terminate your account, you can:&nbsp;&nbsp;</p>
            <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.&nbsp;&nbsp;</p>
            <p><strong>Opting out of email marketing:&nbsp;</strong>You can unsubscribe from our marketing email list at any time by clicking on the unsubscribe link in the emails that we send or by contacting us using the details provided below. You will then be removed from the marketing email list &ndash; however, we will still need to send you service-related emails that are necessary for the administration and use of your account. To otherwise opt-out, you may:</p>
            <p><strong>11. CONTROLS FOR DO-NOT-TRACK FEATURES</strong></p>
            <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&ldquo;DNT&rdquo;) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Policy.&nbsp;</p>
            <p><strong>12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.&nbsp;</em>&nbsp;</p>
            <p>California Civil Code Section 1798.83, also known as the &ldquo;Shine The Light&rdquo; law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.&nbsp;</p>
            <p>If you are under 18 years of age, reside in California, and have a registered account with the&nbsp;, you have the right to request removal of unwanted data that you publicly post on the&nbsp;. To request removal of such data, please contact us using the contact information provided below, and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the&nbsp;, but please be aware that the data may not be completely or comprehensively removed from our systems.</p>
            <p><strong>13. DO WE MAKE UPDATES TO THIS POLICY?</strong></p>
            <p><strong><em>In Short:&nbsp;</em></strong><em>Yes, we will update this policy as necessary to stay compliant with relevant laws.</em></p>
            <p>We may update this privacy policy from time to time. The updated version will be indicated by an updated &ldquo;Revised&rdquo; date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.&nbsp;</p>
            <p><strong>14. HOW CAN YOU CONTACT US ABOUT THIS POLICY?</strong></p>
            <p>If you have questions or comments about this policy, you may&nbsp;email us at&nbsp;<strong>info@serviceloop.com</strong>&nbsp;or by post to:</p>
            <p><strong>Service Loop&nbsp;&nbsp;</strong></p>
            <p><strong>Dundalk,&nbsp;Louth,</strong></p>
            <p><strong>Ireland&nbsp;&nbsp;&nbsp;</strong></p>
        </ion-list>
    </ion-content>
        `;

    let modal_created = await createModal(controller, modal_text);

    modal_created.present().then(() => {
        currentModal = modal_created;

        document.getElementById("modal_close").addEventListener('click', () => {
            dismissModal(currentModal);
        });
    });
});