let my_requested_posts_response;
let my_requested_posts_loaded = false;
let my_requested_posts_event_listener_added = false;

let my_requested_posts_open;
let my_requested_posts_pending;
let my_requested_posts_ongoing;
let my_requested_posts_done;

let my_requested_posts_open_loaded = true;
let my_requested_posts_pending_loaded = false;
let my_requested_posts_ongoing_loaded = false;
let my_requested_posts_done_loaded = false;

function load_my_requested_tutorials() {
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

                tutorials = new Tutorials(my_requested_posts_response, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());

                console.log(tutorials.open_tutorials);
                console.log(tutorials.pending_tutorials);
                console.log(tutorials.ongoing_tutorials);
                console.log(tutorials.done_tutorials);
            }

            let html;
            if (my_requested_posts_response.response === "There are no posts to display!") {
                html = `
           <ion-header translucent>
            <ion-toolbar>
                <ion-buttons style="margin-top: -55px;" slot="start">
                    <ion-back-button defaultHref="/"></ion-back-button>
                </ion-buttons>
                <ion-buttons style="margin-top: -55px;" slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>
                    <h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1>
                </ion-title>
                <ion-segment> 
                    <ion-segment-button value="open_segment" checked>
                        <ion-label>Open</ion-label>
                        <IonBadge color="primary">0</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="pending_segment">
                        <ion-label>Pending</ion-label>
                        <IonBadge color="primary">0</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="ongoing_segment">
                        <ion-label>Ongoing</ion-label>
                        <IonBadge color="primary">0</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="done_segment">
                        <ion-label>Done</ion-label>
                        <IonBadge color="primary">0</IonBadge>
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
                
                    <ion-infinite-scroll threshold="100px" id="open-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                
                <ion-list id="pending" class="hide">
                    <ion-list-header id="pending_tutorials_header">
                        NO PENDING TUTORIALS
                    </ion-list-header> 
                
                    <ion-infinite-scroll threshold="100px" id="pending-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="ongoing" class="hide">
                    <ion-list-header id="ongoing_tutorials_header">
                        NO ONGOING TUTORIALS  
                    </ion-list-header>  
                
                    <ion-infinite-scroll threshold="100px" id="ongoing-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="done" class="hide">
                    <ion-list-header id="done_tutorials_header">
                        NO DONE TUTORIALS  
                    </ion-list-header>  
                
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
                <ion-buttons style="margin-top: -55px;" slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
                <ion-buttons style="margin-top: -55px;" slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>
                    <h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1>
                </ion-title>
                <ion-segment> 
                    <ion-segment-button value="open_segment" checked>
                        <ion-label>Open</ion-label>
                        <IonBadge color="primary">${tutorials.total_open_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="pending_segment">
                        <ion-label>Pending</ion-label>
                        <IonBadge color="primary">${tutorials.total_pending_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="ongoing_segment">
                        <ion-label>Ongoing</ion-label>
                        <IonBadge color="primary">${tutorials.total_ongoing_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="done_segment">
                        <ion-label>Done</ion-label>
                        <IonBadge color="primary">${tutorials.total_done_tutorials}</IonBadge>
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
                
                    <ion-infinite-scroll threshold="100px" id="open-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                
                <ion-list id="pending" class="hide">
                    <ion-list-header id="pending_tutorials_header">
                        ${tutorials.pending_tutorials.length ? "PENDING TUTORIALS" : "NO PENDING TUTORIALS"} 
                    </ion-list-header> 
                
                    <ion-infinite-scroll threshold="100px" id="pending-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="ongoing" class="hide">
                    <ion-list-header id="ongoing_tutorials_header">
                        ${tutorials.ongoing_tutorials.length ? "ONGOING TUTORIALS" : "NO ONGOING TUTORIALS"}  
                    </ion-list-header>  
                
                    <ion-infinite-scroll threshold="100px" id="ongoing-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="done" class="hide">
                    <ion-list-header id="done_tutorials_header">
                        ${tutorials.done_tutorials.length ? "DONE TUTORIALS" : "NO DONE TUTORIALS"}  
                    </ion-list-header>  
                
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
//console.log(tutorials.create_tutorial_elements(tutorials.open_tutorials));
//
//
//
//
//            let openReferenceNode = document.getElementById("open");
//            let append_open_tutorials_list = document.createElement("ion-list");
//            append_open_tutorials_list.setAttribute("id", "open_tutorials_list");
//            append_open_tutorials_list.classList = "ion-activatable ripple offer";
//
//            // Insert the new node before the reference node
//            openReferenceNode.parentNode.insertBefore(append_open_tutorials_list, openReferenceNode.nextSibling);
//
//            let pendingReferenceNode = document.getElementById("pending_tutorials_header");
//            let append_pending_tutorials_list = document.createElement("ion-list");
//            append_pending_tutorials_list.setAttribute("id", "open_tutorials_list");
//            append_pending_tutorials_list.classList = "ion-activatable ripple offer";
//
//            // Insert the new node before the reference node
//            pendingReferenceNode.parentNode.insertBefore(append_pending_tutorials_list, pendingReferenceNode.nextSibling);
//
//            let ongoingReferenceNode = document.getElementById("ongoing");
//            let append_ongoing_tutorials_list = document.createElement("ion-list");
//            append_ongoing_tutorials_list.setAttribute("id", "open_tutorials_list");
//            append_ongoing_tutorials_list.classList = "ion-activatable ripple offer";
//
//            // Insert the new node before the reference node
//            ongoingReferenceNode.parentNode.insertBefore(append_ongoing_tutorials_list, ongoingReferenceNode.nextSibling);
//
//            let doneReferenceNode = document.getElementById("done");
//            let append_done_tutorials_infinite_scroll = document.createElement("ion-list");
//            append_done_tutorials_infinite_scroll.setAttribute("id", "open_tutorials_list");
//            append_done_tutorials_infinite_scroll.classList = "ion-activatable ripple offer";
//
//            // Insert the new node before the reference node
//            doneReferenceNode.parentNode.insertBefore(append_done_tutorials_infinite_scroll, doneReferenceNode.nextSibling);


            //We set the tutorials length to 0 as when you first launch the component you do not see the elements scrolled thus we need to reset the value
            tutorials.open_tutorials_length = 0;
            tutorials.pending_tutorials_length = 0;
            tutorials.ongoing_tutorials_length = 0;
            tutorials.closed_tutorials_length = 0;

            //List element we are appending our tutorials to
            //const open_tutorial_list = document.getElementById('open_tutorials_header');
            const openInfiniteScroll = document.getElementById('open-tutorials-infinite-scroll');


            console.log("Tutorials")
            console.log(tutorials);
            console.log(tutorials.get_open_tutorials());



            //If we have less than 7 tutorials we display all of them otherwise we display only 7
            if (tutorials.get_open_tutorials().length <= 3) {
                tutorials.open_tutorials_length = tutorials.appendPosts(tutorials.get_open_tutorials().length, openInfiniteScroll, tutorials.open_tutorials, tutorials.open_tutorials_length);
            } else {
                tutorials.open_tutorials_length = tutorials.appendPosts(3, openInfiniteScroll, tutorials.open_tutorials, tutorials.open_tutorials_length);
            }

            const pendingInfiniteScroll = document.getElementById('pending-tutorials-infinite-scroll');

            const ongoingInfiniteScroll = document.getElementById('ongoing-tutorials-infinite-scroll');

            const doneInfiniteScroll = document.getElementById('done-tutorials-infinite-scroll');

            //The number of posts we will add, this is calculated later
            let number_of_open_tutorials_to_add;
            let number_of_pending_tutorials_to_add;
            let number_of_ongoing_tutorials_to_add;
            let number_of_done_tutorials_to_add;

            openInfiniteScroll.addEventListener('ionInfinite', async function () {
                if (tutorials.open_tutorials_length < tutorials.get_open_tutorials().length) {
                    console.log('Loading data...');
                    await wait(500);
                    openInfiniteScroll.complete();

                    number_of_open_tutorials_to_add = tutorials.get_open_tutorials().length - tutorials.open_tutorials_length;

                    tutorials.open_tutorials_length = tutorials.appendPosts(number_of_open_tutorials_to_add, openInfiniteScroll, tutorials.open_tutorials, tutorials.open_tutorials_length);

                    console.log('Done');

                    if (tutorials.open_tutorials_length >= tutorials.get_open_tutorials().length) {
                        console.log('No More Open Data 2');
                        openInfiniteScroll.disabled = true;
                    }
                } else {
                    console.log('No More Open Data 1');
                    openInfiniteScroll.disabled = true;
                }
            });


            let segment_elements = {open: document.getElementById("open"), pending: document.getElementById("pending"), ongoing: document.getElementById("ongoing"), done: document.getElementById("done")};

            const segments = document.querySelectorAll('ion-segment')
            for (let i = 0; i < segments.length; i++) {
                segments[i].addEventListener('ionChange', (ev) => {
                    if (ev.detail.value === "open_segment") {
                        segment_elements.open.classList.remove("hide");
                        segment_elements.pending.classList.add("hide");
                        segment_elements.ongoing.classList.add("hide");
                        segment_elements.done.classList.add("hide");
                    } else if (ev.detail.value === "pending_segment") {
                        segment_elements.pending.classList.remove("hide");
                        segment_elements.open.classList.add("hide");
                        segment_elements.ongoing.classList.add("hide");
                        segment_elements.done.classList.add("hide");

                        //Add the infinite scroll listener
                        if (!my_requested_posts_pending_loaded || document.getElementById('pending').childElementCount <= 2) {
                            //If we have less than 3 tutorials we display all of them otherwise we display only 3 
                            if (tutorials.get_pending_tutorials().length <= 3) {
                                tutorials.pending_tutorials_length = tutorials.appendPosts(tutorials.get_pending_tutorials().length, pendingInfiniteScroll, tutorials.pending_tutorials, tutorials.pending_tutorials_length);
                            } else {
                                tutorials.pending_tutorials_length = tutorials.appendPosts(3, pendingInfiniteScroll, tutorials.pending_tutorials, tutorials.pending_tutorials_length);
                            }

                            pendingInfiniteScroll.addEventListener('ionInfinite', async function () {
                                if (tutorials.pending_tutorials_length < tutorials.get_pending_tutorials().length) {
                                    console.log('Loading data...');
                                    await wait(500);
                                    pendingInfiniteScroll.complete();

                                    number_of_pending_tutorials_to_add = tutorials.get_pending_tutorials().length - tutorials.pending_tutorials_length;

                                    tutorials.pending_tutorials_length = tutorials.appendPosts(number_of_pending_tutorials_to_add, pendingInfiniteScroll, tutorials.pending_tutorials, tutorials.pending_tutorials_length);
                                    console.log('Done');

                                    if (tutorials.pending_tutorials_length >= tutorials.get_pending_tutorials().length) {
                                        console.log('No More Pending Data 2');
                                        pendingInfiniteScroll.disabled = true;
                                    }
                                } else {
                                    console.log('No More Pending Data 1');
                                    pendingInfiniteScroll.disabled = true;
                                }
                            });

                            my_requested_posts_pending_loaded = true;
                        }
                    } else if (ev.detail.value === "ongoing_segment") {
                        segment_elements.ongoing.classList.remove("hide");
                        segment_elements.pending.classList.add("hide");
                        segment_elements.open.classList.add("hide");
                        segment_elements.done.classList.add("hide");

                        //Add the infinite scroll listener
                        if (!my_requested_posts_ongoing_loaded || document.getElementById('ongoing').childElementCount <= 2) {
                            //If we have less than 3 tutorials we display all of them otherwise we display only 3 
                            if (tutorials.get_ongoing_tutorials().length <= 3) {
                                tutorials.ongoing_tutorials_length = tutorials.appendPosts(tutorials.get_ongoing_tutorials().length, ongoingInfiniteScroll, tutorials.ongoing_tutorials, tutorials.ongoing_tutorials_length);
                            } else {
                                tutorials.ongoing_tutorials_length = tutorials.appendPosts(3, ongoingInfiniteScroll, tutorials.ongoing_tutorials, tutorials.ongoing_tutorials_length);
                            }

                            ongoingInfiniteScroll.addEventListener('ionInfinite', async function () {
                                if (tutorials.ongoing_tutorials_length < tutorials.get_ongoing_tutorials().length) {
                                    console.log('Loading data...');
                                    await wait(500);
                                    ongoingInfiniteScroll.complete();

                                    number_of_ongoing_tutorials_to_add = tutorials.get_ongoing_tutorials().length - tutorials.ongoing_tutorials_length;

                                    tutorials.ongoing_tutorials_length = tutorials.appendPosts(number_of_ongoing_tutorials_to_add, ongoingInfiniteScroll, tutorials.ongoing_tutorials, tutorials.ongoing_tutorials_length);
                                    console.log('Done');

                                    if (tutorials.ongoing_tutorials_length >= tutorials.get_ongoing_tutorials().length) {
                                        console.log('No More Pending Data 2');
                                        ongoingInfiniteScroll.disabled = true;
                                    }
                                } else {
                                    console.log('No More Pending Data 1');
                                    ongoingInfiniteScroll.disabled = true;
                                }
                            });

                            my_requested_posts_ongoing_loaded = true;
                        }
                    } else if (ev.detail.value === "done_segment") {
                        segment_elements.done.classList.remove("hide");
                        segment_elements.pending.classList.add("hide");
                        segment_elements.ongoing.classList.add("hide");
                        segment_elements.open.classList.add("hide");

                        //Add the infinite scroll listener
                        if (!my_requested_posts_done_loaded || document.getElementById('ongoing').childElementCount <= 2) {
                            //If we have less than 3 tutorials we display all of them otherwise we display only 3 
                            if (tutorials.get_done_tutorials().length <= 3) {
                                tutorials.done_tutorials_length = tutorials.appendPosts(tutorials.get_done_tutorials().length, doneInfiniteScroll, tutorials.done_tutorials, tutorials.done_tutorials_length);
                            } else {
                                tutorials.done_tutorials_length = tutorials.appendPosts(3, doneInfiniteScroll, tutorials.done_tutorials, tutorials.done_tutorials_length);
                            }

                            doneInfiniteScroll.addEventListener('ionInfinite', async function () {
                                if (tutorials.done_tutorials_length < tutorials.get_done_tutorials().length) {
                                    console.log('Loading data...');
                                    await wait(500);
                                    doneInfiniteScroll.complete();

                                    number_of_done_tutorials_to_add = tutorials.get_done_tutorials().length - tutorials.done_tutorials_length;

                                    tutorials.done_tutorials_length = tutorials.appendPosts(number_of_done_tutorials_to_add, doneInfiniteScroll, tutorials.done_tutorials, tutorials.done_tutorials_length);
                                    console.log('Done');

                                    if (tutorials.done_tutorials_length >= tutorials.get_done_tutorials().length) {
                                        console.log('No More Pending Data 2');
                                        doneInfiniteScroll.disabled = true;
                                    }
                                } else {
                                    console.log('No More Pending Data 1');
                                    doneInfiniteScroll.disabled = true;
                                }
                            });

                            my_requested_posts_done_loaded = true;
                        }
                    }
                });
            }

            if (!my_requested_posts_event_listener_added) {
                document.querySelector('body').addEventListener('click', async function (event) {
                    //Get closest element with specified class
                    let tutorial = getClosest(event.target, '.test');
                    let tutorial_tags = [];

                    console.log(tutorial);

                    //If there exists an element with the specified target near the clicked 
                    if (tutorial) {
                        //Find a post from posts object that matches the ID of the clicked element.
                        let tutorial_tag = tutorial.getAttribute('post_modules');
                        let tutorial_status = tutorial.getAttribute('post_status');
                        let this_tutorial = tutorials.getTutorialDetailsById(tutorial.getAttribute('post_id'), tutorial_status);

                        if (tutorial_status == "In negotiation") {
                            tutorial_status = "Pending";
                        }

                        let tutorial_element = document.createElement('tutorial');
                        let tutorial_element_html;

                        if (tutorial_status == "Open") {
                            load_open_tutorial_component(this_tutorial, tutorial_tag, tutorial_status);
                        } else if (tutorial_status == "Pending") {
                            if (this_tutorial.post_agreement_offered) { 
                                load_post_agreement_offered_component(nav, this_tutorial, tutorial_tag, tutorial_status);
                            } else if (this_tutorial.post_agreement_signed) { 
                                load_pending_tutorial_component_agreement_signed(nav, this_tutorial, tutorial_tag, tutorial_status) 
                            } else { 
                                load_pending_tutorial_component(this_tutorial, tutorial_tag, tutorial_status);
                            }
                        } else if (tutorial_status == "Ongoing") {
                            load_ongoing_tutorial_component(this_tutorial, tutorial_tag, tutorial_status);
                        } else {
                            load_done_tutorial_component(this_tutorial, tutorial_tag, tutorial_status);
                        }
                    }
                });

                my_requested_posts_event_listener_added = true;
            }
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

    nav.push('nav-my-requested-tutorials');
}

function load_open_tutorial_component(this_tutorial, tutorial_tag, tutorial_status) {
    let tutorial_element = document.createElement('tutorial');
    let tutorial_element_html = `<ion-header translucent>
                        <ion-toolbar>
                            <ion-buttons style="margin-top: -55px;" slot="start">
                                <ion-back-button defaultHref="/"></ion-back-button>
                            </ion-buttons>
                            <ion-buttons style="margin-top: -55px;" slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
                            <ion-title><h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1></ion-title>
                        </ion-toolbar>
                    </ion-header>

                    <ion-content fullscreen>
                        <ion-item style="margin-top:10px;" lines="none">
                            <ion-avatar style="width: 100px;height: 100px;" slot="start">
                                <img src="${this_tutorial.std_avatar}">
                            </ion-avatar>
                            <ion-label>
                                <h2><strong>${this_tutorial.std_name}</strong></h2>
                                <p>${this_tutorial.std_email}</p>
                            </ion-label><p class="date">${formatDate(this_tutorial.post_posted_on)}</p>
                        </ion-item>


                        <ion-item-divider class="divider"></ion-item-divider>
                        <ion-item lines="none">
                            <ion-label>
                                <h2><strong>${this_tutorial.post_title}</strong></h2>
                            </ion-label>
                        </ion-item>
                        <ion-item style="margin-top:-15px;" lines="none">
                            <h6>
                                ${this_tutorial.post_desc}
                            </h6>
                        </ion-item>

                        <ion-chip class="module" color="primary">
                            <ion-icon name="star"></ion-icon>
                            <ion-label>${tutorial_tag}</ion-label>
                        </ion-chip>
                        <!--<ion-chip class="module2" color="danger">
                          <ion-icon name="close"></ion-icon>
                          <ion-label>Closed</ion-label>
                        </ion-chip>-->
                        <ion-chip color="success">
                            <ion-icon name="swap"></ion-icon>
                            <ion-label>${tutorial_status}</ion-label>
                        </ion-chip> 
                            <ion-item-divider class="divider2"></ion-item-divider>  
                                  <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>Extra information</strong></h2>
                                    </ion-label>
                                </ion-item>      
                                 <ion-item style="margin-top:-15px;" lines="none">
                                    <h6>
                                        A tutor has not yet accepted your agreement. Please be patient
                                        as we have limited tutors.
                                    </h6>
                                </ion-item>    
                                <ion-item-divider class="divider2"></ion-item-divider> 
                                <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>Tutorial stage</strong></h2>
                                    </ion-label>
                                </ion-item>
                                    <div class="timeline">
                                  <div class="entry">
                                    <div class="title">
                                    </div>
                                    <div class="body">
                                      <p>Open</p>
                                      <ul>
                                        <li>Your tutorial has been requested successfully, it has currently not been assigned to a tutor. </li> 
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Pending</p>
                                      <ul>
                                        <li>A tutor has been assigned, the tutor will contact you via email to generate an agreement.</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Ongoing</p>
                                      <ul>
                                        <li>Agreement has been generated and signed by both tutor & student, tutorial will take place on agreed time and date.</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Done</p>
                                      <ul>
                                        <li>Tutorial has been compeleted.</li>
                                      </ul>
                                    </div>
                                  </div>

                                </div>
                            </ion-content>`;
    tutorial_element.innerHTML = tutorial_element_html;

    nav.push(tutorial_element);

}

function load_pending_tutorial_component_agreement_offered(this_tutorial, tutorial_tag, tutorial_status) {
    let tutorial_element = document.createElement('tutorial');
    let tutorial_element_html = `<ion-header translucent>
                                                            <ion-toolbar>
                                                                <ion-buttons style="margin-top: -55px;" slot="start">
                                                                    <ion-back-button defaultHref="/"></ion-back-button>
                                                                </ion-buttons>
                                                                <ion-buttons style="margin-top: -55px;" slot="end">
                                                                    <ion-menu-button></ion-menu-button>
                                                                </ion-buttons>
                                                                <ion-title><h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1></ion-title>
                                                            </ion-toolbar>
                                                        </ion-header>

                                                        <ion-content fullscreen>
                                                            <ion-item style="margin-top:10px;" lines="none">
                                                                <ion-avatar style="width: 100px;height: 100px;" slot="start">
                                                                    <img src="${this_tutorial.std_avatar}">
                                                                </ion-avatar>
                                                                <ion-label>
                                                                    <h2><strong>${this_tutorial.std_name}</strong></h2>
                                                                    <p>${this_tutorial.std_email}</p>
                                                                </ion-label><p class="date">${formatDate(this_tutorial.post_posted_on)}</p>
                                                            </ion-item>


                                                            <ion-item-divider class="divider"></ion-item-divider>
                                                            <ion-item lines="none">
                                                                <ion-label>
                                                                    <h2><strong>${this_tutorial.post_title}</strong></h2>
                                                                </ion-label>
                                                            </ion-item>
                                                            <ion-item style="margin-top:-15px;" lines="none">
                                                                <h6>
                                                                    ${this_tutorial.post_desc}
                                                                </h6>
                                                            </ion-item>
                                                                    <ion-chip class="module" color="primary">
                                                                <ion-icon name="star"></ion-icon>
                                                                <ion-label>${tutorial_tag}</ion-label>
                                                            </ion-chip>
                                                            <!--<ion-chip class="module2" color="danger">
                                                              <ion-icon name="close"></ion-icon>
                                                              <ion-label>Closed</ion-label>
                                                            </ion-chip>-->
                                                            <ion-chip color="success">
                                                                <ion-icon name="swap"></ion-icon>
                                                                <ion-label>${tutorial_status}</ion-label>
                                                            </ion-chip>
                                                             <ion-item-divider class="divider2"></ion-item-divider>  
                                                              <ion-item lines="none">
                                                                <ion-label>
                                                                    <h2><strong>Extra information</strong></h2>
                                                                </ion-label>
                                                            </ion-item>      
                                                             <ion-item style="margin-top:-15px;" lines="none">
                                                                <h6>
                                                                    Your tutor, ${this_tutorial.post_tutor_name} has sent you an agreement regarding your tutorial request, please
                                                                    review it before accepting or rejecting it. If you have any questions, contact him through his college email at 
                                                                    '${this_tutorial.post_tutor_email}' 
                                                                </h6>

                                                            </ion-item> 
                                                                <div class="ion-padding-top">
                                                                    <ion-button expand="block" type="button" class="ion-no-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="view_agreement">View agreement</ion-button>
                                                                     <ion-button expand="block" type="button" class="ion-no-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
                                                                    <ion-button id="accept_agreement" color="success">Accept agreement</ion-button>
                                                                    <ion-button id="reject_agreement" color="danger">Reject agreement</ion-button>
                                                                </div>            
                                                            <ion-item-divider class="divider2"></ion-item-divider> 
                                                                <ion-item lines="none">
                                                                    <ion-label>
                                                                        <h2><strong>Tutorial stage</strong></h2>
                                                                    </ion-label>
                                                                </ion-item>
                                                                    <div class="timeline">
                                                                  <div class="entry">
                                                                    <div class="title">
                                                                    </div>
                                                                    <div class="body">
                                                                      <p>Open</p>
                                                                      <ul>
                                                                        <li>Your tutorial has been requested successfully, it has currently not been assigned to a tutor. </li> 
                                                                      </ul>
                                                                    </div>
                                                                  </div>
                                                                  <div class="entry">
                                                                    <div class="title"> 
                                                                    </div>
                                                                    <div class="body">
                                                                      <p>Pending</p>
                                                                      <ul>
                                                                        <li>A tutor has been assigned, the tutor will contact you via email to generate an agreement.</li>
                                                                      </ul>
                                                                    </div>
                                                                  </div>
                                                                  <div class="entry">
                                                                    <div class="title"> 
                                                                    </div>
                                                                    <div class="body">
                                                                      <p>Ongoing</p>
                                                                      <ul>
                                                                        <li>Agreement has been generated and signed by both tutor & student, tutorial will take place on agreed time and date.</li>
                                                                      </ul>
                                                                    </div>
                                                                  </div>
                                                                  <div class="entry">
                                                                    <div class="title"> 
                                                                    </div>
                                                                    <div class="body">
                                                                      <p>Done</p>
                                                                      <ul>
                                                                        <li>Tutorial has been compeleted.</li>
                                                                      </ul>
                                                                    </div>
                                                                  </div>

                                                                </div>
                                                            </ion-content>`;
    tutorial_element.innerHTML = tutorial_element_html;

    nav.push(tutorial_element);

    let accept_agreement;
    let accept_agreement_handler = async function () {
        device_feedback();

        create_ionic_alert("Accept agreement", "Please confirm that you wish to accept this agreement.", [
            {
                text: 'Accept',
                handler: () => {
                    console.log('Accepted');
                    load_sign_accepted_agreement_component(this_tutorial);
                }
            },
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel')
                }
            }
        ]);
    }

    let reject_agreement;
    let reject_agreement_handler = async function () {
        device_feedback();

        create_ionic_alert("Reject agreement", "Please confirm that you wish to reject this agreement.", [
            {
                text: 'Reject',
                handler: () => {
                    console.log('Rejected')
                }
            },
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel')
                }
            }
        ]);

        //reject_agreement(tutorial);
    }

    let ionNavDidChangeEvent = async function () {
        if (document.getElementById('accept_agreement') !== null) {
            accept_agreement = document.getElementById("accept_agreement");
            accept_agreement.addEventListener('click', accept_agreement_handler, false);
        }

        if (document.getElementById('reject_agreement') !== null) {
            reject_agreement = document.getElementById("reject_agreement");
            reject_agreement.addEventListener('click', reject_agreement_handler, false);
        }

        let notifications_active_component = await nav.getActive();

        if (notifications_active_component.component.tagName !== "TUTORIAL") {
            accept_agreement.removeEventListener("click", accept_agreement_handler, false);
            reject_agreement.removeEventListener("click", reject_agreement_handler, false);
            nav.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

function load_pending_tutorial_component(this_tutorial, tutorial_tag, tutorial_status) {
    let tutorial_element = document.createElement('tutorial');
    let tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons style="margin-top: -55px;" slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons style="margin-top: -55px;" slot="end">
                                        <ion-menu-button></ion-menu-button>
                                    </ion-buttons>
                                    <ion-title><h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1></ion-title>
                                </ion-toolbar>
                            </ion-header>

                            <ion-content fullscreen>
                                <ion-item style="margin-top:10px;" lines="none">
                                    <ion-avatar style="width: 100px;height: 100px;" slot="start">
                                        <img src="${this_tutorial.std_avatar}">
                                    </ion-avatar>
                                    <ion-label>
                                        <h2><strong>${this_tutorial.std_name}</strong></h2>
                                        <p>${this_tutorial.std_email}</p>
                                    </ion-label><p class="date">${formatDate(this_tutorial.post_posted_on)}</p>
                                </ion-item>


                                <ion-item-divider class="divider"></ion-item-divider>
                                <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>${this_tutorial.post_title}</strong></h2>
                                    </ion-label>
                                </ion-item>
                                <ion-item style="margin-top:-15px;" lines="none">
                                    <h6>
                                        ${this_tutorial.post_desc}
                                    </h6>
                                </ion-item>
                                        <ion-chip class="module" color="primary">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-label>${tutorial_tag}</ion-label>
                                </ion-chip>
                                <!--<ion-chip class="module2" color="danger">
                                  <ion-icon name="close"></ion-icon>
                                  <ion-label>Closed</ion-label>
                                </ion-chip>-->
                                <ion-chip color="success">
                                    <ion-icon name="swap"></ion-icon>
                                    <ion-label>${tutorial_status}</ion-label>
                                </ion-chip>
                                 <ion-item-divider class="divider2"></ion-item-divider>  
                                  <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>Extra information</strong></h2>
                                    </ion-label>
                                </ion-item>      
                                 <ion-item style="margin-top:-15px;" lines="none">
                                    <h6>
                                        ${this_tutorial.post_tutor_name} has agreed to be your tutor, please get in contact with him
                                        through his college email '${this_tutorial.post_tutor_email}' to discuss the details of your tutorial
                                        and create an agreement.
                                    </h6>
                                </ion-item>    
                                <ion-item-divider class="divider2"></ion-item-divider> 
                            <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>Tutorial stage</strong></h2>
                                    </ion-label>
                                </ion-item>
                                    <div class="timeline">
                                  <div class="entry">
                                    <div class="title">
                                    </div>
                                    <div class="body">
                                      <p>Open</p>
                                      <ul>
                                        <li>Your tutorial has been requested successfully, it has currently not been assigned to a tutor. </li> 
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Pending</p>
                                      <ul>
                                        <li>A tutor has been assigned, the tutor will contact you via email to generate an agreement.</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Ongoing</p>
                                      <ul>
                                        <li>Agreement has been generated and signed by both tutor & student, tutorial will take place on agreed time and date.</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Done</p>
                                      <ul>
                                        <li>Tutorial has been compeleted.</li>
                                      </ul>
                                    </div>
                                  </div>

                                </div>
                            </ion-content>`;

    tutorial_element.innerHTML = tutorial_element_html;

    nav.push(tutorial_element);
}

