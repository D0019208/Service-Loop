"use strict"

/*
 * Function that takes a users email and password and logs them in while at the
 * same time creating a JWT session.
 * 
 * @param {String} user_email
 * @param {String} user_password
 * @returns {Redirects to index.html}
 */
async function login_user(user_email, user_password) {
    let loading = await create_ionic_loading();

    try {
        let data = {
            users_email: user_email,
            users_password: user_password
        };

//        http://serviceloopserver.ga
//        http://localhost:3000
        const rawResponse = await fetch('http://serviceloopserver.ga/login_user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const content = await rawResponse.json();
        //Dismiss the loading indicator
        loading.dismiss();

        if (content.status === 200) {

            await set_secure_storage("jwt_session", content.token);
            await set_secure_storage("users_email", user_email);
            await set_secure_storage("user_name", content.user_name);
            await set_secure_storage("user_status", content.user_tutor);
            
            if(content.user_tutor) {
                await set_secure_storage("user_modules", content.user_modules);
            }

            window.location.href = 'index.html';

            return;
        } else {
            create_ionic_alert("Login failed", content.error, ["OK"]);
            document.getElementById('login').disabled = false;
        }

        console.log(content);
    } catch (ex) {
        console.log(ex)
        loading.dismiss();
        create_ionic_alert("Login failed", ex, ["OK"]);
        document.getElementById('login').disabled = false;
    }
}

//We call this function when the user wishes to login via fingerprint, we decrypt the data then send it
//to the login function
async function decrypt_fingerprint() {
    try {
        let token = await get_secure_storage("service_loop_fingerprint_token")
        let email = await get_secure_storage("users_email");

        var decryptConfig = {
            clientId: "Service Loop User",
            username: email,
            token: token
        };

        FingerprintAuth.decrypt(decryptConfig, successCallback, errorCallback);

        function successCallback(result) {
            console.log("successCallback(): " + JSON.stringify(result));
            /* Once we decrypted the token, we take the decrypted 
             * password and email and login the user creating a
             * JWT session.
             */
            if (result.password) {
                login_user(email, result.password)
            }

        }

        function errorCallback(error) {
            if (error !== FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                create_ionic_alert("Fingerprint authentication failed", error, ["OK"])
            }
        }
    } catch (ex) {
        create_ionic_alert("Fingerprint authentication failed", ex, ["OK"]);
    }
}