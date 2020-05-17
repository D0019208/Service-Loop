class Posts extends User {
    constructor(id, posts, name, email, status, modules, avatar, open_tutorials, pending_tutorials, ongoing_tutorials, done_tutorials, tutored_pending_tutorials, tutored_ongoing_tutorials, tutored_done_tutorials, socket) {
        super(id, name, email, status, modules, avatar, open_tutorials, pending_tutorials, ongoing_tutorials, done_tutorials, tutored_pending_tutorials, tutored_ongoing_tutorials, tutored_done_tutorials, 0, socket);

        this.all_posts = posts.response;

        //Check to see if there are any posts (If empty, there will be a string)
        if (typeof posts.response !== "string") {
            this.total_posts = this.all_posts.length;
        } else {
            this.total_posts = 0;
        }

        this.posts_length = 0;
        this.notification_posts = [];
    }

    async update_with_new_posts(posts) {
        this.all_posts = posts.response;
        this.posts_length = 0;
        
        //Check to see if there are any posts (If empty, there will be a string)
        if (typeof posts.response !== "string") {
            this.total_posts = this.all_posts.length;
            document.getElementById('posts_header').innerText = "ALL REQUESTED TUTORIALS";
        } else {
            this.total_posts = 0;
        }
        
        document.getElementById('forum_list').innerHTML = "";
        if(this.total_posts > 3) {
            this.appendPosts(3, document.getElementById('forum_list'));
        } else {
            this.appendPosts(this.total_posts, document.getElementById('forum_list'));
        }
        
        notification_posts = await this.getAllNotificationPosts();
        console.log(notification_posts)
    }

    append_unique_posts(posts) {
        let context = this;

        //Get all new notifications
        let new_posts = posts.filter(new_post => context.all_posts.map(old_post => old_post._id).indexOf(new_post._id) === -1);

        new_posts.filter((post) => {
            context.addToPosts(post);
        });
    }

    set_notification_posts(notification_posts) {
        this.notification_posts = notification_posts;
    }

    get_notification_posts() {
        return this.notification_posts;
    }

    appendPosts(number, list) {
        let posts = this.getAllPosts();
        const originalLength = this.posts_length;

        for (var i = 0; i < number; i++) {
            const el = document.createElement('ion-list');
            el.className = "ion-activatable ripple";
            el.classList.add('ion-activatable', 'ripple', "not_read");
            el.innerHTML = `
                <ion-card onclick="device_feedback();" class="test post" post_id="${posts[i + originalLength]._id}" post_modules="${posts[i + originalLength].post_modules.join(', ')}">
                        <ion-item lines="full">
                            <ion-avatar slot="start">
                                <img src="${posts[i + originalLength].std_avatar}">
                            </ion-avatar>
                            <ion-label>
                                <p style="font-size:1em; color: black;">${posts[i + originalLength].post_title}</p>
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
            this.posts_length += 1;
        }
    }

    addPosts(posts) {
        if (posts !== "There are no posts to display!") {
            if (this.all_posts.length === 0) {
                for (let i = 0; i < posts.length; i++) {
                    this.all_posts.push(posts[i]);
                }
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
                <ion-card onclick="device_feedback();" class="test post" post_id="${post._id}" post_modules="${post.post_modules.join(', ')}">
                        <ion-item lines="full">
                            <ion-avatar slot="start">
                                <img src="${post.std_avatar}">
                            </ion-avatar>
                            <ion-label>
                                <p style="font-size:1em; color: black;">${post.post_title}</p>
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

            create_toast("New tutorial request available.", "dark", 3000, toast_buttons);
            new_message_ping.play();
            this.addToPosts(data.response);
        });

//        socket.on('tutorial_request_accepted', (data) => {
//            user_notifications.addToNotifications(data.response);
//            //Add notification
//            console.log(data);
//        });
    }

    waitForTutorialAccepted() {
        let socket = this.socket;

        socket.on('tutorial_request_accepted', (data) => {
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

            create_toast("A tutorial has been accepted!", "dark", 3000, toast_buttons);
            new_message_ping.play();
            user_notifications.addToNotifications(data.the_notification.response);
        });
    }

    removePostById(id, is_notifications = false) {
        if (this.all_posts.length !== 0) {
            this.all_posts = this.all_posts.filter(function (obj) {
                return obj._id !== id;
            });
        }

        this.total_posts--;

        if (typeof document.getElementById('forum_list') !== 'undefined' && !is_notifications) {
            console.log("trst")
            console.log(typeof document.getElementById('forum_list'));
            if (document.querySelector('[post_id="' + id + '"]') !== null) {
                document.querySelector('[post_id="' + id + '"]').parentNode.remove();
            }

            if (this.all_posts.length == 0) {
                if (document.getElementById('posts_header') !== null) {
                    document.getElementById('posts_header').innerText = "THERE ARE NO TUTORIAL REQUESTS!";
                }
            }
    }
    }

    removeNotificationPostByPostId(post_id) {
        this.notification_posts = this.notification_posts.filter(function (obj) {
            return obj._id !== post_id;
        });
    }

    getNotificationById(id) {
        for (let i = 0; i < this.all_posts.length; i++) {
            if (this.all_posts[i]._id == id) {
                return this.all_posts[i];
            }
        }
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
        let notification_list = user_notifications.getAllNotifications();
        let notification_posts;
        let post_ids = [];

        for (let i = 0; i < notification_list.length; i++) {
            post_ids.push(notification_list[i].post_id);
        }

        notification_posts = await access_route({notification_posts_id: post_ids}, "get_notification_posts");
        return notification_posts.response;
    }

    replace_notification_posts(new_post) {
        for (let i = 0; i < this.notification_posts.length; i++) {
            if (this.notification_posts[i]._id === new_post._id) {
                this.notification_posts[i] = new_post;
            }
        }
    }
}