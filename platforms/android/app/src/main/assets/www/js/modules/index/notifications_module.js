"use strict"

//Notifications
//function appendItems(number, list, notifications) {
//    console.log('length is', length);
//    const originalLength = length;
//    let read_class;
//    console.log(notifications)
//    for (var i = 0; i < number; i++) {
//        const el = document.createElement('ion-list');
//        console.log(notifications[i + originalLength])
//        if (notifications[i + originalLength].notification_opened) {
//            read_class = "read";
//        } else {
//            read_class = "not_read";
//        }
//
//        el.classList.add('ion-activatable', 'ripple', read_class);
//        el.innerHTML = `
//                
//                <ion-item lines="none" class="notification" notification_id="${notifications[i + originalLength]._id}" post_id="${notifications[i + originalLength].post_id}" notification_tags="${notifications[i + originalLength].notification_tags.join(', ')}" notification_modules="${notifications[i + originalLength].notification_modules.join(', ')}">
//          <ion-avatar slot="start">
//            <img src="${notifications[i + originalLength].notification_avatar}">
//        </ion-avatar>
//        <ion-label>
//            <h2>${notifications[i + originalLength].notification_title}</h2>
//            <span>${notifications[i + originalLength].notification_posted_on}</span>
//            <p>${notifications[i + originalLength].notification_desc_trunc}</p>
//        </ion-label>
//            </ion-item>
//            <ion-ripple-effect></ion-ripple-effect>
//            
//        `;
//        list.appendChild(el);
//
//        length++;
//    }
//}

const nav_notifications = document.getElementById('nav-notifications');
let active_component;

customElements.define('nav-notifications', class NavNotifications extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.innerHTML = `
          <ion-header translucent>
                        <ion-toolbar>
                            <ion-buttons slot="start">
                                <!--<ion-back-button default-href="home"></ion-back-button>-->
                            </ion-buttons>
                            <ion-buttons slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
                            <ion-title>
                                <h1>Notifications</h1>
                            </ion-title>
                        </ion-toolbar>
                    </ion-header>

                    <ion-content fullscreen>
                        <!-- <h2><a href="login.html">Home</a></h2>-->
                        <ion-list>
                            <ion-list-header id="notifications_header">
                                NOTIFICATIONS
                            </ion-list-header><!--<p>Manage information about you...</p>-->

                            <ion-list id="list"></ion-list>

                            <ion-infinite-scroll threshold="100px" id="infinite-scroll">
                                <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                                </ion-infinite-scroll-content>
                            </ion-infinite-scroll>
                        </ion-list>
                    </ion-content>
        `;

        active_component = await nav_notifications.getActive();
        if (posts.get_notification_posts().length == 0 && document.getElementById('list').hasChildNodes() && active_component.component === "nav-notifications") {
            //Function to get all ids from the notifications list and find the posts associated with them
            notification_posts = await posts.getAllNotificationPosts();
            console.log("Notification posts")
            console.log(notification_posts);
            posts.set_notification_posts(notification_posts);
        } else {
            notification_posts = posts.get_notification_posts();
        }
    }
});

//List element we are appending to
const list = document.getElementById('list');
const infiniteScroll = document.getElementById('infinite-scroll');
let number_of_notifications_to_add;

if (user_notifications.getTotalNotifications() == 0) {
    document.getElementById("notifications_header").innerText = "YOU HAVE NO NOTIFICATIONS!";
} else {
    document.getElementById("notifications_header").innerText = "NOTIFICATIONS";
    /*
     * We add an event listener to the infinite-scroll element that when the scroll reaches
     * the bottom, it appends new elements
     */
    infiniteScroll.addEventListener('ionInfinite', async function () {
        if (user_notifications.notifications_length < user_notifications.getAllNotifications().length - 1) {
            console.log('Loading data...');
            await wait(500);
            infiniteScroll.complete();

            number_of_notifications_to_add = user_notifications.getAllNotifications().length - user_notifications.notifications_length;

            user_notifications.appendNotifications(number_of_notifications_to_add, list);
            console.log('Done');

            if (user_notifications.notifications_length > user_notifications.getAllNotifications().length - 1) {
                console.log('No More Data');
                infiniteScroll.disabled = true;
            }
        } else {
            console.log('No More Data');
            infiniteScroll.disabled = true;
        }
    });

    if (user_notifications.getAllNotifications().length <= 7) {
        user_notifications.appendNotifications(user_notifications.getAllNotifications().length, list);
    } else {
        user_notifications.appendNotifications(7, list);
    }

}



