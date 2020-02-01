class Tutorials extends User {
    constructor(tutorials, name, email, status, modules, socket) {
        super(name, email, status, modules, socket);

        this.all_tutorials = tutorials.response;

        //Check to see if there are any posts (If empty, there will be a string)
        if (typeof tutorials.response !== "string") {
            this.total_tutorials = this.all_tutorials.length;

            this.open_tutorials = groupBy(this.all_tutorials, "Open");
            this.pending_tutorials = groupBy(this.all_tutorials, "In negotiation");
            this.ongoing_tutorials = groupBy(this.all_tutorials, "Ongoing");
            this.done_tutorials = groupBy(this.all_tutorials, "Done");

            this.total_open_tutorials = this.open_tutorials.length;
            this.total_pending_tutorials = this.pending_tutorials.length;
            this.total_ongoing_tutorials = this.ongoing_tutorials.length;
            this.total_done_tutorials = this.done_tutorials.length;
        } else {
            this.total_tutorials = 0;
            
            this.open_tutorials = [];
            this.pending_tutorials = [];
            this.ongoing_tutorials = [];
            this.done_tutorials = [];
            
            this.total_open_tutorials = 0;
            this.total_pending_tutorials = 0;
            this.total_ongoing_tutorials = 0;
            this.total_done_tutorials = 0;
        }

        //For infinite loading
        this.open_tutorials_length = 0;
        this.pending_tutorials_length = 0;
        this.ongoing_tutorials_length = 0;
        this.done_tutorials_length = 0;

        console.log(this.all_tutorials);
    }

    //GETTERS
    get_all_tutorials() {
        return this.all_tutorials;
    }

    get_total_tutorials() {
        return  this.total_tutorials;
    }

    get_open_tutorials() {
        return this.open_tutorials;
    }

    get_pending_tutorials() {
        return this.pending_tutorials;
    }

    get_ongoing_tutorials() {
        return this.ongoing_tutorials;
    }

    get_done_tutorials() {
        return this.done_tutorials;
    }

    set_open_tutorials(open_tutorials) {
        this.open_tutorials = open_tutorials;
    }

    set_pending_tutorials(pending_tutorials) {
        this.pending_tutorials = pending_tutorials;
    }

    set_get_ongoing_tutorials(ongoing_tutorials) {
        this.ongoing_tutorials = ongoing_tutorials;
    }

    set_done_tutorials(done_tutorials) {
        this.done_tutorials = done_tutorials;
    }

    //SETTERS
    set_all_tutorials(all_tutorials) {
        this.all_tutorials = all_tutorials;
    }

    set_total_tutorials(total_tutorials) {
        this.total_tutorials = total_tutorials;
    }

    appendPosts(number, list, tutorials_array, tutorials_length) {
        let tutorials = tutorials_array;
 
        const originalLength = tutorials_length;

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
                <ion-card class="test post" post_id="${tutorials[i + originalLength]._id}" post_modules="${tutorials[i + originalLength].post_modules.join(', ')}" post_status="${tutorials[i + originalLength].post_status}">
                        <ion-item lines="full">
                            <ion-avatar slot="start">
                                <img src="https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png">
                            </ion-avatar>
                            <ion-label>
                                <h2>${tutorials[i + originalLength].post_title}</h2>
                                <p>${formatDate(tutorials[i + originalLength].post_posted_on)}</p>
                            </ion-label>
                        </ion-item>
                        <ion-card-content>
                            ${tutorials[i + originalLength].post_desc_trunc}
                        </ion-card-content>
                        <ion-item>
                            <ion-chip class="module2" outline color="primary">
                                <ion-icon name="star"></ion-icon>
                                <ion-label>${tutorials[i + originalLength].post_modules.join(', ')}</ion-label>
                            </ion-chip>
                            <ion-button fill="outline" slot="end">View</ion-button>
                        </ion-item>
                        <ion-ripple-effect></ion-ripple-effect>
                    </ion-card> 
            
        `;
            list.parentNode.insertBefore(el, list.previousSibling);
            //list.appendChild(el);

            tutorials_length += 1;
        }

        return tutorials_length;
    }

    getTutorialDetailsById(post_id, tutorial_status) {
        //Why search all array when we can search induvidual array? More efficient this way
        if (tutorial_status === "Open") {
            for (let i = 0; i < this.open_tutorials.length; i++) {
                if (this.open_tutorials[i]._id == post_id) {
                    return this.open_tutorials[i];
                }
            }
        } else if (tutorial_status === "In negotiation") {
            for (let i = 0; i < this.pending_tutorials.length; i++) {
                if (this.pending_tutorials[i]._id == post_id) {
                    return this.pending_tutorials[i];
                }
            }
        } else if (tutorial_status === "Ongoing") {
            for (let i = 0; i < this.ongoing_tutorials.length; i++) {
                if (this.ongoing_tutorials[i]._id == post_id) {
                    return this.ongoing_tutorials[i];
                }
            }
        } else {
            for (let i = 0; i < this.done_tutorials.length; i++) {
                if (this.done_tutorials[i]._id == post_id) {
                    return this.done_tutorials[i];
                }
            }
        } 
    }
}