class Tutorials extends User {
    constructor(tutorials, name, email, status, modules, avatar, open_tutorials, pending_tutorials, ongoing_tutorials, done_tutorials, tutored_pending_tutorials, tutored_ongoing_tutorials, tutored_done_tutorials, socket) {
        super(name, email, status, modules, avatar, open_tutorials, pending_tutorials, ongoing_tutorials, done_tutorials, tutored_pending_tutorials, tutored_ongoing_tutorials, tutored_done_tutorials, socket);

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
    
    add_ongoing_post(post) {
        insert_to_array_by_index(this.ongoing_tutorials, 0, post)  ;
        this.total_ongoing_tutorials = this.ongoing_tutorials.length;
    }

    add_post_to_segment(segment, list, tutorial) { 
        console.log(list)
        const el = document.createElement('ion-list');
        el.className = "ion-activatable ripple";
        el.classList.add('ion-activatable', 'ripple', "not_read");

        el.innerHTML = `
                <ion-card class="test post" post_id="${tutorial._id}" post_modules="${tutorial.post_modules.join(', ')}" post_status="${tutorial.post_status}">
                        <ion-item lines="full">
                            <ion-avatar slot="start">
                                <img src="${tutorial.std_avatar}">
                            </ion-avatar>
                            <ion-label>
                                <p style="font-size:1em; color: black;">${tutorial.post_title}</p>
                                <p>${formatDate(tutorial.post_posted_on)}</p>
                            </ion-label>
                        </ion-item>
                        <ion-card-content>
                            ${tutorial.post_desc_trunc}
                        </ion-card-content>
                        <ion-item>
                            <ion-chip class="module2" outline color="primary">
                                <ion-icon name="star"></ion-icon>
                                <ion-label>${tutorial.post_modules.join(', ')}</ion-label>
                            </ion-chip>
                            <ion-button fill="outline" slot="end">View</ion-button>
                        </ion-item>
                        <ion-ripple-effect></ion-ripple-effect>
                    </ion-card> 
            
        `;

        list.parentNode.insertBefore(el, list.nextSibling);

        if (segment == "Open") {
            if (this.total_open_tutorials > 0) {
                document.getElementById('open_tutorials_header').innerText = "OPEN TUTORIALS";
                document.getElementById('open_badge').innerText = this.total_open_tutorials;
            }
        } else if (segment == "Pending") {
            if (this.total_pending_tutorials > 0) {
                document.getElementById('pending_tutorials_header').innerText = "PENDING TUTORIALS";
                document.getElementById('pending_badge').innerText = this.total_pending_tutorials;
            }
        } else if (segment == "Ongoing") { 
            if (this.total_ongoing_tutorials > 0) {
                document.getElementById('ongoing_tutorials_header').innerText = "ONGOING TUTORIALS";
                document.getElementById('ongoing_badge').innerText = this.total_ongoing_tutorials;
            }
        } else {
            if (this.total_done_tutorials > 0) {
                document.getElementById('done_tutorials_header').innerText = "DONE TUTORIALS";
                document.getElementById('done_badge').innerText = this.total_done_tutorials;
            }
        }
    }

    remove_tutorial_by_id(array, id) {
        array = array.filter(function (obj) {
            return obj._id !== id;
        });
    }

    appendPosts(number, list, tutorials_array, tutorials_length) {
        console.log("=============")
        console.log(tutorials_array)
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
            el.setAttribute('onClick', 'device_feedback()'); 
            el.innerHTML = `
                <ion-card class="test post" post_id="${tutorials[i + originalLength]._id}" post_modules="${tutorials[i + originalLength].post_modules.join(', ')}" post_status="${tutorials[i + originalLength].post_status}">
                        <ion-item lines="full">
                            <ion-avatar slot="start">
                                <img src="${tutorials[i + originalLength].std_avatar}">
                            </ion-avatar>
                            <ion-label>
                                <p style="font-size:1em; color: black;">${tutorials[i + originalLength].post_title}</p>
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

    remove_tutorial_from_DOM(segment, response, this_tutorial) {
        let container;
        let total_tutorials;
        let tutorial_id;
        let tutorial;

        if (segment == "Open") {
            container = document.getElementById('open');

            if (container) {
                total_tutorials = this.total_open_tutorials;

                if (total_tutorials > 0) {
                    tutorial_id = response.updated_tutorial._id;
                    tutorial = container.querySelector('[post_id="' + tutorial_id + '"]');

                    if (total_tutorials == 1) {
                        document.getElementById('open_tutorials_header').innerText = "NO PENDING TUTORIALS";
                    }

                    this.total_open_tutorials--;

                    document.getElementById("open_badge").innerText = this.total_open_tutorials;

                    this.open_tutorials = this.open_tutorials.filter(e => e !== this_tutorial);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_open_tutorials--;
                    this.open_tutorials = this.open_tutorials.filter(e => e !== this_tutorial);
                }
            }
        } else if (segment == "Pending") {
            container = document.getElementById('pending');

            if (container) {
                total_tutorials = this.total_pending_tutorials;

                if (total_tutorials > 0) {
                    tutorial_id = response.updated_tutorial._id;
                    tutorial = container.querySelector('[post_id="' + tutorial_id + '"]');

                    if (total_tutorials == 1) {
                        document.getElementById('pending_tutorials_header').innerText = "NO PENDING TUTORIALS";
                    }

                    this.total_pending_tutorials--;

                    document.getElementById("pending_badge").innerText = this.total_pending_tutorials;

                    this.pending_tutorials = this.pending_tutorials.filter(e => e !== this_tutorial);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_pending_tutorials--;
                    this.pending_tutorials = this.pending_tutorials.filter(e => e !== this_tutorial);
                }
            }
        } else if (segment == "Ongoing") {
            container = this.total_tutor_ongoing_tutorials;

            if (container) {
                total_tutorials = container.querySelectorAll('.test').length;

                if (total_tutorials > 0) {
                    tutorial_id = response.updated_tutorial._id;
                    tutorial = container.querySelector('[post_id="' + tutorial_id + '"]');

                    if (total_tutorials == 1) {
                        document.getElementById('ongoing_tutor_tutorials_header').innerText = "NO ONGOING TUTORIALS";
                    }

                    this.total_tutor_ongoing_tutorials--;

                    document.getElementById("ongoing_tutorials_badge").innerText = this.total_tutor_ongoing_tutorials;

                    this.ongoing_tutor_tutorials = this.ongoing_tutor_tutorials.filter(e => e !== this_tutorial);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_tutor_ongoing_tutorials--;
                    this.ongoing_tutor_tutorials = this.ongoing_tutor_tutorials.filter(e => e !== this_tutorial);
                }
            }
        } else {
            container = document.getElementById('tutor_tutorials_done');

            if (container) {
                total_tutorials = this.total_tutor_done_tutorials;

                if (total_tutorials > 0) {
                    tutorial_id = response.updated_tutorial._id;
                    tutorial = container.querySelector('[post_id="' + tutorial_id + '"]');

                    if (total_tutorials == 1) {
                        document.getElementById('done_tutor_tutorials_header').innerText = "NO DONE TUTORIALS";
                    }

                    this.total_tutor_done_tutorials--;

                    document.getElementById("done_tutorials_badge").innerText = this.total_tutor_done_tutorials;

                    this.done_tutor_tutorials = this.done_tutor_tutorials.filter(e => e !== this_tutorial);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_tutor_done_tutorials--;
                    this.done_tutor_tutorials = this.done_tutor_tutorials.filter(e => e !== this_tutorial);
                }
            }
        }

        console.log(tutorial);
        tutorial.parentNode.remove();
    }

    update_my_tutorial(segment, updated_tutorial) {
        console.log("Updating...");
        console.log(updated_tutorial);

        if (segment === "Open") {
            console.log(this.open_tutorials);

            for (let i = 0; i < this.open_tutorials.length; i++) {
                if (this.open_tutorials[i]._id === updated_tutorial._id) {
                    this.open_tutorials[i] = updated_tutorial;
                }
            }

            console.log(this.open_tutorials);
        } else if (segment === "Pending") {
            console.log(this.pending_tutorials);

            for (let i = 0; i < this.pending_tutorials.length; i++) {
                if (this.pending_tutorials[i]._id === updated_tutorial._id) {
                    this.pending_tutorials[i] = updated_tutorial;
                }
            }

            console.log(this.pending_tutorials);
        }
    }
}