document.querySelector('body').addEventListener('click', async function (event) {
    //Get closest element with specified class
    let notification = getClosest(event.target, '.notification');
    let notification_tags = [];

    //If there exists an element with the specified target near the clicked 
    if (notification !== null) {
        notification_tags.push(notification.getAttribute('notification_tags'));
    }

    if (notification_tags.includes("Tutorial request sent") && notification_tags.length !== 0) {
        device_feedback();

        //Find a notification from notifications object that matches the ID of the clicked element.
        let this_notification = user_notifications.getNotificationDetailsById(notification.getAttribute('notification_id'));

        if (!this_notification.notification_opened) {
            this_notification.notification_opened = true;
            user_notifications.subtractUnreadNotifications();
            notification.parentNode.classList.remove("not_read");
            notification.parentNode.classList.add("read");
            access_route({notification_id: notification.getAttribute('notification_id')}, "set_notification_to_read", false);
            user_notifications.updateNotification(this_notification, notification.getAttribute('notification_id'))
        }

        let tutorial_request_sent_element = document.createElement('nav-notification');
        tutorial_request_sent_element.innerHTML = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
                <ion-buttons slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
              <ion-title>${this_notification.notification_title}</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content fullscreen class="ion-padding">
            <p>${this_notification.notification_desc}</p>
                <div class="ion-padding-top">
                   <ion-button expand="block" type="button" class="ion-no-margin" color="primary" id="do_something">Do something</ion-button>
                </div>
          </ion-content>
        `;

        nav_notifications.push(tutorial_request_sent_element);

    } else if (notification_tags.includes("Tutorial requested") && notification_tags.length !== 0) {
        device_feedback();
        console.log("Notification <>")
        console.log(notification);

        //Find a notification from notifications object that matches the ID of the clicked element.
        let this_notification = user_notifications.getNotificationDetailsById(notification.getAttribute('notification_id'));
        let this_post;

        //We get the post that this notifiaction relates to by comparing the post id's
        for (let i = 0; i < notification_posts.length; i++) {
            if (this_notification.post_id === notification_posts[i]._id) {
                this_post = notification_posts[i];
            }
        }

        if (!this_notification.notification_opened) {
            this_notification.notification_opened = true;
            user_notifications.subtractUnreadNotifications();
            notification.parentNode.classList.remove("not_read");
            notification.parentNode.classList.add("read");
            access_route({notification_id: notification.getAttribute('notification_id')}, "set_notification_to_read", false);
            user_notifications.updateNotification(this_notification, notification.getAttribute('notification_id'))
        }

        let nav_notification_tutorial_requested = document.createElement('nav-notification-tutorial-requested');

        if (this_post.post_status === "Open") {
            nav_notification_tutorial_requested.innerHTML = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
                <ion-buttons slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
              <ion-title>${this_notification.notification_title}</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content fullscreen class="ion-padding">
            <p>${this_notification.notification_desc}</p>
                <div class="ion-padding-top">
                   <ion-button expand="block" type="button" class="ion-no-margin" color="primary" id="open_tutorial_post">Open post</ion-button>
                </div>
          </ion-content>
        `;

            //The button to which we are applying the event listener
            let open_tutorial_post_button;
            nav_notifications.push(nav_notification_tutorial_requested);

            let event_handler = function () {
                device_feedback();
                load_component(this_notification);
            };


            let ionNavDidChangeEvent = async function () {
                if (document.getElementById('open_tutorial_post') !== null) {
                    open_tutorial_post_button = document.getElementById('open_tutorial_post');

                    open_tutorial_post_button.addEventListener('click', event_handler, false);
                }

                let notifications_active_component = await nav_notifications.getActive();

                if (notifications_active_component.component === "nav-notifications") {
                    open_tutorial_post_button.removeEventListener("click", event_handler, false);
                    nav_notifications.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
                }
            };

            nav_notifications.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
        } else {
            nav_notification_tutorial_requested.innerHTML = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
                <ion-buttons slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
              <ion-title>${this_notification.notification_title}</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content fullscreen class="ion-padding">
            <p>${this_notification.notification_desc}</p> 
          </ion-content>
        `;
            nav_notifications.push(nav_notification_tutorial_requested);
        }
    } else if (notification_tags.includes("Tutorial request accepted")) {
        device_feedback();
        let this_notification = user_notifications.getNotificationDetailsById(notification.getAttribute('notification_id'));

        console.log("This notification")
        console.log(this_notification);

        if (!this_notification.notification_opened) {
            this_notification.notification_opened = true;
            user_notifications.subtractUnreadNotifications();
            notification.parentNode.classList.remove("not_read");
            notification.parentNode.classList.add("read");
            access_route({notification_id: notification.getAttribute('notification_id')}, "set_notification_to_read", false);
            user_notifications.updateNotification(this_notification, notification.getAttribute('notification_id'))
        }
        
        let nav_notification = document.createElement('nav-notification');
        nav_notification.innerHTML = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
                <ion-buttons slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
              <ion-title>${this_notification.notification_title}</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content fullscreen class="ion-padding">
            <p>${this_notification.notification_desc}</p>
                <div class="ion-padding-top">
                   <ion-button expand="block" type="button" class="ion-no-margin" color="primary" id="do_something">Do something</ion-button>
                </div>
          </ion-content>
        `;

        nav_notifications.push(nav_notification);
    }
});








