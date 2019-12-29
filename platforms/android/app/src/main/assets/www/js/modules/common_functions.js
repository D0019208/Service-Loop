/*
 * A function that can create Ionic Alerts based on inputed information.
 * 
 * @param {String} header - This is the heading of the alert e.g. "Warning!"
 * @param {type} message - This is the body of the alert e.g. "Agreement has been changed!"
 * @param {type} buttons - These are the actions a user can take e.g "Invalidate agreement" (Optional)
 * @param {type} inputs - These are fields the user can enter information into e.g. "Password" (Optional)
 * @param {type} on_alert_dismiss_function - A function to execute when alert is dismissed (Optional)
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


//Ionic loading overlay
function create_ionic_loading() {
    let ion_loading_controller = document.createElement('ion-loading-controller');
    document.querySelector('ion-app').appendChild(ion_loading_controller);

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

async function access_route(data, route, show_loading = true) {
    //Get back the loading object so we can then dismiss it when our API call is done.
    let loading;
    if(show_loading) {
        loading = await create_ionic_loading();
    }
    
    try {
        const rawResponse = await fetch("http://serviceloopserver.ga/" + route, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if(show_loading) {
            loading.dismiss();
        }
         
        return await rawResponse.json();
    } catch (ex) {
        if(show_loading) {
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

//Cordova Secure Storage
function set_secure_storage(key, value) {
    return new Promise((resolve, reject) => {
        cordova.plugins.SecureKeyStore.set(function (res) {
            resolve("Successfully stored string!")
        }, function (error) {
            reject(error)
        }, key, value);
    });
}

function get_secure_storage(key) {
    return new Promise((resolve, reject) => {
        cordova.plugins.SecureKeyStore.get(function (email) {
            resolve(email);
        }, function (error) {
            reject(error);
        }, key);
    });
}

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
	        function(s) {
	            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
	                i = matches.length;
	            while (--i >= 0 && matches.item(i) !== this) {}
	            return i > -1;
	        };
	}

	// Get the closest matching element
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;

};

//Ionic 4 Modal
customElements.define('modal-content', class ModalContent extends HTMLElement {
    connectedCallback() {
        const modalElement = document.querySelector('ion-modal');
        this.innerHTML = modalElement.componentProps.modal_content;
    }
}); 


function createModal(controller, modal_content) {
    return controller.create({
        component: 'modal-content',
        componentProps: {
            modal_content: modal_content
        }
    });
}

function dismissModal(currentModal) {
    if (currentModal) {
        currentModal.dismiss().then(() => {
            currentModal = null;
        });
    }
}