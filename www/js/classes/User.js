class User {
    constructor(name = "", email = "", status = "", modules = ["none"], socket = "") {
        this.name = name;
        this.email = email;
        this.status = status;
        this.modules = modules;
        this.socket = socket;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setEmail(email) {
        this.email = email;
    }

    getEmail() {
        return this.email;
    }

    setStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

    setModules(modules) {
        this.modules = modules;
    }

    getModules() {
        return this.modules;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    getSocket() {
        return this.socket;
    }

    async check_session() {
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
                //alert("Session NOT valid")
                await remove_secure_storage("jwt_session"); 
                window.location.href = "login.html";
                return;
            } else {  
                //alert("Session valid.") 
                return "Proceed";
            }
            
        } catch (ex) {
            console.log(ex);
            window.location.href = "login.html";
            return;
        }
    }

    createWebSocketConnection() {
        //HTTPS
        //const socket = io.connect("https://my.website.com:3002", { secure: true, reconnection: true, rejectUnauthorized: false });
        let modules = encodeURIComponent(JSON.stringify(this.modules));
        let socket = io.connect('http://serviceloopserver.ga', {query: 'email=' + this.email + '&modules=' + modules});
        this.socket = socket;

        console.log(socket);
    }

    test() {
        this.socket.emit('update_socket', {user_email: this.getEmail(), user_modules: ["test"]});
    }

    async ascendToTutor(user_notifications, user_modules, handler) {
        //We update the users modules, status and socket as he is now a tutor
        this.modules = user_modules;
        this.status = "Tutor";
        this.socket.emit('update_socket', {user_email: this.getEmail(), user_modules: user_modules});

        //Get the new notifications that the user would see as a tutor
        let notifications_response = await access_route({users_email: this.getEmail(), user_tutor: {is_tutor: true, user_modules: user_modules}}, "get_all_notifications", false);


        if (typeof notifications_response === "string") {
            user_notifications.all_notifications = notifications_response;
        } else {
            user_notifications.all_notifications = notifications_response.response;
        }

        let unopened_notification = user_notifications.find_unopened_notifications_number();

        user_notifications.setUnreadNotifications(unopened_notification);
        user_notifications.addUnreadNotificationsToBadge(unopened_notification);

        //Delete the current notifications so that we can add the new ones IF we have initialized the notifications module
        if (typeof document.getElementById('notifications_script') == null) {
            document.getElementById('list').innerHTML = "";
            if (user_notifications.getAllNotifications().length <= 7) {
                user_notifications.appendNotifications(user_notifications.getAllNotifications().length, document.getElementById('list'));
            } else {
                user_notifications.appendNotifications(7, document.getElementById('list'));
            }

            user_notifications.setTotalNotifications(unopened_notification.length);
        }


        //Change the UI to the UI of the tutor
        document.getElementById("user_status").innerText = "Tutor";

        //get reference to element that we want to replace
        let tutor_application_button = document.getElementById('home_tutor_application');
        console.log(apply_to_be_tutor);
        tutor_application_button.removeEventListener("click", handler, false);


        tutor_application_button.querySelector("h6").innerText = "All tutorial requests";
        tutor_application_button.querySelector("p").innerText = "View all the requested tutorials on the forum";
        tutor_application_button.id = "all_tutorials";

        //Load the forum script
        include("js/modules/index/forum_module.js", "forum_script");

        tutor_application_button.addEventListener("click", function () {
            all_tutorials(nav);
        })
    }
}