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

//Check JWT session
async function check_session() {
    try {
        let data = {
            token: await get_secure_storage("jwt_session")
        };

        const rawResponse = await fetch('http://serviceloopserver.ga/verify_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const content = await rawResponse.json();

        if (content !== "Session valid") {
            await remove_secure_storage("jwt_session");
            window.location.href = "login.html";
            return;
        } else {
            return "Proceed";
        }
    } catch (ex) {
        console.log(ex);
        window.location.href = "login.html";
        return;
    }
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
            return response;
        } else {
            return response;
        }

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
    if (!document.getElementById(id)) {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.id = id;
        script.src = url; 
        document.querySelector('ion-tabs').appendChild(script);
    }
}