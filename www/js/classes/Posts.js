class Posts extends User {
    constructor(posts, name, email, status, modules, socket) {
        super(name, email, status, modules, socket);

        this.all_posts = posts.response;

        //Check to see if there are any posts (If empty, there will be a string)
        if (typeof posts.response !== "string") {
            this.total_posts = this.all_posts.length;
        } else {
            this.total_posts = 0;
        }

        this.posts_length = 0;
        this.notification_posts = [];
        console.log(this.all_posts);
    }
    
    set_notification_posts(notification_posts) {
        this.notification_posts = notification_posts;
    }
    
    get_notification_posts() {
        return this.notification_posts;
    }

    appendPosts(number, list) {
        console.log("rgrfdbgfjkg")
        let posts = this.getAllPosts();

        console.log('length is', this.posts_length);
        const originalLength = this.posts_length;

        for (var i = 0; i < number; i++) {
            const el = document.createElement('ion-list');
            el.className = "ion-activatable ripple";

//            if (posts[i + originalLength].notification_opened) {
//                read_class = "read";
//            } else {
//                read_class = "not_read";
//            }

            el.classList.add('ion-activatable', 'ripple', "not_read");

            el.innerHTML = `
                <ion-card class="test post" post_id="${posts[i + originalLength]._id}" post_modules="${posts[i + originalLength].post_modules.join(', ')}">
                        <ion-item lines="full">
                            <ion-avatar slot="start">
                                <img src="https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png">
                            </ion-avatar>
                            <ion-label>
                                <h2>${posts[i + originalLength].post_title}</h2>
                                <p>${formatDate(posts[i + originalLength].post_posted_on)}</p>
                            </ion-label>
                        </ion-item>
                        <ion-card-content>
                            ${posts[i + originalLength].post_desc_trunc}
                        </ion-card-content>
                        <ion-item>
                            <ion-chip class="module2" outline color="primary">
                                <ion-icon name="star"></ion-icon>
                                <ion-label>${posts[i + originalLength].post_modules.join(', ')}</ion-label>
                            </ion-chip>
                            <ion-button fill="outline" slot="end">View</ion-button>
                        </ion-item>
                        <ion-ripple-effect></ion-ripple-effect>
                    </ion-card> 
            
        `;
            list.prepend(el)
            //list.appendChild(el);

            this.posts_length += 1;
        }
    }

    //Array
    addPosts(posts) {
        console.log(posts);
        console.log(this.all_posts.length)

        if (posts !== "There are no posts to display!") {
            if (this.all_posts.length === 0) {
                console.log("d")
                for (let i = 0; i < posts.length; i++) {
                    this.all_posts.push(posts[i]);
                }

                console.log(this.all_posts)
            } else {
                this.all_posts = posts;
            }

            this.setTotalPosts();
        }

    }

    getPostDetailsById(post_id) {
        for (let i = 0; i < this.all_posts.length; i++) {
            if (this.all_posts[i]._id == post_id) {
                return this.all_posts[i];
            }
        }
    }

    setTotalPosts() {
        this.total_posts = this.all_posts.length;
    }

    getTotalPosts() {
        return this.total_posts;
    }

    getAllPosts() {
        return this.all_posts;
    }
    
    addToNotificationPosts(post) {
        insert_to_array_by_index(this.notification_posts, 0, post);
    }

    addToPosts(post) {
        console.log(this.all_posts)
        if (this.all_posts == "There are no posts to display!") {
            this.all_posts = [post];
        } else {
            insert_to_array_by_index(this.all_posts, 0, post);
        }
        
        this.addToNotificationPosts(post);

        //Increase count of total posts
        this.total_posts = this.total_posts + 1;
        this.posts_length = this.posts_length + 1;

        if (document.getElementById('forum_list') != null) {
            document.getElementById("posts_header").innerText = "ALL REQUESTED TUTORIALS";

            const el = document.createElement('ion-list');
            el.classList.add('ion-activatable', 'ripple', 'not_read');
            el.innerHTML = `
                <ion-card class="test post" post_id="${post._id}" post_modules="${post.post_modules.join(', ')}">
                        <ion-item lines="full">
                            <ion-avatar slot="start">
                                <img src="https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png">
                            </ion-avatar>
                            <ion-label>
                                <h2>${post.post_title}</h2>
                                <p>${formatDate(post.post_posted_on)}</p>
                            </ion-label>
                        </ion-item>
                        <ion-card-content>
                            ${post.post_desc_trunc}
                        </ion-card-content>
                        <ion-item>
                            <ion-chip class="module2" outline color="primary">
                                <ion-icon name="star"></ion-icon>
                                <ion-label>JavaScript</ion-label>
                            </ion-chip>
                            <ion-button fill="outline" slot="end">View</ion-button>
                        </ion-item>
                        <ion-ripple-effect></ion-ripple-effect>
                    </ion-card>
        `;
            document.getElementById('forum_list').prepend(el);
        }
    }

    sendNewTutorial(tutorial) {
        this.socket.emit('new_tutorial', tutorial);
    }

    waitForNewTutorials() {
        let socket = this.socket;

        socket.on('new_tutorial_request', (data) => {
            this.addToPosts(data.response);
            //Add notification
            console.log(data);
        });
        
//        socket.on('tutorial_request_accepted', (data) => {
//            user_notifications.addToNotifications(data.response);
//            //Add notification
//            console.log(data);
//        });
 
        socket.on('news', function (data) {
            console.log(data);
        });
    }
    
    waitForTutorialAccepted() {
        let socket = this.socket;
        
        socket.on('tutorial_request_accepted', (data) => {
            user_notifications.addToNotifications(data.response);
            //Add notification
            console.log(data);
        });
    }

    removePostById(id) {
        this.all_posts = this.all_posts.filter(function (obj) {
            return obj._id !== id;
        });
    }
    
    removeNotificationPostByPostId(post_id) {
        this.notification_posts = this.notification_posts.filter(function (obj) {
            return obj._id !== post_id;
        });
    }
    
    getNotificationPostDetailsById(id) {
        for (let i = 0; i < this.notification_posts.length; i++) {
            if (this.notification_posts[i]._id == id) {
                return this.notification_posts[i];
            }
        }
    }
    
    async getAllNotificationPosts() {
        //The list containing all the notifications
        let notification_list = document.getElementById("list");
        //The children of the notification list
        let notification_list_children = notification_list.children;
        let post_ids = [];
        
        console.log(notification_list.children[0].firstElementChild.attributes[3].value)
        for (let i = 0; i < notification_list_children.length; i++) {
            post_ids.push(notification_list.children[i].firstElementChild.attributes[3].value);
        } 
        
        let notification_posts = await access_route({notification_posts_id: post_ids}, "get_notification_posts");
        return notification_posts.response;
    }
}