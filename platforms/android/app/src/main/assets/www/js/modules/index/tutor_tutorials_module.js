let tutor_tutorials_response;
let tutor_tutorials_loaded = false;
let tutor_tutorials_event_listener_added = false;
 
let tutor_tutorials_pending;
let tutor_tutorials_ongoing;
let tutor_tutorials_done;

let tutor_tutorials_pending_loaded = false;
let tutor_tutorials_ongoing_loaded = false;
let tutor_tutorials_done_loaded = false;

let popover_title = "";
let popover_content = "";

let active_tutor_segment = "Pending";

function all_tutor_tutorials(nav_controller) {
    customElements.get('nav-my-tutorials') || customElements.define('nav-my-tutorials', class RequestTutorial extends HTMLElement {
        constructor() {
            super();
        }

        async connectedCallback() {
            if (!tutor_tutorials_response) {
                let data = {
                    users_email: user.getEmail()
                };

                tutor_tutorials_response = await access_route(data, "get_all_tutor_tutorials");

                console.log("All tutorials");
                console.log(tutor_tutorials_response)

                tutor_tutorials_loaded = true;

                tutor_tutorials = new Tutor_Tutorials(user.getId(), tutor_tutorials_response, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
            }

            let html;
            if (tutor_tutorials.get_all_tutor_tutorials() === "There are no posts to display!") {
                html = `
           <ion-header translucent>
            <ion-toolbar>
                <ion-buttons onclick="device_feedback()" style="margin-top: -55px;" slot="start">
                    <ion-back-button defaultHref="/"></ion-back-button>
                </ion-buttons>
                <ion-buttons onclick="device_feedback()" style="margin-top: -55px;" slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title><h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1></ion-title>
                <ion-segment>  
                    <ion-segment-button value="tutor_tutorials_pending_segment" checked onclick="device_feedback();">
                        <ion-label>Pending</ion-label>
                        <IonBadge color="primary" id="pending_tutorials_badge">${tutor_tutorials.total_tutor_pending_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="tutor_tutorials_ongoing_segment" onclick="device_feedback();">
                        <ion-label>Ongoing</ion-label>
                        <IonBadge color="primary" id="ongoing_tutorials_badge">${tutor_tutorials.total_tutor_ongoing_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="tutor_tutorials_done_segment" onclick="device_feedback();">
                        <ion-label>Done</ion-label>
                        <IonBadge color="primary" id="done_tutorials_badge">${tutor_tutorials.total_tutor_done_tutorials}</IonBadge>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar> 
        </ion-header> 
        <ion-content fullscreen  class="ion-padding"> 
            <segment-content id="my_tutored_posts_content">  
                <ion-list id="tutor_tutorials_pending" class="hide">
                    <ion-list-header id="pending_tutor_tutorials_header">
                        NO PENDING TUTORIALS
                    </ion-list-header> 
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                
                    <ion-infinite-scroll threshold="100px" id="pending-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="tutor_tutorials_ongoing" class="hide">
                    <ion-list-header id="ongoing_tutor_tutorials_header">
                        NO ONGOING TUTORIALS  
                    </ion-list-header>  
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                
                    <ion-infinite-scroll threshold="100px" id="ongoing-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="tutor_tutorials_done" class="hide">
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
        `;
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
                <ion-title><h1 style="margin-left: 0px; margin-top: 12px;">My Tutorials</h1></ion-title>
                <ion-segment>  
                    <ion-segment-button value="tutor_tutorials_pending_segment" checked onclick="device_feedback();">
                        <ion-label>Pending</ion-label>
                        <IonBadge color="primary" id="pending_tutorials_badge">${tutor_tutorials.total_tutor_pending_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="tutor_tutorials_ongoing_segment" onclick="device_feedback();">
                        <ion-label>Ongoing</ion-label>
                        <IonBadge color="primary" id="ongoing_tutorials_badge">${tutor_tutorials.total_tutor_ongoing_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="tutor_tutorials_done_segment" onclick="device_feedback();">
                        <ion-label>Done</ion-label>
                        <IonBadge color="primary" id="done_tutorials_badge">${tutor_tutorials.total_tutor_done_tutorials}</IonBadge>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar> 
        </ion-header> 
        <ion-content fullscreen  class="ion-padding"> 
            <segment-content id="my_tutored_posts_content">  
                <ion-list id="tutor_tutorials_pending" class="hide">
                    <ion-list-header id="pending_tutor_tutorials_header">
                        ${tutor_tutorials.pending_tutor_tutorials.length ? "PENDING TUTORIALS" : "NO PENDING TUTORIALS"} 
                    </ion-list-header> 
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                
                    <ion-infinite-scroll threshold="100px" id="pending-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="tutor_tutorials_ongoing" class="hide">
                    <ion-list-header id="ongoing_tutor_tutorials_header">
                        ${tutor_tutorials.ongoing_tutor_tutorials.length ? "ONGOING TUTORIALS" : "NO ONGOING TUTORIALS"}  
                    </ion-list-header>  
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                
                    <ion-infinite-scroll threshold="100px" id="ongoing-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="tutor_tutorials_done" class="hide">
                    <ion-list-header id="done_tutor_tutorials_header">
                        ${tutor_tutorials.done_tutor_tutorials.length ? "DONE TUTORIALS" : "NO DONE TUTORIALS"}  
                    </ion-list-header>  
                    <ion-icon color="primary" class="info" size="large" name="information-circle-outline"></ion-icon>
                
                    <ion-infinite-scroll threshold="100px" id="done-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
            </segment-content>
        </ion-content>
        `;
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
            
            
            //Ionic popover 
            let currentPopover = null;
            var popover;
            const buttons = document.querySelectorAll('.info');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', handleButtonClick);
            }

            async function handleButtonClick(ev) {
                popover = await popoverController.create({
                    component: 'popover-example-page',
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
            
            customElements.get('popover-example-page') || customElements.define('popover-example-page', class ModalContent extends HTMLElement {
                connectedCallback() {
                    this.innerHTML = `
                  <ion-list>
                    <ion-list-header id="info_title" style="font-weight: bold; font-size: x-large;">${popover_title}</ion-list-header>
                    <p style="margin-left: 15px; margin-right: 15px;">${popover_content}</p>
                  </ion-list>
                `;
                }
            });

            //We set the tutorials length to 0 as when you first launch the component you do not see the elements scrolled thus we need to reset the value 
            tutor_tutorials.pending_tutor_tutorials_length = 0;
            tutor_tutorials.ongoing_tutor_tutorials_length = 0;
            tutor_tutorials.done_tutor_tutorials_length = 0;
            
            console.log("?W?W?W?W?W?W?");
            console.log(tutor_tutorials.pending_tutor_tutorials);
            
            //List element we are appending our tutorials to  
            const pendingInfiniteScroll = document.getElementById('pending-tutorials-infinite-scroll');
            //If we have less than 3 tutorials we display all of them otherwise we display only 7
            if (tutor_tutorials.get_pending_tutor_tutorials().length <= 3) {
                tutor_tutorials.pending_tutor_tutorials_length = tutor_tutorials.appendPosts(tutor_tutorials.get_pending_tutor_tutorials().length, pendingInfiniteScroll, tutor_tutorials.pending_tutor_tutorials, tutor_tutorials.pending_tutor_tutorials_length);
            } else {
                tutor_tutorials.pending_tutor_tutorials_length = tutor_tutorials.appendPosts(3, pendingInfiniteScroll, tutor_tutorials.pending_tutor_tutorials, tutor_tutorials.pending_tutor_tutorials_length);
            }

            const ongoingInfiniteScroll = document.getElementById('ongoing-tutorials-infinite-scroll');
            const doneInfiniteScroll = document.getElementById('done-tutorials-infinite-scroll');

            //The number of posts we will add, this is calculated later 
            let number_of_pending_tutor_tutorials_to_add;
            let number_of_ongoing_tutor_tutorials_to_add;
            let number_of_done_tutor_tutorials_to_add;

            pendingInfiniteScroll.addEventListener('ionInfinite', async function () {
                if (tutor_tutorials.pending_tutor_tutorials_length < tutor_tutorials.get_pending_tutor_tutorials().length) {
                    console.log('Loading data...');
                    await wait(500);
                    pendingInfiniteScroll.complete(); 
                    
                    number_of_pending_tutor_tutorials_to_add = tutor_tutorials.get_pending_tutor_tutorials().length - tutor_tutorials.pending_tutor_tutorials_length;
                    if(number_of_pending_tutor_tutorials_to_add > 3) {
                        number_of_pending_tutor_tutorials_to_add = 3;
                    }
                    
                    tutor_tutorials.pending_tutor_tutorials_length = tutor_tutorials.appendPosts(number_of_pending_tutor_tutorials_to_add, pendingInfiniteScroll, tutor_tutorials.pending_tutor_tutorials, tutor_tutorials.pending_tutor_tutorials_length);

                    console.log('Done');

                    if (tutor_tutorials.pending_tutor_tutorials_length >= tutor_tutorials.get_pending_tutor_tutorials().length) {
                        console.log('No More Open Data 2');
                        pendingInfiniteScroll.disabled = true;
                    }
                } else {
                    console.log('No More Open Data 1');
                    pendingInfiniteScroll.disabled = true;
                }
            });


            let segment_elements = {pending: document.getElementById("tutor_tutorials_pending"), ongoing: document.getElementById("tutor_tutorials_ongoing"), done: document.getElementById("tutor_tutorials_done")};
            
            const segments = document.querySelectorAll('ion-segment')
            for (let i = 0; i < segments.length; i++) {
                segments[i].addEventListener('ionChange', (ev) => {
                    if (ev.detail.value === "tutor_tutorials_pending_segment") {
                        active_tutor_segment = "Pending";
                        popover_title = "Pending";
                        popover_content = "All tutorials that need to be confirmed by tutor and student";
                        
                        segment_elements.ongoing.classList.add("hide");
                        segment_elements.pending.classList.remove("hide");
                        segment_elements.done.classList.add("hide");
                    } else if (ev.detail.value === "tutor_tutorials_ongoing_segment") {
                        active_tutor_segment = "Ongoing";
                        popover_title = "Ongoing";
                        popover_content = "All tutorials that are in progress";
                        
                        segment_elements.ongoing.classList.remove("hide");
                        segment_elements.pending.classList.add("hide");
                        segment_elements.done.classList.add("hide");

                        //Add the infinite scroll listener
                        if (!tutor_tutorials_ongoing_loaded || document.getElementById('tutor_tutorials_ongoing').childElementCount <= 3) {
                            //If we have less than 3 tutorials we display all of them otherwise we display only 3  
                            if (tutor_tutorials.get_ongoing_tutor_tutorials().length <= 3) {
                                tutor_tutorials.ongoing_tutor_tutorials_length = tutor_tutorials.appendPosts(tutor_tutorials.get_ongoing_tutor_tutorials().length, ongoingInfiniteScroll, tutor_tutorials.ongoing_tutor_tutorials, tutor_tutorials.ongoing_tutor_tutorials_length);
                            } else {
                                tutor_tutorials.ongoing_tutor_tutorials_length = tutor_tutorials.appendPosts(3, ongoingInfiniteScroll, tutor_tutorials.ongoing_tutor_tutorials, tutor_tutorials.ongoing_tutor_tutorials_length);
                            }

                            ongoingInfiniteScroll.addEventListener('ionInfinite', async function () {
                                if (tutor_tutorials.ongoing_tutor_tutorials_length < tutor_tutorials.get_ongoing_tutor_tutorials().length) {
                                    console.log('Loading data...');
                                    await wait(500);
                                    ongoingInfiniteScroll.complete();

                                    number_of_ongoing_tutor_tutorials_to_add = tutor_tutorials.get_ongoing_tutor_tutorials().length - tutor_tutorials.ongoing_tutor_tutorials_length;

                                    tutor_tutorials.ongoing_tutorials_length = tutor_tutorials.appendPosts(number_of_ongoing_tutor_tutorials_to_add, ongoingInfiniteScroll, tutor_tutorials.ongoing_tutor_tutorials, tutor_tutorials.ongoing_tutor_tutorials_length);
                                    console.log('Done');

                                    if (tutor_tutorials.ongoing_tutor_tutorials_length >= tutor_tutorials.get_ongoing_tutor_tutorials().length) {
                                        console.log('No More Pending Data 2');
                                        ongoingInfiniteScroll.disabled = true;
                                    }
                                } else {
                                    console.log('No More Pending Data 1');
                                    ongoingInfiniteScroll.disabled = true;
                                }
                            });

                            tutor_tutorials_ongoing_loaded = true;
                        }
                    } else if (ev.detail.value === "tutor_tutorials_done_segment") {
                        active_tutor_segment = "Done";
                        popover_title = "Done";
                        popover_content = "All tutorials that have being completed";
                        
                        segment_elements.done.classList.remove("hide");
                        segment_elements.pending.classList.add("hide");
                        segment_elements.ongoing.classList.add("hide");

                        //Add the infinite scroll listener
                        if (!tutor_tutorials_done_loaded || document.getElementById('tutor_tutorials_done').childElementCount <= 3) {
                            //If we have less than 3 tutorials we display all of them otherwise we display only 3 
                            if (tutor_tutorials.get_done_tutor_tutorials().length <= 3) {
                                tutor_tutorials.done_tutor_tutorials_length = tutor_tutorials.appendPosts(tutor_tutorials.get_done_tutor_tutorials().length, doneInfiniteScroll, tutor_tutorials.done_tutor_tutorials, tutor_tutorials.done_tutor_tutorials_length);
                            } else {
                                tutor_tutorials.done_tutor_tutorials_length = tutor_tutorials.appendPosts(3, doneInfiniteScroll, tutor_tutorials.done_tutor_tutorials, tutor_tutorials.done_tutor_tutorials_length);
                            }

                            doneInfiniteScroll.addEventListener('ionInfinite', async function () {
                                if (tutor_tutorials.done_tutor_tutorials_length < tutor_tutorials.get_done_tutor_tutorials().length) {
                                    console.log('Loading data...');
                                    await wait(500);
                                    doneInfiniteScroll.complete();

                                    number_of_done_tutor_tutorials_to_add = tutor_tutorials.get_done_tutor_tutorials().length - tutor_tutorials.done_tutor_tutorials_length;

                                    tutor_tutorials.done_tutor_tutorials_length = tutor_tutorials.appendPosts(number_of_done_tutor_tutorials_to_add, doneInfiniteScroll, tutor_tutorials.done_tutor_tutorials, tutor_tutorials.done_tutor_tutorials_length);
                                    console.log('Done');

                                    if (tutor_tutorials.done_tutor_tutorials_length >= tutor_tutorials.get_done_tutor_tutorials().length) {
                                        console.log('No More Pending Data 2');
                                        doneInfiniteScroll.disabled = true;
                                    }
                                } else {
                                    console.log('No More Pending Data 1');
                                    doneInfiniteScroll.disabled = true;
                                }
                            });

                            tutor_tutorials_done_loaded = true;
                        }
                    }
                });
            }

            if (!tutor_tutorials_event_listener_added) {
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
                        
                        let this_tutorial = tutor_tutorials.getTutorTutorialDetailsById(tutorial.getAttribute('post_id'), tutorial_status);

                        if (tutorial_status == "In negotiation") {
                            tutorial_status = "Pending";
                        }
                        let active_component = await nav_controller.getActive();
                        
                        console.log(tutorial_status);
                        console.log("Active thign") 
                        console.log(active_component);

                        if (tutorial_status == "Pending" && active_component.component == "nav-my-tutorials") {
                            if (!this_tutorial.post_agreement_offered) {
                                load_pending_tutorial_component_not_signed(nav_controller, this_tutorial);
                            } else {
                                load_pending_tutorial_component_signed(nav_controller, this_tutorial, tutorial_status, tutorial_tag)
                            }
                        } else if (tutorial_status == "Ongoing" && active_component.component == "nav-my-tutorials") {
                            console.log(this_tutorial)
                            load_ongoing_tutorial_component(nav_controller, this_tutorial, tutorial_tag, tutorial_status);
                        } else if(tutorial_status == "Done" && active_component.component == "nav-my-tutorials") {
                            load_done_tutorial_component(nav_controller, this_tutorial, tutorial_tag, tutorial_status);
                        }
                    }
                });

                tutor_tutorials_event_listener_added = true;
            }
        }

        disconnectedCallback() {
            tutor_tutorials_ongoing_loaded = false;
            tutor_tutorials_done_loaded = false;
            
            active_tutor_segment = "Pending";
            
            console.log('Custom square element removed from page.');
        }

        adoptedCallback() {
            console.log('Custom square element moved to new page.');
        }

        attributeChangedCallback() {
            console.log("Attribute changed?")
        }
    });

    nav_controller.push('nav-my-tutorials');
}  

//function load_ongoing_tutorial_component(this_tutorial, tutorial_status, tutorial_tag) {
//    let tutor_tutorial_element = document.createElement('tutorial');
//    let tutor_tutorial_element_html = `
//                            <ion-header translucent>
//                                <ion-toolbar>
//                                    <ion-buttons onclick="device_feedback()" slot="start">
//                                        <ion-back-button defaultHref="/"></ion-back-button>
//                                    </ion-buttons>
//                                    <ion-buttons onclick="device_feedback()" slot="end">
//                                        <ion-menu-button></ion-menu-button>
//                                    </ion-buttons>
//                                    <ion-title><h1>Tutorial</h1></ion-title>
//                                </ion-toolbar>
//                            </ion-header>
//
//                            <ion-content fullscreen>
//                                <ion-item style="margin-top:10px;" lines="none">
//                                    <ion-avatar style="width: 100px;height: 100px;" slot="start">
//                                        <img src="${this_tutorial.std_avatar}">
//                                    </ion-avatar>
//                                    <ion-label>
//                                        <h2><strong>${this_tutorial.std_name}</strong></h2>
//                                        <p>${this_tutorial.std_email}</p>
//                                    </ion-label><p class="date">${formatDate(this_tutorial.post_posted_on)}</p>
//                                </ion-item>
//
//
//                                <ion-item-divider class="divider"></ion-item-divider>
//                                <ion-item lines="none">
//                                    
//                                        <h6><strong>${this_tutorial.post_title}</strong></h6>
//                                    
//                                </ion-item>
//                                <ion-item style="margin-top:-10px;" lines="none">
//                                    <p>
//                                        ${this_tutorial.post_desc}
//                                    </p>
//                                </ion-item>
//                                        <ion-chip class="module" color="primary">
//                                    <ion-icon name="star"></ion-icon>
//                                    <ion-label>${tutorial_tag}</ion-label>
//                                </ion-chip>
//                                <!--<ion-chip class="module2" color="danger">
//                                  <ion-icon name="close"></ion-icon>
//                                  <ion-label>Closed</ion-label>
//                                </ion-chip>-->
//                                <ion-chip color="success">
//                                    <ion-icon name="swap"></ion-icon>
//                                    <ion-label>${tutorial_status}</ion-label>
//                                </ion-chip>
//                                 <ion-item-divider class="divider2"></ion-item-divider>   
//                                <div class="ion-padding-top">
//                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="view_agreement">View agreement</ion-button>
//                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
//                                </div> 
//                                 <ion-item-divider class="divider2"></ion-item-divider> 
//                            <ion-item lines="none">
//                                                            <ion-label>
//                                                                <h2><strong>Tutorial stage</strong></h2>
//                                                            </ion-label>
//                                                        </ion-item>
//                                                            <div class="wrapper">
//                                                            <ul class="StepProgress">
//                                                              <li class="StepProgress-item is-done"><strong>Open</strong>
//                                                              <span>Your tutorial has been requested successfully, it has currently not been assigned to a tutor.</span>
//                                                              </li>
//                                                              <li class="StepProgress-item is-done"><strong>Pending</strong>
//                                                              <span>A tutor has been assigned, the tutor will contact you via email to generate an agreement.</span>
//                                                              </li>
//                                                              <li class="StepProgress-item current"><strong>Ongoing</strong>
//                                                              <span>Agreement has been generated and signed by both tutor & student, tutorial will take place on agreed time and date.</span>
//                                                              </li>
//                                                              <li class="StepProgress-item"><strong>Done</strong>
//                                                              <span>Tutorial has been compeleted.</span>
//                                                              </li>
//                                                            </ul>
//                                                        </div><br><br>
//                                                    </ion-content>`;
//
//    tutor_tutorial_element.innerHTML = tutor_tutorial_element_html;
//    nav.push(tutor_tutorial_element);
//}

function done_tutorial_component(this_tutorial, tutorial_status, tutorial_tag) {
    let tutor_info = "";
    if(this_tutorial.std_email !== user.getEmail()) {
        tutor_info = `<ion-item-divider class="divider"></ion-item-divider><ion-item lines="none"><h6><strong>Tutor's Information</strong></h6></ion-item><ion-item style="margin-top:-10px;margin-bottom: -30px;" lines="none"><p style="font-size: 14px;margin-left: 3px;"><strong>Name:</strong> ${this_tutorial.post_tutor_name}<br><strong>Email:</strong> ${this_tutorial.post_tutor_email}</p></ion-item>`;
    }
    let tutor_tutorial_element = document.createElement('tutorial');
    let tutor_tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons onclick="device_feedback()" slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons onclick="device_feedback()" slot="end">
                                        <ion-menu-button></ion-menu-button>
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
                                
                                ${tutor_info}

                                <ion-item-divider class="divider"></ion-item-divider>
                                <ion-item lines="none">
                                    
                                        <h6><strong>${this_tutorial.post_title}</strong></h6>
                                    
                                </ion-item>
                                <ion-item style="margin-top:-15px;" lines="none">
                                    <p>
                                        ${this_tutorial.post_desc}
                                    </p>
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
                                <div class="ion-padding-top">
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="view_agreement">View agreement</ion-button>
                                    <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="primary" id="verify_agreement">Check agreement validity</ion-button>
                                </div> 
                                 <ion-item-divider class="divider2"></ion-item-divider> 
                            <ion-item lines="none">
                                                            <ion-label>
                                                                <h2><strong>Tutorial stage</strong></h2>
                                                            </ion-label>
                                                        </ion-item>
                                                            <div class="wrapper">
                                                            <ul class="StepProgress">
                                                              <li class="StepProgress-item is-done"><strong>Open</strong>
                                                              <span>Your tutorial has been requested successfully, it has currently not been assigned to a tutor.</span>
                                                              </li>
                                                              <li class="StepProgress-item is-done"><strong>Pending</strong>
                                                              <span>A tutor has been assigned, the tutor will contact you via email to generate an agreement.</span>
                                                              </li>
                                                              <li class="StepProgress-item is-done"><strong>Ongoing</strong>
                                                              <span>Agreement has been generated and signed by both tutor & student, tutorial will take place on agreed time and date.</span>
                                                              </li>
                                                              <li class="StepProgress-item" current><strong>Done</strong>
                                                              <span>Tutorial has been compeleted.</span>
                                                              </li>
                                                            </ul>
                                                        </div>
                                                        <ion-item-divider class="divider"></ion-item-divider>
                                                            <ion-list-header class="collapsible">
                                                                <strong>TUTORIAL LINKS</strong>
                                                            </ion-list-header>
                                                        <ion-list class="content">
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/js/', '_system', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">JavaScript tutorial</ion-label>
                                                            </ion-item>
                                                            <ion-item onclick="cordova.InAppBrowser.open('https://www.w3schools.com/html/', '_system', 'location=yes');">
                                                                <ion-label style="font-style: italic; text-decoration: underline;" color="primary">HTML tutorial</ion-label>
                                                            </ion-item>
                                                        </ion-list>   
                                                        <ion-button expand="block" type="button" class="ion-margin ion-color ion-color-primary md button button-block button-solid ion-activatable ion-focusable hydrated" color="danger" id="cancel_tutorial">Cancel Tutorial</ion-button>
                                                    </ion-content>`;

    tutor_tutorial_element.innerHTML = tutor_tutorial_element_html;
    
    //TUTORIAL LINKS ACCORDION
        if (document.getElementsByClassName("collapsible") !== null) {
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
              coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight){
                  content.style.maxHeight = null;
                } else {
                  content.style.maxHeight = content.scrollHeight + "px";
                } 
              });
            }
        }
        
    nav.push(tutor_tutorial_element);
}