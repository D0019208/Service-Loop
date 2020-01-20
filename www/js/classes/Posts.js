class Posts extends User {
    constructor(posts, name, email, status, modules, socket) {
        super(name, email, status, modules, socket);

        this.all_posts = posts;
        
        //Check to see if there are any posts (If empty, there will be a string)
        if (typeof posts !== "string") {
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
}