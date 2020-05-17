class Tutorials extends User {
    constructor(id, tutorials, name, email, status, modules, avatar, open_tutorials, pending_tutorials, ongoing_tutorials, done_tutorials, tutored_pending_tutorials, tutored_ongoing_tutorials, tutored_done_tutorials, socket) {
        super(id, name, email, status, modules, avatar, open_tutorials, pending_tutorials, ongoing_tutorials, done_tutorials, tutored_pending_tutorials, tutored_ongoing_tutorials, tutored_done_tutorials, 0, socket);
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
    }

    refresh_tutorials(tutorials) {
        if (typeof tutorials.response !== "string") {
            this.all_tutorials = tutorials.response;

            this.total_tutorials = this.all_tutorials.length;

            this.open_tutorials = groupBy(this.all_tutorials, "Open");
            this.pending_tutorials = groupBy(this.all_tutorials, "In negotiation");
            this.ongoing_tutorials = groupBy(this.all_tutorials, "Ongoing");
            this.done_tutorials = groupBy(this.all_tutorials, "Done");

            this.total_open_tutorials = this.open_tutorials.length;
            this.total_pending_tutorials = this.pending_tutorials.length;
            this.total_ongoing_tutorials = this.ongoing_tutorials.length;
            this.total_done_tutorials = this.done_tutorials.length;

            this.open_tutorials_length = 0;
            this.pending_tutorials_length = 0;
            this.ongoing_tutorials_length = 0;
            this.done_tutorials_length = 0;

            user.setOpenTutorials(this.open_tutorials_length);
            user.setPendingTutorials(this.pending_tutorials_length);
            user.setOngoingTutorials(this.ongoing_tutorials_length);
            user.setDoneTutorials(this.done_tutorials_length);

            this.add_refreshed_tutorials();
        } else {
            this.all_tutorials = tutorials.response;

            this.total_tutorials = 0;

            this.open_tutorials = [];
            this.pending_tutorials = [];
            this.ongoing_tutorials = [];
            this.done_tutorials = [];

            this.total_open_tutorials = 0;
            this.total_pending_tutorials = 0;
            this.total_ongoing_tutorials = 0;
            this.total_done_tutorials = 0;

            this.open_tutorials_length = 0;
            this.pending_tutorials_length = 0;
            this.ongoing_tutorials_length = 0;
            this.done_tutorials_length = 0;

            user.setOpenTutorials(0);
            user.setPendingTutorials(0);
            user.setOngoingTutorials(0);
            user.setDoneTutorials(0);

            this.clear_tutored_segments();
        }
    }

    clear_tutored_segments() {
        let all_open_elements = [].slice.call(document.getElementById('open').getElementsByTagName("ion-list"));
        let all_pending_elements = [].slice.call(document.getElementById('pending').getElementsByTagName("ion-list"));
        let all_ongoing_elements = [].slice.call(document.getElementById('ongoing').getElementsByTagName("ion-list"));
        let all_done_elements = [].slice.call(document.getElementById('done').getElementsByTagName("ion-list"));

        my_requested_posts_open_loaded = true;
        my_requested_posts_pending_loaded = true;
        my_requested_posts_ongoing_loaded = true;
        my_requested_posts_done_loaded = true;

        for (let i = 0; i < all_open_elements.length; i++) {
            all_open_elements[i].remove();
        }

        for (let i = 0; i < all_pending_elements.length; i++) {
            all_pending_elements[i].remove();
        }

        for (let i = 0; i < all_ongoing_elements.length; i++) {
            all_ongoing_elements[i].remove();
        }

        for (let i = 0; i < all_done_elements.length; i++) {
            all_done_elements[i].remove();
        }

        document.getElementById('open_badge').innerText = this.get_open_tutorials().length;
        if (this.get_open_tutorials().length > 0) {
            document.getElementById('open_tutorials_header').innerText = "OPEN TUTORIALS";
        } else {
            document.getElementById('open_tutorials_header').innerText = "NO OPEN TUTORIALS";
        }

        document.getElementById('pending_badge').innerText = this.get_pending_tutorials().length;
        if (this.get_pending_tutorials().length > 0) {
            document.getElementById('pending_tutorials_header').innerText = "PENDING TUTORIALS";
        } else {
            document.getElementById('pending_tutorials_header').innerText = "NO PENDING TUTORIALS";
        }

        document.getElementById('ongoing_badge').innerText = this.get_ongoing_tutorials().length;
        if (this.get_ongoing_tutorials().length > 0) {
            document.getElementById('ongoing_tutorials_header').innerText = "ONGOING TUTORIALS";
        } else {
            document.getElementById('ongoing_tutorials_header').innerText = "NO ONGOING TUTORIALS";
        }

        document.getElementById('done_badge').innerText = this.get_done_tutorials().length;
        if (this.get_done_tutorials().length > 0) {
            document.getElementById('done_tutorials_header').innerText = "DONE TUTORIALS";
        } else {
            document.getElementById('done_tutorials_header').innerText = "NO DONE TUTORIALS";
        }
    }

    add_refreshed_tutorials() {
        this.clear_tutored_segments();
        
        if (this.get_open_tutorials().length <= 7) {
            this.open_tutorials_length = this.appendPosts(this.get_open_tutorials().length, document.getElementById('open-tutorials-infinite-scroll'), this.open_tutorials, this.open_tutorials_length);
        } else {
            this.open_tutorials_length = this.appendPosts(7, document.getElementById('open-tutorials-infinite-scroll'), this.open_tutorials, this.open_tutorials_length);
        }

        if (this.get_pending_tutorials().length <= 7) {
            this.pending_tutorials_length = tutorials.appendPosts(tutorials.get_pending_tutorials().length, document.getElementById('pending-tutorials-infinite-scroll'), tutorials.pending_tutorials, tutorials.pending_tutorials_length);
        } else if (document.getElementById('pending').childElementCount <= 7) {
            if (this.total_done_tutorials >= 7) {
                this.pending_tutorials_length = this.appendPosts(7, document.getElementById('pending-tutorials-infinite-scroll'), this.pending_tutorials, 0);
            } else {
                this.pending_tutorials_length = this.appendPosts(this.total_pending_tutorials, document.getElementById('pending-tutorials-infinite-scroll'), this.pending_tutorials, 0);
            }
        } else {
            this.pending_tutorials_length = this.appendPosts(7, document.getElementById('pending-tutorials-infinite-scroll'), this.pending_tutorials, this.pending_tutorials_length);
        }

        if (this.get_ongoing_tutorials().length <= 7) {
            this.ongoing_tutorials_length = tutorials.appendPosts(this.get_ongoing_tutorials().length, document.getElementById('ongoing-tutorials-infinite-scroll'), this.ongoing_tutorials, this.ongoing_tutorials_length);
        } else if (document.getElementById('ongoing').childElementCount <= 7) {
            if (this.total_done_tutorials >= 7) {
                this.ongoing_tutorials_length = this.appendPosts(7, document.getElementById('ongoing-tutorials-infinite-scroll'), this.ongoing_tutorials, 0);
            } else {
                this.ongoing_tutorials_length = this.appendPosts(this.total_ongoing_tutorials, document.getElementById('ongoing-tutorials-infinite-scroll'), this.ongoing_tutorials, 0);
            }
        } else {
            this.ongoing_tutorials_length = this.appendPosts(7, document.getElementById('ongoing-tutorials-infinite-scroll'), this.ongoing_tutorials, this.ongoing_tutorials_length);
        }

        if (this.get_done_tutorials().length <= 7 && document.getElementById('done').childElementCount > 7) {
            this.done_tutorials_length = this.appendPosts(this.get_done_tutorials().length, document.getElementById('done-tutorials-infinite-scroll'), this.done_tutorials, this.done_tutorials_length);
        } else if (document.getElementById('done').childElementCount <= 7) {
            if (this.total_done_tutorials >= 7) {
                this.done_tutorials_length = this.appendPosts(7, document.getElementById('done-tutorials-infinite-scroll'), this.done_tutorials, 0);
            } else {
                this.done_tutorials_length = this.appendPosts(this.total_done_tutorials, document.getElementById('done-tutorials-infinite-scroll'), this.done_tutorials, 0);
            }
        } else {
            this.done_tutorials_length = this.appendPosts(7, document.getElementById('done-tutorials-infinite-scroll'), this.done_tutorials, this.done_tutorials_length);
        }
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
        insert_to_array_by_index(this.ongoing_tutorials, 0, post);
        this.total_ongoing_tutorials = this.ongoing_tutorials.length;
    }

    add_post_to_segment(segment, list, tutorial) {
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


        if (segment == "Open") {
            //if (this.total_open_tutorials > 0) {
            this.total_open_tutorials++;
            this.open_tutorials.push(tutorial);

            if (typeof document.getElementById('open_tutorials_header') !== 'undefined' && document.getElementById('open_tutorials_header') !== null) {
                document.getElementById('open_tutorials_header').innerText = "OPEN TUTORIALS";
                document.getElementById('open_badge').innerText = this.total_open_tutorials;
            }
            //}
        } else if (segment == "Pending") {
            //if (this.total_pending_tutorials > 0) {
            this.total_pending_tutorials++;
            this.pending_tutorials.push(tutorial);

            if (typeof document.getElementById('pending_tutorials_header') !== 'undefined' && document.getElementById('pending_tutorials_header') !== null) {
                document.getElementById('pending_tutorials_header').innerText = "PENDING TUTORIALS";
                document.getElementById('pending_badge').innerText = this.total_pending_tutorials;
            }

            if (document.getElementById('pending') !== null && this.pending_tutorials_length !== 7) {
                list.after(el, list.previousSibling);
                this.pending_tutorials_length++;
            }
            //}
        } else if (segment == "Ongoing") {
            //if (this.total_ongoing_tutorials > 0) {
            this.total_ongoing_tutorials++;
            this.ongoing_tutorials.push(tutorial);

            if (typeof document.getElementById('ongoing_tutorials_header') !== 'undefined' && document.getElementById('ongoing_tutorials_header') !== null) {
                document.getElementById('ongoing_tutorials_header').innerText = "ONGOING TUTORIALS";
                document.getElementById('ongoing_badge').innerText = this.total_ongoing_tutorials;
            }

            if (document.getElementById('ongoing') !== null && this.ongoing_tutorials_length !== 7) {
                list.after(el, list.previousSibling);
                this.ongoing_tutorials_length++;
            }
            //}
        } else {
            //if (this.total_done_tutorials > 0) {
            this.total_done_tutorials++;
            this.done_tutorials.push(tutorial);

            if (typeof document.getElementById('done_tutorials_header') !== 'undefined' && document.getElementById('done_tutorials_header') !== null) {
                document.getElementById('done_tutorials_header').innerText = "DONE TUTORIALS";
                document.getElementById('done_badge').innerText = this.total_done_tutorials;
            }

            if (document.getElementById('done') !== null && this.done_tutorials_length !== 7) {
                list.after(el, list.previousSibling);
                this.done_tutorials_length++;
            }
            //}
        }
    }

    remove_tutorial_by_id(array, id) {
        array = array.filter(function (obj) {
            return obj._id !== id;
        });
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

    /**
     * This is a function that removes a tutorial card from the DOM along with 
     * removing the tutorial from the array
     * 
     * @param {String} segment - This is the segment from which you wish to remove the tutorial from
     * @param {Object} response - This is the object that contains the tutorial_id
     * @param {Object} this_tutorial - This is the tutorial object to be removed from the array
     */
    remove_tutorial_from_DOM(segment, response, this_tutorial) {
        let container;
        let total_tutorials;
        let tutorial_id;
        let tutorial;

        if (segment == "Open") {
            container = document.getElementById('open');
            total_tutorials = this.total_open_tutorials;

            if (container) {
                if (total_tutorials > 0) {
                    tutorial_id = response.updated_tutorial._id;
                    tutorial = container.querySelector('[post_id="' + tutorial_id + '"]');

                    if (total_tutorials == 1) {
                        document.getElementById('open_tutorials_header').innerText = "NO OPEN TUTORIALS";
                    }

                    this.total_open_tutorials--;

                    document.getElementById("open_badge").innerText = this.total_open_tutorials;

                    this.open_tutorials = this.open_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_open_tutorials--;
                    this.open_tutorials = this.open_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            }
        } else if (segment == "Pending") {
            container = document.getElementById('pending');
            total_tutorials = this.total_pending_tutorials;

            if (container) {
                if (total_tutorials > 0) {
                    tutorial_id = response.updated_tutorial._id;
                    tutorial = container.querySelector('[post_id="' + tutorial_id + '"]');

                    if (total_tutorials == 1) {
                        document.getElementById('pending_tutorials_header').innerText = "NO PENDING TUTORIALS";
                    }

                    this.total_pending_tutorials--;

                    document.getElementById("pending_badge").innerText = this.total_pending_tutorials;

                    this.pending_tutorials = this.pending_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_pending_tutorials--;
                    this.pending_tutorials = this.pending_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            }
        } else if (segment == "Ongoing") {
            container = document.getElementById('ongoing');
            total_tutorials = this.total_ongoing_tutorials;

            if (container) {
                if (total_tutorials > 0) {
                    tutorial_id = response.updated_tutorial._id;
                    tutorial = container.querySelector('[post_id="' + tutorial_id + '"]');

                    if (total_tutorials == 1) {
                        document.getElementById('ongoing_tutorials_header').innerText = "NO ONGOING TUTORIALS";
                    }

                    this.total_ongoing_tutorials--;

                    document.getElementById("ongoing_badge").innerText = this.total_ongoing_tutorials;

                    this.ongoing_tutorials = this.ongoing_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_ongoing_tutorials--;
                    this.ongoing_tutorials = this.ongoing_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            }
        } else {
            container = document.getElementById('tutor_tutorials_done');
            total_tutorials = this.total_done_tutorials;

            if (container) {
                if (total_tutorials > 0) {
                    tutorial_id = response.updated_tutorial._id;
                    tutorial = container.querySelector('[post_id="' + tutorial_id + '"]');

                    if (total_tutorials == 1) {
                        document.getElementById('don_tutorials_header').innerText = "NO DONE TUTORIALS";
                    }

                    this.total_done_tutorials--;

                    document.getElementById("done_badge").innerText = this.total_done_tutorials;

                    this.done_tutorials = this.done_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            } else {
                if (total_tutorials > 0) {
                    this.total_done_tutorials--;
                    this.done_tutorials = this.done_tutorials.filter(e => e._id !== this_tutorial._id);
                }
            }
        }

        if (typeof tutorial !== 'undefined' && tutorial !== null) {
            tutorial.parentNode.remove();
        }
    }

    update_my_tutorial(segment, updated_tutorial) {
        if (segment === "Open") {
            for (let i = 0; i < this.open_tutorials.length; i++) {
                if (this.open_tutorials[i]._id === updated_tutorial._id) {
                    this.open_tutorials[i] = updated_tutorial;
                }
            }

        } else if (segment === "Pending") {
            for (let i = 0; i < this.pending_tutorials.length; i++) {
                if (this.pending_tutorials[i]._id === updated_tutorial._id) {
                    this.pending_tutorials[i] = updated_tutorial;
                }
            }
        } else if (segment === "Ongoing") {
            for (let i = 0; i < this.ongoing_tutorials.length; i++) {
                if (this.ongoing_tutorials[i]._id === updated_tutorial._id) {
                    this.ongoing_tutorials[i] = updated_tutorial;
                }
            }
        } else if (segment === "Done") {
            for (let i = 0; i < this.done_tutorials.length; i++) {
                if (this.done_tutorials[i]._id === updated_tutorial._id) {
                    this.done_tutorials[i] = updated_tutorial;
                }
            }
        }
    }
}