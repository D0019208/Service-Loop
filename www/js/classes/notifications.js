class Notifications extends User {
    constructor(notifications, name, email, status, modules, socket) {
        super(name, email, status, modules, socket);

        this.all_notifications = notifications;

        if (typeof notifications !== "string") {
            let unopened_notifications_counter = 0;
            for (let i = 0; i < this.all_notifications.length; i++) {
                if (!this.all_notifications[i]["notification_opened"]) {
                    unopened_notifications_counter++;
                }
            }

            this.total_notifications = this.all_notifications.length;
            this.unread_notifications = unopened_notifications_counter;
        } else {
            this.total_notifications = 0;
            this.unread_notifications = 0;
        }
        
        this.notifications_length = 0;
        console.log(this.all_notifications);
    }
    
    find_unopened_notifications_number() {
        if (typeof notifications !== "string") {
            let unopened_notifications_counter = 0;
            for (let i = 0; i < this.all_notifications.length; i++) {
                if (!this.all_notifications[i]["notification_opened"]) {
                    unopened_notifications_counter++;
                }
            } 
            
            return unopened_notifications_counter;
        } else {
            return 0;
        }
    }
    
    addToTotalNotifications() {
        console.log("Total nots = " + this.total_notifications)
        this.total_notifications++;
        console.log("Total nots after add = " + this.total_notifications)
    }

    setTotalNotifications(total_notifications) {
        this.total_notifications = total_notifications;
    }

    getTotalNotifications() {
        return this.total_notifications;
    } 
    
    subtractUnreadNotifications() {
        if (this.unread_notifications != 0) {
            this.unread_notifications--;

            if (this.unread_notifications == 0) {
                document.getElementById("new_notifications").remove();
            } else {
                document.getElementById("new_notifications").innerText = this.unread_notifications;
            }
        }
    }

    getUnreadNotifications() {
        return this.unread_notifications;
    }

    addUnreadNotifications() {
        this.unread_notifications++;

        if (this.unread_notifications == 1) {
            this.addUnreadNotificationsToDOM();
        }

        document.getElementById("new_notifications").innerText = this.unread_notifications;
    }

    setAllNotifications(all_notifications) {
        this.all_notifications = all_notifications;
    }

    getAllNotifications() {
        return this.all_notifications;
    }

    setUnreadNotifications(unread_notifications) {
        this.unread_notifications = unread_notifications;
    }

    getUnreadNotifications() {
        return this.notifications;
    }

    getNotificationDetailsById(id) {
        console.log(id)
        console.log(this.all_notifications)
        for (let i = 0; i < this.all_notifications.length; i++) {
            if (this.all_notifications[i]._id == id) {
                console.log(this.all_notifications[i])
                return this.all_notifications[i];
            }
        }
    }

    updateNotification(notification, id) {
        for (let i = 0; i < this.all_notifications.length; i++) {
            if (this.all_notifications[i]._id == id) {

                this.all_notifications[i] = notification;
                return "Update successfull";
            }
        }
    }

    addToNotifications(notification) {
        console.log("A notification")
        console.log(notification);
         
        if (this.all_notifications == "There are no notifications to display!") {
            this.all_notifications = [notification];
        } else {
            insert_to_array_by_index(this.all_notifications, 0, notification) 
        }
        
        //Increase count of total notifications
        this.addToTotalNotifications(); 
        
        if (document.getElementById('list') != null) {
            document.getElementById("notifications_header").innerText = "NOTIFICATIONS"; 
            
            this.addUnreadNotifications();
            const el = document.createElement('ion-list');
            el.classList.add('ion-activatable', 'ripple', 'not_read');
            el.innerHTML = `
                
                <ion-item lines="none" class="notification" notification_id="${notification._id}" post_id="${notification.post_id}" notification_tags="${notification.notification_tags.join(', ')}">
          <ion-avatar slot="start">
            <img src="${notification.notification_avatar}">
        </ion-avatar>
        <ion-label>
            <h2>${notification.notification_title}</h2>
            <span>${formatDate(notification.notification_posted_on)}</span>
            <p>${notification.notification_desc_trunc}</p>
        </ion-label>
            </ion-item>
            <ion-ripple-effect></ion-ripple-effect>
            
        `;
            document.getElementById('list').prepend(el);
        } else {
            this.addUnreadNotifications();
        }

    }

    addUnreadNotificationsToDOM() {
        if (!this.unread_notifications == 0) {

            let notifications_icon = document.querySelector("[name='notifications']");

            let notification_badge = document.createElement("ion-badge");
            notification_badge.color = "danger";
            notification_badge.id = "new_notifications";
            notification_badge.innerText = this.unread_notifications;


            notification_badge.appendAfter(notifications_icon);
        } else {
            return "No new notifications!"
        }
    }
    
    addUnreadNotificationsToBadge(unread_notifications) {
        if(!document.getElementById("new_notifications").length) {
            document.getElementById("new_notifications").innerText = unread_notifications;
        }
    }
    
    //Add the notifications 
    appendNotifications(number, list) {
        let notifications = this.getAllNotifications();
        
        console.log('length is', this.notifications_length);
        const originalLength = this.notifications_length;
        let read_class;
        console.log(notifications)
        for (var i = 0; i < number; i++) {
            const el = document.createElement('ion-list');
            
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
            <span>${formatDate(notifications[i + originalLength].notification_posted_on)}</span>
            <p>${notifications[i + originalLength].notification_desc_trunc}</p>
        </ion-label>
            </ion-item>
            <ion-ripple-effect></ion-ripple-effect>
            
        `;
            list.appendChild(el);
            
            this.notifications_length += 1;
        }
    }  
    
    sendNewNotification(notification) {
        this.socket.emit('send_notification', notification);
    }
    
    sendTutorialAcceptedNotification(notification, post) {
        this.socket.emit('tutorial_request_accepted', {the_notification: notification, the_post: post});
    }

    waitForNewNotifications() {
        let socket = this.socket;

        socket.on('new_notification', (data) => { 
            //window.plugins.deviceFeedback.haptic();
            this.addToNotifications(data.response);
            console.log(data);
        }); 
        
        socket.on('add_tutorial_request_accepted_notification', (data) => { 
            posts.replace_notification_posts(data.post); 
            
            //window.plugins.deviceFeedback.haptic();
            this.addToNotifications(data.response); 
            
            console.log(data);
        });

        socket.on('news', function (data) {
            console.log(data);
        });
    }
}