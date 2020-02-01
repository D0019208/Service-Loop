let tutot_tutorials_response;
let tutot_tutorials_loaded = false;
let tutot_tutorials_event_listener_added = false;

let tutot_tutorials_open;
let tutot_tutorials_pending;
let tutot_tutorials_ongoing;
let tutot_tutorials_done;

let tutot_tutorials_pending_loaded = false;
let tutot_tutorials_ongoing_loaded = false;
let tutot_tutorials_done_loaded = false;

function all_tutor_tutorials() {
    customElements.get('nav-my-tutorials') || customElements.define('nav-my-tutorials', class RequestTutorial extends HTMLElement {
        constructor() {
            super();
        }

        async connectedCallback() {
            if (!tutot_tutorials_response) {
                let data = {
                    users_email: user.getEmail()
                };

                tutot_tutorials_response = await access_route(data, "get_all_tutor_tutorials");

                console.log("All tutorials");
                console.log(tutot_tutorials_response)

                tutot_tutorials_loaded = true;

                tutor_tutorials = new Tutor_Tutorials(tutot_tutorials_response, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
            }

            let html;
            if (tutot_tutorials_response.response === "There are no posts to display!") {
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
                    <ion-segment-button value="tutor_tutorials_pending_segment">
                        <ion-label>Pending</ion-label>
                        <IonBadge color="primary">0</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="tutor_tutorials_ongoing_segment">
                        <ion-label>Ongoing</ion-label>
                        <IonBadge color="primary">0</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="tutor_tutorials_done_segment">
                        <ion-label>Done</ion-label>
                        <IonBadge color="primary">0</IonBadge>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar> 
        </ion-header> 
        <ion-content fullscreen  class="ion-padding"> 
            <segment-content id="my_posts_content">  
                <ion-list id="tutor_tutorials_pending" class="hide">
                    <ion-list-header id="pending_tutor_tutorials_header">
                        NO PENDING TUTORIALS
                    </ion-list-header> 
                
                    <ion-infinite-scroll threshold="100px" id="pending-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="tutor_tutorials_ongoing" class="hide">
                    <ion-list-header id="ongoing_tutor_tutorials_header">
                        NO ONGOING TUTORIALS  
                    </ion-list-header>  
                
                    <ion-infinite-scroll threshold="100px" id="ongoing-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="tutor_tutorials_done" class="hide">
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
                    <ion-segment-button value="tutor_tutorials_pending_segment" checked>
                        <ion-label>Pending</ion-label>
                        <IonBadge color="primary">${tutor_tutorials.total_tutor_pending_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="tutor_tutorials_ongoing_segment">
                        <ion-label>Ongoing</ion-label>
                        <IonBadge color="primary">${tutor_tutorials.total_tutor_ongoing_tutorials}</IonBadge>
                    </ion-segment-button>
                    <ion-segment-button value="tutor_tutorials_done_segment">
                        <ion-label>Done</ion-label>
                        <IonBadge color="primary">${tutor_tutorials.total_tutor_done_tutorials}</IonBadge>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar> 
        </ion-header> 
        <ion-content fullscreen  class="ion-padding"> 
            <segment-content id="my_posts_content">  
                <ion-list id="tutor_tutorials_pending" class="hide">
                    <ion-list-header id="pending_tutor_tutorials_header">
                        ${tutor_tutorials.pending_tutor_tutorials.length ? "PENDING TUTORIALS" : "NO PENDING TUTORIALS"} 
                    </ion-list-header> 
                
                    <ion-infinite-scroll threshold="100px" id="pending-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="tutor_tutorials_ongoing" class="hide">
                    <ion-list-header id="ongoing_tutor_tutorials_header">
                        ${tutor_tutorials.ongoing_tutor_tutorials.length ? "ONGOING TUTORIALS" : "NO ONGOING TUTORIALS"}  
                    </ion-list-header>  
                
                    <ion-infinite-scroll threshold="100px" id="ongoing-tutorials-infinite-scroll">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                </ion-list>
                <ion-list id="tutor_tutorials_done" class="hide">
                    <ion-list-header id="done_tutor_tutorials_header">
                        ${tutor_tutorials.done_tutor_tutorials.length ? "DONE TUTORIALS" : "NO DONE TUTORIALS"}  
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
            tutor_tutorials.open_tutor_tutorials_length = 0;
            tutor_tutorials.pending_tutor_tutorials_length = 0;
            tutor_tutorials.ongoing_tutor_tutorials_length = 0;
            tutor_tutorials.closed_tutor_tutorials_length = 0;

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
                if (tutor_tutorials.open_tutorials_length < tutor_tutorials.get_open_tutorials().length) {
                    console.log('Loading data...');
                    await wait(500);
                    pendingInfiniteScroll.complete();

                    number_of_pending_tutor_tutorials_to_add = tutor_tutorials.get_open_tutorials().length - tutor_tutorials.open_tutorials_length;

                    tutor_tutorials.open_tutorials_length = tutor_tutorials.appendPosts(number_of_pending_tutor_tutorials_to_add, pendingInfiniteScroll, tutor_tutorials.open_tutorials, tutor_tutorials.open_tutorials_length);

                    console.log('Done');

                    if (tutor_tutorials.open_tutorials_length >= tutor_tutorials.get_open_tutorials().length) {
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
                        segment_elements.ongoing.classList.add("hide");
                        segment_elements.pending.classList.remove("hide");
                        segment_elements.done.classList.add("hide");
                    } else if (ev.detail.value === "tutor_tutorials_ongoing_segment") {
                        segment_elements.ongoing.classList.remove("hide");
                        segment_elements.pending.classList.add("hide");
                        segment_elements.done.classList.add("hide");

                        //Add the infinite scroll listener
                        if (!tutot_tutorials_ongoing_loaded || document.getElementById('tutor_tutorials_ongoing').childElementCount <= 2) {
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

                            tutot_tutorials_ongoing_loaded = true;
                        }
                    } else if (ev.detail.value === "tutor_tutorials_done_segment") {
                        segment_elements.done.classList.remove("hide");
                        segment_elements.pending.classList.add("hide");
                        segment_elements.ongoing.classList.add("hide");

                        //Add the infinite scroll listener
                        if (!tutot_tutorials_done_loaded || document.getElementById('tutor_tutorials_done').childElementCount <= 2) {
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

                            tutot_tutorials_done_loaded = true;
                        }
                    }
                });
            }

            if (!tutot_tutorials_event_listener_added) {
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

                        let tutor_tutorial_element = document.createElement('tutorial');
                        let tutor_tutorial_element_html;

                        console.log(tutorial_status);

                        if (tutorial_status == "Pending") { 
                            let date = new Date();
                            let year = date.getFullYear(); 
                            let current_date = year + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
                            console.log(current_date);
                            console.log(year)
                            tutor_tutorial_element_html = `
                                <ion-header translucent>
                                    <ion-toolbar>
                                        <ion-buttons slot="start">
                                            <ion-back-button defaultHref="/"></ion-back-button>
                                            </ion-buttons>
                                            <ion-buttons slot="end">
                                                <ion-menu-button></ion-menu-button>
                                            </ion-buttons>
                                        <ion-title><h1>Agreement Details</h1></ion-title>
                                    </ion-toolbar>
                                </ion-header>
                                <ion-content fullscreen> 
                                    <p class="center">Please enter the following details</p>
                                    <ion-item-divider class="divider">
                                    </ion-item-divider>
                                    <ion-item>
                                        <ion-label>Date <ion-text color="danger">*</ion-text></ion-label>
                                        <ion-datetime id="tutorial_date" value="${current_date}" min="${year}" max="${year}" placeholder="Select Date"></ion-datetime>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label>Duration <ion-text color="danger">*</ion-text></ion-label>
                                        <ion-datetime id="tutorial_time" display-format="HH:mm" value="00:00"></ion-datetime>
                                    </ion-item>

                                    <ion-item>
                                        <ion-label position="stacked">Location <ion-text color="danger">*</ion-text></ion-label>
                                        <ion-input id="tutorial_room" placeholder="P1119" required type="text"></ion-input>
                                    </ion-item>

                                    <br><br>
                                    <div class="wrapper">
                                        <canvas id="signature-pad" class="signature-pad" width=300 height=200></canvas>
                                    </div>
                                    <div style="text-align:center">
                                        <button id="save">Save</button>
                                        <button id="undo">Undo</button>
                                        <button id="clear">Clear</button>
                                    </div>

                                    <div class="ion-padding-top fields">
                                        <ion-button expand="block" id="generate_agreement" type="submit" class="ion-no-margin">Create agreement</ion-button>
                                    </div>
                                    <p class="success_text3">Please note, the student has to agree to the agreement before a tutorial can take place.</p> 
                                </ion-content>`;
                        } else if (tutorial_status == "Ongoing") {
                            tutor_tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons slot="end">
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
                            tutor_tutorial_element_html = `
                            <ion-header translucent>
                                <ion-toolbar>
                                    <ion-buttons slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                    <ion-buttons slot="end">
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


                        tutor_tutorial_element.innerHTML = tutor_tutorial_element_html;
                        nav.push(tutor_tutorial_element);

                        let generate_agreement_button;
                        let generate_agreement_handler = async function () {
                            device_feedback();

                            generate_agreement(tutorial);
                        }

                        let ionNavDidChangeEvent = async function () {
                            if (document.getElementById('signature-pad') !== null) {
                                await include("js/signature_pad.min.js", "signature_pad");
                                drawing_pad();
                                generate_agreement_button = document.getElementById("generate_agreement");
                                generate_agreement_button.addEventListener('click', generate_agreement_handler, false);
                            }

                            let notifications_active_component = await nav.getActive();

                            if (notifications_active_component.component === "nav-my-tutorials") {
                                generate_agreement_button.removeEventListener("click", generate_agreement_handler, false);
                                nav.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
                            }
                        };

                        nav.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
                    }
                });

                tutot_tutorials_event_listener_added = true;
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

    nav.push('nav-my-tutorials');
}

function drawing_pad() {
    signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)'
    });
    var saveButton = document.getElementById('save');
    var undoButton = document.getElementById('undo')
    var cancelButton = document.getElementById('clear');

    saveButton.addEventListener('click', function (event) {
        var data = signaturePad.toDataURL('image/png');
        console.log(data)
// Send data to server instead...
        //window.open(data);
    });

    undoButton.addEventListener('click', () => {
        var data = signaturePad.toData();
        if (data) {
            data.pop(); // remove the last dot or line
            signaturePad.fromData(data);
        }
    });

    cancelButton.addEventListener('click', function (event) {
        signaturePad.clear();
    });
}

async function generate_agreement(tutorial) { 
    let agreement_generated_response = await access_route({tutorial_id: tutorial.getAttribute('post_id'), email: user.getEmail(), name: user.getName(), tutorial_date: document.getElementById('tutorial_date').value, tutorial_time: document.getElementById('tutorial_time').value, tutorial_room: document.getElementById('tutorial_room').value, tutor_signature: signaturePad.toDataURL('image/png')}, "offer_agreement");
    
    if (!agreement_generated_response.error) {
        user_notifications.addToNotifications(agreement_generated_response.tutor_notification.response);
        //user_notifications.sendTutorialAcceptedNotification(agreement_generated_response.student_notification.response);
    } else {
        alert("Error")
    }
    
    console.log(agreement_generated_response);
}