async function load_component(this_notification) {
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

    let modules = "";

    for (let i = 0; i < this_post.post_modules.length; i++) {
        modules += '<ion-chip class="module" color="primary"><ion-icon name="star"></ion-icon><ion-label>' + this_post.post_modules[i] + '</ion-label></ion-chip>';
    }
    console.log("This notification")
    console.log(this_notification);
    console.log("This post")
    console.log(this_post);

    console.log("fucked")
    console.log(customElements.get('nav-post'));

    let nav_post = document.createElement("nav-post");
    nav_post.innerHTML = `
                            <ion-header translucent>
                            <ion-toolbar>
                                    <ion-buttons slot="start">
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
                            <ion-label>
                                <h2><strong>${this_post.post_title}</strong></h2>
                            </ion-label>
                        </ion-item>
                        <ion-item style="margin-top:-15px;" lines="none">
                            <ion-label>
                                <h2>${this_post.post_desc}</h2>
                            </ion-label>
                        </ion-item>
                            
                        ${modules}
                            
                            <ion-item-divider class="divider2"></ion-item-divider>
                            <ion-button expand="block" type="submit" class="ion-margin accept_request_btn" id="accept_request_btn">Accept Request</ion-button>
                        </ion-content>
                                              `;

    let accept_request_btn;

    let handler = function () {
        device_feedback();
        accept_post(this_post);
    }

    nav_notifications.push(nav_post);




    let ionNavDidChangeEvent = async function () {
        if (document.getElementById('accept_request_btn') !== null) {
            accept_request_btn = document.getElementById("accept_request_btn");
            accept_request_btn.addEventListener('click', handler, false);
        }

        let notifications_active_component = await nav_notifications.getActive();

        if (notifications_active_component.component.tagName === "NAV-NOTIFICATION-TUTORIAL-REQUESTED") {
            accept_request_btn.removeEventListener("click", handler, false);
            nav_notifications.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav_notifications.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}




async function accept_post(this_post) {
    let post_acceptated_response = await access_route({tutor_email: user.getEmail(), post_id: this_post._id}, "post_accepted");

    //let post_acceptated_response = {error: false};

    if (!post_acceptated_response.error) {
        user_notifications.addToNotifications(post_acceptated_response.response.tutor_notification);
        user_notifications.sendTutorialAcceptedNotification(post_acceptated_response.response.student_notification);

        create_ionic_alert("Tutorial request acceptated", "You have successfully acceptated a tutorial request.", ["OK"], function () {

            //Maybe needed idk
            //posts.removeNotificationPostByPostId(this_post._id);


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


            nav_notifications.popToRoot();
        });
    } else {
        create_ionic_alert("Tutorial request error", post_acceptated_response.response, ["OK"], function () {
            if (posts.all_posts !== 0 && posts.total_posts !== 0) {
                posts.all_posts = posts.all_posts.filter(e => e !== this_post);
                posts.total_posts = posts.total_posts - 1;

                posts.removePostById(this_post._id);
            }
            nav_notifications.popToRoot();
        });
    }
}