function load_ongoing_tutorial_component(this_tutorial, tutorial_tag, tutorial_status) {
    let tutorial_element = document.createElement('tutorial');
    let tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons style="margin-top: -55px;" slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons style="margin-top: -55px;" slot="end">
                                        <ion-menu-button></ion-menu-button>
                                    </ion-buttons>
                                    <ion-title><h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1></ion-title>
                                </ion-toolbar>
                            </ion-header>

                            <ion-content fullscreen>
                                <ion-item style="margin-top:10px;" lines="none">
                                    <ion-avatar style="width: 100px;height: 100px;" slot="start">
                                        <img src="${this_tutorial.std_avatar}">
                                    </ion-avatar>
                                    <ion-label>
                                        <h2><strong>${this_tutorial.std_name}</strong></h2>
                                        <p>${this_tutorial.std_email}</p>
                                    </ion-label><p class="date">${formatDate(this_tutorial.post_posted_on)}</p>
                                </ion-item>


                                <ion-item-divider class="divider"></ion-item-divider>
                                <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>${this_tutorial.post_title}</strong></h2>
                                    </ion-label>
                                </ion-item>
                                <ion-item style="margin-top:-15px;" lines="none">
                                    <h6>
                                        ${this_tutorial.post_desc}
                                    </h6>
                                </ion-item>
                                        <ion-chip class="module" color="primary">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-label>${tutorial_tag}</ion-label>
                                </ion-chip>
                                <!--<ion-chip class="module2" color="danger">
                                  <ion-icon name="close"></ion-icon>
                                  <ion-label>Closed</ion-label>
                                </ion-chip>-->
                                <ion-chip color="success">
                                    <ion-icon name="swap"></ion-icon>
                                    <ion-label>${tutorial_status}</ion-label>
                                </ion-chip>
                                 <ion-item-divider class="divider2"></ion-item-divider>   
                                <ion-button expand="block" type="button" class="ion-no-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
                                <img class="pdf_button" src="images/pdf.png" width="100px" alt=""/>
                                <img class="blockchain_button" src="images/blockchain.png" width="100px" alt=""/>
                            <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>Tutorial stage</strong></h2>
                                    </ion-label>
                                </ion-item>
                                    <div class="timeline">
                                  <div class="entry">
                                    <div class="title">
                                    </div>
                                    <div class="body">
                                      <p>Open</p>
                                      <ul>
                                        <li>Your tutorial has been requested successfully, it has currently not been assigned to a tutor. </li> 
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Pending</p>
                                      <ul>
                                        <li>A tutor has been assigned, the tutor will contact you via email to generate an agreement.</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Ongoing</p>
                                      <ul>
                                        <li>Agreement has been generated and signed by both tutor & student, tutorial will take place on agreed time and date.</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Done</p>
                                      <ul>
                                        <li>Tutorial has been compeleted.</li>
                                      </ul>
                                    </div>
                                  </div>

                                </div>
                            </ion-content>`;

    tutorial_element.innerHTML = tutorial_element_html;

    nav.push(tutorial_element);
}

function load_done_tutorial_component(this_tutorial, tutorial_tag, tutorial_status) {
    let tutorial_element = document.createElement('tutorial');
    let tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons style="margin-top: -55px;" slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons style="margin-top: -55px;" slot="end">
                                        <ion-menu-button></ion-menu-button>
                                    </ion-buttons>
                                    <ion-title><h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1></ion-title>
                                </ion-toolbar>
                            </ion-header>

                            <ion-content fullscreen>
                                <ion-item style="margin-top:10px;" lines="none">
                                    <ion-avatar style="width: 100px;height: 100px;" slot="start">
                                        <img src="${this_tutorial.std_avatar}">
                                    </ion-avatar>
                                    <ion-label>
                                        <h2><strong>${this_tutorial.std_name}</strong></h2>
                                        <p>${this_tutorial.std_email}</p>
                                    </ion-label><p class="date">${formatDate(this_tutorial.post_posted_on)}</p>
                                </ion-item>


                                <ion-item-divider class="divider"></ion-item-divider>
                                <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>${this_tutorial.post_title}</strong></h2>
                                    </ion-label>
                                </ion-item>
                                <ion-item style="margin-top:-15px;" lines="none">
                                    <h6>
                                        ${this_tutorial.post_desc}
                                    </h6>
                                </ion-item>
                                        <ion-chip class="module" color="primary">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-label>${tutorial_tag}</ion-label>
                                </ion-chip>
                                <!--<ion-chip class="module2" color="danger">
                                  <ion-icon name="close"></ion-icon>
                                  <ion-label>Closed</ion-label>
                                </ion-chip>-->
                                <ion-chip color="success">
                                    <ion-icon name="swap"></ion-icon>
                                    <ion-label>${tutorial_status}</ion-label>
                                </ion-chip>
                                 <ion-item-divider class="divider2"></ion-item-divider>   
                                <ion-button expand="block" type="button" class="ion-no-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
                                <img class="pdf_button" src="images/pdf.png" width="100px" alt=""/>
                                <img class="blockchain_button" src="images/blockchain.png" width="100px" alt=""/>
                            <ion-item lines="none">
                                    <ion-label>
                                        <h2><strong>Tutorial stage</strong></h2>
                                    </ion-label>
                                </ion-item>
                                    <div class="timeline">
                                  <div class="entry">
                                    <div class="title">
                                    </div>
                                    <div class="body">
                                      <p>Open</p>
                                      <ul>
                                        <li>Your tutorial has been requested successfully, it has currently not been assigned to a tutor. </li> 
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Pending</p>
                                      <ul>
                                        <li>A tutor has been assigned, the tutor will contact you via email to generate an agreement.</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Ongoing</p>
                                      <ul>
                                        <li>Agreement has been generated and signed by both tutor & student, tutorial will take place on agreed time and date.</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div class="entry">
                                    <div class="title"> 
                                    </div>
                                    <div class="body">
                                      <p>Done</p>
                                      <ul>
                                        <li>Tutorial has been compeleted.</li>
                                      </ul>
                                    </div>
                                  </div>

                                </div>
                            </ion-content>`;

    tutorial_element.innerHTML = tutorial_element_html;

    nav.push(tutorial_element);
}

