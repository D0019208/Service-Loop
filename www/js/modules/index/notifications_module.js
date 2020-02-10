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
        let this_post;

        //We get the post that this notifiaction relates to by comparing the post id's
        for (let i = 0; i < notification_posts.length; i++) {
            if (this_notification.post_id === notification_posts[i]._id) {
                this_post = notification_posts[i];
            }
        }

        //Find a notification from notifications object that matches the ID of the clicked element.
        this_notification = user_notifications.getNotificationDetailsById(notification.getAttribute('notification_id'));

        if (!this_notification.notification_opened) {
            this_notification.notification_opened = true;
            user_notifications.subtractUnreadNotifications();
            notification.parentNode.classList.remove("not_read");
            notification.parentNode.classList.add("read");
            access_route({notification_id: notification.getAttribute('notification_id')}, "set_notification_to_read", false);
            user_notifications.updateNotification(this_notification, notification.getAttribute('notification_id'))
        }

        let tutorial_request_sent_element = document.createElement('nav-notification');

        let tutorial_request_sent_element_html;

        if (this_post.post_status === "Open") {
            tutorial_request_sent_element_html = `
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
                   <ion-button expand="block" type="button" class="ion-no-margin" color="primary" id="open_tutorial">Open tutorial</ion-button>
                </div>
          </ion-content>
        `;
        } else {
            tutorial_request_sent_element_html = `
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
        }

        tutorial_request_sent_element.innerHTML = tutorial_request_sent_element_html;

        //The button to which we are applying the event listener
        let open_tutorial_post_button;
        nav_notifications.push(tutorial_request_sent_element);



        let tutorial_requested_event_handler;


        let ionNavDidChangeEvent = async function () {
            if (document.getElementById('open_tutorial') !== null) {
                open_tutorial_post_button = document.getElementById('open_tutorial');
                if (this_post.post_status === "Open") {
                    tutorial_requested_event_handler = function () {
                        device_feedback();
                        load_tutorial_requested_component(this_post);
                    };
                }

                if (typeof open_tutorial_post_button !== 'undefined') {
                    open_tutorial_post_button.addEventListener('click', tutorial_requested_event_handler, false);
                }
            }

            let notifications_active_component = await nav_notifications.getActive();

            if (notifications_active_component.component === "nav-notifications") {
                if (typeof open_tutorial_post_button !== 'undefined' && open_tutorial_post_button !== null) {
                    open_tutorial_post_button.removeEventListener("click", tutorial_requested_event_handler, false);
                }
                nav_notifications.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
            }
        };

        nav_notifications.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);

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

            let new_tutorial_request_event_handler = function () {
                device_feedback();
                load_new_tutorial_request_component(nav_notifications, this_notification, {post: null, is_forum: false});
            };


            let ionNavDidChangeEvent = async function () {
                if (document.getElementById('open_tutorial_post') !== null) {
                    open_tutorial_post_button = document.getElementById('open_tutorial_post');

                    open_tutorial_post_button.addEventListener('click', new_tutorial_request_event_handler, false);
                }

                let notifications_active_component = await nav_notifications.getActive();

                if (notifications_active_component.component === "nav-notifications") {
                    open_tutorial_post_button.removeEventListener("click", new_tutorial_request_event_handler, false);
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

        let nav_notification = document.createElement('nav-notification');
        let nav_notification_html;
        console.log(this_post.post_status)

        if (this_post.post_status == "In negotiation" && !this_post.post_agreement_offered && user.getStatus() == "Student") {
            nav_notification_html = `
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
                   <ion-button expand="block" type="button" class="ion-no-margin" color="primary" id="open_tutorial">Open tutorial</ion-button>
                </div>
          </ion-content>
        `;
        } else if (this_post.post_status == "In negotiation" && !this_post.post_agreement_offered && user.getStatus() == "Tutor") { 
            nav_notification_html = `
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
                   <ion-button expand="block" type="button" class="ion-no-margin" color="primary" id="open_accepted_tutorial">Open agreement form</ion-button>
                </div>
          </ion-content>
        `;
        } else if (this_post.post_status == "In negotiation" && this_post.post_agreement_offered) {
            alert("__")
            nav_notification_html = `
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
        } else {
            console.log(this_notification)
            console.log(this_post)
            alert("sdfjkds")
        }

        nav_notification.innerHTML = nav_notification_html;

        //The button to which we are applying the event listener
        let open_accepted_tutorial_post_button;

        nav_notifications.push(nav_notification); 

        let accepted_tutorial_request_event_handler; 

        let ionNavDidChangeEvent = async function () {
            if (this_post.post_status == "In negotiation" && !this_post.post_agreement_offered && user.getStatus() == "Student") {
                open_accepted_tutorial_post_button = document.getElementById('open_tutorial');

                accepted_tutorial_request_event_handler = function () {
                    device_feedback();

                    let tutorial_status = this_post.post_status;
                    let tutorial_tag = this_post.post_modules.join(', ');
                    load_pending_tutorial_component(this_post, tutorial_tag, tutorial_status);
                };
            } else if (this_post.post_status == "In negotiation" && !this_post.post_agreement_offered && user.getStatus() == "Tutor") {
                open_accepted_tutorial_post_button = document.getElementById('open_accepted_tutorial');

                accepted_tutorial_request_event_handler = function () {
                    device_feedback();
                    load_tutorial_accepted_component(this_post, notification_tags);
                };
            } else if (this_post.post_status == "In negotiation" && !this_post.post_agreement_offered) {
                open_accepted_tutorial_post_button = document.getElementById('open_tutorial');

                accepted_tutorial_request_event_handler = function () {
                    device_feedback();

                    let tutorial_status = this_post.post_status;
                    let tutorial_tag = this_post.post_modules.join(', ');
                    load_pending_tutorial_component(this_post, tutorial_tag, tutorial_status);
                };
            }

            if (typeof open_accepted_tutorial_post_button !== 'undefined' && open_accepted_tutorial_post_button !== null) {
                open_accepted_tutorial_post_button.addEventListener('click', accepted_tutorial_request_event_handler, false);
            }

            let notifications_active_component = await nav_notifications.getActive();

            if (notifications_active_component.component.tagName !== "NAV-NOTIFICATION") {
                if (typeof open_accepted_tutorial_post_button !== 'undefined' && open_accepted_tutorial_post_button !== null) {
                    open_accepted_tutorial_post_button.removeEventListener("click", accepted_tutorial_request_event_handler, false);
                }

                nav_notifications.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
            }
        };

        nav_notifications.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
    } else if (notification_tags.includes("Tutorial agreement offered")) {
        device_feedback();
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

        let nav_notification = document.createElement('nav-notification');
        let nav_notification_html;
        console.log(this_post.post_status)

        if (this_post.post_status == "In negotiation" && !this_post.post_agreement_offered) { 
            alert("?")
            nav_notification_html = `
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
                   <ion-button expand="block" type="button" class="ion-no-margin" color="primary" id="open_accepted_tutorial_agreement_form">Open agreement form</ion-button>
                </div>
          </ion-content>
        `;
        } else if (this_post.post_status == "In negotiation" && this_post.post_agreement_offered) {
            alert("??")
            nav_notification_html = `
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
                   <ion-button expand="block" type="button" class="ion-no-margin" color="primary" id="open_accepted_tutorial">Open tutorial</ion-button>
                </div>
          </ion-content>
        `;
        } else {
            alert("???")
            nav_notification_html = `
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
        }
        
        nav_notification.innerHTML = nav_notification_html;

        //The button to which we are applying the event listener
        let open_accepted_tutorial_post_button;
        nav_notifications.push(nav_notification);

        let accepted_tutorial_request_event_handler;

        let tutorial_status = this_post.post_status;
        let tutorial_tag = this_post.post_modules.join(', ');

        if (tutorial_status == "In Negotiation") {
            tutorial_status = "Pending";
        }

        let ionNavDidChangeEvent = async function () { 
            if (this_post.post_status == "In negotiation" && !this_post.post_agreement_offered && user.getStatus() == "Tutor") {
                open_accepted_tutorial_post_button = document.getElementById('open_accepted_tutorial_agreement_form');

                accepted_tutorial_request_event_handler = function () {
                    device_feedback(); 
                    load_pending_tutorial_component_not_signed(nav_notifications, this_post); 
                };
                
                if(open_accepted_tutorial_post_button !== null) {
                    open_accepted_tutorial_post_button.addEventListener('click', accepted_tutorial_request_event_handler, false);
                } 
            } else if (this_post.post_status == "In negotiation" && this_post.post_agreement_offered && user.getStatus() == "Tutor") {
                //Agreement has been offered by tutor
                open_accepted_tutorial_post_button = document.getElementById('open_accepted_tutorial');

                accepted_tutorial_request_event_handler = function () {
                    device_feedback();

                    load_pending_tutorial_component_signed(nav_notifications, this_post, tutorial_status, tutorial_tag);
                };
                
                if(open_accepted_tutorial_post_button !== null) {
                    open_accepted_tutorial_post_button.addEventListener('click', accepted_tutorial_request_event_handler, false);
                }  
            } else if (this_post.post_status == "In negotiation" && this_post.post_agreement_offered && user.getStatus() == "Student") {
                //Agreement has been offered by tutor and is being viewed by the student
                open_accepted_tutorial_post_button = document.getElementById('open_accepted_tutorial');

                accepted_tutorial_request_event_handler = function () {
                    device_feedback();

                    load_post_agreement_offered_component(nav_notifications, this_post, tutorial_tag, tutorial_status);
                };
                
                if(open_accepted_tutorial_post_button !== null && typeof open_accepted_tutorial_post_button !== 'undefined') {
                    open_accepted_tutorial_post_button.addEventListener('click', accepted_tutorial_request_event_handler, false);
                }
                
            } else if(this_post.post_status == "In negotiation" && !this_post.post_agreement_offered && user.getStatus() == "Student") {
                open_accepted_tutorial_post_button = document.getElementById('open_accepted_tutorial_agreement_form');

                accepted_tutorial_request_event_handler = function () {
                    device_feedback();
                    load_pending_tutorial_component(this_post, tutorial_tag, tutorial_status);
                };

                open_accepted_tutorial_post_button.addEventListener('click', accepted_tutorial_request_event_handler, false);
            }


            let notifications_active_component = await nav_notifications.getActive();

            if (notifications_active_component.component.tagName !== "NAV-NOTIFICATION") {
                if (open_accepted_tutorial_post_button !== null && typeof open_accepted_tutorial_post_button !== 'undefined') {
                    console.log("listener removed")
                    console.log(open_accepted_tutorial_post_button)
                    open_accepted_tutorial_post_button.removeEventListener("click", accepted_tutorial_request_event_handler, false);
                }

                nav_notifications.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
            }
        };

        nav_notifications.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
    }
}); 

function load_tutorial_accepted_component(this_post, notification_tags) {
    console.log("Accepted post")
    console.log(this_post);

    let tutorial_status = this_post.post_status;
    let tutorial_tag = this_post.post_modules.join(', ');

    if (tutorial_status == "In Negotiation") {
        tutorial_status = "Pending";
    }















//    tutor_tutorial_element.innerHTML = tutor_tutorial_element_html;
//    nav.push(tutor_tutorial_element);
//
//    let generate_agreement_button;
//    let generate_agreement_handler = async function () {
//        device_feedback();
//
//        generate_agreement(tutorial);
//    }
//
//    let ionNavDidChangeEvent = async function () {
//        if (document.getElementById('signature-pad') !== null) {
//            await include("js/signature_pad.min.js", "signature_pad");
//            drawing_pad();
//            generate_agreement_button = document.getElementById("generate_agreement");
//            generate_agreement_button.addEventListener('click', generate_agreement_handler, false);
//        }
//
//        let notifications_active_component = await nav.getActive();
//
//        if (notifications_active_component.component === "nav-my-tutorials") {
//            generate_agreement_button.removeEventListener("click", generate_agreement_handler, false);
//            nav.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
//        }
//    };
//
//    nav.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);

    if (this_post.post_agreement_offered) {
        load_post_agreement_offered_component(nav_notifications, this_post, tutorial_tag, tutorial_status);
    } else if (this_post.post_agreement_signed) {
        load_post_agreement_signed_component(this_post);
    } else if (notification_tags.includes("Tutorial request accepted")) {
        load_pending_tutorial_component_not_signed(nav_notifications, this_post);
    } else {
        load_pending_tutorial_component(this_post);
    }
}

function load_tutorial_requested_component(this_post) {
    let tutorial_status = this_post.post_status;

    if (tutorial_status == "In Negotiation") {
        tutorial_status = "Pending";
    }

    let tutorial_requested_component = document.createElement('tutorial_requested');
    tutorial_requested_component.innerHTML = `<ion-header translucent>
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
                            <ion-label>${this_post.post_modules.join(', ')}</ion-label>
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
                            </ion-content>`;
    nav_notifications.push(tutorial_requested_component)

}

function load_post_agreement_signed_component(this_post) {
    let tutorial_accepted_component = document.createElement('tutorial_requested');
    let tutorial_accepted_component_html;
    tutorial_accepted_component_html = `<ion-header translucent>
                                                        <ion-toolbar>
                                                                <ion-buttons slot="start">
                                                            <ion-back-button defaultHref="/"></ion-back-button>
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
                                                                <ion-button color="success">Accept agreement</ion-button>
                                                                <ion-button color="danger">Reject agreement</ion-button>
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

    tutorial_accepted_component.innerHTML = tutorial_accepted_component_html;

    nav_notifications.push(tutorial_accepted_component);
}

function load_pending_tutorial_component(this_post, tutorial_tag, tutorial_status) {
    let tutorial_accepted_component = document.createElement('tutorial_requested');
    let tutorial_accepted_component_html;
    tutorial_accepted_component_html = `
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
                                        ${this_post.post_tutor_name} has agreed to be your tutor, please get in contact with him
                                        through his college email '${this_post.post_tutor_email}' to discuss the details of your tutorial
                                        and create an agreement.
                                    </h6>
                                </ion-item>    
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

    tutorial_accepted_component.innerHTML = tutorial_accepted_component_html;

    nav_notifications.push(tutorial_accepted_component);
} 