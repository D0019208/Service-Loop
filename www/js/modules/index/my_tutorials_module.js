let my_requested_posts_response;
let my_requested_posts_loaded = false;

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
                <ion-buttons slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
                <ion-buttons slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>
                    <h1>Tutorial Request</h1>
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
                <ion-buttons slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
                <ion-buttons slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>
                    <h1>Tutorial Request</h1>
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
                        if (!my_requested_posts_pending_loaded) {
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
                        if (!my_requested_posts_ongoing_loaded) {
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
                        if (!my_requested_posts_done_loaded) {
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

                    if (tutorial_status == "In Negotiation") {
                        tutorial_status = "Pending";
                    }

                    let tutorial_element = document.createElement('tutorial');
                    let tutorial_element_html;

                    if (tutorial_status == "Open") {
                        tutorial_element_html = `<ion-header translucent>
                        <ion-toolbar>
                                <ion-buttons slot="start">
                            <ion-back-button defaultHref="/"></ion-back-button>
                          </ion-buttons>
                            <ion-title><h1>Tutorial</h1></ion-title>
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
                            </ion-content>`;
                    } else if (tutorial_status == "In negotiation") {
                        if (this_tutorial.post_agreement_offered) {
                            tutorial_element_html = `<ion-header translucent>
                                                            <ion-toolbar>
                                                                    <ion-buttons slot="start">
                                                                <ion-back-button defaultHref="/"></ion-back-button>
                                                              </ion-buttons>
                                                                <ion-title><h1>Tutorial</h1></ion-title>
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
                                                                    <ion-button color="success">Accept agreement</ion-button>
                                                                    <ion-button color="danger">Reject agreement</ion-button>
                                                                </div>            
                                                            <ion-item-divider class="divider2"></ion-item-divider> 
                                                        </ion-content>`;
                        } else if (this_tutorial.post_agreement_signed) {
                            tutorial_element_html = `<ion-header translucent>
                                                        <ion-toolbar>
                                                                <ion-buttons slot="start">
                                                            <ion-back-button defaultHref="/"></ion-back-button>
                                                          </ion-buttons>
                                                            <ion-title><h1>Tutorial</h1></ion-title>
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
                                                                <ion-button color="success">Accept agreement</ion-button>
                                                                <ion-button color="danger">Reject agreement</ion-button>
                                                            </div>            
                                                        <ion-item-divider class="divider2"></ion-item-divider> 
                                                    </ion-content>`;
                        } else {
                            tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                        <ion-buttons slot="start">
                                    <ion-back-button defaultHref="/"></ion-back-button>
                                  </ion-buttons>
                                    <ion-title><h1>Tutorial</h1></ion-title>
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
                            </ion-content>
                        `;
                        }
                    } else if (tutorial_status == "Ongoing") {
                        tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                        <ion-buttons slot="start">
                                    <ion-back-button defaultHref="/"></ion-back-button>
                                  </ion-buttons>
                                    <ion-title><h1>Tutorial</h1></ion-title>
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
                            </ion-content>
                        `;
                    } else {
                        tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                        <ion-buttons slot="start">
                                    <ion-back-button defaultHref="/"></ion-back-button>
                                  </ion-buttons>
                                    <ion-title><h1>Tutorial</h1></ion-title>
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
                            </ion-content>
                        `;
                    }

                    tutorial_element.innerHTML = tutorial_element_html;

                    nav.push(tutorial_element);

//                    let ionNavDidChangeEvent = async function () {
//                        if (document.getElementById('accept_request_btn') !== null) {
//                            accept_request_btn = document.getElementById("accept_request_btn");
//                            accept_request_btn.addEventListener('click', handler, false);
//                        }
//
//                        let notifications_active_component = await nav_notifications.getActive();
//
//                        if (notifications_active_component.component.tagName === "NAV-NOTIFICATION-TUTORIAL-REQUESTED") {
//                            accept_request_btn.removeEventListener("click", handler, false);
//                            nav_notifications.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
//                        }
//                    };
//
//                    nav.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
                }
            });
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