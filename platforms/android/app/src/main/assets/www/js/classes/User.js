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

    createWebSocketConnection() {
        //HTTPS
        //const socket = io.connect("https://my.website.com:3002", { secure: true, reconnection: true, rejectUnauthorized: false });
        let modules = encodeURIComponent(JSON.stringify(this.modules));  
        let socket = io.connect('http://serviceloopserver.ga', {query: 'email=' + this.email + '&modules=' + modules});  
        this.socket = socket;
        
        console.log(socket);
    }
}