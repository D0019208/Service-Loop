class Tutor_Tutorials extends User {
    constructor(tutor_tutorials, name, email, status, modules, socket) {
        super(name, email, status, modules, socket);

        this.all_tutor_tutorials = tutor_tutorials.response;

        //Check to see if there are any posts (If empty, there will be a string)
        if (typeof tutor_tutorials.response !== "string") {
            this.total_tutor_tutorials = this.all_tutor_tutorials.length;
 
            this.pending_tutor_tutorials = groupBy(this.all_tutor_tutorials, "In negotiation");
            this.ongoing_tutor_tutorials = groupBy(this.all_tutor_tutorials, "Ongoing");
            this.done_tutor_tutorials = groupBy(this.all_tutor_tutorials, "Done");
 
            this.total_tutor_pending_tutorials = this.pending_tutor_tutorials.length;
            this.total_tutor_ongoing_tutorials = this.ongoing_tutor_tutorials.length;
            this.total_tutor_done_tutorials = this.done_tutor_tutorials.length;
        } else {
            this.total_tutor_tutorials = 0;
             
            this.pending_tutor_tutorials = [];
            this.ongoing_tutor_tutorials = [];
            this.done_tutor_tutorials = [];
             
            this.total_tutor_pending_tutorials = 0;
            this.total_tutor_ongoing_tutorials = 0;
            this.total_tutor_done_tutorials = 0;
        }

        //For infinite loading 
        this.pending_tutor_tutorials_length = 0;
        this.ongoing_tutor_tutorials_length = 0;
        this.done_tutor_tutorials_length = 0;

        console.log(this.all_tutor_tutorials);
    }

    //GETTERS
    get_all_tutor_tutorials() {
        return this.all_tutor_tutorials;
    }

    get_total_tutor_tutorials() {
        return  this.total_tutor_tutorials;
    }

    get_open_tutor_tutorials() {
        return this.open_tutor_tutorials;
    }

    get_pending_tutor_tutorials() {
        return this.pending_tutor_tutorials;
    }

    get_ongoing_tutor_tutorials() {
        return this.ongoing_tutor_tutorials;
    }

    get_done_tutor_tutorials() {
        return this.done_tutor_tutorials;
    }

    set_open_tutor_tutorials(open_tutor_tutorials) {
        this.open_tutor_tutorials = open_tutor_tutorials;
    }

    set_pending_tutor_tutorials(pending_tutor_tutorials) {
        this.pending_tutor_tutorials = pending_tutor_tutorials;
    }

    set_get_ongoing_tutor_tutorials(ongoing_tutor_tutorials) {
        this.ongoing_tutor_tutorials = ongoing_tutor_tutorials;
    }

    set_done_tutor_tutorials(done_tutor_tutorials) {
        this.done_tutor_tutorials = done_tutor_tutorials;
    }

    //SETTERS
    set_all_tutor_tutorials(all_tutor_tutorials) {
        this.all_tutor_tutorials = all_tutor_tutorials;
    }

    set_total_tutor_tutorials(total_tutor_tutorials) {
        this.total_tutor_tutorials = total_tutor_tutorials;
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
            console.log(list)
            list.parentNode.insertBefore(el, list.previousSibling);
            //list.appendChild(el);

            tutorials_length += 1;
        }

        return tutorials_length;
    }

    getTutorTutorialDetailsById(post_id, tutorial_status) {
        //Why search all array when we can search induvidual array? More efficient this way
        if (tutorial_status === "In negotiation") {
            for (let i = 0; i < this.pending_tutor_tutorials.length; i++) {
                if (this.pending_tutor_tutorials[i]._id == post_id) {
                    return this.pending_tutor_tutorials[i];
                }
            }
        } else if (tutorial_status === "Ongoing") {
            for (let i = 0; i < this.ongoing_tutor_tutorials.length; i++) {
                if (this.ongoing_tutor_tutorials[i]._id == post_id) {
                    return this.ongoing_tutor_tutorials[i];
                }
            }
        } else {
            for (let i = 0; i < this.done_tutor_tutorials.length; i++) {
                if (this.done_tutor_tutorials[i]._id == post_id) {
                    return this.done_tutor_tutorials[i];
                }
            }
        } 
    }
    
    remove_tutorial_from_DOM(tutorial) {
        
    }
}