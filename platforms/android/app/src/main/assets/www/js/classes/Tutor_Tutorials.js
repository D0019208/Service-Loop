class Tutor_Tutorials extends User {
    constructor(id, tutor_tutorials, name, email, status, modules, avatar, open_tutorials, pending_tutorials, ongoing_tutorials, done_tutorials, tutored_pending_tutorials, tutored_ongoing_tutorials, tutored_done_tutorials, socket) {
        super(id, name, email, status, modules, avatar, open_tutorials, pending_tutorials, ongoing_tutorials, done_tutorials, tutored_pending_tutorials, tutored_ongoing_tutorials, tutored_done_tutorials, 0, socket);

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
    }

    refresh_tutor_tutorials(tutor_tutorials, active_tutor_segment) {
        //this.add_refreshed_tutor_tutorials(tutor_tutorials.response, active_tutor_segment);

        this.all_tutor_tutorials = tutor_tutorials.response;

        this.total_tutor_tutorials = this.all_tutor_tutorials.length;

        this.pending_tutor_tutorials = groupBy(this.all_tutor_tutorials, "In negotiation");
        this.ongoing_tutor_tutorials = groupBy(this.all_tutor_tutorials, "Ongoing");
        this.done_tutor_tutorials = groupBy(this.all_tutor_tutorials, "Done");

        this.total_tutor_pending_tutorials = this.pending_tutor_tutorials.length;
        this.total_tutor_ongoing_tutorials = this.ongoing_tutor_tutorials.length;
        this.total_tutor_done_tutorials = this.done_tutor_tutorials.length;

        this.pending_tutor_tutorials_length = 0;
        this.ongoing_tutor_tutorials_length = 0;
        this.done_tutor_tutorials_length = 0;

        this.add_refreshed_tutor_tutorials();
    }

    add_refreshed_tutor_tutorials() {
        let all_pending_elements = [].slice.call(document.getElementById('tutor_tutorials_pending').getElementsByTagName("ion-list"));
        let all_ongoing_elements = [].slice.call(document.getElementById('tutor_tutorials_ongoing').getElementsByTagName("ion-list"));
        let all_done_elements = [].slice.call(document.getElementById('tutor_tutorials_done').getElementsByTagName("ion-list"));
        
        tutor_tutorials_pending_loaded = true;
        tutor_tutorials_ongoing_loaded = true;
        tutor_tutorials_done_loaded = true;

        for (let i = 0; i < all_pending_elements.length; i++) {
            all_pending_elements[i].remove();
        }

        for (let i = 0; i < all_ongoing_elements.length; i++) {
            all_ongoing_elements[i].remove();
        }

        for (let i = 0; i < all_done_elements.length; i++) {
            all_done_elements[i].remove();
        }

        document.getElementById('pending_tutorials_badge').innerText = this.get_pending_tutor_tutorials().length;
        if (this.get_pending_tutor_tutorials().length > 0) {
            document.getElementById('pending_tutor_tutorials_header').innerText = "PENDING TUTORIALS";
        } else {
            document.getElementById('pending_tutor_tutorials_header').innerText = "NO PENDING TUTORIALS";
        }

        if (this.get_pending_tutor_tutorials().length <= 4) {
            this.pending_tutor_tutorials_length = this.appendPosts(this.get_pending_tutor_tutorials().length, document.getElementById('pending-tutorials-infinite-scroll'), this.pending_tutor_tutorials, this.pending_tutor_tutorials_length);
        } else {
            this.pending_tutor_tutorials_length = this.appendPosts(4, document.getElementById('pending-tutorials-infinite-scroll'), this.pending_tutor_tutorials, this.pending_tutor_tutorials_length);
        }

        document.getElementById('ongoing_tutorials_badge').innerText = this.get_ongoing_tutor_tutorials().length;
        if (this.get_ongoing_tutor_tutorials().length > 0) {
            document.getElementById('ongoing_tutor_tutorials_header').innerText = "ONGOING TUTORIALS";
        } else {
            document.getElementById('ongoing_tutor_tutorials_header').innerText = "NO ONGOING TUTORIALS";
        }

        if (this.get_ongoing_tutor_tutorials().length <= 4) {
            this.ongoing_tutor_tutorials_length = this.appendPosts(this.get_ongoing_tutor_tutorials().length, document.getElementById('ongoing-tutorials-infinite-scroll'), this.ongoing_tutor_tutorials, this.ongoing_tutor_tutorials_length);
        } else {
            this.ongoing_tutor_tutorials_length = this.appendPosts(4, document.getElementById('ongoing-tutorials-infinite-scroll'), this.ongoing_tutor_tutorials, this.ongoing_tutor_tutorials_length);
        }

        document.getElementById('done_tutorials_badge').innerText = this.get_done_tutor_tutorials().length;
        if (this.get_done_tutor_tutorials().length > 0) {
            document.getElementById('done_tutor_tutorials_header').innerText = "DONE TUTORIALS";
        } else {
            document.getElementById('done_tutor_tutorials_header').innerText = "NO DONE TUTORIALS";
        }

        if (this.get_done_tutor_tutorials().length <= 4) {
            this.done_tutor_tutorials_length = this.appendPosts(this.get_done_tutor_tutorials().length, document.getElementById('done-tutorials-infinite-scroll'), this.done_tutor_tutorials, this.done_tutor_tutorials_length);
        } else {
            this.done_tutor_tutorials_length = this.appendPosts(4, document.getElementById('done-tutorials-infinite-scroll'), this.done_tutor_tutorials, this.done_tutor_tutorials_length);
        }
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

    add_tutorial_to_tutor_tutorials(tutorial) {
        if (tutorial.post_status == "In negotiation") {
            this.pending_tutor_tutorials.push(tutorial);
            this.total_tutor_pending_tutorials = this.pending_tutor_tutorials.length;

            if (document.getElementById('tutor_tutorials_pending') !== null && typeof document.getElementById('tutor_tutorials_pending') !== 'undefined') {
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

                this.pending_tutor_tutorials_length++;
                document.getElementById('pending-tutorials-infinite-scroll').parentNode.insertBefore(el, document.getElementById('pending-tutorials-infinite-scroll').nextSibling);
            }
        }
    }

    appendPosts(number, list, tutorials_array, tutorials_length) {
        let tutorials = tutorials_array;
        const originalLength = tutorials_length;

        for (var i = 0; i < number; i++) {
            const el = document.createElement('ion-list');
            el.className = "ion-activatable ripple";
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

    remove_tutor_tutorial_from_DOM(segment, response, this_tutorial) {
        let container;
        let total_tutorials;
        let tutorial_id;
        let tutorial;

        if (segment == "Pending") {
            container = document.getElementById('tutor_tutorials_pending');

            if (container) {
                total_tutorials = this.total_tutor_pending_tutorials;

                if (total_tutorials > 0) {
                    tutorial_id = response.updated_tutorial._id;
                    tutorial = container.querySelector('[post_id="' + tutorial_id + '"]');

                    if (total_tutorials == 1) {
                        document.getElementById('pending_tutor_tutorials_header').innerText = "NO PENDING TUTORIALS";
                    }

                    this.total_tutor_pending_tutorials--;

                    document.getElementById("pending_tutorials_badge").innerText = this.total_tutor_pending_tutorials;

                    this.pending_tutor_tutorials = this.pending_tutor_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_tutor_pending_tutorials--;
                    this.pending_tutor_tutorials = this.pending_tutor_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            }
        } else if (segment == "Ongoing") {
            container = document.getElementById('tutor_tutorials_ongoing');

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

                    this.ongoing_tutor_tutorials = this.ongoing_tutor_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_tutor_ongoing_tutorials--;
                    this.ongoing_tutor_tutorials = this.ongoing_tutor_tutorials.filter(e => e._id !== this_tutorial._id);
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

                    this.done_tutor_tutorials = this.done_tutor_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_tutor_done_tutorials--;
                    this.done_tutor_tutorials = this.done_tutor_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            }
        }

        if (typeof tutorial !== 'undefined' && tutorial !== null) {
            tutorial.parentNode.remove();
        }
    }

    add_tutorial_to_DOM(segment, this_tutorial, refresh = false) {
        let container;
        let append_to;
        let total_tutorials;
        let tutorial = document.createElement('ion-list');
        tutorial.className = "ion-activatable ripple";

        tutorial.classList.add('ion-activatable', 'ripple', "not_read");
        tutorial.setAttribute('onClick', 'device_feedback()');
        tutorial.innerHTML = `
                <ion-card class="test post" post_id="${this_tutorial._id}" post_modules="${this_tutorial.post_modules.join(', ')}" post_status="${this_tutorial.post_status}">
                        <ion-item lines="full">
                            <ion-avatar slot="start">
                                <img src="${this_tutorial.std_avatar}">
                            </ion-avatar>
                            <ion-label>
                                <p style="font-size:1em; color: black;">${this_tutorial.post_title}</p>
                                <p>${formatDate(this_tutorial.post_posted_on)}</p>
                            </ion-label>
                        </ion-item>
                        <ion-card-content>
                            ${this_tutorial.post_desc_trunc}
                        </ion-card-content>
                        <ion-item>
                            <ion-chip class="module2" outline color="primary">
                                <ion-icon name="star"></ion-icon>
                                <ion-label>${this_tutorial.post_modules.join(', ')}</ion-label>
                            </ion-chip>
                            <ion-button fill="outline" slot="end">View</ion-button>
                        </ion-item>
                        <ion-ripple-effect></ion-ripple-effect>
                    </ion-card>  
            `;

        if (segment == "Pending") {
            append_to = document.getElementById('pending-tutorials-infinite-scroll');
            container = document.getElementById('tutor_tutorials_pending');

            if (container) {
                //total_tutorials = this.total_tutor_pending_tutorials;

                //if (total_tutorials > 0) {
                //if (total_tutorials == 0) {
                document.getElementById('pending_tutor_tutorials_header').innerText = "PENDING TUTORIALS";
                //}

                this.total_tutor_pending_tutorials++;

                document.getElementById("pending_tutorials_badge").innerText = this.total_tutor_pending_tutorials;

                this.pending_tutor_tutorials.push(this_tutorial);
                //}
            } else {
                //if (total_tutorials > 0) {
                this.total_tutor_pending_tutorials++;
                this.pending_tutor_tutorials.push(this_tutorial);
                //}
            }

            if (document.getElementById('tutor_tutorials_peding') !== null && this.pending_tutor_tutorials_length !== 4 || refresh) {
                append_to.parentNode.insertBefore(tutorial, append_to.previousSibling);
                this.pending_tutor_tutorials_length++;
            }
        } else if (segment == "Ongoing") {
            append_to = document.getElementById('ongoing-tutorials-infinite-scroll');
            container = document.getElementById('tutor_tutorials_ongoing');

            if (container) {
                total_tutorials = this.total_tutor_ongoing_tutorials;

                if (total_tutorials > 0) {
                    if (total_tutorials == 0) {
                        document.getElementById('ongoing_tutor_tutorials_header').innerText = "ONGOING TUTORIALS";
                    }

                    this.total_tutor_ongoing_tutorials++;

                    document.getElementById("ongoing_tutorials_badge").innerText = this.total_tutor_ongoing_tutorials;

                    this.ongoing_tutor_tutorials.push(this_tutorial);
                } else {
                    this.total_tutor_ongoing_tutorials++;

                    if (document.getElementById('ongoing_tutor_tutorials_header') !== null) {
                        document.getElementById('ongoing_tutor_tutorials_header').innerText = "ONGOING TUTORIALS";
                        document.getElementById("ongoing_tutorials_badge").innerText = this.total_tutor_ongoing_tutorials;
                    }

                    this.ongoing_tutor_tutorials.push(this_tutorial);
                }

            } else {
                if (total_tutorials > 0) {
                    this.total_tutor_ongoing_tutorials++;
                    this.ongoing_tutor_tutorials.push(this_tutorial);
                } else {
                    this.total_tutor_ongoing_tutorials++;

                    if (document.getElementById('ongoing_tutor_tutorials_header')) {
                        document.getElementById('ongoing_tutor_tutorials_header').innerText = "ONGOING TUTORIALS";
                        document.getElementById("ongoing_tutorials_badge").innerText = this.total_tutor_ongoing_tutorials;
                    }

                    this.ongoing_tutor_tutorials.push(this_tutorial);
                }
            }

            if (document.getElementById('tutor_tutorials_ongoing') !== null && this.ongoing_tutor_tutorials_length !== 4 || refresh) {
                append_to.parentNode.insertBefore(tutorial, append_to.previousSibling);
                this.ongoing_tutor_tutorials_length++;
            }
        } else {
            append_to = document.getElementById('done-tutorials-infinite-scroll');
            container = document.getElementById('tutor_tutorials_done');

            if (container) {
                total_tutorials = this.total_tutor_done_tutorials;

                if (total_tutorials > 0) {
                    if (total_tutorials == 0) {
                        document.getElementById('done_tutor_tutorials_header').innerText = "DONE TUTORIALS";
                    }

                    this.total_tutor_done_tutorials++;

                    document.getElementById("done_tutorials_badge").innerText = this.total_tutor_done_tutorials;

                    this.done_tutor_tutorials.push(this_tutorial);
                } else {
                    this.total_tutor_done_tutorials++;

                    if (document.getElementById('done_tutor_tutorials_header') !== null) {
                        document.getElementById('done_tutor_tutorials_header').innerText = "DONE TUTORIALS";
                        document.getElementById("done_tutorials_badge").innerText = this.total_tutor_done_tutorials;
                    }

                    this.done_tutor_tutorials.push(this_tutorial);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_tutor_done_tutorials++;
                    this.done_tutor_tutorials.push(this_tutorial);
                }
            }

            if (document.getElementById('tutor_tutorials_done') !== null && this.done_tutor_tutorials_length !== 4 || refresh) {
                append_to.parentNode.insertBefore(tutorial, append_to.previousSibling);
                this.done_tutor_tutorials_length++;
            }
    }
    }

    update_tutorial(segment, updated_tutorial) {
        if (segment === "Pending") {
            for (let i = 0; i < this.pending_tutor_tutorials.length; i++) {
                if (this.pending_tutor_tutorials[i]._id === updated_tutorial._id) {
                    this.pending_tutor_tutorials[i] = updated_tutorial;
                }
            }
        } else if (segment === "Ongoing") {
            for (let i = 0; i < this.ongoing_tutor_tutorials.length; i++) {
                if (this.ongoing_tutor_tutorials[i]._id === updated_tutorial._id) {
                    this.ongoing_tutor_tutorials[i] = updated_tutorial;
                }
            }
        } else if (segment === "Done") {
            for (let i = 0; i < this.done_tutor_tutorials.length; i++) {
                if (this.done_tutor_tutorials[i]._id === updated_tutorial._id) {
                    this.done_tutor_tutorials[i] = updated_tutorial;
                }
            }
        }
    }

    remove_tutorial(segment, tutorial) {
        if (segment === "Pending") {
            this.pending_tutor_tutorials.filter(function (e) {
                return e !== 'seven'
            });
        }
    }
}