function load_sign_accepted_agreement_component(this_tutorial) {
    let tutor_tutorial_element = document.createElement('sign-tutorial-agreement');
    let date = new Date();
    let year = date.getFullYear();
    let current_date = year + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
    console.log(current_date);
    console.log(year)
    let tutor_tutorial_element_html = `
                                <ion-header translucent>
                                    <ion-toolbar>
                                        <ion-buttons style="margin-top: -55px;" slot="start">
                                            <ion-back-button defaultHref="/"></ion-back-button>
                                            </ion-buttons>
                                            <ion-buttons style="margin-top: -55px;" slot="end">
                                                <ion-menu-button></ion-menu-button>
                                            </ion-buttons>
                                        <ion-title><h1>Sign Agreement</h1></ion-title>
                                    </ion-toolbar>
                                </ion-header>
                                <ion-content fullscreen> 
                                    <p class="center">Please enter you signature</p>
                                    <ion-item-divider class="divider">
                                    </ion-item-divider>
                                    <br><br>
                                    <div class="wrapper">
                                        <canvas id="signature-pad" class="signature-pad" width=300 height=200></canvas>
                                    </div>
                                    <div style="text-align:center"> 
                                        <button id="undo">Undo</button>
                                        <button id="clear">Clear</button>
                                    </div>

                                    <div class="ion-padding-top fields">
                                        <ion-button expand="block" id="accept_agreement_button" type="submit" class="ion-no-margin">Accept agreement</ion-button>
                                    </div>
                                    <p class="success_text3">Please note, once accepted, you cannot cancel the agreement or not turn up. Failure to turn up will result in penalties being imposed.</p> 
                            </ion-content>`;

    tutor_tutorial_element.innerHTML = tutor_tutorial_element_html;
    nav.push(tutor_tutorial_element);

    let accept_agreement_button;
    let accept_agreement_handler = async function () {
        device_feedback();

        accept_agreement(this_tutorial);
    }

    let ionNavDidChangeEvent = async function () {
        if (document.getElementById('signature-pad') !== null) {
            await include("js/signature_pad.min.js", "signature_pad");
            drawing_pad();
            accept_agreement_button = document.getElementById("accept_agreement_button");
            accept_agreement_button.addEventListener('click', accept_agreement_handler, false);
        }

        let notifications_active_component = await nav.getActive();

        if (notifications_active_component.component.tagName !== "SIGN-TUTORIAL-AGREEMENT" && typeof accept_agreement_button !== 'undefined') {
            accept_agreement_button.removeEventListener("click", accept_agreement_handler, false);
            nav.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
    };

    nav.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
}

async function accept_agreement(this_tutorial) {
    if (isCanvasBlank(document.getElementById('signature-pad'))) {
        create_ionic_alert("Failed to accept agreement", "Please enter a signature to accept the agreement.", ["OK"]);
    } else {
        let agreement_accepted_response = await access_route({tutorial_id: this_tutorial._id, student_signature: signaturePad.toDataURL('image/png')}, "accept_agreement");

        if (!agreement_accepted_response.error) {
            user_notifications.addToNotifications(agreement_accepted_response.tutor_notification.response);
            //user_notifications.sendTutorialAcceptedNotification(agreement_generated_response.student_notification.response);

            tutor_tutorials.update_tutorial("Pending", agreement_accepted_response.updated_tutorial);
            tutor_tutorials.remove_tutorial_from_DOM("Pending", agreement_accepted_response, this_tutorial);
        } else {
            alert("Error")
        }

        console.log(agreement_accepted_response);
    }
}