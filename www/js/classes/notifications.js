class Notifications extends User {
    constructor(id, notifications, name, email, status, modules, avatar, open_tutorials, pending_tutorials, ongoing_tutorials, done_tutorials, tutored_pending_tutorials, tutored_ongoing_tutorials, tutored_done_tutorials, socket) {
        super(id, name, email, status, modules, avatar, open_tutorials, pending_tutorials, ongoing_tutorials, done_tutorials, tutored_pending_tutorials, tutored_ongoing_tutorials, tutored_done_tutorials, 0, socket);

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
    }

    update_with_new_notifications(all_notifications) {
        this.all_notifications = all_notifications;

        if (typeof all_notifications !== "string") {
            let unopened_notifications_counter = 0;
            for (let i = 0; i < this.all_notifications.length; i++) {
                if (!this.all_notifications[i]["notification_opened"]) {
                    unopened_notifications_counter++;
                }
            }

            this.total_notifications = this.all_notifications.length;
            this.unread_notifications = unopened_notifications_counter;

            document.getElementById('notifications_header').innerText = "NOTIFICATIONS";

            if (!document.getElementById('new_notifications')) {
                this.addUnreadNotificationsToDOM();
            }
        } else {
            this.total_notifications = 0;
            this.unread_notifications = 0;
        }

        this.notifications_length = 0;

        document.getElementById('list').innerHTML = "";

        if (this.total_notifications > 3) {
            this.appendNotifications(3, document.getElementById('list'));
        } else {
            this.appendNotifications(this.total_notifications, document.getElementById('list'));
        }

        this.addUnreadNotificationsToBadge(this.unread_notifications);
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

    append_unique_notifications(all_notifications) {
        let context = this;

        //Get all new notifications
        let new_notifications = all_notifications.filter(new_notification => context.all_notifications.map(old_notification => old_notification._id).indexOf(new_notification._id) === -1);

        new_notifications.filter((notification) => {
            context.addToNotifications(notification);
        });
    }

    addToTotalNotifications() {
        this.total_notifications++;
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

    getNotifications() {
        return this.notifications;
    }

    getNotificationDetailsById(id) {
        for (let i = 0; i < this.all_notifications.length; i++) {
            if (this.all_notifications[i]._id == id) {
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

    deleteNotifications() {
        document.getElementById("list").innerHTML = "";
    }

    addToNotifications(notification) {
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
            <p class="notification_title">${notification.notification_title}</p>
            <span class="notification_date">${formatDate(notification.notification_posted_on)}</span>
            <p class="notification_desc">${notification.notification_desc_trunc}</p>
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
        if (!this.unread_notifications == 0 && !document.getElementById("new_notifications")) {

            let notifications_icon = document.querySelector("[name='notifications']");

            let notification_badge = document.createElement("ion-badge");
            notification_badge.color = "danger";
            notification_badge.id = "new_notifications";
            notification_badge.innerText = this.unread_notifications;


            notification_badge.appendAfter(notifications_icon);
        } else {
            return "No new notifications!";
        }
    }

    addUnreadNotificationsToBadge(unread_notifications) {
        if (document.getElementById("new_notifications")) {
            document.getElementById("new_notifications").innerText = unread_notifications;
        }
    }

    //Add the notifications 
    appendNotifications(number, list) {
        let notifications = this.getAllNotifications();
        const originalLength = this.notifications_length;
        let read_class;

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
            <p class="notification_title">${notifications[i + originalLength].notification_title}</p>
            <span class="notification_date">${formatDate(notifications[i + originalLength].notification_posted_on)}</span>
            <p class="notification_desc">${notifications[i + originalLength].notification_desc_trunc}</p>
        </ion-label>
            </ion-item>
            <ion-ripple-effect></ion-ripple-effect>
            
        `;
            list.appendChild(el);

            this.notifications_length += 1;
        }
    }

    sendTutorialFinished(notification, post) {
        this.socket.emit('finish_tutorial', {the_notification: notification, the_post: post});
    }

    sendTutorialCanceledNotification(notification, post) {
        this.socket.emit('cancel_tutorial', {the_notification: notification, the_post: post});
    }

    removeOpenPost(post) {
        this.socket.emit('remove_open_post', {the_post: post});
    }

    sendNewNotification(notification, post) {
        this.socket.emit('send_notification', {the_notification: notification, the_post: post});
    }

    sendBeginTutorialNotification(notification, post) {
        this.socket.emit('begin_tutorial', {the_notification: notification, the_post: post});
    }

    sendTutorialAcceptedNotification(notification, post) {
        this.socket.emit('tutorial_request_accepted', {the_notification: notification, the_post: post});
    }

    sendAgreementGeneratedNotification(notification, post) {
        this.socket.emit('agreement_generated', {the_notification: notification, the_post: post});
    }

    sendAgreementRejectedNotification(notification, post) {
        this.socket.emit('agreement_rejected', {the_notification: notification, the_post: post});
    }

    sendAgreementAcceptedNotification(notification, post) {
        this.socket.emit('agreement_accepted', {the_notification: notification, the_post: post});
    }

    sendRateTutor(post, rating) {
        this.socket.emit('send_rate_tutor', {the_rating: rating, the_post: post});
    }

    wait_for_agreement_rejected() {
        let socket = this.socket;

        socket.on('agreement_rejected_tutor', (data) => {
            if (!localhost) {
                window.plugins.deviceFeedback.haptic();
            }

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

            create_toast("A tutorial agreement has been rejected!", "dark", 3000, toast_buttons);
            new_message_ping.play();
            tutor_tutorials.update_tutorial("Pending", data.post);
            posts.replace_notification_posts(data.post);

            if (typeof notification_posts !== 'undefined') {
                notification_posts = notification_posts.filter(function (obj) {
                    return obj._id !== data.post._id;
                });

                notification_posts.push(data.post);
            }

            this.addToNotifications(data.response);
        });

        socket.on('agreement_accepted_tutor', (data) => {
            user.setPendingTutoredTutorials(user.getPendingTutoredTutorials() - 1);
            user.setOngoingTutoredTutorials(user.getOngoingTutoredTutorials() + 1);

            if (!localhost) {
                window.plugins.deviceFeedback.haptic();
            }

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

            create_toast("A tutorial agreement has been accepted!", "dark", 3000, toast_buttons);
            new_message_ping.play();

            //PROBLEM HERE, Cannot read property 'parentNode' of undefined, TUTOR_TUTORIAL LINE 300
            tutor_tutorials.remove_tutor_tutorial_from_DOM("Pending", {updated_tutorial: {_id: data.post._id}}, data.post);
            tutor_tutorials.add_tutorial_to_DOM("Ongoing", data.post)
            posts.replace_notification_posts(data.post);

            if (typeof notification_posts !== 'undefined') {
                notification_posts = notification_posts.filter(function (obj) {
                    return obj._id !== data.post._id;
                });

                notification_posts.push(data.post);
            }

            this.addToNotifications(data.response);
        });
    }

    waitForNewNotifications() {
        let socket = this.socket;

        socket.on('remove_open_post', (data) => {
            if (!localhost) {
                window.plugins.deviceFeedback.haptic();
            }

            new_message_ping.play();
            posts.removePostById(data.post._id);
            posts.removeNotificationPostByPostId(data.post._id);

            if (typeof notification_posts !== 'undefined') {
                notification_posts = notification_posts.filter(function (obj) {
                    return obj._id !== data.post._id;
                });
            }
        });

        socket.on('new_notification', (data) => {
            if (!localhost) {
                window.plugins.deviceFeedback.haptic();
            }

            new_message_ping.play();
            posts.replace_notification_posts(data.post);

            if (typeof notification_posts !== 'undefined') {
                notification_posts = notification_posts.filter(function (obj) {
                    return obj._id !== data.post._id;
                });

                notification_posts.push(data.post);
            }

            this.addToNotifications(data.response);
        });

        socket.on('tutorial_has_finished', (data) => {
            user.setOngoingTutorials(user.getOngoingTutorials() - 1);
            user.setDoneTutorials(user.getDoneTutorials() + 1);

            if (!localhost) {
                window.plugins.deviceFeedback.haptic();
            }

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

            create_toast("A tutorial has finished!", "dark", 3000, toast_buttons);
            new_message_ping.play();

            posts.replace_notification_posts(data.post);

            tutorials.remove_tutorial_from_DOM("Ongoing", {updated_tutorial: {_id: data.post._id}}, data.post);

            tutorials.add_post_to_segment("Done", document.getElementById('done_tutorials_header'), data.post);

            posts.replace_notification_posts(data.post);

            if (typeof notification_posts !== 'undefined') {
                notification_posts = notification_posts.filter(function (obj) {
                    return obj._id !== data.post._id;
                });

                notification_posts.push(data.post);
            }

            this.addToNotifications(data.response);
        });

        socket.on('tutorial_has_begun', (data) => {
            if (!localhost) {
                window.plugins.deviceFeedback.haptic();
            }

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

            create_toast("A tutorial has been begun!", "dark", 3000, toast_buttons);
            new_message_ping.play();

            tutorials.update_my_tutorial("Ongoing", data.post);

            posts.replace_notification_posts(data.post);

            if (typeof notification_posts !== 'undefined') {
                notification_posts = notification_posts.filter(function (obj) {
                    return obj._id !== data.post._id;
                });

                notification_posts.push(data.post);
            }

            this.addToNotifications(data.response);
        });

        socket.on('add_tutorial_request_accepted_notification', (data) => {
            if (!localhost) {
                window.plugins.deviceFeedback.haptic();
            }

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

            user.setOpenTutorials(user.getOpenTutorials() - 1);
            user.setPendingTutorials(user.getPendingTutorials() + 1);

            create_toast("A tutorial has been accepted!", "dark", 3000, toast_buttons);
            new_message_ping.play();
            posts.replace_notification_posts(data.post);
            tutorials.remove_tutorial_from_DOM("Open", {updated_tutorial: {_id: data.post._id}}, data.post);
            tutorials.add_post_to_segment("Pending", document.getElementById('pending_tutorials_header'), data.post);

            this.addToNotifications(data.response);
        });

        socket.on('add_agreement_created_notification', (data) => {
            if (!localhost) {
                window.plugins.deviceFeedback.haptic();
            }

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

            create_toast("A new agreement has been created!", "dark", 3000, toast_buttons);
            new_message_ping.play();

            posts.replace_notification_posts(data.post);

            tutorials.update_my_tutorial("Pending", data.post);

            this.addToNotifications(data.response);
        });

        socket.on('tutorial_has_been_canceled', (data) => {
            if (!localhost) {
                window.plugins.deviceFeedback.haptic();
            }

            if (tutorial.post_status == "Open") {
                if (user.getEmail() !== tutorial.post_tutor_email) {
                    user.setOpenTutorials(user.getOpenTutorials() - 1);
                }
            } else if (tutorial.post_status == "Pending" || tutorial.post_status == "In negotiation") {
                if (user.getEmail() !== tutorial.post_tutor_email) {
                    user.setPendingTutorials(user.getPendingTutorials() - 1);
                } else {
                    user.setPendingTutoredTutorials(user.getPendingTutoredTutorials() - 1);
                }
            } else if (tutorial.post_status == "Ongoing") {
                if (user.getEmail() !== tutorial.post_tutor_email) {
                    user.setOngoingTutorials(user.getOngoingTutorials() - 1);
                } else {
                    user.setOngoingTutoredTutorials(user.getOngoingTutoredTutorials() - 1);
                }
            }

            let status = data.post.post_status;

            if (status == "In negotiation") {
                status = "Pending";
            }

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

            create_toast("A tutorial has been canceled!", "dark", 3000, toast_buttons);
            new_message_ping.play();

            if (user.getEmail() == data.post.std_email) {
                tutorials.remove_tutorial_from_DOM(status, {updated_tutorial: {_id: data.post._id}}, data.post);
            } else {
                tutor_tutorials.remove_tutor_tutorial_from_DOM(status, {updated_tutorial: {_id: data.post._id}}, data.post);
            }

            posts.removeNotificationPostByPostId(data.post._id);

            if (typeof notification_posts !== 'undefined') {
                notification_posts = notification_posts.filter(function (obj) {
                    return obj._id !== data.post._id;
                });
            }

            this.addToNotifications(data.response);
        });

        socket.on('tutor_update_rating', (data) => {
            if (!localhost) {
                window.plugins.deviceFeedback.haptic();
            }

            new_message_ping.play();
            posts.replace_notification_posts(data.post);
            tutor_tutorials.update_tutorial("Done", data.post);

            if (typeof notification_posts !== 'undefined') {
                notification_posts = notification_posts.filter(function (obj) {
                    return obj._id !== data.post._id;
                });

                notification_posts.push(data.post);
            }

            user.tutor_rating = data.rating;

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

            create_toast("You have been rated!", "dark", 3000, toast_buttons);
        });
    }
}