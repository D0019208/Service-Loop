"use strict"

//Make this as a closure
var length = 0;
//Notifications
function appendItems(number, list, notifications) {
    console.log('length is', length);
    const originalLength = length;
    let read_class;
    console.log(notifications)
    for (var i = 0; i < number; i++) {
        const el = document.createElement('ion-list');
        console.log(notifications[i + originalLength])
        if (notifications[i + originalLength].notification_opened) {
            read_class = "read";
        } else {
            read_class = "not_read";
        }

        el.classList.add('ion-activatable', 'ripple', read_class);
        el.innerHTML = `
                
                <ion-item lines="none" class="notification" notification_id="${notifications[i + originalLength]._id}" post_id="${notifications[i + originalLength].post_id}" notification_tags="${notifications[i + originalLength].notification_tags.join(', ')}" notification_modules="${notifications[i + originalLength].notification_modules.join(', ')}">
          <ion-avatar slot="start">
            <img src="${notifications[i + originalLength].notification_avatar}">
        </ion-avatar>
        <ion-label>
            <h2>${notifications[i + originalLength].notification_title}</h2>
            <span>${notifications[i + originalLength].notification_posted_on}</span>
            <p>${notifications[i + originalLength].notification_desc_trunc}</p>
        </ion-label>
            </ion-item>
            <ion-ripple-effect></ion-ripple-effect>
            
        `;
        list.appendChild(el);

        length++;
    }
}

function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const nav_notifications = document.getElementById('nav-notifications');

customElements.define('nav-notifications', class NavNotifications extends HTMLElement {
    connectedCallback() {
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
        if (length < user_notifications.getAllNotifications().length - 1) {
            console.log('Loading data...');
            await wait(500);
            infiniteScroll.complete();

            number_of_notifications_to_add = user_notifications.getAllNotifications().length - length;

            appendItems(number_of_notifications_to_add, list, user_notifications.getAllNotifications());
            console.log('Done');

            if (length > user_notifications.getAllNotifications().length - 1) {
                console.log('No More Data');
                infiniteScroll.disabled = true;
            }
        } else {
            console.log('No More Data');
            infiniteScroll.disabled = true;
        }
    });

    if (user_notifications.getAllNotifications().length <= 7) {
        appendItems(user_notifications.getAllNotifications().length, list, user_notifications.getAllNotifications());
    } else {
        appendItems(7, list, user_notifications.getAllNotifications());
    }

}



document.querySelector('body').addEventListener('click', async function (event) {
    let notification = getClosest(event.target, '.notification');
    let notification_tags = [];

    if (notification !== null) {
        notification_tags.push(notification.getAttribute('notification_tags'));
    }
    console.log(notification);
    if (notification_tags.includes("Tutorial request sent") && notification_tags.length !== 0) {
        let this_notification = user_notifications.getNotificationDetailsById(notification.getAttribute('notification_id'));

        if (!this_notification.notification_opened) {
            this_notification.notification_opened = true;
            user_notifications.subtractUnreadNotifications();
            notification.parentNode.classList.remove("not_read");
            notification.parentNode.classList.add("read");
            access_route({notification_id: notification.getAttribute('notification_id')}, "set_notification_to_read", false);
            user_notifications.updateNotification(this_notification, notification.getAttribute('notification_id'))
        }

        customElements.get('nav-notification') || customElements.define('nav-notification', class NavNotification extends HTMLElement {
            connectedCallback() {
                this.innerHTML = `
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

                document.getElementById('do_something').addEventListener('click', function () {
                    alert("something")
                })
            }

            disconnectedCallback() {
                console.log('Custom square element removed from page.');
            }

            adoptedCallback() {
                console.log('Custom square element moved to new page.');
            }

            attributeChangedCallback() {
                console.log("Attribute changed?")
            }
        });

        nav_notifications.push('nav-notification'); 
        
    } else if (notification_tags.includes("Tutorial requested") && notification_tags.length !== 0) {
        let this_notification = user_notifications.getNotificationDetailsById(notification.getAttribute('notification_id'));

        if (!this_notification.notification_opened) {
            this_notification.notification_opened = true;
            user_notifications.subtractUnreadNotifications();
            notification.parentNode.classList.remove("not_read");
            notification.parentNode.classList.add("read");
            access_route({notification_id: notification.getAttribute('notification_id')}, "set_notification_to_read", false);
            user_notifications.updateNotification(this_notification, notification.getAttribute('notification_id'))
        }

        customElements.get('nav-notification-tutorial-requested') || customElements.define('nav-notification-tutorial-requested', class NavNotification extends HTMLElement {
            connectedCallback() {
                this.innerHTML = `
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

                document.getElementById('do_something').addEventListener('click', function () {
                    alert("something")
                })
            }

            disconnectedCallback() {
                console.log('Custom square element removed from page.');
            }

            adoptedCallback() {
                console.log('Custom square element moved to new page.');
            }

            attributeChangedCallback() {
                console.log("Attribute changed?")
            }
        });

        nav_notifications.push('nav-notification-tutorial-requested');
    }
});