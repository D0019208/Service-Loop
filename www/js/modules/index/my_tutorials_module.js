let my_requested_posts_response;
let my_requested_posts_loaded = false;
let my_requested_posts_event_listener_added = false;

let my_requested_posts_open;
let my_requested_posts_pending;
let my_requested_posts_ongoing;
let my_requested_posts_done;

let my_requested_posts_open_loaded = false;
let my_requested_posts_pending_loaded = false;
let my_requested_posts_ongoing_loaded = false;
let my_requested_posts_done_loaded = false;

let popover_title2 = "";
let popover_content2 = "";

let active_segment = "Open";

function load_my_requested_tutorials(nav_controller) {
    customElements.get('nav-my-requested-tutorials') || customElements.define('nav-my-requested-tutorials', class RequestTutorial extends HTMLElement {
        constructor() {
            super();
        }

        async connectedCallback() {
            if (!my_requested_posts_loaded) {
                let data = {
                    users_email: user.getEmail()
                };

                my_requested_posts_response = await access_route(data, "get_my_requested_posts");
                my_requested_posts_loaded = true;

                tutorials = new Tutorials(user.getId(), my_requested_posts_response, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
            }

            let html;
            if (tutorials.get_all_tutorials() === "There are no posts to display!") {
                html = `
           <ion-header translucent>
            <ion-toolbar>
                <ion-buttons onclick="device_feedback()" style="margin-top: -55px;" slot="start">
                    <ion-back-button defaultHref="/"></ion-back-button>
                </ion-buttons>
                <ion-buttons onclick="device_feedback()" style="margin-top: -55px;" slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>
                    <h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1>
                </ion-title>
                <ion-segment> 
                    <ion-segment-button value="open_segment" checked onclick="device_feedback();">
                        <ion-label>Open</ion-label>
                        <IonBadge id="open_badge" color="primary">${tutorials.total_open_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="pending_segment" onclick="device_feedback();">
                        <ion-label>Pending</ion-label>
                        <IonBadge id="pending_badge" color="primary">${tutorials.total_pending_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="ongoing_segment" onclick="device_feedback();">
                        <ion-label>Ongoing</ion-label>
                        <IonBadge id="ongoing_badge" color="primary">${tutorials.total_ongoing_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="done_segment" onclick="device_feedback();">
                        <ion-label>Done</ion-label>
                        <IonBadge id="done_badge" color="primary">${tutorials.total_done_tutorials}</IonBadge>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar> 
        </ion-header> 
        <ion-content fullscreen  class="ion-padding"> 
            <segment-content id="my_posts_content">
                <ion-list id="open" class="hide"> 
                    <ion-list-header id="open_tutorials_header">
                        NO OPEN TUTORIALS
                    </ion-list-header> 
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                    
                    <ion-refresher slot="fixed" id="tutorials_refresher">
                        <ion-refresher-content></ion-refresher-content>
                    </ion-refresher>
                    
                    <ion-infinite-scroll threshold="100px" id="open-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                
                <ion-list id="pending" class="hide">
                    <ion-list-header id="pending_tutorials_header">
                        NO PENDING TUTORIALS
                    </ion-list-header> 
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                    
                    <ion-infinite-scroll threshold="100px" id="pending-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="ongoing" class="hide">
                    <ion-list-header id="ongoing_tutorials_header">
                        NO ONGOING TUTORIALS  
                    </ion-list-header>  
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                    
                    <ion-infinite-scroll threshold="100px" id="ongoing-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="done" class="hide">
                    <ion-list-header id="done_tutorials_header">
                        NO DONE TUTORIALS  
                    </ion-list-header>  
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                    
                    <ion-infinite-scroll threshold="100px" id="done-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
            </segment-content>
        </ion-content>
        `
            } else {
                html = `
           <ion-header translucent>
            <ion-toolbar>
                <ion-buttons onclick="device_feedback()" style="margin-top: -55px;" slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
                <ion-buttons onclick="device_feedback()" style="margin-top: -55px;" slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>
                    <h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1>
                </ion-title>
                <ion-segment> 
                    <ion-segment-button value="open_segment" checked onclick="device_feedback();">
                        <ion-label>Open</ion-label>
                        <IonBadge id="open_badge" color="primary">${tutorials.total_open_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="pending_segment" onclick="device_feedback();">
                        <ion-label>Pending</ion-label>
                        <IonBadge id="pending_badge" color="primary">${tutorials.total_pending_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="ongoing_segment" onclick="device_feedback();">
                        <ion-label>Ongoing</ion-label>
                        <IonBadge id="ongoing_badge" color="primary">${tutorials.total_ongoing_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="done_segment" onclick="device_feedback();">
                        <ion-label>Done</ion-label>
                        <IonBadge id="done_badge" color="primary">${tutorials.total_done_tutorials}</IonBadge>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar> 
        </ion-header> 
        <ion-content fullscreen  class="ion-padding"> 
            <segment-content id="my_posts_content">
                <ion-list id="open" class="hide"> 
                    <ion-list-header id="open_tutorials_header">
                        ${tutorials.open_tutorials.length ? "OPEN TUTORIALS" : "NO OPEN TUTORIALS"}
                    </ion-list-header> 
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                    
                    <ion-refresher slot="fixed" id="tutorials_refresher">
                        <ion-refresher-content></ion-refresher-content>
                    </ion-refresher>
                    
                    <ion-infinite-scroll threshold="100px" id="open-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                
                <ion-list id="pending" class="hide">
                    <ion-list-header id="pending_tutorials_header">
                        ${tutorials.pending_tutorials.length ? "PENDING TUTORIALS" : "NO PENDING TUTORIALS"} 
                    </ion-list-header> 
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                    
                    <ion-infinite-scroll threshold="100px" id="pending-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="ongoing" class="hide">
                    <ion-list-header id="ongoing_tutorials_header">
                        ${tutorials.ongoing_tutorials.length ? "ONGOING TUTORIALS" : "NO ONGOING TUTORIALS"}  
                    </ion-list-header>  
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                    
                    <ion-infinite-scroll threshold="100px" id="ongoing-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="done" class="hide">
                    <ion-list-header id="done_tutorials_header">
                        ${tutorials.done_tutorials.length ? "DONE TUTORIALS" : "NO DONE TUTORIALS"}  
                    </ion-list-header>  
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                    
                    <ion-infinite-scroll threshold="100px" id="done-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
            </segment-content>
        </ion-content>
        `
            }

            this.innerHTML = html;

            //Ionic popover 
            let currentPopover = null;
            var popover;
            const buttons = document.querySelectorAll('.info');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', handleButtonClick);
            }

            async function handleButtonClick(ev) {
                device_feedback();
                popover = await popoverController.create({
                    component: 'popover-example-page2',
                    event: ev,
                    translucent: true,
                    mode: "ios"
                });
                currentPopover = popover;
                return popover.present();
            }

            function dismissPopover() {
                if (currentPopover) {
                    currentPopover.dismiss().then(() => {
                        currentPopover = null;
                    });
                }
            }

            customElements.get('popover-example-page2') || customElements.define('popover-example-page2', class ModalContent extends HTMLElement {
                connectedCallback() {
                    this.innerHTML = `
                  <ion-list>
                    <ion-list-header id="info_title" style="font-weight: bold; font-size: x-large;">${popover_title2}</ion-list-header>
                    <p style="margin-left: 15px; margin-right: 15px;">${popover_content2}</p>
                  </ion-list>
                `;
                }
            });

            //We set the tutorials length to 0 as when you first launch the component you do not see the elements scrolled thus we need to reset the value
            tutorials.open_tutorials_length = 0;
            tutorials.pending_tutorials_length = 0;
            tutorials.ongoing_tutorials_length = 0;
            tutorials.closed_tutorials_length = 0;

            //List element we are appending our tutorials to
            //const open_tutorial_list = document.getElementById('open_tutorials_header');
            const openInfiniteScroll = document.getElementById('open-tutorials-infinite-scroll');

            //If we have less than 7 tutorials we display all of them otherwise we display only 7
            if (tutorials.get_open_tutorials().length <= 7) {
                tutorials.open_tutorials_length = tutorials.appendPosts(tutorials.get_open_tutorials().length, openInfiniteScroll, tutorials.open_tutorials, tutorials.open_tutorials_length);
            } else {
                tutorials.open_tutorials_length = tutorials.appendPosts(7, openInfiniteScroll, tutorials.open_tutorials, tutorials.open_tutorials_length);
            }

            const pendingInfiniteScroll = document.getElementById('pending-tutorials-infinite-scroll');

            const ongoingInfiniteScroll = document.getElementById('ongoing-tutorials-infinite-scroll');

            const doneInfiniteScroll = document.getElementById('done-tutorials-infinite-scroll');

            //The number of posts we will add, this is calculated later
            let number_of_open_tutorials_to_add;
            let number_of_pending_tutorials_to_add;
            let number_of_ongoing_tutorials_to_add;
            let number_of_done_tutorials_to_add;

            const tutorials_refresher = document.getElementById('tutorials_refresher');
            tutorials_refresher.addEventListener('ionRefresh', async () => {
                let load_more_response = await access_route({users_email: user.getEmail()}, "get_my_requested_posts", false);

                //Update the posts object with the new reloaded values
                tutorials.refresh_tutorials(load_more_response);

                tutorials_refresher.complete();
            });

            openInfiniteScroll.addEventListener('ionInfinite', async function () {
                if (tutorials.open_tutorials_length < tutorials.get_open_tutorials().length) {
                    await wait(500);
                    openInfiniteScroll.complete();

                    if (tutorials.get_open_tutorials().length - tutorials.open_tutorials_length <= 7) {
                        number_of_open_tutorials_to_add = tutorials.get_open_tutorials().length - tutorials.open_tutorials_length;
                    } else {
                        number_of_open_tutorials_to_add = 7;
                    }

                    tutorials.open_tutorials_length = tutorials.appendPosts(number_of_open_tutorials_to_add, openInfiniteScroll, tutorials.open_tutorials, tutorials.open_tutorials_length);

                    if (tutorials.open_tutorials_length >= tutorials.get_open_tutorials().length) {
                        openInfiniteScroll.disabled = true;
                    }
                } else {
                    openInfiniteScroll.disabled = true;
                }
            });

            pendingInfiniteScroll.addEventListener('ionInfinite', async function () {
                console.log("pending tut length: " + tutorials.pending_tutorials_length)
                console.log("num of posts " + tutorials.get_pending_tutorials().length)

                if (tutorials.pending_tutorials_length < tutorials.get_pending_tutorials().length) {
                    console.log("in")
                    await wait(500);
                    pendingInfiniteScroll.complete();

                    if (tutorials.get_pending_tutorials().length - tutorials.pending_tutorials_length <= 7) {
                        number_of_pending_tutorials_to_add = tutorials.get_pending_tutorials().length - tutorials.pending_tutorials_length;
                    } else {
                        number_of_pending_tutorials_to_add = 7;
                    }

                    tutorials.pending_tutorials_length = tutorials.appendPosts(number_of_pending_tutorials_to_add, pendingInfiniteScroll, tutorials.pending_tutorials, tutorials.pending_tutorials_length);

                    if (tutorials.pending_tutorials_length >= tutorials.get_pending_tutorials().length) {
                        console.log("idk? in")
                        pendingInfiniteScroll.disabled = true;
                    }
                } else {
                    console.log("out");
                    pendingInfiniteScroll.disabled = true;
                }
            });

            ongoingInfiniteScroll.addEventListener('ionInfinite', async function () {
                if (tutorials.ongoing_tutorials_length < tutorials.get_ongoing_tutorials().length) {
                    await wait(500);
                    ongoingInfiniteScroll.complete();

                    if (tutorials.get_ongoing_tutorials().length - tutorials.ongoing_tutorials_length <= 7) {
                        number_of_ongoing_tutorials_to_add = tutorials.get_ongoing_tutorials().length - tutorials.ongoing_tutorials_length;
                    } else {
                        number_of_ongoing_tutorials_to_add = 7;
                    }

                    tutorials.ongoing_tutorials_length = tutorials.appendPosts(number_of_ongoing_tutorials_to_add, ongoingInfiniteScroll, tutorials.ongoing_tutorials, tutorials.ongoing_tutorials_length);

                    if (tutorials.ongoing_tutorials_length >= tutorials.get_ongoing_tutorials().length) {
                        ongoingInfiniteScroll.disabled = true;
                    }
                } else {
                    ongoingInfiniteScroll.disabled = true;
                }
            });

            doneInfiniteScroll.addEventListener('ionInfinite', async function () {
                if (tutorials.done_tutorials_length < tutorials.get_done_tutorials().length) {
                    await wait(500);
                    doneInfiniteScroll.complete();

                    if (tutorials.get_done_tutorials().length - tutorials.done_tutorials_length <= 7) {
                        number_of_done_tutorials_to_add = tutorials.get_done_tutorials().length - tutorials.done_tutorials_length;
                    } else {
                        number_of_done_tutorials_to_add = 7;
                    }

                    tutorials.done_tutorials_length = tutorials.appendPosts(number_of_done_tutorials_to_add, doneInfiniteScroll, tutorials.done_tutorials, tutorials.done_tutorials_length);

                    if (tutorials.done_tutorials_length >= tutorials.get_done_tutorials().length) {
                        doneInfiniteScroll.disabled = true;
                    }
                } else {
                    doneInfiniteScroll.disabled = true;
                }
            });


            let segment_elements = {open: document.getElementById("open"), pending: document.getElementById("pending"), ongoing: document.getElementById("ongoing"), done: document.getElementById("done")};

            const segments = document.querySelectorAll('ion-segment')
            for (let i = 0; i < segments.length; i++) {
                segments[i].addEventListener('ionChange', (ev) => {
                    if (ev.detail.value === "open_segment") {
                        active_segment = "Open";
                        popover_title2 = "Open";
                        popover_content2 = "All tutorials with no assigned tutor";

                        segment_elements.open.classList.remove("hide");
                        segment_elements.pending.classList.add("hide");
                        segment_elements.ongoing.classList.add("hide");
                        segment_elements.done.classList.add("hide");
                    } else if (ev.detail.value === "pending_segment") {
                        active_segment = "Pending";
                        popover_title2 = "Pending";
                        popover_content2 = "All tutorials that need to be confirmed by tutor and student";

                        segment_elements.pending.classList.remove("hide");
                        segment_elements.open.classList.add("hide");
                        segment_elements.ongoing.classList.add("hide");
                        segment_elements.done.classList.add("hide");

                        //Add the infinite scroll listener 
                        if (!my_requested_posts_pending_loaded || document.getElementById('pending').childElementCount <= 7) {
                            //If we have less than 7 tutorials we display all of them otherwise we display only 7 
                            if (tutorials.get_pending_tutorials().length <= 7) {
                                tutorials.pending_tutorials_length = tutorials.appendPosts(tutorials.get_pending_tutorials().length, pendingInfiniteScroll, tutorials.pending_tutorials, tutorials.pending_tutorials_length);
                            } else if (document.getElementById('pending').childElementCount <= 7) {
                                if (tutorials.total_pending_tutorials >= 7) {
                                    tutorials.pending_tutorials_length = tutorials.appendPosts(7, pendingInfiniteScroll, tutorials.pending_tutorials, 0);
                                } else {
                                    tutorials.pending_tutorials_length = tutorials.appendPosts(tutorials.total_pending_tutorials, pendingInfiniteScroll, tutorials.pending_tutorials, 0);
                                }
                            } else {
                                tutorials.pending_tutorials_length = tutorials.appendPosts(7, pendingInfiniteScroll, tutorials.pending_tutorials, tutorials.pending_tutorials_length);
                            }

                            my_requested_posts_pending_loaded = true;
                        }
                    } else if (ev.detail.value === "ongoing_segment") {
                        active_segment = "Ongoing";
                        popover_title2 = "Ongoing";
                        popover_content2 = "All tutorials that are in progress";

                        segment_elements.ongoing.classList.remove("hide");
                        segment_elements.pending.classList.add("hide");
                        segment_elements.open.classList.add("hide");
                        segment_elements.done.classList.add("hide");

                        //Add the infinite scroll listener
                        if (!my_requested_posts_ongoing_loaded || document.getElementById('ongoing').childElementCount <= 7) {
                            //If we have less than 7 tutorials we display all of them otherwise we display only 3 
                            if (tutorials.get_ongoing_tutorials().length <= 7) {
                                tutorials.ongoing_tutorials_length = tutorials.appendPosts(tutorials.get_ongoing_tutorials().length, ongoingInfiniteScroll, tutorials.ongoing_tutorials, tutorials.ongoing_tutorials_length);
                            } else if (document.getElementById('ongoing').childElementCount <= 7) {
                                if (tutorials.total_done_tutorials >= 7) {
                                    tutorials.ongoing_tutorials_length = tutorials.appendPosts(7, ongoingInfiniteScroll, tutorials.ongoing_tutorials, 0);
                                } else {
                                    tutorials.ongoing_tutorials_length = tutorials.appendPosts(tutorials.total_ongoing_tutorials, ongoingInfiniteScroll, tutorials.ongoing_tutorials, 0);
                                }
                            } else {
                                tutorials.ongoing_tutorials_length = tutorials.appendPosts(7, ongoingInfiniteScroll, tutorials.ongoing_tutorials, tutorials.ongoing_tutorials_length);
                            }

                            my_requested_posts_ongoing_loaded = true;
                        }
                    } else if (ev.detail.value === "done_segment") {
                        active_segment = "Done"
                        popover_title2 = "Done";
                        popover_content2 = "All tutorials that have being completed";

                        segment_elements.done.classList.remove("hide");
                        segment_elements.pending.classList.add("hide");
                        segment_elements.ongoing.classList.add("hide");
                        segment_elements.open.classList.add("hide");

                        //Add the infinite scroll listener
                        if (!my_requested_posts_done_loaded || document.getElementById('done').childElementCount <= 7) {
                            //If we have less than 7 tutorials we display all of them otherwise we display only 7 
                            if (tutorials.get_done_tutorials().length <= 7 && document.getElementById('done').childElementCount > 7) {
                                tutorials.done_tutorials_length = tutorials.appendPosts(tutorials.get_done_tutorials().length, doneInfiniteScroll, tutorials.done_tutorials, tutorials.done_tutorials_length);
                            } else if (document.getElementById('done').childElementCount <= 7) {
                                if (tutorials.total_done_tutorials >= 7) {
                                    tutorials.done_tutorials_length = tutorials.appendPosts(7, doneInfiniteScroll, tutorials.done_tutorials, 0);
                                } else {
                                    tutorials.done_tutorials_length = tutorials.appendPosts(tutorials.total_done_tutorials, doneInfiniteScroll, tutorials.done_tutorials, 0);
                                }
                            } else {
                                tutorials.done_tutorials_length = tutorials.appendPosts(7, doneInfiniteScroll, tutorials.done_tutorials, tutorials.done_tutorials_length);
                            }

                            my_requested_posts_done_loaded = true;
                        }
                    }
                });
            }

            if (!my_requested_posts_event_listener_added) {
                document.querySelector('body').addEventListener('click', async function (event) {
                    //Get closest element with specified class
                    let tutorial = getClosest(event.target, '.test');

                    //If there exists an element with the specified target near the clicked 
                    if (tutorial) {
                        //Find a post from posts object that matches the ID of the clicked element.
                        let tutorial_tag = tutorial.getAttribute('post_modules');
                        let tutorial_status = tutorial.getAttribute('post_status');
                        let this_tutorial = tutorials.getTutorialDetailsById(tutorial.getAttribute('post_id'), tutorial_status);
                        let active_component = await nav_controller.getActive();

                        if (tutorial_status == "In negotiation") {
                            tutorial_status = "Pending";
                        }

                        if (tutorial_status == "Open" && active_component.component == "nav-my-requested-tutorials") {
                            load_open_tutorial_component(nav_controller, this_tutorial);
                        } else if (tutorial_status == "Pending" && active_component.component == "nav-my-requested-tutorials") {
                            if (this_tutorial.post_agreement_offered) {
                                load_post_agreement_offered_component(nav_controller, this_tutorial, tutorial_tag, tutorial_status);
                            } else if (this_tutorial.post_agreement_signed) {
                                load_pending_tutorial_component_agreement_signed(nav_controller, this_tutorial, tutorial_tag, tutorial_status)
                            } else {
                                load_pending_tutorial_component(nav_controller, this_tutorial, tutorial_tag, tutorial_status);
                            }
                        } else if (tutorial_status == "Ongoing" && active_component.component == "nav-my-requested-tutorials") {
                            load_ongoing_tutorial_component(nav_controller, this_tutorial, tutorial_tag, tutorial_status);
                        } else if (tutorial_status == "Done" && active_component.component == "nav-my-requested-tutorials") {
                            load_done_tutorial_component(nav_controller, this_tutorial, tutorial_tag, tutorial_status);
                        }
                    }
                });

                my_requested_posts_event_listener_added = true;
            }
        }

        disconnectedCallback() {
            my_requested_posts_pending_loaded = false;
            my_requested_posts_ongoing_loaded = false;
            my_requested_posts_done_loaded = false;

            active_segment = "Open";

            console.log('Custom square element removed from page.');
        }

        adoptedCallback() {
            console.log('Custom square element moved to new page.');
        }

        attributeChangedCallback() {
            console.log("Attribute changed?")
        }
    });

    nav_controller.push('nav-my-requested-tutorials');
}