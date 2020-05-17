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
                on_alert_dismiss_function();
            });
        } else {
            alert.onDidDismiss().then(() => {
                document.querySelector('ion-alert-controller').remove();
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
            duration: 300000
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
        let path = localhost ? "http://localhost:3001/" : "http://serviceloopserver.ga/";
        //let path = "http://serviceloopserver.ga/";
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
            if (result.isAvailable) {
                resolve(true);
            }
        }

        function isAvailableError(message) {
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

    return null;
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
        device_feedback();
        var data = signaturePad.toData();
        if (data) {
            data.pop(); // remove the last dot or line
            signaturePad.fromData(data);
        }
    });

    cancelButton.addEventListener('click', function (event) {
        device_feedback();
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

    let tutor_info = "";
    if (this_post.std_email === user.getEmail()) {
        tutor_info = `<ion-item-divider class="divider"></ion-item-divider><ion-item lines="none"><h6><strong>Tutor's Information</strong></h6></ion-item><ion-item style="margin-top:-10px;margin-bottom: -30px;" lines="none"><p style="font-size: 14px;margin-left: 3px;"><strong>Name:</strong> ${this_post.post_tutor_name}<br><strong>Email:</strong> ${this_post.post_tutor_email}</p></ion-item>`;
    }

    if (tutorial_status == "In negotiation") {
        tutorial_status = "Pending";
    }

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
            
            ${tutor_info}

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
              <li class="StepProgress-item is-done"><strong>Open</strong>
              <span>Tutorial requested. No tutor assigned.</span>
              </li>
              <li class="StepProgress-item current"><strong>Pending</strong>
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

        let previous = await nav_controller.getPrevious();

        cancel_the_tutorial(nav_controller, this_post, this_post._id, tutorial_status, previous);
    };

    let tutorial_log;
    let tutorial_log_handler = async function () {
        load_blockchain_component(nav_controller, this_post._id);
    };

    let accept_agreement;
    let accept_agreement_handler = async function () {
        device_feedback();
        let previous_view = await nav_controller.getPrevious();
        load_sign_accepted_agreement_component(nav_controller, this_post, previous_view);
    }

    let reject_agreement;
    let reject_agreement_handler = async function () {
        device_feedback();

        create_ionic_alert("Reject agreement", "Please confirm that you wish to reject this agreement.", [
            {
                text: 'Reject',
                handler: () => {
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
        user.setPendingTutoredTutorials(user.getPendingTutoredTutorials() + 1);

        user_notifications.addToNotifications(post_acceptated_response.response.tutor_notification);
        user_notifications.sendTutorialAcceptedNotification(post_acceptated_response.response.student_notification, post_acceptated_response.response.post);

        posts.replace_notification_posts(post_acceptated_response.response.post);

        if (typeof notification_posts !== 'undefined') {
            notification_posts = notification_posts.filter(function (obj) {
                return obj._id !== post_acceptated_response.response.post._id;
            });

            notification_posts.push(post_acceptated_response.response.post);
        }

        //Send push notification
        if (!localhost) {
            push.send_notification("Tutor assigned", "A tutor has been assigned for the tutorial '" + post_acceptated_response.response.post.post_title + "'. Click on this notification to open it.", post_acceptated_response.response.post.std_email, "Tutorial accepted", post_acceptated_response.response.post, post_acceptated_response.response.student_notification);
        }

        if (typeof tutor_tutorials.all_tutor_tutorials === 'string') {
            tutor_tutorials.all_tutor_tutorials = [post_acceptated_response.response.post];
        }

        tutor_tutorials.add_tutorial_to_DOM("Pending", post_acceptated_response.response.post);
//        tutor_tutorials.add_tutorial_to_tutor_tutorials(post_acceptated_response.response.post);

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
            } else {
                alert("d")
                if (posts.all_posts.length !== 0) {
                    posts.all_posts = posts.all_posts.filter(function (obj) {
                        return obj._id !== this_post._id;
                    });
                }

                if (posts.all_posts.length == 0) {
                    if (document.getElementById('posts_header') !== null) {
                        document.getElementById('posts_header').innerText = "THERE ARE NO TUTORIAL REQUESTS!";
                    }
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

    let tutor_info = "";
    if (this_tutorial.std_email === user.getEmail()) {
        tutor_info = `<ion-item-divider class="divider"></ion-item-divider><ion-item lines="none"><h6><strong>Tutor's Information</strong></h6></ion-item><ion-item style="margin-top:-10px;margin-bottom: -30px;" lines="none"><p style="font-size: 14px;margin-left: 3px;"><strong>Name:</strong> ${this_tutorial.post_tutor_name}<br><strong>Email:</strong> ${this_tutorial.post_tutor_email}</p></ion-item>`;
    }

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

                                ${tutor_info}
                                
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

        let previous = await nav_controller.getPrevious();

        cancel_the_tutorial(nav_controller, this_tutorial, this_tutorial._id, tutorial_status, previous);
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

    if (tutorial_status == "In Negotiation") {
        tutorial_status = "Pending";
    }

    let tutor_info = "";
    if (this_post.std_email === user.getEmail()) {
        tutor_info = `<ion-item-divider class="divider"></ion-item-divider><ion-item lines="none"><h6><strong>Tutor's Information</strong></h6></ion-item><ion-item style="margin-top:-10px;margin-bottom: -30px;" lines="none"><p style="font-size: 14px;margin-left: 3px;"><strong>Name:</strong> ${this_post.post_tutor_name}<br><strong>Email:</strong> ${this_post.post_tutor_email}</p></ion-item>`;
    }

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

                                ${tutor_info}
    
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

        let previous = await nav_controller.getPrevious();

        cancel_the_tutorial(nav_controller, this_post, this_post._id, tutorial_status, previous);
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
                                    <p class="center">Please enter the following details about the tutorial</p>
                                    <ion-item-divider class="divider">
                                    </ion-item-divider>
                                    <ion-item>
                                        <ion-label>Date <ion-text color="danger">*</ion-text></ion-label>
                                        <ion-datetime id="tutorial_date" value="${current_date}" min="${year}" max="${year}" placeholder="Select Date"></ion-datetime>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label>Start Time <ion-text color="danger">*</ion-text></ion-label>
                                        <ion-datetime id="tutorial_time" display-format="HH:mm" value="00:00"></ion-datetime>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label>End Time <ion-text color="danger">*</ion-text></ion-label>
                                        <ion-datetime id="end_tutorial_time" display-format="HH:mm" value="00:00"></ion-datetime>
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

        if (this_tutorial.post_status = "In negotiation") {
            this_tutorial.post_status = "Pending"
        }

        let previous = await nav_controller.getPrevious();

        cancel_the_tutorial(nav_controller, this_tutorial, this_tutorial._id, this_tutorial.post_status, previous);
    };

    let generate_agreement_button;
    let generate_agreement_handler = async function () {
        device_feedback();

        generate_agreement(nav_controller, this_tutorial);
    };

    let ionNavDidChangeEvent = async function () {
        let previous_view = await nav_controller.getPrevious();

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
        let date = new Date(document.getElementById('tutorial_date').value);
        let final_date = date.getUTCFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate();

        if (new Date(final_date + ' ' + document.getElementById('tutorial_time').value) > new Date()) {
            if (new Date(final_date + ' ' + document.getElementById('end_tutorial_time').value) > new Date(final_date + ' ' + document.getElementById('tutorial_time').value)) {
                if (typeof tutorial._id == 'undefined') {
                    agreement_generated_response = await access_route({tutorial_id: tutorial.getAttribute('post_id'), tutor_avatar: user.getAvatar(), tutorial_date: final_date, tutorial_time: document.getElementById('tutorial_time').value, tutorial_end_time: document.getElementById('end_tutorial_time').value, tutor_signature: signaturePad.toDataURL('image/png')}, "offer_agreement");
                } else {
                    agreement_generated_response = await access_route({tutorial_id: tutorial._id, tutor_avatar: user.getAvatar(), tutorial_date: final_date, tutorial_time: document.getElementById('tutorial_time').value, tutorial_end_time: document.getElementById('end_tutorial_time').value, tutor_signature: signaturePad.toDataURL('image/png')}, "offer_agreement");
                }
            } else {
                create_ionic_alert("What's the rush?", "Tutorial end date must not be shorter than or the same as tutorial start time!", ["OK"]);
                return;
            }
        } else {
            create_ionic_alert("What's the rush?", "This is not a time machine! Please choose a time that is not in the past!", ["OK"]);
            return;
        }

        if (agreement_generated_response.action_available) {
            if (!agreement_generated_response.error) {
                //Send push notification
                if (!localhost) {
                    push.send_notification("Preliminary agreement generated", "An agreement for the tutorial '" + agreement_generated_response.updated_tutorial.post_title + "' has ben created. Click on this notification to open it.", agreement_generated_response.updated_tutorial.std_email, "Tutorial accepted", {}, {});
                }

                //push.send_notification("Preliminary agreement generated", "An agreement for the tutorial '" + agreement_generated_response.updated_tutorial.post_title + "' has ben created. Click on this notification to open it.", agreement_generated_response.updated_tutorial.std_email, "Agreement offer accepted", agreement_generated_response.updated_tutorial, agreement_generated_response.student_notification.response);

                user_notifications.addToNotifications(agreement_generated_response.tutor_notification.response);
                user_notifications.sendAgreementGeneratedNotification({response: agreement_generated_response.student_notification.response}, agreement_generated_response.updated_tutorial);

                if (typeof notification_posts !== 'undefined') {
                    notification_posts = notification_posts.filter(function (obj) {
                        return obj._id !== agreement_generated_response.updated_tutorial._id;
                    });

                    notification_posts.push(agreement_generated_response.updated_tutorial);
                }

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

                let previous_view = await nav_controller.getPrevious();
                if (previous_view.element.tagName === "NAV-NOTIFICATION" || previous_view.element.tagName === "NAV-NOTIFICATION-TUTORIAL-AGREEMENT-REJECTED") {
                    nav_controller.popTo(0);
                } else {
                    nav_controller.pop();
                }
            } else {
                create_ionic_alert("Agreement creation", agreement_generated_response.response, ["OK"]);
            }
        } else {
            create_ionic_alert("Agreement creation", "The tutorial you wish to create an agreement for is either no longer available or has an agreement.`Please refresh your tutorials.", [
                {
                    text: 'OK',
                    handler: async () => {
                        device_feedback();

                        let previous_view = await nav_controller.getPrevious();
                        if (previous_view.element.tagName === "NAV-NOTIFICATION" || previous_view.element.tagName === "NAV-NOTIFICATION-TUTORIAL-AGREEMENT-REJECTED") {
                            nav_controller.popTo(0);
                        } else {
                            nav_controller.pop();
                        }
                    }
                }
            ]);
        }
    }
}

async function load_new_tutorial_request_component(nav_controller, this_notification, extra_information) {
    //Get the current post notification
    let this_post = posts.getNotificationPostDetailsById(this_notification.post_id);
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









function load_sign_accepted_agreement_component(nav_controller, this_tutorial, previous_view) {
    let tutor_tutorial_element = document.createElement('sign-tutorial-agreement');
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
                    handler: async () => {
                        accept_agreement(nav_controller, this_tutorial, previous_view);
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







async function accept_agreement(nav_controller, this_tutorial, previous_view) {
    if (isCanvasBlank(document.getElementById('signature-pad'))) {
        create_ionic_alert("Failed to accept agreement", "Please enter a signature to accept the agreement.", ["OK"]);
    } else {
        let agreement_accepted_response = await access_route({tutorial_id: this_tutorial._id, student_signature: signaturePad.toDataURL('image/png')}, "accept_agreement");
        if (agreement_accepted_response.action_available) {
            if (!agreement_accepted_response.error) {
                user.setPendingTutorials(user.getPendingTutorials() - 1);
                user.setOngoingTutorials(user.getOngoingTutorials() + 1);

                user_notifications.addUnreadNotificationsToDOM();
                user_notifications.addToNotifications(agreement_accepted_response.student_notification.response);

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
                user_notifications.sendAgreementAcceptedNotification({response: agreement_accepted_response.tutor_notification.response}, agreement_accepted_response.updated_tutorial);

                //tutorials.update_my_tutorial("Pending", agreement_accepted_response.updated_tutorial); 
                posts.replace_notification_posts(agreement_accepted_response.updated_tutorial);

                tutorials.add_post_to_segment("Ongoing", document.getElementById('ongoing_tutorials_header'), agreement_accepted_response.updated_tutorial);
                tutorials.remove_tutorial_from_DOM("Pending", agreement_accepted_response, this_tutorial);

                if (previous_view.element.tagName === "NAV-NOTIFICATION") {
                    nav_controller.popTo(0);
                } else {
                    nav_controller.popTo(1);
                }
            } else {
                create_ionic_alert("Failed to accept agreement", agreement_accepted_response.response, ["OK"]);
            }
        } else {
            create_ionic_alert("Agreement rejection", "The agreement you are trying to reject either no longer exists, has already been reject or accepted. Please refresh your tutorials.", [
                {
                    text: 'OK',
                    handler: async () => {
                        device_feedback();

                        if (previous_view.element.tagName === "NAV-NOTIFICATION") {
                            nav_controller.popTo(0);
                        } else {
                            nav_controller.popTo(1);
                        }
                    }
                }
            ]);
        }
    }
}

async function reject_this_agreement(nav_controller, this_tutorial) {
    let agreement_rejected_response = await access_route({tutorial_id: this_tutorial._id}, "reject_agreement");

    if (agreement_rejected_response.action_available) {
        if (!agreement_rejected_response.error) {
            user_notifications.addUnreadNotificationsToDOM();
            user_notifications.addToNotifications(agreement_rejected_response.student_notification.response);
            user_notifications.sendAgreementRejectedNotification({response: agreement_rejected_response.tutor_notification.response}, agreement_rejected_response.updated_tutorial);

            let reject_buttons = [
                {
                    side: 'end',
                    text: 'Close',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ];

            create_toast("Agreement rejected!", "dark", 2000, reject_buttons);
            //Send push notification
            if (!localhost) {
                push.send_notification("Agreement rejected", "The student has rejected your agreement for the '" + agreement_rejected_response.updated_tutorial.post_title + "' tutorial. Click on this notification to create a new one.", agreement_rejected_response.updated_tutorial.post_tutor_email, "Agreement rejected", {}, {});
            }

            posts.replace_notification_posts(agreement_rejected_response.updated_tutorial);


            let previous_view = await nav_controller.getPrevious();

            if (previous_view.element.tagName === 'NAV-MY-REQUESTED-TUTORIALS') {
                nav_controller.pop();
            } else if (previous_view.element.tagName === 'NAV-NOTIFICATION') {
                nav_controller.popTo(0);
            }

            tutorials.total_open_tutorials = tutorials.open_tutorials.length;
            tutorials.update_my_tutorial("Pending", agreement_rejected_response.updated_tutorial);
        } else {
            create_ionic_alert("Failed to reject agreement", agreement_rejected_response.response, ["OK"]);
        }
    } else {
        create_ionic_alert("Agreement rejection", "The agreement you are trying to reject either no longer exists, has already been reject or accepted.", [
            {
                text: 'OK',
                handler: async () => {
                    device_feedback();

                    let previous_view = await nav_controller.getPrevious();

                    if (previous_view.element.tagName === 'NAV-MY-REQUESTED-TUTORIALS') {
                        nav_controller.pop();
                    } else if (previous_view.element.tagName === 'NAV-NOTIFICATION') {
                        nav_controller.popTo(0);
                    }
                }
            }
        ]);
    }
}











function load_ongoing_tutorial_component(nav_controller, this_post, tutorial_tag, tutorial_status) {
    let tutorial_links = get_tutorial_links(tutorial_tag);
    let cancel_button = "";
    let begin_button = "";

    //Check to see if tutorial in progress, add another line of code to check if to add the "Begin tutorial" or "Finish tutorial" button. Use same method for creating method as u can see below.
    if (!this_post.tutorial_started) {
        cancel_button = '<ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="cancel_tutorial">Cancel Tutorial</ion-button>';
        if (this_post.std_email !== user.getEmail()) {
            begin_button = '<ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="success" id="begin_tutorial">Begin Tutorial</ion-button>';
        }
    } else
    {
        if (this_post.std_email !== user.getEmail()) {
            begin_button = '<ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="finish_tutorial">Finish Tutorial</ion-button>';
        }
    }

    let tutor_info = "";
    if (this_post.std_email === user.getEmail()) {
        tutor_info = `<ion-item-divider class="divider"></ion-item-divider><ion-item lines="none"><h6><strong>Tutor's Information</strong></h6></ion-item><ion-item style="margin-top:-10px;margin-bottom: -30px;" lines="none"><p style="font-size: 14px;margin-left: 3px;"><strong>Name:</strong> ${this_post.post_tutor_name}<br><strong>Email:</strong> ${this_post.post_tutor_email}</p></ion-item>`;
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

                                ${tutor_info}
                                
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
                                    ${begin_button}
                                    <ion-button style="display:none;" expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="finish_tutorial">Finish Tutorial</ion-button>
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
                                  <li class="StepProgress-item is-done"><strong>Open</strong>
                                  <span>Tutorial requested. No tutor assigned.</span>
                                  </li>
                                  <li class="StepProgress-item is-done"><strong>Pending</strong>
                                  <span>Tutor has been assigned.</span>
                                  </li>
                                  <li class="StepProgress-item current"><strong>Ongoing</strong>
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

        let previous = await nav_controller.getPrevious();

        cancel_the_tutorial(nav_controller, this_post, this_post._id, tutorial_status, previous);
    };

    let begin_tutorial;
    let begin_tutorial_handler = async function () {
        let student_number;

        if (!localhost) {
            student_number = await activate_bar_code_scanner();
        } else {
            student_number = "";
        }

        if (student_number !== "Canceled") {
            let previous_view = await nav_controller.getPrevious();
            start_tutorial(nav_controller, this_post, this_post._id, tutorial_status, student_number, begin_tutorial, begin_tutorial_handler, cancel_tutorial, cancel_tutorial_handler, previous_view);
        }
    };

    let finish_tutorial;
    let finish_tutorial_handler = async function () {
        let previous = await nav_controller.getPrevious();

        end_tutorial(nav_controller, this_post, this_post._id, tutorial_status, finish_tutorial, finish_tutorial_handler, previous);
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
            if (typeof begin_tutorial !== 'undefined') {
                begin_tutorial.removeEventListener("click", begin_tutorial_handler, false);
            }
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);

            if (typeof cancel_tutorial !== 'undefined') {
                cancel_tutorial.removeEventListener("click", cancel_tutorial_handler, false);
            }
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

        let previous = await nav_controller.getPrevious();

        cancel_the_tutorial(nav_controller, this_post, this_post._id, tutorial_status, previous);
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

    let comment = "";
    if (this_post.tutor_rated) {
        comment = `<ion-list>
                                <ion-list-header>
                                  <strong>STUDENT COMMENT</strong>
                                </ion-list-header>
                                
                                <ion-item lines="none" class="comment">
                                    <ion-avatar class="comment_avatar" slot="start">
                                        <img src="${this_post.std_avatar}">
                                    </ion-avatar>
                                    <ion-label class="ion-text-wrap">
                                        <p class="comment_title"><strong>${this_post.std_name}</strong></p>
                                        <p class="comment_desc">${this_post.comment}</p>
                                    </ion-label>
                                </ion-item>
                                <ion-item-divider class="divider3"></ion-item-divider>
                                
                            </ion-list>`;
    }

    let tutor_info = "";
    if (this_post.std_email === user.getEmail()) {
        tutor_info = `<ion-item-divider class="divider"></ion-item-divider><ion-item lines="none"><h6><strong>Tutor's Information</strong></h6></ion-item><ion-item style="margin-top:-10px;margin-bottom: -30px;" lines="none"><p style="font-size: 14px;margin-left: 3px;"><strong>Name:</strong> ${this_post.post_tutor_name}<br><strong>Email:</strong> ${this_post.post_tutor_email}</p></ion-item>`;
    }

    let rate_button = "";
    if (!this_post.tutor_rated && this_post.std_email === user.getEmail()) {
        rate_button = `<ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="rate_tutor">Rate tutor</ion-button>`
    }

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

                                ${tutor_info}
                                
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
                                    ${rate_button}
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
                                  <li class="StepProgress-item is-done"><strong>Pending</strong>
                                  <span>Tutor has been assigned.</span>
                                  </li>
                                  <li class="StepProgress-item is-done"><strong>Ongoing</strong>
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
                                    <ion-list id='tutorial_links_list' class="content">
                                        ${tutorial_links}
                                    </ion-list>
                            ${comment}
                            </ion-content>`;

    tutorial_accepted_component.innerHTML = tutorial_accepted_component_html;

    nav_controller.push(tutorial_accepted_component);

    let rate_the_tutor;
    let rate_the_tutor_handler = async function () {
        rate_tutor(nav_controller, this_post, this_post._id, true, rate_the_tutor, rate_the_tutor_handler);
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

        if (document.getElementById('rate_tutor') !== null && this_post.std_name === user.getName()) {
            rate_the_tutor = document.getElementById("rate_tutor");
            rate_the_tutor.addEventListener('click', rate_the_tutor_handler, false);
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
        if (notifications_active_component.component.tagName !== "TUTORIAL_COMPLETE" && notifications_active_component.component.tagName !== "BLOCKCHAIN_AUDIT_LOG" && notifications_active_component.component.tagName !== "RATE_TUTOR") {
            openPdf.removeEventListener("click", openPdfHandler, false);
            tutorial_log.removeEventListener("click", tutorial_log_handler, false);
            validate_agreement.removeEventListener('click', validate_agreement_handler, false);

            if (rate_the_tutor !== null && typeof rate_the_tutor !== 'undefined') {
                rate_the_tutor.removeEventListener('click', rate_the_tutor_handler, false);
            }

            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

async function cancel_the_tutorial(nav_controller, tutorial, tutorial_id, status, previous) {
    create_ionic_alert("Cancel tutorial?", "Are you sure you want to cancel this tutorial? You cannot undo this action!", [
        {
            text: 'Yes',
            handler: async () => {
                device_feedback();

                let cancel_response = await access_route({tutorial: tutorial, tutorial_id: tutorial_id, avatar: user.getAvatar()}, "cancel_tutorial");

                if (cancel_response.action_available) {
                    if (status == "In negotiation") {
                        status = "Pending";
                    }

                    //Canceler is THE student
                    if (user.getEmail() == tutorial.std_email) {
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
                            } else if (status === "Pending") {
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
                    } else {
                        if (document.getElementById('my_tutored_posts_content') !== null) {
                            tutor_tutorials.remove_tutor_tutorial_from_DOM(status, {updated_tutorial: {_id: tutorial_id}}, tutorial)
                        } else {
                            let total_tutorials;

                            if (status === "Pending") {
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
                    }

                    user_notifications.addUnreadNotificationsToDOM();
                    user_notifications.addToNotifications(cancel_response.student_notification.response);

                    if (tutorial.post_status == "Open") {
                        if (user.getEmail() !== tutorial.post_tutor_email) {
                            user.setOpenTutorials(user.getOpenTutorials() - 1);
                        }
                    } else if (tutorial.post_status == "Pending" || tutorial.post_status == "In negotiation") {
                        if (user.getEmail() !== tutorial.post_tutor_email) {
                            user.setPendingTutorials(user.getPendingTutorials() - 1);
                        } else {
                            user.setPendingTutoredTutorials(user.getPendingTutoredTutorials() - 1);
                        }
                    } else if (tutorial.post_status == "Ongoing") {
                        if (user.getEmail() !== tutorial.post_tutor_email) {
                            user.setOngoingTutorials(user.getOngoingTutorials() - 1);
                        } else {
                            user.setOngoingTutoredTutorials(user.getOngoingTutoredTutorials() - 1);
                        }
                    }

                    console.log(tutorial);
                    console.log("above tut");

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

                    posts.removeNotificationPostByPostId(tutorial_id);
                    //tutorials.remove_tutorial_from_DOM(status, {updated_tutorial: {_id: tutorial_id}}, tutorial);

                    if (typeof notification_posts !== 'undefined') {
                        notification_posts = notification_posts.filter(function (obj) {
                            return obj._id !== tutorial_id;
                        });
                    }

                    //Canceler is a student, send notification to only tutor (if exists)
                    if (user.getEmail() == tutorial.std_email) {
                        //Send notification to tutor if he exists
                        if (cancel_response.tutor_exists) {
                            user_notifications.sendTutorialCanceledNotification(cancel_response.tutor_notification.response, tutorial);
                        } else {
                            user_notifications.removeOpenPost(tutorial);
                        }
                    } else {
                        user_notifications.sendTutorialCanceledNotification(cancel_response.student_notification.response, tutorial);
                    }

                    if (previous.element.nodeName == "NAV-NOTIFICATION" || "NAV-NOTIFICATION-TUTORIAL-AGREEMENT-ACCEPTED" || "NAV-NOTIFICATION-TUTORIAL-AGREEMENT-REJECTED") {
                        nav_controller.popToRoot();
                    } else {
                        nav_controller.pop();
                    }
                } else {
                    create_ionic_alert("Cancel tutorial", "The tutorial you wish to cancel is no longer available! Please refresh your tutorials.", [
                        {
                            text: 'OK',
                            handler: async () => {
                                device_feedback();

                                if (previous.element.nodeName == "NAV-NOTIFICATION" || "NAV-NOTIFICATION-TUTORIAL-AGREEMENT-ACCEPTED" || "NAV-NOTIFICATION-TUTORIAL-AGREEMENT-REJECTED") {
                                    nav_controller.popToRoot();
                                } else {
                                    nav_controller.pop();
                                }
                            }
                        }
                    ]);
                }
            }
        },
        {
            text: 'No',
            role: 'cancel',
            handler: () => {
                device_feedback();
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

function start_tutorial(nav_controller, this_post, post_id, tutorial_status, student_number, begin_tutorial, begin_tutorial_handler, cancel_tutorial, cancel_tutorial_handler, previous_view) {
    if (previous_view.element.tagName === 'NAV-MY-REQUESTED-TUTORIALS') {
        nav_controller.pop();
    } else if (previous_view.element.tagName === 'NAV-NOTIFICATION') {
        nav_controller.popTo(0);
    }

    create_ionic_alert("Begin tutorial?", "Are you sure you want to begin this tutorial? Once a tutorial is started, it cannot be canceled or paused!", [
        {
            text: 'Yes',
            handler: async () => {
                device_feedback();
                //Update the tutorial 
                let begin_response = await access_route({tutorial_id: post_id, student_number: student_number, avatar: user.getAvatar()}, "begin_tutorial");

                if (begin_response.action_available) {
                    user_notifications.addUnreadNotificationsToDOM();
                    user_notifications.addToNotifications(begin_response.student_notification.response);

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
                            tutor_tutorials.ongoing_tutor_tutorials = tutor_tutorials.ongoing_tutor_tutorials.filter(e => e._id !== this_post._id);

                            tutor_tutorials.ongoing_tutor_tutorials.push(begin_response.updated_tutorial);
                        }
                    }

                    create_toast("Tutorial started!", "dark", 2000, begin_buttons);

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

                    //REMOVE BEGIN TUTORIAL EVENT LISTENER
                    begin_tutorial.removeEventListener("click", begin_tutorial_handler, false);
                    cancel_tutorial.removeEventListener("click", cancel_tutorial_handler, false);
                    cancel_tutorial.remove();

                    //ADD YOUR CODE TO CHANGE THE 'Begin Tutorial' BUTTON to 'Finish Tutorial' HERE!
                    var element = document.getElementById("begin_tutorial");
                    element.parentNode.removeChild(element);
                    document.getElementById("finish_tutorial").style.display = "block";
                    user_notifications.sendBeginTutorialNotification(begin_response.student_notification.response, begin_response.updated_tutorial);

                    if (!localhost) {
                        push.send_notification("Tutorial has begun", "The '" + begin_response.updated_tutorial.post_title + "' tutorial has begun", begin_response.updated_tutorial.std_email, "Tutorial has begun", {}, {});
                    }
                } else {
                    create_ionic_alert("Begin tutorial", "The tutorial you wish to begin has either already begun or has been canceled. Please refresh your tutorials.", [
                        {
                            text: 'OK',
                            handler: async () => {
                                device_feedback();
                            }
                        }
                    ]);
                }
            }
        },
        {
            text: 'No',
            role: 'cancel',
            handler: () => {
                device_feedback();
            }
        }
    ]);
}

function end_tutorial(nav_controller, tutorial, tutorial_id, status, finish_tutorial, finish_tutorial_handler, previous) {
    create_ionic_alert("Finish tutorial?", "Are you sure you want to finish this tutorial? The tutorial will be moved to done and be considered completed.", [
        {
            text: 'Yes',
            handler: async () => {
                device_feedback();

                let end_response = await access_route({tutorial: tutorial, tutorial_id: tutorial_id, avatar: user.getAvatar()}, "finish_tutorial");

                if (end_response.action_available) {
                    user.setOngoingTutoredTutorials(user.getOngoingTutoredTutorials() - 1);
                    user.setDoneTutoredTutorials(user.getDoneTutoredTutorials() + 1);

                    user_notifications.addUnreadNotificationsToDOM();
                    user_notifications.addToNotifications(end_response.tutor_notification.response);

                    //Check what page we on, my tutorials or my requested tutorials
                    if (document.getElementById('my_posts_content') !== null) {
                        tutorials.remove_tutorial_from_DOM(status, {updated_tutorial: {_id: tutorial_id}}, tutorial);
                        tutorials.total_done_tutorials++;
                        tutorials.add_post_to_segment("Done", document.getElementById('done_tutorials_header'), end_response.updated_tutorial);
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

                    create_toast("Tutorial finished!", "dark", 2000, cancel_buttons);

                    posts.removeNotificationPostByPostId(tutorial_id)

                    if (typeof notification_posts !== 'undefined') {
                        notification_posts = notification_posts.filter(function (obj) {
                            return obj._id !== tutorial_id;
                        });

                        notification_posts.push(end_response.updated_tutorial);
                    }

                    //REMOVE BEGIN TUTORIAL EVENT LISTENER
                    finish_tutorial.removeEventListener("click", finish_tutorial_handler, false);

                    user_notifications.sendTutorialFinished(end_response.student_notification.response, end_response.updated_tutorial);

                    if (!localhost) {
                        push.send_notification("Tutorial has finished!", "The '" + end_response.updated_tutorial.post_title + "' tutorial has finished! Thank you for using Student Loop.", end_response.updated_tutorial.std_email, "Tutorial has finished", {}, {});
                    }

                    if (previous.element.nodeName == "NAV-NOTIFICATION-TUTORIAL-AGREEMENT-ACCEPTED") {
                        nav_controller.popToRoot();
                    } else {
                        nav_controller.pop();
                    }
                } else {
                    create_ionic_alert("Finish tutorial", "The tutorial you wish to finish has already been finished. Please refresh your tutorials.", [
                        {
                            text: 'OK',
                            handler: async () => {
                                device_feedback();

                                if (previous.element.nodeName == "NAV-NOTIFICATION-TUTORIAL-AGREEMENT-ACCEPTED") {
                                    nav_controller.popToRoot();
                                } else {
                                    nav_controller.pop();
                                }
                            }
                        }
                    ]);
                }
            }
        },
        {
            text: 'No',
            role: 'cancel',
            handler: () => {
                device_feedback();
            }
        }
    ]);
}

function rate_tutor(nav_controller, tutorial, tutorial_id, from_forum, rate_the_tutor, rate_the_tutor_handler) {

    let menu_buttons = '';
    if (from_forum) {
        menu_buttons = `<ion-buttons onclick="device_feedback()" slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons onclick="device_feedback()" slot="end">
                                        <ion-menu-button></ion-menu-button>
                                    </ion-buttons>`;
    }

    let rate_tutor_component = document.createElement('rate_tutor');
    let rate_tutor_component_html;
    rate_tutor_component_html = `
                            <ion-header translucent>
            <ion-toolbar>
                ${menu_buttons}
                <ion-title style="text-align:center;">Rate Tutor</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list class="fields" style="text-align:center;">
                <p><strong>Rate Tutor Experience</strong></p>
                <p>Please rate your tutor based on the tutorial experience you have experienced and leave a comment with some feedback.</p>
            </ion-list>

            <ion-list align="center" style="">
                <fieldset class="rating">
                    <input type="radio" id="star5" name="rating" value="5" /><label class = "star full" value="5" for="star5"></label>
                    <input type="radio" id="star4half" name="rating" value="4.5" /><label class="star half" value="4.5" for="star4half"></label>
                    <input type="radio" id="star4" name="rating" value="4" /><label class = "star full" value="4" for="star4"></label>
                    <input type="radio" id="star3half" name="rating" value="3.5" /><label class="star half" value="3.5" for="star3half"></label>
                    <input type="radio" id="star3" name="rating" value="3" /><label class = "star full" value="3" for="star3"></label>
                    <input type="radio" id="star2half" name="rating" value="2.5" /><label class="star half" value="2.5" for="star2half"></label>
                    <input type="radio" id="star2" name="rating" value="2" /><label class = "star full" value="2" for="star2"></label>
                    <input type="radio" id="star1half" name="rating" value="1.5" /><label class="star half" value="1.5" for="star1half"></label>
                    <input type="radio" id="star1" name="rating" value="1" /><label class = "star full" value="1" for="star1"></label>
                    <input type="radio" id="starhalf" name="rating" value="0.5" /><label class="star half" value="0.5" for="starhalf"></label>
                </fieldset>
            </ion-list>
    
            <ion-item-divider class="divider"></ion-item-divider>
            <ion-item>
                <ion-label style="padding-left:34%;font-size: 19px;" align="center" position="stacked">Comment <ion-text color="danger">*</ion-text></ion-label>
                <ion-textarea rows="5" align="center" placeholder="Comment" required type="text" id="comment"></ion-textarea>
            </ion-item>

            <div class="ion-padding-top">
                <ion-button expand="block" style="padding-left:5%;padding-right: 5%;" type="button" class="ion-no-margin" id="rate_tutor_button">Rate Tutor</ion-button>
            </div>
            <!--<p style="text-align: center; color: gray;">Any extra text!</p>-->

        </ion-content>`;

    rate_tutor_component.innerHTML = rate_tutor_component_html;

    nav_controller.push(rate_tutor_component);

    let rating = 0;

    let rate;
    let rate_handler = async function () {
        device_feedback();

        if (rating !== 0 && document.getElementById('comment').value !== '') {
            let rate_response = await access_route({tutorial: tutorial, tutorial_id: tutorial_id, rating: rating, comment: document.getElementById('comment').value}, "rate_tutor");

            if (rate_response.action_available) {
                tutorials.update_my_tutorial("Done", rate_response.updated_tutorial);

                //IMPORTNAT!!!! LOOK INTO ADDING THIS FOR CANCEL, BEGIN AND FINISH TUTORIAL!!!!!!!!
                posts.replace_notification_posts(rate_response.updated_tutorial);

                if (typeof notification_posts !== 'undefined') {
                    notification_posts = notification_posts.filter(function (obj) {
                        return obj._id !== tutorial_id;
                    });

                    notification_posts.push(rate_response.updated_tutorial);
                }

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

                create_toast("Tutor rated " + rating + "/5!", "dark", 2000, cancel_buttons);

                if (from_forum) {
                    tutorial.tutor_rated = true;
                    tutorial.comment = document.getElementById('comment').value;

                    rate_the_tutor.removeEventListener('click', rate_the_tutor_handler, false);
                    rate_the_tutor.remove();

                    if (document.getElementById('tutorial_links_list') !== null) {
                        let comment = document.createElement('ion-list');
                        comment.innerHTML = `<ion-list>
                                <ion-list-header>
                                  <strong>STUDENT COMMENT</strong>
                                </ion-list-header>
                                
                                <ion-item lines="none" class="comment">
                                    <ion-avatar class="comment_avatar" slot="start">
                                        <img src="${rate_response.updated_tutorial.std_avatar}">
                                    </ion-avatar>
                                    <ion-label class="ion-text-wrap">
                                        <p class="comment_title"><strong>${rate_response.updated_tutorial.std_name}</strong></p>
                                        <p class="comment_desc">${rate_response.updated_tutorial.comment}</p>
                                    </ion-label>
                                </ion-item>
                                <ion-item-divider class="divider3"></ion-item-divider>
                                
                            </ion-list>`;

                        document.getElementById('tutorial_links_list').after(comment);
                    }
                }

                user_notifications.sendRateTutor(rate_response.updated_tutorial, rate_response.rating);

                nav_controller.pop();
            } else {
                create_ionic_alert("Rate tutor", "You have already rated this tutor. Please refresh your tutorials.", [
                    {
                        text: 'OK',
                        handler: async () => {
                            device_feedback();

                            nav_controller.pop();
                        }
                    }
                ]);
            }
        } else {
            create_ionic_alert("Failed to rate tutor", "Please add a rating from half a star to 5 stars and add a comment.", ["OK"]);
        }
    };

    let tab_bar = document.querySelector('ion-tab-bar');
    tab_bar.style.display = 'none';

    let all_stars;
    let all_stars_handler = function () {
        rating = this.getAttribute("value");
    };

    let ionNavDidChangeEvent = async function () {
        all_stars = document.getElementsByClassName('star');
        for (let i = 0; i < all_stars.length; i++) {
            all_stars[i].addEventListener('click', all_stars_handler, false);
        }

        if (document.getElementById('rate_tutor_button') !== null) {
            rate = document.getElementById("rate_tutor_button");
            rate.addEventListener('click', rate_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();
        if (notifications_active_component.component.tagName !== "RATE_TUTOR") {
            rate.removeEventListener("click", rate_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);

            tab_bar.style.display = 'flex';

            for (let i = 0; i < all_stars.length; i++) {
                all_stars[i].removeEventListener('click', all_stars_handler, false);
            }
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

async function show_terms_conditions() {
    const controller = document.querySelector('ion-modal-controller');
    let modal_text;

    modal_text = `
          <ion-header translucent>
                            <ion-toolbar>
                                <ion-title>Terms & conditions</ion-title>
                                <ion-buttons onclick="device_feedback()" slot="end">
                <ion-button id="modal_close">Close</ion-button>
              </ion-buttons>
                            </ion-toolbar>
                        </ion-header>
                
                        <ion-content fullscreen>
                            <ion-list class="terms">
                        <p><strong style="opacity: 0.7;">Last Updated&nbsp;30&nbsp;January&nbsp;&nbsp;2020&nbsp;</strong>&nbsp;</p>
                        <p><strong>1. Agreement to Terms</strong>&nbsp;&nbsp;</p>
                        <p><strong>1.1 &nbsp;These Terms and Conditions</strong> constitute a legally binding agreement made between you, whether personally or on behalf of an entity (you), and&nbsp;Service Loop,&nbsp;located at&nbsp;Dundalk,&nbsp;Louth,&nbsp;Ireland&nbsp;(we,&nbsp;us), concerning your access to and use of the&nbsp;Service Loop&nbsp;website as well as any related applications (the&nbsp;Site).&nbsp;&nbsp;</p>
                        <p>The Site provides the following services:&nbsp;App that helps students to book tutorials&nbsp;(Services). You agree that by accessing the Site and/or Services, you have read, understood, and agree to be bound by all of these Terms and Conditions.&nbsp;&nbsp;</p>
                        <p>If you do not agree with all of these Terms and Conditions, then you are prohibited from using the Site and Services and you must discontinue use immediately. We recommend that you print a copy of these Terms and Conditions for future reference.&nbsp;&nbsp;</p>
                        <p><strong>1.2 &nbsp;The supplemental policies</strong> set out in Section 1.7 below, as well as any supplemental terms and condition or documents that may be posted on the Site from time to time, are expressly incorporated by reference.&nbsp;&nbsp;</p>
                        <p><strong>1.3 &nbsp;We may make changes</strong> to these Terms and Conditions at any time. The updated version of these Terms and Conditions will be indicated by an updated &ldquo;Revised&rdquo; date and the updated version will be effective as soon as it is accessible. You are responsible for reviewing these Terms and Conditions to stay informed of updates. Your continued use of the Site represents that you have accepted such changes.&nbsp;&nbsp;</p>
                        <p><strong>1.4 &nbsp;We may update or change</strong> the Site from time to time to reflect changes to our products, our users' needs and/or our business priorities.&nbsp;&nbsp;</p>
                        <p><strong>1.5 &nbsp;Our site</strong> is directed to people residing in&nbsp;England. The information provided on the Site is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. &nbsp;&nbsp;</p>
                        <p><strong>1.6 &nbsp;The Site</strong> is intended for users who are at least 18 years old. &nbsp;If you are under the age of 18, you are not permitted to register for the Site or use the Services without parental permission.&nbsp;</p>
                        <p><strong>1.7 &nbsp;Additional policies</strong> which also apply to your use of the Site include:&nbsp;&nbsp;&nbsp;</p>

                        <p><strong>2. Acceptable Use</strong>&nbsp;&nbsp;</p>
                        <p><strong>2.1 &nbsp;You may not</strong> access or use the Site for any purpose other than that for which we make the site and our services available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.&nbsp;&nbsp;</p>
                        <p><strong>2.2 &nbsp;As a user</strong> of this Site, you agree not to:&nbsp;&nbsp;</p>
                        <ul>
                        <li>Systematically retrieve data or other content from the Site to a compile database or directory without written permission from us&nbsp;</li>
                        <li>Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users to send unsolicited email or creating user accounts under false pretenses&nbsp;</li>
                        <li>Engage in unauthorized framing of or linking to the Site&nbsp;</li>
                        <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords&nbsp;</li>
                        <li>Make improper use of our support services, or submit false reports of abuse or misconduct&nbsp;</li>
                        <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools&nbsp;</li>
                        <li>Attempt to impersonate another user or person, or use the username of another user&nbsp;</li>
                        <li>Interfere with, disrupt, or create an undue burden on the Site or the networks and services connected to the Site&nbsp;</li>
                        <li>Sell or otherwise transfer your profile&nbsp;</li>
                        <li>Use any information obtained from the Site in order to harass, abuse, or harm another person&nbsp;</li>
                        <li>Use the Site or our content as part of any effort to compete with us or to create a revenue-generating endeavor or commercial enterprise&nbsp;</li>
                        <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Site&nbsp;</li>
                        <li>Attempt to access any portions of the Site that you are restricted from accessing&nbsp;</li>
                        <li>Harass, annoy, intimidate, or threaten any of our employees, agents, or other users&nbsp;</li>
                        <li>Delete the copyright or other proprietary rights notice from any of the content&nbsp;</li>
                        <li>Copy or adapt the Site&rsquo;s software, including but not limited to Flash, PHP, HTML, JavaScript, or other code&nbsp;</li>
                        <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material that interferes with any party&rsquo;s uninterrupted use and enjoyment of the Site, or any material that acts as a passive or active information collection or transmission mechanism&nbsp;</li>
                        <li>Use, launch, or engage in any automated use of the system, such as using scripts to send comments or messages, robots, scrapers, offline readers, or similar data gathering and extraction tools&nbsp;</li>
                        <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site&nbsp;</li>
                        <li>Use the Site in a manner inconsistent with any applicable laws or regulations&nbsp;</li>
                        <li>Threaten users with negative feedback or offering services solely to give positive feedback to users&nbsp;</li>
                        <li>Misrepresent experience, skills, or information about a User&nbsp;</li>
                        <li>Advertise products or services not intended by us</li>
                        <li>Falsely imply a relationship with us or another company with whom you do not have a relationship&nbsp;</li>
                        </ul>
                        <p><strong>3. Information you provide to us</strong></p>
                        <p><strong>3.1 &nbsp;You represent and warrant that:</strong> (a) all registration information you submit will be true, accurate, current, and complete and relate to you and not a third party; (b) you will maintain the accuracy of such information and promptly update such information as necessary; (c) you will keep your password confidential and will be responsible for all use of your password and account; (d) you have the legal capacity and you agree to comply with these Terms and Conditions; and (e) you are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Site.&nbsp;&nbsp;</p>
                        <p>If you know or suspect that anyone other than you knows your user information (such as an identification code or user name) and/or password you must promptly notify us at&nbsp;info@serviceloop.com.</p>
                        <p><strong>3.2 &nbsp;If you provide</strong> any information that is untrue, inaccurate, not current or incomplete, we may suspend or terminate your account. We may remove or change a user name you select if we determine that such user name is inappropriate.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <p><strong>4. Our content&nbsp;</strong></p>
                        <p><strong>4.1 &nbsp;Unless otherwise indicated</strong>, the Site and Services including source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (<strong>Our Content</strong>) are owned or licensed to us, and are protected by copyright and trade mark laws. &nbsp;&nbsp;</p>
                        <p><strong>4.2 &nbsp;Except</strong> as expressly provided in these Terms and Conditions, no part of the Site, Services or Our Content may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.&nbsp;</p>
                        <p><strong>4.3 &nbsp;Provided that you</strong> are eligible to use the Site, you are granted a limited licence to access and use the Site and Our Content and to download or print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial use. &nbsp;&nbsp;</p>
                        <p><strong>4.4 &nbsp;You shall not</strong> (a) try to gain unauthorised access to the Site or any networks, servers or computer systems connected to the Site; and/or (b) make for any purpose including error correction, any modifications, adaptions, additions or enhancements to the Site or Our Content, including the modification of the paper or digital copies you may have downloaded.&nbsp;</p>
                        <p><strong>4.5 &nbsp;We shall</strong> (a) prepare the Site and Our Content with reasonable skill and care; and (b) use industry standard virus detection software to try to block the uploading of content to the Site that contains viruses.&nbsp;&nbsp;</p>
                        <p><strong>4.6 &nbsp;The content on the Site</strong> is provided for general information only. It is not intended to amount to advice on which you should rely. You must obtain professional or specialist advice before taking, or refraining from taking, any action on the basis of the content on the Site.&nbsp;&nbsp;</p>
                        <p><strong>4.7 &nbsp;Although</strong> we make reasonable efforts to update the information on our site, we make no representations, warranties or guarantees, whether express or implied, that Our Content on the Site is accurate, complete or up to date.&nbsp;</p>
                        <p><strong>5. Site Management &nbsp;</strong>&nbsp; &nbsp;</p>
                        <p><strong>5.1&nbsp;&nbsp;We reserve the right</strong> at our sole discretion, to (1) monitor the Site for breaches of these Terms and Conditions; (2) take appropriate legal action against anyone in breach of applicable laws or these Terms and Conditions;&nbsp;(3) remove from the Site or otherwise disable all files and content that are excessive in size or are in any way a burden to our systems; and (4) otherwise manage the Site in a manner designed to protect our rights and property and to facilitate the proper functioning of the Site and Services.&nbsp;&nbsp;</p>
                        <p><strong>5.2 &nbsp;We do not guarantee</strong> that the Site will be secure or free from bugs or viruses.&nbsp;</p>
                        <p><strong>5.3 &nbsp;You are responsible</strong> for configuring your information technology, computer programs and platform to access the Site and you should use your own virus protection software.&nbsp;&nbsp;</p>
                        <p><strong>6. Modifications to and availability of the Site &nbsp;</strong>&nbsp; &nbsp;</p>
                        <p><strong>6.1 &nbsp;We reserve the right</strong> to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the Services without notice at any time.&nbsp; &nbsp;</p>
                        <p><strong>6.2 &nbsp;We cannot guarantee</strong> the Site and Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Site, resulting in interruptions, delays, or errors. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Site or Services during any downtime or discontinuance of the Site or Services.We are not obliged to maintain and support the Site or Services or to supply any corrections, updates, or releases.&nbsp;</p>
                        <p><strong>6.3 &nbsp;There may be information</strong> on the Site that contains typographical errors, inaccuracies, or omissions that may relate to the Services, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information at any time, without prior notice.&nbsp;&nbsp;</p>
                        <p><strong>7. Disclaimer/Limitation of Liability &nbsp;</strong>&nbsp; &nbsp;</p>
                        <p><strong>7.1&nbsp;&nbsp;The Site and Services</strong> are provided on an as-is and as-available basis. You agree that your use of the Site and/or Services will be at your sole risk except as expressly set out in these Terms and Conditions. All warranties, terms, conditions and undertakings, express or implied (including by statute, custom or usage, a course of dealing, or common law) in connection with the Site and Services and your use thereof including, without limitation, the implied warranties of satisfactory quality, fitness for a particular purpose and non-infringement are excluded to the fullest extent permitted by applicable law.&nbsp;&nbsp;</p>
                        <p>We make no warranties or representations about the accuracy or completeness of the Site&rsquo;s content and are not liable for any (1) errors or omissions in content: (2) any unauthorized access to or use of our servers and/or any and all personal information and/or financial information stored on our server; (3) any interruption or cessation of transmission to or from the site or services; and/or (4) any bugs, viruses, trojan horses, or the like which may be transmitted to or through the site by any third party. We will not be responsible for any delay or failure to comply with our obligations under these Terms and Conditions if such delay or failure is caused by an event beyond our reasonable control.</p>
                        <p><strong>7.2&nbsp;&nbsp;Our responsibility</strong> for loss or damage suffered by you:&nbsp;</p>
                        <p><strong>Whether you are a consumer or a business user:</strong>&nbsp;</p>
                        <ul>
                        <li>We do not exclude or limit in any way our liability to you where it would be unlawful to do so. This includes liability for death or personal injury caused by our negligence or the negligence of our employees, agents or subcontractors and for fraud or fraudulent misrepresentation.&nbsp;</li>
                        </ul>
                        <ul>
                        <li>If we fail to comply with these Terms and Conditions, we will be responsible for loss or damage you suffer that is a foreseeable result of our breach of these Terms and Conditions, but we would not be responsible for any loss or damage that were not foreseeable at the time you started using the Site/Services.&nbsp;</li>
                        </ul>
                        <p>Notwithstanding anything to the contrary contained in the Disclaimer/Limitation of Liability section, our liability to you for any cause whatsoever and regardless of the form of the action, will at all times be limited to a total aggregate amount equal to the greater of (a) the sum of &pound;5000 or (b) the amount paid, if any, by you to us for the Services/Site during the six (6) month period prior to any cause of action arising.&nbsp;&nbsp;&nbsp;</p>
                        <p><strong>If you are a consumer user:</strong>&nbsp;</p>
                        <ul>
                        <li>Please note that we only provide our Site for domestic and private use. You agree not to use our Site for any commercial or business purposes, and we have no liability to you for any loss of profit, loss of business, business interruption, or loss of business opportunity.</li>
                        </ul>
                        <ul>
                        <li>If defective digital content that we have supplied, damages a device or digital content belonging to you and this is caused by our failure to use reasonable care and skill, we will either repair the damage or pay you compensation.&nbsp;&nbsp;</li>
                        </ul>
                        <ul>
                        <li>You have legal rights in relation to goods that are faulty or not as described. Advice about your legal rights is available from your local Citizens' Advice Bureau or Trading Standards office. Nothing in these Terms and Conditions will affect these legal rights.&nbsp; &nbsp;&nbsp;</li>
                        </ul>
                        <p><strong>8. Term and Termination &nbsp;</strong>&nbsp; &nbsp;</p>
                        <p><strong>8.1 &nbsp;These Terms and Conditions</strong> shall remain in full force and effect while you use the Site or Services or are otherwise a user of the Site, as applicable. You may terminate your use or participation at any time, for any reason, by following the instructions for terminating user accounts in your account settings, if available, or by contacting us at&nbsp;info@serviceloop.com.&nbsp;&nbsp;</p>
                        <p><strong>8.2 &nbsp;Without limiting</strong> any other provision of these Terms and Conditions, we reserve the right to, in our sole discretion and without notice or liability, deny access to and use of the Site and the Services (including blocking certain IP addresses), to any person for any reason including without limitation for breach of any representation, warranty or covenant contained in these Terms and Conditions or of any applicable law or regulation.&nbsp;&nbsp;</p>
                        <p>If we determine, in our sole discretion, that your use of the Site/Services is in breach of these Terms and Conditions or of any applicable law or regulation, we may terminate your use or participation in the Site and the Services or delete&nbsp;your profile and&nbsp;any content or information that you posted at any time, without warning, in our sole discretion.&nbsp;&nbsp;</p>
                        <p><strong>8.3 &nbsp;If we terminate</strong> or suspend your account for any reason set out in this Section 9, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <p><strong>9. Mobile Application &nbsp;&nbsp;</strong>&nbsp;&nbsp;</p>
                        <p><strong>9.1 &nbsp;If you access</strong> the Services via a mobile application, then we grant you a revocable, non-exclusive, non-transferable, limited right to install and use the mobile application on wireless electronic devices owned or controlled by you, and to access and use the mobile application on such devices strictly in accordance with the terms and conditions of this license.&nbsp;&nbsp;</p>
                        <p><strong>9.2 &nbsp;The following terms</strong> apply when you use a mobile application obtained from either the Apple Store or Google Play (each an App Distributor) to access the Services:&nbsp;</p>
                        <p><strong>(a)</strong> The licence granted to you for our mobile application is limited to a non-transferable licence to use the application on a device that utilizes the Apple iOS or Android operating system, as applicable, and in accordance with the usage rules set forth in the applicable App Distributor terms of service;&nbsp;</p>
                        <p><strong>(b)</strong> We are responsible for providing any maintenance and support services with respect to the mobile application as specified in these Terms and Conditions or as otherwise required under applicable law. You acknowledge that each App Distributor has no obligation whatsoever to furnish any maintenance and support services with respect to the mobile application;&nbsp;</p>
                        <p><strong>(c)</strong> In the event of any failure of the mobile application to conform to any applicable warranty, you may notify an App Distributor, and the App Distributor, in accordance with its terms and policies, may refund the purchase price, if any, paid for the mobile application, and to the maximum extent permitted by applicable law, an App Distributor will have no other warranty obligation whatsoever with respect to the mobile application;&nbsp;</p>
                        <p><strong>(d)</strong> You represent and warrant that (i) you are not located in a country that is subject to a U.S. government embargo, or that has been designated by the U.S. government as a &ldquo;terrorist supporting&rdquo; country; and (ii) you are not listed on any U.S. government list of prohibited or restricted parties;&nbsp;</p>
                        <p><strong>(e)</strong> You must comply with applicable third party terms of agreement when using the mobile application, e.g., if you have a VoIP application, then you must not be in breach of their wireless data service agreement when using the mobile application; and&nbsp;</p>
                        <p><strong>(f)</strong> You acknowledge and agree that the App Distributors are third party beneficiaries of these Terms and Conditions, and that each App Distributor will have the right (and will be deemed to have accepted the right) to enforce these Terms and Conditions against you as a third party beneficiary thereof.&nbsp;&nbsp;&nbsp;</p>
                        <p><strong>10. General &nbsp;</strong>&nbsp; &nbsp; &nbsp;</p>
                        <p><strong>10.1&nbsp;&nbsp;Visiting the Site</strong>, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communication be in writing.&nbsp;&nbsp;</p>
                        <p>You hereby agree to the use of electronic signatures, contracts, orders and other records and to electronic delivery of notices, policies and records of transactions initiated or completed by us or via the Site.</strong>&nbsp;You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by other than electronic means.&nbsp;&nbsp;</p>
                        <p><strong>10.2 &nbsp;These Terms and Conditions</strong> and any policies or operating rules posted by us on the Site or in respect to the Services constitute the entire agreement and understanding between you and us. &nbsp;&nbsp;</p>
                        <p><strong>10.3 &nbsp;Our failure to exercise</strong> or enforce any right or provision of these Terms and Conditions shall not operate as a waiver of such right or provision. &nbsp;&nbsp;</p>
                        <p><strong>10.4 &nbsp;We may assign</strong> any or all of our rights and obligations to others at any time. &nbsp;&nbsp;</p>
                        <p><strong>10.5 &nbsp;We shall not be responsible</strong> or liable for any loss, damage, delay or failure to act caused by any cause beyond our reasonable control. &nbsp;&nbsp;</p>
                        <p><strong>10.6 &nbsp;If any provision</strong> or part of a provision of these Terms and Conditions is unlawful, void or unenforceable, that provision or part of the provision is deemed severable from these Terms and Conditions and does not affect the validity and enforceability of any remaining provisions.&nbsp;&nbsp;</p>
                        <p><strong>10.7 &nbsp;There is no joint venture</strong>, partnership, employment or agency relationship created between you and us as a result of these Terms and Conditions or use of the Site or Services.&nbsp;</p>
                        <p><strong>10.8</strong> &nbsp;<strong><em>For consumers only&nbsp;</em></strong><em>&nbsp;- Please note that these Terms and Conditions, their subject matter and their formation, are governed by English law. You and we both agree that the courts of England and Wales will have exclusive jurisdiction expect that if you are a resident of Northern Ireland you may also bring proceedings in Northern Ireland, and if you are resident of Scotland, you may also bring proceedings in Scotland. If you have any complaint or wish to raise a dispute under these Terms and Conditions or otherwise in relation to the Site please follow this link</em>&nbsp;<a href="http://ec.europa.eu/odr"><em>http://ec.europa.eu/odr</em></a><em>&nbsp;</em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <p><strong>10.9&nbsp;&nbsp;Except as stated</strong> under the Mobile Application section, a&nbsp;person who is not a party to these Terms and Conditions shall have no right under the Contracts (Rights of Third Parties) Act 1999 to enforce any term of these Terms and Conditions.&nbsp;</p>
                        <p><strong>10.10 &nbsp;In order to resolve</strong> a complaint regarding the Services or to receive further information regarding use of the Services, please contact us by email at&nbsp;info@serviceloop.com&nbsp;or by post to:&nbsp;</p>
                        <p><strong>Service Loop&nbsp;&nbsp;</p>
                        <p>Dundalk,&nbsp;Louth,</p>
                        <p>Ireland&nbsp;&nbsp;&nbsp;</strong></p>
                        <p>&nbsp;</p>
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
}

//Change password
async function change_pass(modal_created) {
    let change_pass_response;

    if (document.getElementById('old_password').value == "" || document.getElementById('new_password').value == "" || document.getElementById('conf_new_password').value == "") {
        create_ionic_alert("Change Password", "Please fill in all fields to reset password.", ["OK"]);
    } else {
        change_pass_response = await access_route({old_password: document.getElementById('old_password').value, new_password: document.getElementById('new_password').value, password_confirm: document.getElementById('conf_new_password').value, users_email: user.getEmail()}, "change_password");

        if (change_pass_response !== 'Password changed') {
            create_ionic_alert("Change Password", change_pass_response, ["OK"]);
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
            delete_fingerprint(user.getEmail());
            create_toast("Password changed.", "dark", 2000, toast_buttons);
            modal_created.dismiss();
        }
    }

}

//Update Personal Information
async function update_info(currentModal) {
    let update_info_response;

    if (document.getElementById('new_phone_number').value !== "") {
        update_info_response = await access_route({user_phone_number: document.getElementById('new_phone_number').value, users_email: user.getEmail()}, "change_phone");

        if (update_info_response === "Phone number is not valid") {
            create_ionic_alert("Personal Information", "Please enter a valid phone number!", ["OK"]);
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

            create_toast("Phone number updated", "dark", 2000, toast_buttons);
            dismissModal(currentModal);
        }
    } else {
        create_ionic_alert("Personal Information", "Please fill in your phone number to continue!", ["OK"]);
    }
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