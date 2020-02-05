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
        const rawResponse = await fetch("http://localhost:3001/" + route, {
            //const rawResponse = await fetch("http://serviceloopserver.ga/" + route, {
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
            reject(error)
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
            reject(error);
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
            reject(error);
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
//    window.plugins.deviceFeedback.isFeedbackEnabled(function (feedback) {
//        if (feedback.haptic && feedback.acoustic) {
//            window.plugins.deviceFeedback.haptic();
//            window.plugins.deviceFeedback.acoustic();
//        }  
//        else if (feedback.haptic) {
//            window.plugins.deviceFeedback.haptic();
//        }
//        else if (feedback.acoustic) {
//            window.plugins.deviceFeedback.acoustic();
//        }
//    });
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
    let tutorial_element = document.createElement('tutorial');
    let tutorial_element_html = `<ion-header translucent>
                                                            <ion-toolbar>
                                                                <ion-buttons slot="start">
                                                                    <ion-back-button defaultHref="/"></ion-back-button>
                                                                </ion-buttons>
                                                                <ion-buttons slot="end">
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
                                                                <ion-label>
                                                                    <h2><strong>${this_post.post_title}</strong></h2>
                                                                </ion-label>
                                                            </ion-item>
                                                            <ion-item style="margin-top:-15px;" lines="none">
                                                                <h6>
                                                                    ${this_post.post_desc}
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
                                                                    Your tutor, ${this_post.post_tutor_name} has sent you an agreement regarding your tutorial request, please
                                                                    review it before accepting or rejecting it. If you have any questions, contact him through his college email at 
                                                                    '${this_post.post_tutor_email}' 
                                                                </h6>

                                                            </ion-item> 
                                                                <div class="ion-padding-top">
                                                                    <ion-button expand="block" type="button" class="ion-no-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="view_agreement">View agreement</ion-button>
                                                                     <ion-button expand="block" type="button" class="ion-no-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
                                                                    <ion-button id="accept_agreement" color="success">Accept agreement</ion-button>
                                                                    <ion-button id="reject_agreement" color="danger">Reject agreement</ion-button>
                                                                </div>            
                                                            <ion-item-divider class="divider2"></ion-item-divider> 
                                                                <ion-item lines="none">
                                                                    <ion-label>
                                                                        <h2><strong>Tutorial stage</strong></h2>
                                                                    </ion-label>
                                                                </ion-item>
                                                                    <div class="timeline">
                                                                  <div class="entry">
                                                                    <div class="title">
                                                                    </div>
                                                                    <div class="body">
                                                                      <p>Open</p>
                                                                      <ul>
                                                                        <li>Your tutorial has been requested successfully, it has currently not been assigned to a tutor. </li> 
                                                                      </ul>
                                                                    </div>
                                                                  </div>
                                                                  <div class="entry">
                                                                    <div class="title"> 
                                                                    </div>
                                                                    <div class="body">
                                                                      <p>Pending</p>
                                                                      <ul>
                                                                        <li>A tutor has been assigned, the tutor will contact you via email to generate an agreement.</li>
                                                                      </ul>
                                                                    </div>
                                                                  </div>
                                                                  <div class="entry">
                                                                    <div class="title"> 
                                                                    </div>
                                                                    <div class="body">
                                                                      <p>Ongoing</p>
                                                                      <ul>
                                                                        <li>Agreement has been generated and signed by both tutor & student, tutorial will take place on agreed time and date.</li>
                                                                      </ul>
                                                                    </div>
                                                                  </div>
                                                                  <div class="entry">
                                                                    <div class="title"> 
                                                                    </div>
                                                                    <div class="body">
                                                                      <p>Done</p>
                                                                      <ul>
                                                                        <li>Tutorial has been compeleted.</li>
                                                                      </ul>
                                                                    </div>
                                                                  </div>

                                                                </div>
                                                            </ion-content>`;
    tutorial_element.innerHTML = tutorial_element_html;

    nav_controller.push(tutorial_element);

    let accept_agreement;
    let accept_agreement_handler = async function () {
        device_feedback();

        create_ionic_alert("Accept agreement", "Please confirm that you wish to accept this agreement.", [
            {
                text: 'Accept',
                handler: () => {
                    console.log('Accepted');
                    load_sign_accepted_agreement_component(this_tutorial);
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

    let reject_agreement;
    let reject_agreement_handler = async function () {
        device_feedback();

        create_ionic_alert("Reject agreement", "Please confirm that you wish to reject this agreement.", [
            {
                text: 'Reject',
                handler: () => {
                    console.log('Rejected')
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

        //reject_agreement(tutorial);
    }

    let ionNavDidChangeEvent = async function () {
        if (document.getElementById('accept_agreement') !== null) {
            accept_agreement = document.getElementById("accept_agreement");
            accept_agreement.addEventListener('click', accept_agreement_handler, false);
        }

        if (document.getElementById('reject_agreement') !== null) {
            reject_agreement = document.getElementById("reject_agreement");
            reject_agreement.addEventListener('click', reject_agreement_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();

        if (notifications_active_component.component.tagName !== "TUTORIAL") {
            accept_agreement.removeEventListener("click", accept_agreement_handler, false);
            reject_agreement.removeEventListener("click", reject_agreement_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

async function accept_post(nav_controller, this_post, post, is_forum) {
    console.log("This_post")
    console.log(this_post)
    let post_acceptated_response = await access_route({tutor_email: user.getEmail(), tutor_name: user.getName(), post_id: this_post._id}, "post_accepted", function () {
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

        create_toast("You have successfully accepted a tutorial.", "dark", 2000, toast_buttons);
    });

    if (!post_acceptated_response.error) {
        user_notifications.addToNotifications(post_acceptated_response.response.tutor_notification);
        user_notifications.sendTutorialAcceptedNotification(post_acceptated_response.response.student_notification, post_acceptated_response.response.post);



        let name = post_acceptated_response.response.student_notification.response.notification_desc.split(' ').slice(0, 2).join(' ');

        let success_screen_element = document.createElement('success_screen');
        success_screen_element.innerHTML =
                `<ion-header translucent>
            <ion-toolbar>
                <ion-title><h1>Request Accepted</h1></ion-title>
                <ion-buttons slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

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

        let ok_btn_handler = function () {
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


                if (posts.all_posts !== 0 && posts.total_posts !== 0) {
                    posts.all_posts = posts.all_posts.filter(e => e !== this_post);
                    posts.total_posts = posts.total_posts - 1;

                    posts.removePostById(this_post._id);
                }

                nav_controller.popToRoot();
            } else {
                nav_controller.popToRoot();
            }
            
            console.log("Response post");
            console.log(post_acceptated_response.response)
            console.log("Notification pists pre updated");
            console.log(posts.notification_posts);
            posts.replace_notification_posts(post_acceptated_response.response.post); 
            console.log("Post update");
            console.log(posts.notification_posts);
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

            if (document.getElementById("forum_list").childNodes.length === 0) {
                document.getElementById("forum_list").remove();
            }

            post.remove();
            nav_controller.popToRoot();
        });
    }
} 

function load_pending_tutorial_component_not_signed(nav_controller, tutorial) {
    let tutor_tutorial_element = document.createElement('tutorial');
    let date = new Date();
    let year = date.getFullYear();
    let current_date = year + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
    
    let tutor_tutorial_element_html = `
                                <ion-header translucent>
                                    <ion-toolbar>
                                        <ion-buttons slot="start">
                                            <ion-back-button defaultHref="/"></ion-back-button>
                                            </ion-buttons>
                                            <ion-buttons slot="end">
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
                                        <ion-label>Duration <ion-text color="danger">*</ion-text></ion-label>
                                        <ion-datetime id="tutorial_time" display-format="HH:mm" value="00:00"></ion-datetime>
                                    </ion-item>

                                    <ion-item>
                                        <ion-label position="stacked">Location <ion-text color="danger">*</ion-text></ion-label>
                                        <ion-input id="tutorial_room" placeholder="P1119" required type="text"></ion-input>
                                    </ion-item>

                                    <br><br>
                                    <div class="wrapper">
                                        <canvas id="signature-pad" class="signature-pad" width=300 height=200></canvas>
                                    </div>
                                    <div style="text-align:center">
                                        <button id="save">Save</button>
                                        <button id="undo">Undo</button>
                                        <button id="clear">Clear</button>
                                    </div>

                                    <div class="ion-padding-top fields">
                                        <ion-button expand="block" id="generate_agreement" type="submit" class="ion-no-margin">Create agreement</ion-button>
                                    </div>
                                    <p class="success_text3">Please note, the student has to agree to the agreement before a tutorial can take place.</p> 
                                </ion-content>`;

    tutor_tutorial_element.innerHTML = tutor_tutorial_element_html;
    nav_controller.push(tutor_tutorial_element);

    let generate_agreement_button;
    let generate_agreement_handler = async function () {
        device_feedback();

        generate_agreement(tutorial);
    }

    let ionNavDidChangeEvent = async function () {
        if (document.getElementById('signature-pad') !== null) {
            await include("js/signature_pad.min.js", "signature_pad");
            drawing_pad();
            generate_agreement_button = document.getElementById("generate_agreement");
            generate_agreement_button.addEventListener('click', generate_agreement_handler, false);
        }

        let notifications_active_component = await nav_controller.getActive();

        if (notifications_active_component.component.tagName === "TUTORIAL") {
            generate_agreement_button.removeEventListener("click", generate_agreement_handler, false);
            nav_controller.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav_controller.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

async function generate_agreement(tutorial) { 
    if (isCanvasBlank(document.getElementById('signature-pad')) || document.getElementById('tutorial_room').value == "") {
        create_ionic_alert("Agreement creation failed", "Please fill in all fields before proceeding.", ["OK"]);
    } else {
        let agreement_generated_response = await access_route({tutorial_id: tutorial.getAttribute('post_id'), email: user.getEmail(), name: user.getName(), tutorial_date: document.getElementById('tutorial_date').value, tutorial_time: document.getElementById('tutorial_time').value, tutorial_room: document.getElementById('tutorial_room').value, tutor_signature: signaturePad.toDataURL('image/png')}, "offer_agreement");
        console.log(agreement_generated_response);
        if (!agreement_generated_response.error) {
            user_notifications.addToNotifications(agreement_generated_response.tutor_notification.response);
            //user_notifications.sendTutorialAcceptedNotification(agreement_generated_response.student_notification.response);

            //tutor_tutorials.remove_tutorial_from_DOM("Pending", agreement_generated_response);
            tutor_tutorials.update_tutorial("Pending", agreement_generated_response.updated_tutorial);
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

            nav.pop();
        } else {
            alert("Error")
        }

        console.log(agreement_generated_response);
    }
}

function load_pending_tutorial_component_signed(nav_controller, this_tutorial, tutorial_status, tutorial_tag) {
    let tutor_tutorial_element = document.createElement('tutorial');
    let tutor_tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons slot="end">
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
                                                                    You have successfully created an agreement for this tutorial, please wait for ${this_tutorial.std_name} to accept or reject the agreement. You can contact the
                                                                    student using his college email '${this_tutorial.post_tutor_email}'. 
                                                                </h6>

                                                            </ion-item> 
                                                                <div class="ion-padding-top">
                                                                    <ion-button expand="block" type="button" class="ion-no-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="view_agreement">View agreement</ion-button> 
                                                                     <ion-button expand="block" type="button" class="ion-no-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
                                                                </div>            
                                                            <ion-item-divider class="divider2"></ion-item-divider> 
                                                        <ion-item lines="none">
                                                            <ion-label>
                                                                <h2><strong>Tutorial stage</strong></h2>
                                                            </ion-label>
                                                        </ion-item>
                                                            <div class="timeline">
                                                          <div class="entry">
                                                            <div class="title">
                                                            </div>
                                                            <div class="body">
                                                              <p>Open</p>
                                                              <ul>
                                                                <li>Your tutorial has been requested successfully, it has currently not been assigned to a tutor. </li> 
                                                              </ul>
                                                            </div>
                                                          </div>
                                                          <div class="entry">
                                                            <div class="title"> 
                                                            </div>
                                                            <div class="body">
                                                              <p>Pending</p>
                                                              <ul>
                                                                <li>A tutor has been assigned, the tutor will contact you via email to generate an agreement.</li>
                                                              </ul>
                                                            </div>
                                                          </div>
                                                          <div class="entry">
                                                            <div class="title"> 
                                                            </div>
                                                            <div class="body">
                                                              <p>Ongoing</p>
                                                              <ul>
                                                                <li>Agreement has been generated and signed by both tutor & student, tutorial will take place on agreed time and date.</li>
                                                              </ul>
                                                            </div>
                                                          </div>
                                                          <div class="entry">
                                                            <div class="title"> 
                                                            </div>
                                                            <div class="body">
                                                              <p>Done</p>
                                                              <ul>
                                                                <li>Tutorial has been compeleted.</li>
                                                              </ul>
                                                            </div>
                                                          </div>

                                                        </div>
                                                    </ion-content>`;

    tutor_tutorial_element.innerHTML = tutor_tutorial_element_html;
    nav_controller.push(tutor_tutorial_element);
}  