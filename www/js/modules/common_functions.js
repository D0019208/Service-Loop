/*
 * A function that can create Ionic Alerts based on inputed information.
 * 
 * @param {String} header - This is the heading of the alert e.g. "Warning!"
 * @param {String} message - This is the body of the alert e.g. "Agreement has been changed!"
 * @param {Array} buttons - These are the actions a user can take e.g "Invalidate agreement" (Optional)
 * @param {Array} inputs - These are fields the user can enter information into e.g. "Password" (Optional)
 * @param {Function} on_alert_dismiss_function - A function to execute when alert is dismissed (Optional)
 * 
 * @returns {undefined}
 */
function create_ionic_alert(header, message, buttons, on_alert_dismiss_function = null, inputs) {
    let ion_alert_controller = document.createElement('ion-alert-controller');
    document.querySelector('ion-app').appendChild(ion_alert_controller);

    ion_alert_controller.create({
        header: header,
        message: message,
        buttons: buttons,
        inputs: inputs
    }).then(alert => {

        alert.present();

        //If we pass in an on_alert_dismiss_function then we call it after we dismiss the alert
        if (on_alert_dismiss_function !== null) {
            alert.onDidDismiss().then(() => {
                document.querySelector('ion-alert-controller').remove();
                console.log("dismissed");
                on_alert_dismiss_function();
            });
        } else {
            alert.onDidDismiss().then(() => {
                document.querySelector('ion-alert-controller').remove();
                console.log("dismissed no function");
            });
        }
    });
}


//Function to view PDFs
function openPDF(pdf_url)
{
    cordova.InAppBrowser.open('https://d00192082.alwaysdata.net/ServiceLoopServer/' + pdf_url, '_system', 'location=yes');
}


/*
 * A function that can create an Ionic Loading overlay. 
 * 
 * @returns {Promise} This function returns the controller for the Ionic loading overlay allowing us to
 * call dismiss() whenever we no longer require the loading overlay
 */
function create_ionic_loading() {
    //Create the ion-loading-controller element
    let ion_loading_controller = document.createElement('ion-loading-controller');
    document.querySelector('ion-app').appendChild(ion_loading_controller);

    //Return the conroller itself as a Promise
    return new Promise((resolve, reject) => {
        ion_loading_controller.create({
            message: 'Please wait...',
            duration: 30000
        }).then((loading) => {
            loading.present();
            resolve(loading);
        });
    });
}

/*
 * A function that we can use to access a route in our NodeJS server. It fetches the data from the specified
 * route and then returns it.
 * 
 * @param {Object} data - This is the data that we wish to pass to the NodeJS e.g. {user_name: "John Wick"}
 * @param {String} route - This is the route that our application should request data from e.g. "login"
 * @param {Boolean} show_loading - This boolean determines wether we see a loading message or not (Optional)
 * 
 * @returns {Object} Once we are finished fetching the data or encounter an error, we send back an Object containing
 * a boolean representing wether the fetching was successful and the response text 
 */
async function access_route(data, route, show_loading = true) {
    //Get back the loading object so we can then dismiss it when our API call is done.
    let loading;
    if (show_loading) {
        loading = await create_ionic_loading();
    }

    try {
        //let path = localhost ? "http://localhost:3001/" : "http://serviceloopserver.ga/";
        let path = "http://serviceloopserver.ga/";
        const rawResponse = await fetch(path + route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let response = await rawResponse.json();

        if (show_loading) {
            loading.dismiss();
        }

        return response;

    } catch (ex) {
        if (show_loading) {
            loading.dismiss();
        }

        return {error: true, response: ex};
}
}

/*
 * This function checks to see if the entered email and password match to a user.
 * 
 * @param {String} user_email
 * @param {String} user_password
 * 
 * @returns {boolean}
 */
async function validate_user(user_email, user_password) {
    let data = {
        users_email: user_email,
        users_password: user_password
    };

    const rawResponse = await fetch('http://serviceloopserver.ga/check_user_details_correct', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await rawResponse.json();
}

//Check if fingerprint authentication is available
async function is_fingerprint_available() {
    return new Promise((resolve, reject) => {
        FingerprintAuth.isAvailable(isAvailableSuccess, isAvailableError);

        /**
         * @return {
         *      isAvailable:boolean,
         *      isHardwareDetected:boolean,
         *      hasEnrolledFingerprints:boolean
         *   }
         */
        function isAvailableSuccess(result) {
            console.log("FingerprintAuth available: " + JSON.stringify(result));
            if (result.isAvailable) {
                resolve(true);
            }
        }

        function isAvailableError(message) {
            console.log("isAvailableError(): " + message);
            resolve(false);
        }
    });

}

/*
 * A function that sets puts a piece of data into your phones SecureStorage. It takes a key and a value as its
 * only arguments
 * 
 * @param {String} key - This is the key that will be associated with our data e.g. "name"
 * @param {String} value - This is the data that we wish to store in SecureStorage e.g. "John Wick"
 * 
 * @returns {Promise} Once we are finished storing the data, we pass back either a success message or error message
 */
function set_secure_storage(key, value) {
    return new Promise((resolve, reject) => {
        cordova.plugins.SecureKeyStore.set(function (res) {
            resolve("Successfully stored string!")
        }, function (error) {
            resolve(error)
        }, key, value);
    });
}

/*
 * A function that gets data from SecureStorage by a key and returns said data
 * 
 * @param {String} key - This is the key that is associated with our data e.g. "name" 
 * 
 * @returns {Promise} Once we are finished getting the data from SecureStorage, we 
 * pass back the data or an error via Promise
 */
function get_secure_storage(key) {
    return new Promise((resolve, reject) => {
        cordova.plugins.SecureKeyStore.get(function (email) {
            resolve(email);
        }, function (error) {
            resolve(error);
        }, key);
    });
}

/*
 * A function that deletes a piece of data from SecureStorage based on the key passed in
 * 
 * @param {String} key - This is the key that will be used to delete our data e.g. "name" 
 * 
 * @returns {Promise} Once we are finished deleting the data, we pass back either a success message or error message
 */
function remove_secure_storage(key) {
    return new Promise((resolve, reject) => {
        cordova.plugins.SecureKeyStore.remove(function (res) {
            resolve("Successfully removed from secure storage!");
        }, function (error) {
            resolve(error);
        }, key);
    });
}

function getClosest(elem, selector) {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                            i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {
                    }
                    return i > -1;
                };
    }

    // Get the closest matching element
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector))
            return elem;
    }
    return null;

}
;

//Ionic 4 Modal
//Why is this here?
customElements.define('modal-content', class ModalContent extends HTMLElement {
    connectedCallback() {
        const modalElement = document.querySelector('ion-modal');
        this.innerHTML = modalElement.componentProps.modal_content;
    }
});

/*
 * A function that creates a modal based on the content passed in
 * 
 * @param {Element} controller - This is the modal controller element
 * @param {String} modal_content - This is the HTML that we will use in the modal
 * 
 * @returns {Controller} Once we are finished creating the modal, we pass its controller back
 */
function createModal(controller, modal_content) {
    return controller.create({
        component: 'modal-content',
        componentProps: {
            modal_content: modal_content
        }
    });
}

/*
 * A function that dismisses a particular modal
 * 
 * @param {Element} currentModal - This is the current active modal
 * 
 * @returns {Null} This function DOES NOT return anything
 */
function dismissModal(currentModal) {
    if (currentModal) {
        currentModal.dismiss().then(() => {
            currentModal = null;
        });
    }
}

/*
 * A function that loads a script tag from the url specified
 * 
 * @param {String} url - This is the location of the script file we wish to load
 * @param {String} id - This is the id that we will assign to the <script> element
 * 
 * @returns {Null} This function DOES NOT return anything
 */
function include(url, id) {
    return new Promise((resolve, reject) => {
        if (!document.getElementById(id)) {
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.id = id;
            script.src = url;
            script.onload = function () {
                resolve()
            };
            document.querySelector('ion-tabs').appendChild(script);
        } else {
            resolve();
        }
    });
}

function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function formatDate(date_string) {
//  var monthNames = [
//    "January", "February", "March",
//    "April", "May", "June", "July",
//    "August", "September", "October",
//    "November", "December"
//  ];
    let date = new Date(date_string);

    let day = date.getDate();
    let monthIndex = date.getMonth() + 1;
    if (monthIndex < 10) {
        monthIndex = "0" + monthIndex;
    }

    let year = date.getFullYear();

    //return day + ' ' + monthNames[monthIndex] + ' ' + year;
    return day + '/' + monthIndex + '/' + year;
}

function insert_to_array_by_index(array, index, value) {
    array.splice(index, 0, value);
}

function device_feedback() {
    if (!localhost) {
        window.plugins.deviceFeedback.isFeedbackEnabled(function (feedback) {
            if (feedback.haptic && feedback.acoustic) {
                window.plugins.deviceFeedback.haptic();
                window.plugins.deviceFeedback.acoustic();
            } else if (feedback.haptic) {
                window.plugins.deviceFeedback.haptic();
            } else if (feedback.acoustic) {
                window.plugins.deviceFeedback.acoustic();
            }
        });
    }
}

/*
 * A function that creates a toast that disapears after a certain time
 * 
 * @param {String} toast_message - This is the message to be displayed on the toast
 * @param {int} toast_duration - This is the duration of the toast after which it closes
 * @param {Object} toast_buttons - These are the buttons that will appear on the toast
 * @param {Object} toast_dismiss_function - This is an optional function that is executed upon the
 * toast being dismissed
 * 
 * @returns {Promise} This function returns a resolved promise that displays the toast notification
 */
async function create_toast(toast_message, toast_color, toast_duration, toast_buttons, toast_dismiss_function = null) {
    const toast = document.createElement('ion-toast');

    toast.message = toast_message;
    toast.color = toast_color;
    toast.duration = toast_duration;
    toast.position = 'bottom';
    toast.buttons = toast_buttons;

    if (toast_dismiss_function !== null) {
        toast.addEventListener('ionToastWillDismiss', toast_dismiss_function);
    }

    document.body.appendChild(toast);

    return toast.present();
}

function groupBy(array, prop) {
    let grouped_objects_array = [];

    for (let i = 0; i < array.length; i++) {
        if (array[i].post_status === prop) {
            grouped_objects_array.push(array[i]);
        }
    }

    return grouped_objects_array;
}
function closeMenu()
{
    const menuCtrl = document.querySelector('ion-menu-controller');
    menuCtrl.close('menu');
}












































//MOVE LATER!!!!! NOT EFFICIENT TO LOAD ALL OF THIS JS AT ONCE!
function drawing_pad() {
    signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)'
    });

    var undoButton = document.getElementById('undo')
    var cancelButton = document.getElementById('clear');

    undoButton.addEventListener('click', () => {
        var data = signaturePad.toData();
        if (data) {
            data.pop(); // remove the last dot or line
            signaturePad.fromData(data);
        }
    });

    cancelButton.addEventListener('click', function (event) {
        signaturePad.clear();
    });
}

function isCanvasBlank(canvas) {
    return !canvas.getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height).data
            .some(channel => channel !== 0);
}

function load_post_agreement_offered_component(nav_controller, this_post, tutorial_tag, tutorial_status) {
    let tutorial_links = get_tutorial_links(tutorial_tag);

    let tutorial_element = document.createElement('tutorial');
    let tutorial_element_html = `<ion-header translucent>
            <ion-toolbar>
                <ion-buttons onclick="device_feedback()" slot="start">
                    <ion-back-button defaultHref="/"></ion-back-button>
                </ion-buttons>
                <ion-buttons onclick="device_feedback()" slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title><h1>Tutorial</h1></ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content fullscreen>
            <ion-item style="margin-top:10px;" lines="none">
                <ion-avatar style="width: 100px;height: 100px;" slot="start">
                    <img src="${this_post.std_avatar}">
                </ion-avatar>
                <ion-label>
                    <h2><strong>${this_post.std_name}</strong></h2>
                    <p>${this_post.std_email}</p>
                </ion-label><p class="date">${formatDate(this_post.post_posted_on)}</p>
            </ion-item>


            <ion-item-divider class="divider"></ion-item-divider>
            <ion-item lines="none">
                
                    <h6><strong>${this_post.post_title}</strong></h6>
                
            </ion-item>
            <ion-item style="margin-top:-10px;" lines="none">
                <p>
                    ${this_post.post_desc}
                </p>
            </ion-item>
            <ion-chip class="module" color="primary">
                <ion-icon name="star"></ion-icon>
                <ion-label>${tutorial_tag}</ion-label>
            </ion-chip>
            <!--<ion-chip class="module2" color="danger">
              <ion-icon name="close"></ion-icon>
              <ion-label>Closed</ion-label>
            </ion-chip>-->
            <ion-chip color="success">
                <ion-icon name="swap"></ion-icon>
                <ion-label>${tutorial_status}</ion-label>
            </ion-chip>
            <ion-item-divider class="divider2"></ion-item-divider>  
            <ion-item lines="none">
                <ion-label>
                    <h2><strong>Extra information</strong></h2>
                </ion-label>
            </ion-item>      
            <ion-item style="margin-top:-15px;" lines="none">
                <h6>
                    Your tutor, ${this_post.post_tutor_name} has sent you an agreement regarding your tutorial request, please
                    review it before accepting or rejecting it. If you have any questions, contact him through his college email at 
                    '${this_post.post_tutor_email}' 
                </h6>

            </ion-item> 
            <ion-item-divider class="divider2"></ion-item-divider>   
            <div class="ion-padding-top">
                <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="view_agreement">View agreement</ion-button>
                <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
                <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="tutorial_log">Tutorial Log</ion-button>
                <ion-button expand="full" type="button" class="ion-no-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="success" id="accept_agreement">Accept<br/>agreement</ion-button>
                <ion-button expand="full" type="button" class="ion-no-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="reject_agreement">Reject<br/>agreement</ion-button>
            </div>               
            <ion-item-divider class="divider2"></ion-item-divider> 
            <ion-item lines="none">
                <ion-label>
                    <h2><strong>Tutorial stage</strong></h2>
                </ion-label>
            </ion-item>
            <div class="wrapper">
            <ul class="StepProgress">
              <li class="StepProgress-item current"><strong>Open</strong>
              <span>Tutorial requested. No tutor assigned.</span>
              </li>
              <li class="StepProgress-item"><strong>Pending</strong>
              <span>Tutor has been assigned.</span>
              </li>
              <li class="StepProgress-item"><strong>Ongoing</strong>
              <span>Agreement generated and signed. </span>
              </li>
              <li class="StepProgress-item"><strong>Done</strong>
              <span>Tutorial completed.</span>
              </li>
            </ul>
        </div>
            <ion-item-divider class="divider"></ion-item-divider>
                <ion-list-header class="collapsible">
                    <strong>TUTORIAL LINKS</strong>
                </ion-list-header>
            <ion-list class="content">
                ${tutorial_links}
            </ion-list>
            <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="cancel_tutorial">Cancel Tutorial</ion-button>
            <br><br>
        </ion-content>`;
    tutorial_element.innerHTML = tutorial_element_html;

    nav_controller.push(tutorial_element);

    let cancel_tutorial;
    let cancel_tutorial_handler = async function () {
        device_feedback();

        cancel_the_tutorial(nav_controller, this_post, this_post._id, tutorial_status);
    };

    let tutorial_log;
    let tutorial_log_handler = async function () {
        load_blockchain_component(nav_controller, this_post._id);
    };

    let accept_agreement;
    let accept_agreement_handler = async function () {
        device_feedback();
        load_sign_accepted_agreement_component(nav_controller, this_post);

    }

    let reject_agreement;
    let reject_agreement_handler = async function () {
        device_feedback();

        create_ionic_alert("Reject agreement", "Please confirm that you wish to reject this agreement.", [
            {
                text: 'Reject',
                handler: () => {
                    console.log('Rejected')
                    reject_this_agreement(nav_controller, this_post);
                }
            },
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel')
                }
            }
        ]);
    }

    let validate_agreement;
    let validate_agreement_handler = async function () {
        device_feedback();

        validate_digital_signatures({tutor_email: this_post.post_tutor_email, pdf: this_post.post_agreement_url, verify_single: true});
    };

    let openPdf;
    let openPdfHandler = async function () {
        device_feedback();
        openPDF(this_post.post_agreement_url);
        //console.log(this_tutorial);
    }

    let ionNavDidChangeEvent = async function () {
        //TUTORIAL LINKS ACCORDION
        if (document.getElementsByClassName("collapsible") !== null) {
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        }

        if (document.getElementById('tutorial_log') !== null) {
            tutorial_log = document.getElementById('tutorial_log');
            tutorial_log.addEventListener('click', tutorial_log_handler, false);
        }

        if (document.getElementById('view_agreement') !== null) {
            openPdf = document.getElementById("view_agreement");
            openPdf.addEventListener('click', openPdfHandler, false);
        }

        if (document.getElementById('accept_agreement') !== null) {
            accept_agreement = document.getElementById("accept_agreement");
            accept_agreement.addEventListener('click', accept_agreement_handler, false);
        }

        if (document.getElementById('reject_agreement') !== null) {
            reject_agreement = document.getElementById("reject_agreement");
            reject_agreement.addEventListener('click', reject_agreement_handler, false);
        }

        if (document.getElementById('verify_agreement') !== null) {
            validate_agreement = document.getElementById('verify_agreement');
            validate_agreement.addEventListener('click', validate_agreement_handler, false);
        }

        if (document.getElementById('cancel_tutorial') !== null) {
            cancel_tutorial = document.getElementById('cancel_tutorial');
            cancel_tutorial.addEventListener('click', cancel_tutorial_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();

        if (notifications_active_component.component.tagName !== "TUTORIAL" && notifications_active_component.component.tagName !== "SIGN-TUTORIAL-AGREEMENT" && notifications_active_component.component.tagName !== "BLOCKCHAIN_AUDIT_LOG") {
            openPdf.removeEventListener("click", openPdfHandler, false);
            accept_agreement.removeEventListener("click", accept_agreement_handler, false);
            reject_agreement.removeEventListener("click", reject_agreement_handler, false);
            validate_agreement.removeEventListener("click", validate_agreement_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
            cancel_tutorial.removeEventListener("click", cancel_tutorial_handler, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

async function accept_post(nav_controller, this_post, post, is_forum, previous_view, user_avatar) {
    console.log("This_post")
    console.log(this_post)
    let post_acceptated_response = await access_route({tutor_email: user.getEmail(), tutor_name: user.getName(), post_id: this_post._id, user_avatar: user_avatar}, "post_accepted", function () {
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

        create_toast("You have accepted a tutorial.", "dark", 2000, toast_buttons);
    });

    if (!post_acceptated_response.error) {
        user_notifications.addToNotifications(post_acceptated_response.response.tutor_notification);
        user_notifications.sendTutorialAcceptedNotification(post_acceptated_response.response.student_notification, post_acceptated_response.response.post);

        //Send push notification
        if (!localhost) {
            push.send_notification("Tutor assigned", "A tutor has been assigned for the tutorial '" + post_acceptated_response.response.post.post_title + "'. Click on this notification to open it.", post_acceptated_response.response.post.std_email, "Tutorial accepted", post_acceptated_response.response.post, post_acceptated_response.response.student_notification);
        }

        tutor_tutorials.add_tutorial_to_tutor_tutorials(post_acceptated_response.response.post);

        let name = post_acceptated_response.response.post.std_name;

        let success_screen_element = document.createElement('success_screen');
        success_screen_element.innerHTML =
                `
        <ion-content fullscreen>
            <h1 class="success_name">Tutorial request accepted!</h1>
            <p class="success_img"><img  src="images/success_blue1.png" alt=""/></p>
            <ion-list lines="full" class="ion-no-margin ion-no-padding fields1">
            <p class="success_text">Congratulations, You have volunteered to be a tutor for ${name}.</p>
            <p class="success_text2">Please get in contact with the student and fill out the agreement form.</p>
            
            </ion-list>
            <ion-list lines="full" class="ion-no-margin ion-no-padding fields">
            <div class="ion-padding-top">
                <ion-button expand="block" type="submit" class="ion-no-margin" id="ok_btn">Okay</ion-button>
                <p class="success_text3">Please note, the student has to agree to the agreement before a tutorial can take place.</p>
            </div>
            </ion-list>
        </ion-content>`;

        let ok_btn;
        let tab_bar = document.querySelector('ion-tab-bar');
        tab_bar.style.display = 'none';

        let ok_btn_handler = async function () {
            device_feedback();

            if (is_forum) {
                //All notification posts
                let notification_posts = posts.notification_posts;

                //Change the status of this post
                for (let i = 0; i < notification_posts.length; i++) {
                    if (notification_posts[i]._id === this_post._id) {
                        notification_posts[i].post_status = "In negotiation";
                    }
                }

                //Set the new array
                posts.notification_posts = notification_posts;

                if (posts.all_posts.length !== 0 && posts.total_posts !== 0) {
                    posts.all_posts = posts.all_posts.filter(e => e !== this_post);
                    posts.removePostById(this_post._id);
                }
            }

            posts.replace_notification_posts(post_acceptated_response.response.post);

            if (post !== null) {
                post.remove();
            }

            if (previous_view === 'NAV-ALL-TUTORIALS') {
                nav_controller.popTo(1);
            } else if (previous_view === 'NAV-NOTIFICATION-TUTORIAL-REQUESTED') {
                nav_controller.popTo(0);
            } else {
                nav_controller.popToRoot();
            }
        }

        nav_controller.push(success_screen_element);




        let ionNavDidChangeEvent = async function () {
            if (document.getElementById('ok_btn') !== null) {
                ok_btn = document.getElementById("ok_btn");
                ok_btn.addEventListener('click', ok_btn_handler, false);
            }

            let active_component = await nav_controller.getActive();

            //Remove the event listener when we no longer need it
            if (active_component.component.tagName !== "SUCCESS_SCREEN") {
                ok_btn.removeEventListener("click", ok_btn_handler, false);
                tab_bar.style.display = 'flex';
                nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
            }
        };

        nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);












//        create_ionic_alert("Tutorial request acceptated", "You have successfully acceptated a tutorial request.", ["OK"], function () {
//            posts.all_posts = posts.all_posts.filter(e => e !== this_post);
//            posts.total_posts = posts.total_posts - 1;
//
//            if (document.getElementById("forum_list").childNodes.length === 0) {
//                document.getElementById("forum_list").remove();
//            }
//
//            post.remove();
//            nav.popToRoot();
//
//            posts.removePostById(post.getAttribute("post_id"));
//        });
    } else {
        create_ionic_alert("Tutorial request error", post_acceptated_response.response, ["OK"], function () {
            posts.all_posts = posts.all_posts.filter(e => e !== this_post);
            posts.total_posts = posts.total_posts - 1;

            if (document.getElementById("forum_list") !== null) {
                if (document.getElementById("forum_list").childNodes.length === 0) {
                    document.getElementById("forum_list").remove();
                }
            }


            post.remove();
            nav_controller.popToRoot();
        });
    }
}







function load_pending_tutorial_component_signed(nav_controller, this_tutorial, tutorial_status, tutorial_tag) {
    let tutorial_links = get_tutorial_links(tutorial_tag);

    let tutor_tutorial_element = document.createElement('tutorial');
    let tutor_tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons onclick="device_feedback()" slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons onclick="device_feedback()" slot="end">
                                        <ion-menu-button></ion-menu-button>
                                    </ion-buttons>
                                    <ion-title><h1>Tutorial</h1></ion-title>
                                </ion-toolbar>
                            </ion-header>

                            <ion-content fullscreen>
                                <ion-item style="margin-top:10px;" lines="none">
                                    <ion-avatar style="width: 100px;height: 100px;" slot="start">
                                        <img src="${this_tutorial.std_avatar}">
                                    </ion-avatar>
                                    <ion-label>
                                        <h2><strong>${this_tutorial.std_name}</strong></h2>
                                        <p>${this_tutorial.std_email}</p>
                                    </ion-label><p class="date">${formatDate(this_tutorial.post_posted_on)}</p>
                                </ion-item>


                                <ion-item-divider class="divider"></ion-item-divider>
                                <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>${this_tutorial.post_title}</strong></h2>
                                    </ion-label>
                                </ion-item>
                                <ion-item style="margin-top:-15px;" lines="none">
                                    <h6>
                                        ${this_tutorial.post_desc}
                                    </h6>
                                </ion-item>
                                        <ion-chip class="module" color="primary">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-label>${tutorial_tag}</ion-label>
                                </ion-chip>
                                <!--<ion-chip class="module2" color="danger">
                                  <ion-icon name="close"></ion-icon>
                                  <ion-label>Closed</ion-label>
                                </ion-chip>-->
                                <ion-chip color="success">
                                    <ion-icon name="swap"></ion-icon>
                                    <ion-label>${tutorial_status}</ion-label>
                                </ion-chip>
                                 <ion-item-divider class="divider2"></ion-item-divider>  
                                                              <ion-item lines="none">
                                                                <ion-label>
                                                                    <h2><strong>Extra information</strong></h2>
                                                                </ion-label>
                                                            </ion-item>      
                                                             <ion-item style="margin-top:-15px;" lines="none">
                                                                <h6>
                                                                An agreement is created. Please wait for ${this_tutorial.std_name} to accept or reject the agreement.
                                                                </h6>

                                                            </ion-item> 
                                                                <ion-item-divider class="divider2"></ion-item-divider>   
                                                                <div class="ion-padding-top">
                                                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="view_agreement">View agreement</ion-button>
                                                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
                                                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="tutorial_log">Tutorial Log</ion-button>
                                                                </div> 
                                                                <ion-item-divider class="divider2"></ion-item-divider> 
                                                        <ion-item lines="none">
                                                            <ion-label>
                                                                <h2><strong>Tutorial stage</strong></h2>
                                                            </ion-label>
                                                        </ion-item>
                                                            <div class="wrapper">
                                                            <ul class="StepProgress">
                                                              <li class="StepProgress-item is-done"><strong>Open</strong>
                                                              <span>Tutorial requested. No tutor assigned.</span>
                                                              </li>
                                                              <li class="StepProgress-item current"><strong>Pending</strong>
                                                              <span>Tutor has been assigned.</span>
                                                              </li>
                                                              <li class="StepProgress-item"><strong>Ongoing</strong>
                                                              <span>Agreement generated and signed.</span>
                                                              </li>
                                                              <li class="StepProgress-item"><strong>Done</strong>
                                                              <span>Tutorial completed.</span>
                                                              </li>
                                                            </ul>
                                                        </div>
                                                        <ion-item-divider class="divider"></ion-item-divider>
                                                            <ion-list-header class="collapsible">
                                                                <strong>TUTORIAL LINKS</strong>
                                                            </ion-list-header>
                                                        <ion-list class="content">
                                                            ${tutorial_links}
                                                        </ion-list> 
                                                        <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="cancel_tutorial">Cancel Tutorial</ion-button>
                                                    </ion-content>`;

    tutor_tutorial_element.innerHTML = tutor_tutorial_element_html;
    nav_controller.push(tutor_tutorial_element);

    let cancel_tutorial;
    let cancel_tutorial_handler = async function () {
        device_feedback();

        cancel_the_tutorial(nav_controller, this_tutorial, this_tutorial._id, tutorial_status);
    };

    let tutorial_log;
    let tutorial_log_handler = async function () {
        load_blockchain_component(nav_controller, this_tutorial._id);
    };

    let validate_agreement;
    let validate_agreement_handler = async function () {
        device_feedback();

        validate_digital_signatures({tutor_email: this_tutorial.post_tutor_email, student_email: this_tutorial.std_email, pdf: this_tutorial.post_agreement_url, verify_single: false});
    };

    let openPdf;
    let openPdfHandler = async function () {
        device_feedback();
        openPDF(this_tutorial.post_agreement_url);
        //console.log(this_tutorial);
    }

    let ionNavDidChangeEvent = async function () {
        //TUTORIAL LINKS ACCORDION
        if (document.getElementsByClassName("collapsible") !== null) {
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        }

        if (document.getElementById('cancel_tutorial') !== null) {
            cancel_tutorial = document.getElementById('cancel_tutorial');
            cancel_tutorial.addEventListener('click', cancel_tutorial_handler, false);
        }

        if (document.getElementById('view_agreement') !== null) {
            openPdf = document.getElementById("view_agreement");
            openPdf.addEventListener('click', openPdfHandler, false);
        }

        if (document.getElementById('verify_agreement') !== null) {
            validate_agreement = document.getElementById("verify_agreement");
            validate_agreement.addEventListener('click', validate_agreement_handler, false);
        }

        if (document.getElementById('tutorial_log') !== null) {
            tutorial_log = document.getElementById('tutorial_log');
            tutorial_log.addEventListener('click', tutorial_log_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();

        if (notifications_active_component.component.tagName !== "TUTORIAL" && notifications_active_component.component.tagName !== "BLOCKCHAIN_AUDIT_LOG") {
            openPdf.removeEventListener("click", openPdfHandler, false);
            validate_agreement.removeEventListener('click', validate_agreement_handler, false);
            tutorial_log.removeEventListener("click", tutorial_log_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
            cancel_tutorial.removeEventListener("click", cancel_tutorial_handler, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

function load_pending_tutorial_component(nav_controller, this_post, tutorial_tag, tutorial_status) {
    let tutorial_links = get_tutorial_links(tutorial_tag);

    let tutorial_accepted_component = document.createElement('tutorial_requested');
    let tutorial_accepted_component_html;
    tutorial_accepted_component_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons onclick="device_feedback()" slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons onclick="device_feedback()" slot="end">
                                        <ion-menu-button></ion-menu-button>
                                    </ion-buttons>
                                    <ion-title><h1>Tutorial</h1></ion-title>
                                </ion-toolbar>
                            </ion-header>

                            <ion-content fullscreen>
                                <ion-item style="margin-top:10px;" lines="none">
                                    <ion-avatar style="width: 100px;height: 100px;" slot="start">
                                        <img src="${this_post.std_avatar}">
                                    </ion-avatar>
                                    <ion-label>
                                        <h2><strong>${this_post.std_name}</strong></h2>
                                        <p>${this_post.std_email}</p>
                                    </ion-label><p class="date">${formatDate(this_post.post_posted_on)}</p>
                                </ion-item>


                                <ion-item-divider class="divider"></ion-item-divider>
                                <ion-item lines="none">
                                    
                                        <h6><strong>${this_post.post_title}</strong></h6>
                                    
                                </ion-item>
                                <ion-item style="margin-top:-10px;" lines="none">
                                    <p>
                                        ${this_post.post_desc}
                                    </p>
                                </ion-item>
                                        <ion-chip class="module" color="primary">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-label>${tutorial_tag}</ion-label>
                                </ion-chip>
                                <!--<ion-chip class="module2" color="danger">
                                  <ion-icon name="close"></ion-icon>
                                  <ion-label>Closed</ion-label>
                                </ion-chip>-->
                                <ion-chip color="success">
                                    <ion-icon name="swap"></ion-icon>
                                    <ion-label>${tutorial_status}</ion-label>
                                </ion-chip>
                                 <ion-item-divider class="divider2"></ion-item-divider>  
                                  <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>Extra information</strong></h2>
                                    </ion-label>
                                </ion-item>      
                                 <ion-item style="margin-top:-15px;" lines="none">
                                    <h6>
                                        ${this_post.post_tutor_name} has assigned to be your tutor and will contact with you shorty via college email
                                        '${this_post.post_tutor_email}'.
                                    </h6>
                                </ion-item>    
                                <ion-item-divider class="divider2"></ion-item-divider>   
                                    <div class="ion-padding-top">
                                        <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="tutorial_log">Tutorial Log</ion-button>
                                    </div> 
                                <ion-item-divider class="divider2"></ion-item-divider> 
                            <ion-item lines="none">
                                                            <ion-label>
                                                                <h2><strong>Tutorial stage</strong></h2>
                                                            </ion-label>
                                                        </ion-item>
                                                            <div class="wrapper">
                                                            <ul class="StepProgress">
                                                              <li class="StepProgress-item is-done"><strong>Open</strong>
                                                              <span>Tutorial requested. No tutor assigned.</span>
                                                              </li>
                                                              <li class="StepProgress-item current"><strong>Pending</strong>
                                                              <span>Tutor has been assigned.</span>
                                                              </li>
                                                              <li class="StepProgress-item"><strong>Ongoing</strong>
                                                              <span>Agreement generated and signed.</span>
                                                              </li>
                                                              <li class="StepProgress-item"><strong>Done</strong>
                                                              <span>Tutorial completed.</span>
                                                              </li>
                                                            </ul>
                                                        </div>
                                                        <ion-item-divider class="divider"></ion-item-divider>
                                                            <ion-list-header class="collapsible">
                                                                <strong>TUTORIAL LINKS</strong>
                                                            </ion-list-header>
                                                        <ion-list class="content">
                                                            ${tutorial_links}
                                                        </ion-list>  
                                                        <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="cancel_tutorial">Cancel Tutorial</ion-button>
                                                    </ion-content>`;

    tutorial_accepted_component.innerHTML = tutorial_accepted_component_html;

    nav_controller.push(tutorial_accepted_component);

    let cancel_tutorial;
    let cancel_tutorial_handler = async function () {
        device_feedback();

        cancel_the_tutorial(nav_controller, this_post, this_post._id, tutorial_status);
    };

    let tutorial_log;
    let tutorial_log_handler = async function () {
        load_blockchain_component(nav_controller, this_post._id);
    };

    let ionNavDidChangeEvent = async function () {
        //TUTORIAL LINKS ACCORDION
        if (document.getElementsByClassName("collapsible") !== null) {
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        }

        if (document.getElementById('cancel_tutorial') !== null) {
            cancel_tutorial = document.getElementById('cancel_tutorial');
            cancel_tutorial.addEventListener('click', cancel_tutorial_handler, false);
        }

        if (document.getElementById('tutorial_log') !== null) {
            tutorial_log = document.getElementById('tutorial_log');
            tutorial_log.addEventListener('click', tutorial_log_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();

        if (notifications_active_component.component.tagName !== "TUTORIAL_REQUESTED" && notifications_active_component.component.tagName !== "BLOCKCHAIN_AUDIT_LOG") {
            tutorial_log.removeEventListener("click", tutorial_log_handler, false);
            cancel_tutorial.removeEventListener("click", cancel_tutorial_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

function load_pending_tutorial_component_not_signed(nav_controller, this_tutorial) {
    let tutor_tutorial_element = document.createElement('tutorial');
    let date = new Date();
    let year = date.getFullYear();
    let current_date = year + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();

    let tutor_tutorial_element_html = `
                                <ion-header translucent>
                                    <ion-toolbar>
                                        <ion-buttons onclick="device_feedback()" slot="start">
                                            <ion-back-button defaultHref="/"></ion-back-button>
                                            </ion-buttons>
                                            <ion-buttons onclick="device_feedback()" slot="end">
                                                <ion-menu-button></ion-menu-button>
                                            </ion-buttons>
                                        <ion-title><h1>Agreement Details</h1></ion-title>
                                    </ion-toolbar>
                                </ion-header>
                                <ion-content fullscreen> 
                                    <p class="center">Please enter the following details</p>
                                    <ion-item-divider class="divider">
                                    </ion-item-divider>
                                    <ion-item>
                                        <ion-label>Date <ion-text color="danger">*</ion-text></ion-label>
                                        <ion-datetime id="tutorial_date" value="${current_date}" min="${year}" max="${year}" placeholder="Select Date"></ion-datetime>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label>Time <ion-text color="danger">*</ion-text></ion-label>
                                        <ion-datetime id="tutorial_time" display-format="HH:mm" value="00:00"></ion-datetime>
                                    </ion-item>

                                    <br><br>
                                    <ion-item lines="none" style="text-align:center;"><ion-label>Your signature <ion-text color="danger">*</ion-text></ion-label></ion-item>
                                    <div class="wrapper2">
                                        <canvas id="signature-pad" class="signature-pad" width=300 height=200></canvas>
                                    </div>
                                    <div style="text-align:center">
                                        
                                        <ion-button style="height: 25px;" fill="outline" id="undo">Undo</ion-button>
                                        <ion-button style="height: 25px;" fill="outline" id="clear">Clear</ion-button>
                                    </div>

                                    <div class="ion-padding-top fields">
                                        <ion-button expand="block" id="generate_agreement" type="submit" class="ion-no-margin">Create agreement</ion-button>
                                    </div>
                                    <p class="success_text3">Please note, the student has to agree to the agreement before a tutorial can take place.</p> 
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="cancel_tutorial">Cancel Tutorial</ion-button>
                                </ion-content>`;

    tutor_tutorial_element.innerHTML = tutor_tutorial_element_html;
    nav_controller.push(tutor_tutorial_element);

    let cancel_tutorial;
    let cancel_tutorial_handler = async function () {
        device_feedback();

        console.log("Eeeeey")
        console.log(this_tutorial)

        if (this_tutorial.post_status = "In negotiation") {
            this_tutorial.post_status = "Pending"
        }

        cancel_the_tutorial(nav_controller, this_tutorial, this_tutorial._id, this_tutorial.post_status);
    };

    let generate_agreement_button;
    let generate_agreement_handler = async function () {
        device_feedback();

        generate_agreement(nav_controller, this_tutorial);
    };

    let ionNavDidChangeEvent = async function () {
        //TUTORIAL LINKS ACCORDION
        if (document.getElementsByClassName("collapsible") !== null) {
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        }

        if (document.getElementById('signature-pad') !== null) {
            await include("js/signature_pad.min.js", "signature_pad");
            drawing_pad();
            generate_agreement_button = document.getElementById("generate_agreement");
            generate_agreement_button.addEventListener('click', generate_agreement_handler, false);
        }

        if (document.getElementById('cancel_tutorial') !== null) {
            cancel_tutorial = document.getElementById('cancel_tutorial');
            cancel_tutorial.addEventListener('click', cancel_tutorial_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();

        if (notifications_active_component.component.tagName !== "TUTORIAL") {
            cancel_tutorial.removeEventListener("click", cancel_tutorial_handler, false);
            generate_agreement_button.removeEventListener("click", generate_agreement_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}













async function generate_agreement(nav_controller, tutorial) {
    if (isCanvasBlank(document.getElementById('signature-pad'))) {
        create_ionic_alert("Agreement creation failed", "Please fill in all fields before proceeding.", ["OK"]);
    } else {
        let agreement_generated_response;

        if (typeof tutorial._id == 'undefined') {
            agreement_generated_response = await access_route({tutorial_id: tutorial.getAttribute('post_id'), tutor_avatar: user.getAvatar(), tutorial_date: document.getElementById('tutorial_date').value, tutorial_time: document.getElementById('tutorial_time').value, tutor_signature: signaturePad.toDataURL('image/png')}, "offer_agreement");
        } else {
            agreement_generated_response = await access_route({tutorial_id: tutorial._id, tutor_avatar: user.getAvatar(), tutorial_date: document.getElementById('tutorial_date').value, tutorial_time: document.getElementById('tutorial_time').value, tutor_signature: signaturePad.toDataURL('image/png')}, "offer_agreement");
        }

        console.log(agreement_generated_response);
        if (!agreement_generated_response.error) {
            //Send push notification
            if (!localhost) {
                push.send_notification("Preliminary agreement generated", "An agreement for the tutorial '" + agreement_generated_response.updated_tutorial.post_title + "' has ben created. Click on this notification to open it.", agreement_generated_response.updated_tutorial.std_email, "Tutorial accepted", {}, {});
            }

            //push.send_notification("Preliminary agreement generated", "An agreement for the tutorial '" + agreement_generated_response.updated_tutorial.post_title + "' has ben created. Click on this notification to open it.", agreement_generated_response.updated_tutorial.std_email, "Agreement offer accepted", agreement_generated_response.updated_tutorial, agreement_generated_response.student_notification.response);

            user_notifications.addToNotifications(agreement_generated_response.tutor_notification.response);
            user_notifications.sendAgreementGeneratedNotification({response: agreement_generated_response.student_notification.response}, agreement_generated_response.updated_tutorial);

            //tutor_tutorials.remove_tutorial_from_DOM("Pending", agreement_generated_response);
            tutor_tutorials.update_tutorial("Pending", agreement_generated_response.updated_tutorial);
            posts.replace_notification_posts(agreement_generated_response.updated_tutorial);
            //tutor_tutorials.add_tutorial_to_DOM("Ongoing", agreement_generated_response.updated_tutorial)

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

            create_toast("Agreement offer sent.", "dark", 2000, toast_buttons);

            nav_controller.pop();
        } else {
            create_ionic_alert("Tutorial request error", agreement_generated_response.response, ["OK"]);
        }

        console.log(agreement_generated_response);
    }
}

async function load_new_tutorial_request_component(nav_controller, this_notification, extra_information) {
//    let notification_posts;
//
//    if (posts.get_notification_posts().length == 0) {
//        //Function to get all ids from the notifications list and find the posts associated with them
//        notification_posts = await posts.getAllNotificationPosts();
//        console.log(notification_posts);
//        posts.set_notification_posts(notification_posts);
//    } else {
//        notification_posts = posts.get_notification_posts();
//    }

    //Get the current post notification
    let this_post = posts.getNotificationPostDetailsById(this_notification.post_id);
    console.log("Test - " + this_notification.post_id)
    console.log("This post");
    console.log(this_post)
    if (typeof this_post == 'undefined') {
        this_post = posts.getNotificationById(this_notification.post_id);
    }

    let modules = "";

    for (let i = 0; i < this_post.post_modules.length; i++) {
        modules += '<ion-chip class="module" color="primary"><ion-icon name="star"></ion-icon><ion-label>' + this_post.post_modules[i] + '</ion-label></ion-chip>';
    }

    let nav_post = document.createElement("nav-post");
    nav_post.innerHTML = `
                            <ion-header translucent>
                            <ion-toolbar>
                                    <ion-buttons onclick="device_feedback()" slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                <ion-title><h1>Request Description</h1></ion-title>
                            </ion-toolbar>
                        </ion-header>
                
                        <ion-content fullscreen>
                        <ion-item style="margin-top:10px;" lines="none">
                          <ion-avatar style="width: 100px;height: 100px;" slot="start">
                            <img src="${this_post.std_avatar}">
                          </ion-avatar>
                          <ion-label>
                            <h2><strong>${this_post.std_name}</strong></h2>
                            <p>${this_post.std_email}</p>
                          </ion-label>
                        </ion-item>
                            
                            <ion-item-divider class="divider"></ion-item-divider>
                        <ion-item lines="none">
                            
                                <h6><strong>${this_post.post_title}</strong></h6>
                            
                        </ion-item>
                        <ion-item style="margin-top:-10px;" lines="none">
                            
                                <p>${this_post.post_desc}</p>
                            
                        </ion-item>
                            
                        ${modules}
                            
                            <ion-item-divider class="divider2"></ion-item-divider>
                            <ion-button expand="block" type="submit" class="ion-margin accept_request_btn" id="accept_request_btn">Accept Request</ion-button>
                        </ion-content>
                                              `;

    let accept_request_btn;

    let handler = function () {
        device_feedback();

        create_ionic_alert("Accept tutorial", "Are you sure you want to accept this tutorial?", [
            {
                text: 'Accept',
                handler: async () => {
                    device_feedback();

                    let previous_view = await nav_controller.getPrevious();

                    accept_post(nav_controller, this_post, extra_information.post, extra_information.is_forum, previous_view.element.tagName, user.getAvatar());
                }
            },
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    device_feedback();
                    console.log('Cancel')
                }
            }
        ]);
    }

    nav_controller.push(nav_post);




    let ionNavDidChangeEvent = async function () {
        if (document.getElementById('accept_request_btn') !== null) {
            accept_request_btn = document.getElementById("accept_request_btn");
            accept_request_btn.addEventListener('click', handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();

        //Remove the event listener when we no longer need it
        if (notifications_active_component.component.tagName !== "NAV-POST") {
            accept_request_btn.removeEventListener("click", handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}









function load_sign_accepted_agreement_component(nav_controller, this_tutorial) {
    let tutor_tutorial_element = document.createElement('sign-tutorial-agreement');
    let date = new Date();
    let year = date.getFullYear();
    let current_date = year + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
    console.log(current_date);
    console.log(year)

    let tutor_tutorial_element_html = `
                                <ion-header translucent>
                                    <ion-toolbar>
                                        <ion-buttons onclick="device_feedback()" slot="start">
                                            <ion-back-button defaultHref="/"></ion-back-button>
                                            </ion-buttons>
                                            <ion-buttons onclick="device_feedback()" slot="end">
                                                <ion-menu-button></ion-menu-button>
                                            </ion-buttons>
                                        <ion-title><h1>Sign Agreement</h1></ion-title>
                                    </ion-toolbar>
                                </ion-header>
                                <ion-content fullscreen> 
                                    <p class="center">Please enter your signature</p>
                                    <ion-item-divider class="divider">
                                    </ion-item-divider>
                                    <br><br>
                                    <div class="wrapper2">
                                        <canvas id="signature-pad" class="signature-pad" width=300 height=200></canvas>
                                    </div>
                                    <div style="text-align:center"> 
                                        <ion-button style="height: 25px;" fill="outline" id="undo">Undo</ion-button>
                                        <ion-button style="height: 25px;" fill="outline" id="clear">Clear</ion-button>
                                    </div>

                                    <div class="ion-padding-top fields">
                                        <ion-button expand="block" id="accept_agreement_button" type="submit" class="ion-no-margin">Accept agreement</ion-button>
                                    </div>
                                    <p class="success_text3">Please note, once accepted you cannot cancel the agreement. Failure to attend will result in penalties being imposed.</p> 
                            </ion-content>`;

    tutor_tutorial_element.innerHTML = tutor_tutorial_element_html;
    nav_controller.push(tutor_tutorial_element);

    let accept_agreement_button;
    let accept_agreement_handler = async function () {
        device_feedback();

        if (isCanvasBlank(document.getElementById('signature-pad'))) {
            create_ionic_alert("No signature", "Please draw your signature to continue", [
                {
                    text: 'OK',
                }]);
        } else {
            create_ionic_alert("Accept agreement", "Please confirm that you wish to accept this agreement.", [
                {
                    text: 'Accept',
                    handler: () => {
                        console.log('Accepted');
                        accept_agreement(nav_controller, this_tutorial);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel')
                    }
                }
            ]);
        }
    }

    let ionNavDidChangeEvent = async function () {
        if (document.getElementById('signature-pad') !== null) {
            await include("js/signature_pad.min.js", "signature_pad");
            drawing_pad();
            accept_agreement_button = document.getElementById("accept_agreement_button");
            accept_agreement_button.addEventListener('click', accept_agreement_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();

        if (notifications_active_component.component.tagName !== "SIGN-TUTORIAL-AGREEMENT" && typeof accept_agreement_button !== 'undefined') {
            accept_agreement_button.removeEventListener("click", accept_agreement_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}







async function accept_agreement(nav_controller, this_tutorial) {
    if (isCanvasBlank(document.getElementById('signature-pad'))) {
        create_ionic_alert("Failed to accept agreement", "Please enter a signature to accept the agreement.", ["OK"]);
    } else {
        let agreement_accepted_response = await access_route({tutorial_id: this_tutorial._id, student_signature: signaturePad.toDataURL('image/png')}, "accept_agreement");

        if (!agreement_accepted_response.error) {
            //Send push notification
            if (!localhost) {
                push.send_notification("Agreement accepted", "The student has accepted your agreement for the '" + agreement_accepted_response.updated_tutorial.post_title + "' tutorial. Click on this notification to view it.", agreement_accepted_response.updated_tutorial.post_tutor_email, "Agreement accepted", {}, {});
            }

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

            create_toast("Agreement accepted.", "dark", 2000, toast_buttons);

            user_notifications.addToNotifications(agreement_accepted_response.student_notification.response);
            user_notifications.sendAgreementAcceptedNotification({response: agreement_accepted_response.tutor_notification.response}, agreement_accepted_response.updated_tutorial);

            //tutorials.update_my_tutorial("Pending", agreement_accepted_response.updated_tutorial); 
            posts.replace_notification_posts(agreement_accepted_response.updated_tutorial);
            tutorials.add_ongoing_post(agreement_accepted_response.updated_tutorial);

            if (document.getElementById('ongoing_tutorials_header') !== null) {
                tutorials.remove_tutorial_by_id(tutorials.pending_tutorials, agreement_accepted_response.updated_tutorial._id);
                tutorials.add_post_to_segment("Ongoing", document.getElementById('ongoing_tutorials_header'), this_tutorial);
            }

            if (document.getElementById('pending_tutorials_header') !== null) {
                tutorials.remove_tutorial_from_DOM("Pending", agreement_accepted_response, this_tutorial);
            }
        } else {
            create_ionic_alert("Failed to accept agreement", agreement_accepted_response.response, ["OK"]);
        }

        console.log(agreement_accepted_response);
    }

    nav_controller.popToRoot();
}

async function reject_this_agreement(nav_controller, this_tutorial) {
    console.log("Test")
    console.log(tutorials.open_tutorials)

    let agreement_rejected_response = await access_route({tutorial_id: this_tutorial._id}, "reject_agreement");

    if (!agreement_rejected_response.error) {
        //Send push notification
        if (!localhost) {
            push.send_notification("Agreement rejected", "The student has rejected your agreement for the '" + agreement_rejected_response.updated_tutorial.post_title + "' tutorial. Click on this notification to create a new one.", agreement_rejected_response.updated_tutorial.post_tutor_email, "Agreement rejected", {}, {});
        }

        console.log(agreement_rejected_response)
        console.log("Before");
        console.log(tutorials.open_tutorials);
        console.log("After");
        console.log(tutorials.open_tutorials);

        user_notifications.addToNotifications(agreement_rejected_response.student_notification.response);
        user_notifications.sendAgreementRejectedNotification({response: agreement_rejected_response.tutor_notification.response}, agreement_rejected_response.updated_tutorial);
        posts.replace_notification_posts(agreement_rejected_response.updated_tutorial);


        let previous_view = await nav_controller.getPrevious();

        if (previous_view.element.tagName === 'NAV-MY-REQUESTED-TUTORIALS') {
            nav_controller.pop();
        } else if (previous_view.element.tagName === 'NAV-NOTIFICATION') {
            nav_controller.popTo(0);
        }

        tutorials.total_open_tutorials = tutorials.open_tutorials.length;

        if (document.getElementById('open_tutorials_header') !== null) {
            tutorials.add_post_to_segment("Open", document.getElementById('open_tutorials_header'), agreement_rejected_response.updated_tutorial);
            tutorials.remove_tutorial_from_DOM("Pending", agreement_rejected_response, this_tutorial);
        }

        tutorials.update_my_tutorial("Pending", agreement_rejected_response.updated_tutorial);
    } else {
        create_ionic_alert("Failed to reject agreement", agreement_rejected_response.response, ["OK"]);
    }
}











function load_ongoing_tutorial_component(nav_controller, this_post, tutorial_tag, tutorial_status) {
    let tutorial_links = get_tutorial_links(tutorial_tag);
    let cancel_button = "";

    //Check to see if tutorial in progress, add another line of code to check if to add the "Begin tutorial" or "Finish tutorial" button. Use same method for creating method as u can see below.
    if (!this_post.tutorial_started) {
        cancel_button = '<ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="cancel_tutorial">Cancel Tutorial</ion-button>';
    }
    
    //Checking to see if user is student or tutor, if student, we DO NOT display Begin tutorial, if tutor, we display it
    if(this_post.std_email !== user.getEmail()) {
        
    }

    let tutorial_accepted_component = document.createElement('tutorial_agreement_accepted');
    let tutorial_accepted_component_html;
    tutorial_accepted_component_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons onclick="device_feedback()" slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons onclick="device_feedback()" slot="end">
                                        <ion-menu-button></ion-menu-button>
                                    </ion-buttons>
                                    <ion-title><h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1></ion-title>
                                </ion-toolbar>
                            </ion-header>

                            <ion-content fullscreen>
                                <ion-item style="margin-top:10px;" lines="none">
                                    <ion-avatar style="width: 100px;height: 100px;" slot="start">
                                        <img src="${this_post.std_avatar}">
                                    </ion-avatar>
                                    <ion-label>
                                        <h2><strong>${this_post.std_name}</strong></h2>
                                        <p>${this_post.std_email}</p>
                                    </ion-label><p class="date">${formatDate(this_post.post_posted_on)}</p>
                                </ion-item>


                                <ion-item-divider class="divider"></ion-item-divider>
                                <ion-item lines="none">
                                    
                                        <h6><strong>${this_post.post_title}</strong></h6>
                                    
                                </ion-item>
                                <ion-item style="margin-top:-10px;" lines="none">
                                    <p>
                                        ${this_post.post_desc}
                                    </p>
                                </ion-item>
                                        <ion-chip class="module" color="primary">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-label>${tutorial_tag}</ion-label>
                                </ion-chip>
                                <!--<ion-chip class="module2" color="danger">
                                  <ion-icon name="close"></ion-icon>
                                  <ion-label>Closed</ion-label>
                                </ion-chip>-->
                                <ion-chip color="success">
                                    <ion-icon name="swap"></ion-icon>
                                    <ion-label>${tutorial_status}</ion-label>
                                </ion-chip>
                                <ion-item-divider class="divider2"></ion-item-divider>   
                                <div class="ion-padding-top">
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="success" id="begin_tutorial">Begin Tutorial</ion-button>
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="finish_tutorial">Finish Tutorial</ion-button>
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="view_agreement">View agreement</ion-button>
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="tutorial_log">Tutorial Log</ion-button>
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
                                </div> 
                                 <ion-item-divider class="divider2"></ion-item-divider>   
                                
                            <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>Tutorial stage</strong></h2>
                                    </ion-label>
                                </ion-item>
                                <div class="wrapper">
                                <ul class="StepProgress">
                                  <li class="StepProgress-item current"><strong>Open</strong>
                                  <span>Tutorial requested. No tutor assigned.</span>
                                  </li>
                                  <li class="StepProgress-item"><strong>Pending</strong>
                                  <span>Tutor has been assigned.</span>
                                  </li>
                                  <li class="StepProgress-item"><strong>Ongoing</strong>
                                  <span>Agreement generated and signed. </span>
                                  </li>
                                  <li class="StepProgress-item"><strong>Done</strong>
                                  <span>Tutorial completed.</span>
                                  </li>
                                </ul>
                            </div>
                                    <ion-item-divider class="divider"></ion-item-divider>
                                        <ion-list-header class="collapsible">
                                            <strong>TUTORIAL LINKS</strong>
                                        </ion-list-header>
                                    <ion-list class="content">
                                        ${tutorial_links}
                                    </ion-list>
                                     ${cancel_button}
                            </ion-content>`;

    tutorial_accepted_component.innerHTML = tutorial_accepted_component_html;

    nav_controller.push(tutorial_accepted_component);

    let cancel_tutorial;
    let cancel_tutorial_handler = async function () {
        device_feedback();

        cancel_the_tutorial(nav_controller, this_post, this_post._id, tutorial_status);
    };

    let begin_tutorial;
    let begin_tutorial_handler = async function () {
        //let student_number = await activate_bar_code_scanner();
        let student_number = "await activate_bar_code_scanner()";

        if (student_number !== "Canceled") {
            start_tutorial(this_post, this_post._id, tutorial_status, student_number, begin_tutorial, begin_tutorial_handler);
        }
    };

    let finish_tutorial;
    let finish_tutorial_handler = async function () {
        end_tutorial(nav_controller, this_post, this_post._id, tutorial_status, finish_tutorial, finish_tutorial_handler);
    };

    let tutorial_log;
    let tutorial_log_handler = async function () {
        load_blockchain_component(nav_controller, this_post._id);
    };

    let validate_agreement;
    let validate_agreement_handler = async function () {
        device_feedback();

        validate_digital_signatures({tutor_email: this_post.post_tutor_email, student_email: this_post.std_email, pdf: this_post.post_agreement_url, verify_single: false});
    };

    let openPdf;
    let openPdfHandler = async function () {
        device_feedback();
        openPDF(this_post.post_agreement_url);
        //console.log(this_tutorial);
    }

    let ionNavDidChangeEvent = async function () {
        //TUTORIAL LINKS ACCORDION
        if (document.getElementsByClassName("collapsible") !== null) {
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        }

        if (document.getElementById('cancel_tutorial') !== null) {
            cancel_tutorial = document.getElementById('cancel_tutorial');
            cancel_tutorial.addEventListener('click', cancel_tutorial_handler, false);
        }

        if (document.getElementById('view_agreement') !== null) {
            openPdf = document.getElementById("view_agreement");
            openPdf.addEventListener('click', openPdfHandler, false);
        }

        if (document.getElementById('tutorial_log') !== null) {
            tutorial_log = document.getElementById('tutorial_log');
            tutorial_log.addEventListener('click', tutorial_log_handler, false);
        }

        if (document.getElementById('verify_agreement') !== null) {
            validate_agreement = document.getElementById("verify_agreement");
            validate_agreement.addEventListener('click', validate_agreement_handler, false);
        }

        if (document.getElementById('begin_tutorial') !== null) {
            begin_tutorial = document.getElementById('begin_tutorial');
            begin_tutorial.addEventListener('click', begin_tutorial_handler, false);
        }

        if (document.getElementById('finish_tutorial') !== null) {
            finish_tutorial = document.getElementById('finish_tutorial');
            finish_tutorial.addEventListener('click', finish_tutorial_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();
        if (notifications_active_component.component.tagName !== "TUTORIAL_AGREEMENT_ACCEPTED" && notifications_active_component.component.tagName !== "BLOCKCHAIN_AUDIT_LOG") {
            openPdf.removeEventListener("click", openPdfHandler, false);
            tutorial_log.removeEventListener("click", tutorial_log_handler, false);
            validate_agreement.removeEventListener('click', validate_agreement_handler, false);
            finish_tutorial.removeEventListener("click", finish_tutorial_handler, false);
            begin_tutorial.removeEventListener("click", begin_tutorial_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
            cancel_tutorial.removeEventListener("click", cancel_tutorial_handler, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}


async function load_open_tutorial_component(nav_controller, this_post) {
    let tutorial_status = this_post.post_status;
    let module = this_post.post_modules.join(', ');

    if (tutorial_status == "In Negotiation") {
        tutorial_status = "Pending";
    }

    //Links for tutrial info
    let tutorial_links = get_tutorial_links(module);

    let tutorial_requested_component = document.createElement('tutorial_requested');
    tutorial_requested_component.innerHTML = `<ion-header translucent>
                        <ion-toolbar>
                                <ion-buttons onclick="device_feedback()" slot="start">
                            <ion-back-button defaultHref="/"></ion-back-button>
                          </ion-buttons>
                            <ion-buttons onclick="device_feedback()" slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
                            <ion-title><h1>Tutorial</h1></ion-title>
                        </ion-toolbar>
                    </ion-header>

                    <ion-content fullscreen>
                        <ion-item style="margin-top:10px;" lines="none">
                            <ion-avatar style="width: 100px;height: 100px;" slot="start">
                                <img src="${this_post.std_avatar}">
                            </ion-avatar>
                            <ion-label>
                                <h2><strong>${this_post.std_name}</strong></h2>
                                <p>${this_post.std_email}</p>
                            </ion-label><p class="date">${formatDate(this_post.post_posted_on)}</p>
                        </ion-item>


                        <ion-item-divider class="divider"></ion-item-divider>
                        <ion-item lines="none">
                                <h6><strong>${this_post.post_title}</strong></h6>
                        </ion-item>
                        <ion-item style="margin-top:-10px;" lines="none">
                            <p>
                                ${this_post.post_desc}
                            </p>
                        </ion-item>

                        <ion-chip class="module" color="primary">
                            <ion-icon name="star"></ion-icon>
                            <ion-label>${module}</ion-label>
                        </ion-chip>
                        <!--<ion-chip class="module2" color="danger">
                          <ion-icon name="close"></ion-icon>
                          <ion-label>Closed</ion-label>
                        </ion-chip>-->
                        <ion-chip color="success">
                            <ion-icon name="swap"></ion-icon>
                            <ion-label>${tutorial_status}</ion-label>
                        </ion-chip> 
                            <ion-item-divider class="divider2"></ion-item-divider>  
                                  <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>Extra information</strong></h2>
                                    </ion-label>
                                </ion-item>      
                                 <ion-item style="margin-top:-15px;" lines="none">
                                    <h6>
                                        A tutor has not yet accepted your agreement. Please be patient
                                        as we have limited tutors.
                                    </h6>
                                </ion-item>    
                                <ion-item-divider class="divider2"></ion-item-divider> 
                           <ion-item lines="none">
                                                            <ion-label>
                                                                <h2><strong>Tutorial stage</strong></h2>
                                                            </ion-label>
                                                        </ion-item>
                                                            <div class="wrapper">
                                                            <ul class="StepProgress">
                                                              <li class="StepProgress-item current"><strong>Open</strong>
                                                              <span>Tutorial requested. No tutor assigned.</span>
                                                              </li>
                                                              <li class="StepProgress-item"><strong>Pending</strong>
                                                              <span>Tutor has been assigned.</span>
                                                              </li>
                                                              <li class="StepProgress-item"><strong>Ongoing</strong>
                                                              <span>Agreement generated and signed. </span>
                                                              </li>
                                                              <li class="StepProgress-item"><strong>Done</strong>
                                                              <span>Tutorial completed.</span>
                                                              </li>
                                                            </ul>
                                                        </div>
                                                        <ion-item-divider class="divider"></ion-item-divider>
                                                            <ion-list-header class="collapsible">
                                                                <strong>TUTORIAL LINKS</strong>
                                                            </ion-list-header>
                                                        <ion-list class="content">
                                                            ${tutorial_links}
                                                        </ion-list>  
                                                        <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="cancel_tutorial">Cancel Tutorial</ion-button>
                                                    </ion-content>`;
    nav_controller.push(tutorial_requested_component);

    let cancel_tutorial;
    let cancel_tutorial_handler = async function () {
        device_feedback();

        cancel_the_tutorial(nav_controller, this_post, this_post._id, tutorial_status);
    };

    let ionNavDidChangeEvent = async function () {
        //TUTORIAL LINKS ACCORDION
        if (document.getElementsByClassName("collapsible") !== null) {
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        }

        if (document.getElementById('cancel_tutorial') !== null) {
            cancel_tutorial = document.getElementById('cancel_tutorial');
            cancel_tutorial.addEventListener('click', cancel_tutorial_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();

        if (notifications_active_component.component.tagName !== "TUTORIAL_REQUESTED") {
            cancel_tutorial.removeEventListener("click", cancel_tutorial_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

async function load_done_tutorial_component(nav_controller, this_post, tutorial_tag, tutorial_status) {
    let tutorial_links = get_tutorial_links(tutorial_tag);

    let tutorial_accepted_component = document.createElement('tutorial_complete');
    let tutorial_accepted_component_html;
    tutorial_accepted_component_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons onclick="device_feedback()" slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons onclick="device_feedback()" slot="end">
                                        <ion-menu-button></ion-menu-button>
                                    </ion-buttons>
                                    <ion-title><h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1></ion-title>
                                </ion-toolbar>
                            </ion-header>

                            <ion-content fullscreen>
                                <ion-item style="margin-top:10px;" lines="none">
                                    <ion-avatar style="width: 100px;height: 100px;" slot="start">
                                        <img src="${this_post.std_avatar}">
                                    </ion-avatar>
                                    <ion-label>
                                        <h2><strong>${this_post.std_name}</strong></h2>
                                        <p>${this_post.std_email}</p>
                                    </ion-label><p class="date">${formatDate(this_post.post_posted_on)}</p>
                                </ion-item>


                                <ion-item-divider class="divider"></ion-item-divider>
                                <ion-item lines="none">
                                    
                                        <h6><strong>${this_post.post_title}</strong></h6>
                                    
                                </ion-item>
                                <ion-item style="margin-top:-10px;" lines="none">
                                    <p>
                                        ${this_post.post_desc}
                                    </p>
                                </ion-item>
                                        <ion-chip class="module" color="primary">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-label>${tutorial_tag}</ion-label>
                                </ion-chip>
                                <!--<ion-chip class="module2" color="danger">
                                  <ion-icon name="close"></ion-icon>
                                  <ion-label>Closed</ion-label>
                                </ion-chip>-->
                                <ion-chip color="success">
                                    <ion-icon name="swap"></ion-icon>
                                    <ion-label>${tutorial_status}</ion-label>
                                </ion-chip>
                                <ion-item-divider class="divider2"></ion-item-divider>   
                                <div class="ion-padding-top">
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="view_agreement">View agreement</ion-button>
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="tutorial_log">Tutorial Log</ion-button>
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
                                </div> 
                                 <ion-item-divider class="divider2"></ion-item-divider>   
                                
                            <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>Tutorial stage</strong></h2>
                                    </ion-label>
                                </ion-item>
                                <div class="wrapper">
                                <ul class="StepProgress">
                                  <li class="StepProgress-item"><strong>Open</strong>
                                  <span>Tutorial requested. No tutor assigned.</span>
                                  </li>
                                  <li class="StepProgress-item"><strong>Pending</strong>
                                  <span>Tutor has been assigned.</span>
                                  </li>
                                  <li class="StepProgress-item"><strong>Ongoing</strong>
                                  <span>Agreement generated and signed. </span>
                                  </li>
                                  <li class="StepProgress-item current"><strong>Done</strong>
                                  <span>Tutorial completed.</span>
                                  </li>
                                </ul>
                            </div>
                                    <ion-item-divider class="divider"></ion-item-divider>
                                        <ion-list-header class="collapsible">
                                            <strong>TUTORIAL LINKS</strong>
                                        </ion-list-header>
                                    <ion-list class="content">
                                        ${tutorial_links}
                                    </ion-list>
                            </ion-content>`;

    tutorial_accepted_component.innerHTML = tutorial_accepted_component_html;

    nav_controller.push(tutorial_accepted_component);

    let tutorial_log;
    let tutorial_log_handler = async function () {
        load_blockchain_component(nav_controller, this_post._id);
    };

    let validate_agreement;
    let validate_agreement_handler = async function () {
        device_feedback();

        validate_digital_signatures({tutor_email: this_post.post_tutor_email, student_email: this_post.std_email, pdf: this_post.post_agreement_url, verify_single: false});
    };

    let openPdf;
    let openPdfHandler = async function () {
        device_feedback();
        openPDF(this_post.post_agreement_url);
        //console.log(this_tutorial);
    }

    let ionNavDidChangeEvent = async function () {
        //TUTORIAL LINKS ACCORDION
        if (document.getElementsByClassName("collapsible") !== null) {
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        }

        if (document.getElementById('view_agreement') !== null) {
            openPdf = document.getElementById("view_agreement");
            openPdf.addEventListener('click', openPdfHandler, false);
        }

        if (document.getElementById('tutorial_log') !== null) {
            tutorial_log = document.getElementById('tutorial_log');
            tutorial_log.addEventListener('click', tutorial_log_handler, false);
        }

        if (document.getElementById('verify_agreement') !== null) {
            validate_agreement = document.getElementById("verify_agreement");
            validate_agreement.addEventListener('click', validate_agreement_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();
        if (notifications_active_component.component.tagName !== "TUTORIAL_COMPLETE" && notifications_active_component.component.tagName !== "BLOCKCHAIN_AUDIT_LOG") {
            openPdf.removeEventListener("click", openPdfHandler, false);
            tutorial_log.removeEventListener("click", tutorial_log_handler, false);
            validate_agreement.removeEventListener('click', validate_agreement_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

async function cancel_the_tutorial(nav_controller, tutorial, tutorial_id, status) {
    create_ionic_alert("Cancel tutorial?", "Are you sure you want to cancel this tutorial? You cannot undo this action!", [
        {
            text: 'Yes',
            handler: async () => {
                device_feedback();

                console.log("Tutorial to be removed");
                console.log(tutorial);

                //Check what page we on, my tutorials or my requested tutorials
                if (document.getElementById('my_posts_content') !== null) {
                    tutorials.remove_tutorial_from_DOM(status, {updated_tutorial: {_id: tutorial_id}}, tutorial);
                } else {
                    let total_tutorials;

                    if (status === "Open") {
                        total_tutorials = tutorials.total_open_tutorials;

                        if (total_tutorials > 0) {
                            tutorials.total_open_tutorials--;
                            tutorials.open_tutorials = tutorials.open_tutorials.filter(e => e._id !== tutorial._id);
                        }
                    } else if (status === "Pending" || status === "In negotiation") {
                        total_tutorials = tutorials.total_pending_tutorials;

                        if (total_tutorials > 0) {
                            tutorials.total_pending_tutorials--;
                            tutorials.pending_tutorials = tutorials.pending_tutorials.filter(e => e._id !== tutorial._id);
                        }
                    } else if (status === "Ongoing") {
                        total_tutorials = tutorials.total_ongoing_tutorials;

                        if (total_tutorials > 0) {
                            tutorials.total_ongoing_tutorials--;
                            tutorials.ongoing_tutorials = tutorials.ongoing_tutorials.filter(e => e._id !== tutorial._id);
                        }
                    } else if (status === "Done") {
                        total_tutorials = tutorials.total_done_tutorials;

                        if (total_tutorials > 0) {
                            tutorials.total_done_tutorials--;
                            tutorials.done_tutorials = tutorials.done_tutorials.filter(e => e._id !== tutorial._id);
                        }
                    }
                }

                if (document.getElementById('my_tutored_posts_content') !== null) {
                    tutor_tutorials.remove_tutor_tutorial_from_DOM(status, {updated_tutorial: {_id: tutorial_id}}, tutorial)
                } else if (user.getStatus() == "Tutor") {
                    let total_tutorials;

                    if (status === "Pending" || status === "In negotiation") {
                        total_tutorials = tutor_tutorials.total_tutor_pending_tutorials;

                        if (total_tutorials > 0) {
                            tutor_tutorials.total_tutor_pending_tutorials--;
                            tutor_tutorials.pending_tutor_tutorials = tutor_tutorials.pending_tutor_tutorials.filter(e => e._id !== tutorial._id);
                        }
                    } else if (status === "Ongoing") {
                        total_tutorials = tutor_tutorials.total_tutor_ongoing_tutorials;

                        if (total_tutorials > 0) {
                            tutor_tutorials.total_tutor_ongoing_tutorials--;
                            tutor_tutorials.ongoing_tutor_tutorials = tutor_tutorials.ongoing_tutor_tutorials.filter(e => e._id !== tutorial._id);
                        }
                    } else if (status === "Done") {
                        total_tutorials = tutor_tutorials.total_tutor_done_tutorials;

                        if (total_tutorials > 0) {
                            tutor_tutorials.total_tutor_done_tutorials--;
                            tutor_tutorials.done_tutor_tutorials = tutor_tutorials.done_tutor_tutorials.filter(e => e._id !== tutorial._id);
                        }
                    }
                }

                console.log("Tutorial removed?");
                console.log(tutor_tutorials.pending_tutor_tutorials);

                let cancel_response = await access_route({tutorial: tutorial, tutorial_id: tutorial_id, avatar: user.getAvatar()}, "cancel_tutorial");
                let cancel_buttons = [
                    {
                        side: 'end',
                        text: 'Close',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ];

                create_toast("Tutorial canceled!", "dark", 2000, cancel_buttons);

                user_notifications.addUnreadNotificationsToDOM();
                user_notifications.addToNotifications(cancel_response.student_notification.response);

                posts.removeNotificationPostByPostId(tutorial_id)

                if (typeof notification_posts !== 'undefined') {
                    notification_posts = notification_posts.filter(function (obj) {
                        return obj._id !== tutorial_id;
                    });
                }

                console.log("Notification Posts");
                console.log(notification_posts);

                console.log("Notification Posts Remove")
                console.log(posts.notification_posts)

                //Send notification to tutor if he exists
                if (cancel_response.tutor_exists) {
                    user_notifications.sendNewNotification(cancel_response.tutor_notification.response);
                }

                nav_controller.pop();
            }
        },
        {
            text: 'No',
            role: 'cancel',
            handler: () => {
                device_feedback();
                console.log('Cancel')
            }
        }
    ]);
}

async function activate_bar_code_scanner() {
    return new Promise((resolve, reject) => {
        cordova.plugins.barcodeScanner.scan(
                function (result) {
//                alert("We got a barcode\n" +
//                        "Result: " + result.text + "\n" +
//                        "Format: " + result.format + "\n" +
//                        "Cancelled: " + result.cancelled);

                    if (result.cancelled) {
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

                        create_toast("Barcode scanning cancelled.", "dark", 2000, toast_buttons);
                        resolve("Canceled");
                    } else if (result.format === "CODE_39" && result.text !== "") {
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

                        resolve(result.text);
                    }
                },
                function (error) {
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

                    create_toast("Scanning failed: " + error, "dark", 2000, toast_buttons);
                    resolve("Canceled");
                },
                {
                    preferFrontCamera: false, // iOS and Android
                    showFlipCameraButton: true, // iOS and Android
                    showTorchButton: true, // iOS and Android
                    torchOn: false, // Android, launch with the torch switched on (if available)
                    saveHistory: true, // Android, save scan history (default false)
                    prompt: "Place a barcode inside the scan area", // Android
                    resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    formats: "BAR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                    orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                    disableAnimations: true, // iOS
                    disableSuccessBeep: false // iOS and Android
                }
        );
    });
}

async function validate_digital_signatures(data_object) {
    let validate_digital_signatures_response = await access_route(data_object, "validate_digital_signatures");

    if (validate_digital_signatures_response.error) {
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

        create_toast("Digital signatures are compromised!", "dark", 5000, toast_buttons);
    } else {
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

        create_toast(validate_digital_signatures_response.response, "dark", 5000, toast_buttons);
    }
}

function load_blockchain_component(nav_controller, this_post_id) {
    let blockchain_component = document.createElement('blockchain_audit_log');
    blockchain_component.innerHTML = `<ion-header translucent>
                        <ion-toolbar>
                                <ion-buttons onclick="device_feedback()" slot="start">
                            <ion-back-button defaultHref="/"></ion-back-button>
                          </ion-buttons>
                            <ion-buttons onclick="device_feedback()" slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
                            <ion-title><h1>Tutorial Log</h1></ion-title>
                        </ion-toolbar>
                    </ion-header>

                    <ion-content fullscreen> 
    <p style="text-align: center; padding-left: 15px; padding-right: 15px;">This is a log that keeps track of all the activities that have occured for this tutorial. </p>
            <ion-item-divider style="margin-top: -30px;"></ion-item-divider>
<section class="blockchain">
   <div class="blockchain_line" id="blockchain_container"></div>
</section>

</ion-content>`;

    nav_controller.push(blockchain_component);

    blockchain.load_blockchain_content(this_post_id);
}

function get_tutorial_links(tutorial_tag) {
    let tutorial_links;

    if (tutorial_tag == "Java") {
        tutorial_links = `<ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/java/java_classes.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Java Classes</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/java/java_conditions.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Java Conditions</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/java/java_arrays.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Java Arrays</ion-label>
                                                            </ion-item>
    `;
    } else if (tutorial_tag == "Visual Basic") {
        tutorial_links = `<ion-item onclick="cordova.InAppBrowser.open('https://docs.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/objects-and-classes/', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Visual Basic Classes</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://docs.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/if-then-else-statement', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Visual Basic Conditions</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://docs.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/arrays/', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Visual Basic Arrays</ion-label>
                                                            </ion-item>
    `;
    } else if (tutorial_tag == "HTML") {
        tutorial_links = `<ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/whatis/whatis_htmldom.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">HTML DOM</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/html/html_elements.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">HTML Elements</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/html/html_attributes.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">HTML Attributes</ion-label>
                                                            </ion-item>
    `;
    } else if (tutorial_tag == "CSS") {
        tutorial_links = `<ion-item onclick="cordova.InAppBrowser.open('https://blog.logrocket.com/how-css-works-understanding-the-cascade-d181cd89a4d8/', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">CSS Cascade</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/cssref/default.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">CSS Properties</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/cssref/css_selectors.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">CSS Selectors</ion-label>
                                                            </ion-item>
    `;
    } else if (tutorial_tag == "JavaScript") {
        tutorial_links = `<ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/js/js_scope.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">JavaScript Scope</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/js/js_classes.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">JavaScript Classes</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/js/js_es6.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">ECMAScript 6</ion-label>
                                                            </ion-item>
    `;
    } else if (tutorial_tag == "ASP.NET") {
        tutorial_links = `<ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/asp/webpages_classes.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">ASP.NET Classes</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/asp/webpages_objects.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">ASP.NET Objects</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/asp/webpages_files.asp', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">ASP.NET Files</ion-label>
                                                            </ion-item>
    `;
    } else if (tutorial_tag == "Networking") {
        tutorial_links = `<ion-item onclick="cordova.InAppBrowser.open('https://docs.oracle.com/javase/tutorial/networking/overview/networking.html', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Networking Basics</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.in/types-of-network-protocols-and-their-uses/', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Network Protocols</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://docs.oracle.com/javase/tutorial/networking/sockets/definition.html', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Sockets</ion-label>
                                                            </ion-item>
    `;
    } else if (tutorial_tag == "Databases") {
        tutorial_links = `<ion-item onclick="cordova.InAppBrowser.open('https://www.tutorialspoint.com/Types-of-databases', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Types of Databases</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.essentialsql.com/what-is-a-database-trigger/', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Database Triggers</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.techopedia.com/definition/16455/transaction', '_blank', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">Database Transactions</ion-label>
                                                            </ion-item>
    `;
    }

    return tutorial_links;
}

function start_tutorial(this_post, post_id, tutorial_status, student_number, begin_tutorial, begin_tutorial_handler) {
    console.log("Start");
    console.log(begin_tutorial);
    console.log(begin_tutorial_handler)
    create_ionic_alert("Begin tutorial?", "Are you sure you want to begin this tutorial? Once a tutorial is started, it cannot be canceled or paused!", [
        {
            text: 'Yes',
            handler: async () => {
                device_feedback();

                //Update the tutorial 
                let begin_response = await access_route({tutorial_id: post_id, student_number: student_number, avatar: user.getAvatar()}, "begin_tutorial");
                let begin_buttons = [
                    {
                        side: 'end',
                        text: 'Close',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ];

                //Update our tutorials
                if (tutorial_status === "Ongoing") {
                    tutorials.total_ongoing_tutorials--;
                    tutorials.ongoing_tutorials = tutorials.ongoing_tutorials.filter(e => e._id !== this_post._id);

                    tutorials.ongoing_tutorials.push(begin_response.updated_tutorial);
                }

                if (user.getStatus() == "Tutor") {
                    if (tutorial_status === "Ongoing") {
                        tutor_tutorials.total_tutor_ongoing_tutorials--;
                        tutor_tutorials.ongoing_tutor_tutorials = tutor_tutorials.ongoing_tutor_tutorials.filter(e => e._id !== this_post._id);

                        tutor_tutorials.ongoing_tutor_tutorials.push(begin_response.updated_tutorial);
                    }
                }

                create_toast("Tutorial started!", "dark", 2000, begin_buttons);

                user_notifications.addUnreadNotificationsToDOM();
                user_notifications.addToNotifications(begin_response.student_notification.response);

                //Remove notification post and add new one (The post object we are using to get the information for notifications)
                posts.removeNotificationPostByPostId(post_id);
                posts.notification_posts.push(begin_response.updated_tutorial);

                //Do same for the notification_posts variable
                if (typeof notification_posts !== 'undefined') {
                    notification_posts = notification_posts.filter(function (obj) {
                        return obj._id !== post_id;
                    });

                    notification_posts.push(begin_response.updated_tutorial);
                }


                console.log("Notification Posts");
                console.log(notification_posts);

                console.log("Notification Posts Remove")
                console.log(posts.notification_posts)

                //REMOVE BEGIN TUTORIAL EVENT LISTENER
                begin_tutorial.removeEventListener("click", begin_tutorial_handler, false);

                //ADD YOUR CODE TO CHANGE THE 'Begin Tutorial' BUTTON to 'Finish Tutorial' HERE!


                user_notifications.sendNewNotification(begin_response.tutor_notification.response);
            }
        },
        {
            text: 'No',
            role: 'cancel',
            handler: () => {
                device_feedback();
                console.log('Cancel')
            }
        }
    ]);
}

function end_tutorial(nav_controller, tutorial, tutorial_id, status, finish_tutorial, finish_tutorial_handler) {
    create_ionic_alert("Finish tutorial?", "Are you sure you want to finish this tutorial? The tutorial will be moved to done and be considered completed.", [
        {
            text: 'Yes',
            handler: async () => {
                device_feedback();

                console.log("Tutorial to be removed");
                console.log(tutorial);

                let end_response = await access_route({tutorial: tutorial, tutorial_id: tutorial_id, avatar: user.getAvatar()}, "finish_tutorial");

                //Check what page we on, my tutorials or my requested tutorials
                if (document.getElementById('my_posts_content') !== null) {
                    tutorials.remove_tutorial_from_DOM(status, {updated_tutorial: {_id: tutorial_id}}, tutorial);
                    tutorials.total_done_tutorials++;
                    tutorials.add_post_to_segment("Done", document.getElementById('done_tutorials_header'), end_response.updated_tutorial);

                    console.log(tutorials.done_tutorials);
                } else {
                    let total_tutorials;

                    if (status === "Ongoing") {
                        total_tutorials = tutorials.total_ongoing_tutorials;

                        if (total_tutorials > 0) {
                            tutorials.total_ongoing_tutorials--;
                            tutorials.ongoing_tutorials = tutorials.ongoing_tutorials.filter(e => e._id !== tutorial._id);
                        }
                    }

                    //ADD A TUTORIAL TO DONE ARRAY
                    tutorials.total_done_tutorials++;
                    tutorials.done_tutorials.push(end_response.updated_tutorial);
                }

                if (document.getElementById('my_tutored_posts_content') !== null) {
                    tutor_tutorials.remove_tutor_tutorial_from_DOM(status, {updated_tutorial: {_id: tutorial_id}}, end_response.updated_tutorial);

                    //Add tutorial to Done segment
                    tutor_tutorials.add_tutorial_to_DOM("Done", end_response.updated_tutorial);
                } else if (user.getStatus() == "Tutor") {
                    let total_tutorials;

                    if (status === "Ongoing") {
                        total_tutorials = tutor_tutorials.total_tutor_ongoing_tutorials;

                        if (total_tutorials > 0) {
                            tutor_tutorials.total_tutor_ongoing_tutorials--;
                            tutor_tutorials.ongoing_tutor_tutorials = tutor_tutorials.ongoing_tutor_tutorials.filter(e => e._id !== tutorial._id);
                        }
                    }

                    //ADD A TUTORIAL TO DONE ARRAY
                    tutor_tutorials.total_tutor_done_tutorials++;
                    tutor_tutorials.done_tutor_tutorials.push(end_response.updated_tutorial);
                }

                console.log("Tutorial removed?");
                console.log(tutor_tutorials.pending_tutor_tutorials);

                let cancel_buttons = [
                    {
                        side: 'end',
                        text: 'Close',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ];

                create_toast("Tutorial canceled!", "dark", 2000, cancel_buttons);

                user_notifications.addUnreadNotificationsToDOM();
                user_notifications.addToNotifications(end_response.tutor_notification.response);

                posts.removeNotificationPostByPostId(tutorial_id)

                if (typeof notification_posts !== 'undefined') {
                    notification_posts = notification_posts.filter(function (obj) {
                        return obj._id !== tutorial_id;
                    });

                    notification_posts.push(end_response.updated_tutorial);
                }

                console.log("Notification Posts");
                console.log(notification_posts);

                console.log("Notification Posts Remove")
                console.log(posts.notification_posts)

                //REMOVE BEGIN TUTORIAL EVENT LISTENER
                finish_tutorial.removeEventListener("click", finish_tutorial_handler, false);

                user_notifications.sendNewNotification(end_response.student_notification.response);


                nav_controller.pop();
            }
        },
        {
            text: 'No',
            role: 'cancel',
            handler: () => {
                device_feedback();
                console.log('Cancel')
            }
        }
    ]);
}

function convertDate(inputFormat) {
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}

function conver_to_time(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (hours < 10) {
        hours = '0' + hours;
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    return hours + ":" + minutes;
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}