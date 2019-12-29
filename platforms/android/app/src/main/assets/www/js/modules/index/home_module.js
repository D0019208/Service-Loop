"use strict"
var notifications_object
var unopened_notifications_counter = 0;
var user;
var user_notifications;

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}, false;

/*
 ******************************************************************************************************************
 ******************************************************************************************************************
 **************************************************DOM STARTS******************************************************
 ******************************************************************************************************************
 ******************************************************************************************************************
 */
//deviceready
//DOMContentLoaded
document.addEventListener("deviceready", async function () {
    user = new User();
    let home_component;
    let notifications_response;

    await user.check_session();

    user.setName(await get_secure_storage("user_name"));
    user.setEmail(await get_secure_storage("users_email"));
    user.setStatus(JSON.parse(await get_secure_storage("user_status")) ? "Tutor" : "Student");

    ////Set status of user to tutor
    //user.setName("Joe Postolachi")
    //user.setStatus("Student");
    //user.setEmail("D00192082@student.dkit.ie");

    //If a user is a tutor, then he has modules he can offer
    if (user.getStatus() === "Tutor") {
        user.setModules(JSON.parse(await get_secure_storage("user_modules")));
        //user.setModules(["PHP", "JavaScript"]);

        home_component = `<ion-header translucent>
                            <ion-toolbar>
                                <ion-buttons slot="start">
                                    <ion-back-button></ion-back-button>
                                </ion-buttons>
                                <ion-buttons slot="end">
                                    <ion-menu-button></ion-menu-button>
                                </ion-buttons>
                                <ion-title>
                                    <h1>Service Loop</h1>
                                </ion-title>
                            </ion-toolbar>
                        </ion-header>

                        <ion-content fullscreen class="ion-padding back">
                            <!--<ion-content padding>
                                <ion-button expand="block" onclick="openMenu()">Open Menu</ion-button>
                            </ion-content>-->
                            <h2 class="user_name"><strong>Welcome <p style="margin-top:0px;" id="user_name">John</p> <p style="margin-top:0px;" id="user_status">Student</p></strong></h2>
                            <div class="white_backgound">
                                <br><br><br>
                                <!--<ion-button expand="block" >Post Offer</ion-button>
                                <ion-button expand="block" >Look For Offer</ion-button>
                                <ion-button expand="block" >My Posts</ion-button>
                                <ion-button expand="block" >Ongoing Exchanges</ion-button>-->

                                <ion-list class='home_buttons ion-activatable ripple' id="post_tutorial">
                                    <h6>Request a tutorial</h6>
                                    <p>Request our tutors for a tutorial for a particular module</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_post' src="images/i_post.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>

                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple' id="all_tutorials">
                                    <h6>All tutorial requests</h6>
                                    <p>View all the requested tutorials on the forum</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_search' src="images/i_search.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
            
                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple'>
                                    <h6>My Posts</h6>
                                    <p>Some text about my post</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_post' src="images/i_posts.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple'>
                                    <h6>Ongoing Exchanges</h6>
                                    <p>Some text about ongoing exchanges</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_exchange' src="images/i_exchange.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list> 
                                <!--<ion-item onclick="navigateForward()">
                                    Navigate Forward
                                </ion-item>-->


                            </div>
                        </ion-content>`;

        notifications_response = await access_route({users_email: user.getEmail(), user_tutor: {is_tutor: true, user_modules: user.getModules()}}, "get_all_notifications");
    } else {
        home_component = `<ion-header translucent>
                            <ion-toolbar>
                                <ion-buttons slot="start">
                                    <ion-back-button></ion-back-button>
                                </ion-buttons>
                                <ion-buttons slot="end">
                                    <ion-menu-button></ion-menu-button>
                                </ion-buttons>
                                <ion-title>
                                    <h1>Service Loop</h1>
                                </ion-title>
                            </ion-toolbar>
                        </ion-header>

                        <ion-content fullscreen class="ion-padding back">
                            <!--<ion-content padding>
                                <ion-button expand="block" onclick="openMenu()">Open Menu</ion-button>
                            </ion-content>-->
                            <h2 class="user_name"><strong>Welcome <p style="margin-top:0px;" id="user_name">John</p> <p style="margin-top:0px;" id="user_status">Student</p></strong></h2>
                            <div class="white_backgound">
                                <br><br><br>
                                <!--<ion-button expand="block" >Post Offer</ion-button>
                                <ion-button expand="block" >Look For Offer</ion-button>
                                <ion-button expand="block" >My Posts</ion-button>
                                <ion-button expand="block" >Ongoing Exchanges</ion-button>-->

                                <ion-list class='home_buttons ion-activatable ripple' id="post_tutorial">
                                    <h6>Request a tutorial</h6>
                                    <p>Request our tutors for a tutorial for a particular module</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_post' src="images/i_post.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>

                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple' id="home_tutor_application">
                                    <h6>Apply to be a tutor</h6>
                                    <p>Have you got what it takes to be a tutor? Apply today!</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_search' src="images/i_search.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
            
                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple'>
                                    <h6>My Posts</h6>
                                    <p>Some text about my post</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_post' src="images/i_posts.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple'>
                                    <h6>Ongoing Exchanges</h6>
                                    <p>Some text about ongoing exchanges</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_exchange' src="images/i_exchange.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
                                <!--<ion-item onclick="navigateForward()">
                                    Navigate Forward
                                </ion-item>-->


                            </div>
                        </ion-content>`;

        notifications_response = await access_route({users_email: user.getEmail(), user_tutor: {is_tutor: false, user_modules: user.getModules()}}, "get_all_notifications");
    }

    const nav = document.getElementById('nav-home');

    //Create home component 
    customElements.define('nav-home', class NavHome extends HTMLElement {
        connectedCallback() {
            this.innerHTML = home_component;

            if (user.getStatus() === "Tutor") {
                document.getElementById('all_tutorials').addEventListener('click', async function () {
                    let posts_response = await access_route({users_email: user.getEmail()}, "get_all_posts");

                    customElements.get('nav-all-tutorials') || customElements.define('nav-all-tutorials', class NavViewAllTutorials extends HTMLElement {
                        connectedCallback() {
                            this.innerHTML = `
                                                <ion-header translucent>
                                                  <ion-toolbar>
                                                      <ion-buttons slot="start">
                                                      <ion-back-button defaultHref="/"></ion-back-button>
                                                    </ion-buttons>
                                                      <ion-buttons slot="end">
                                                          <ion-menu-button></ion-menu-button>
                                                      </ion-buttons>
                                                      <ion-title>
                                                          <h1>Forum</h1>
                                                      </ion-title>
                                                  </ion-toolbar>
                                              </ion-header>

                                              <ion-content fullscreen>
                                                  <!-- <h2><a href="login.html">Home</a></h2>-->
                                                  <ion-list>
                                                      <ion-list-header>
                                                          ALL REQUESTED TUTORIALS
                                                      </ion-list-header><!--<p>Manage information about you...</p>-->

                                                      <ion-list id="list"></ion-list>

                                                      <ion-infinite-scroll threshold="100px" id="infinite-scroll">
                                                          <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                                                          </ion-infinite-scroll-content>
                                                      </ion-infinite-scroll>
                                                  </ion-list>
                                              </ion-content>
                                              `;


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

                    nav.push('nav-all-tutorials');
                });
            } else {
                document.getElementById("home_tutor_application").addEventListener('click', async function () {
                    let tutor_years = [3, 4];
                    let modal_text = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>Tutor application form</ion-title>
              <ion-buttons slot="end">
                <ion-button id="modal_close">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
              <ion-list class="fields" style="text-align:center;">
            <p><strong>Apply to become a tutor here</strong></p>
            <p>Please fill out this form to apply to become a tutor. A memeber of DKIT will then contact you regarding your application.</p>
            
              </ion-list>
        <ion-list lines="full" class="ion-no-margin ion-no-padding fields">
            <ion-item class="line">
            </ion-item>
          
        <ion-item>
            <ion-label align="center">Year of study <ion-text color="danger">*</ion-text></ion-label>
                <ion-select multiple="false" cancel-text="Cancel" ok-text="Okay" id="tutor_year_of_study">
                  <ion-select-option value="3">3</ion-select-option>
                  <ion-select-option value="4">4</ion-select-option>     
                </ion-select>
        </ion-item> 
    
        <ion-item>
            <ion-label align="center">Modules offered <ion-text color="danger">*</ion-text></ion-label>
                <ion-select multiple="true" cancel-text="Cancel" ok-text="Add skills" id="tutor_modules">
                  <ion-select-option value="HTML5">HTML5</ion-select-option>
                  <ion-select-option value="CSS3">CSS3</ion-select-option>    
                  <ion-select-option value="JavaScript">JavaScript</ion-select-option>
                  <ion-select-option value="PHP">PHP</ion-select-option>
                  <ion-select-option value="Java">Java</ion-select-option>
                  <ion-select-option value="C++">C++</ion-select-option>
                  <ion-select-option value="Maths">Maths</ion-select-option>
                </ion-select>
        </ion-item>

        <div class="ion-padding-top">
          <ion-button expand="block" type="button" class="ion-no-margin" id="tutor_apply">Apply to be a tutor</ion-button>
        </div>
            <p style="text-align: center; color: gray;">By agreeing to be a tutor for DKIT, you agree to our <a href="#">Terms and Conditions</a></p>

          </ion-content>
        `;

                    let modal_created = await createModal(controller, modal_text);

                    modal_created.present().then(() => {
                        currentModal = modal_created;
                        let tutor_apply_button = document.getElementById("tutor_apply");

                        tutor_apply_button.addEventListener('click', async () => {
                            tutor_apply_button.disabled = true;

                            if (!tutor_years.includes(parseInt(document.getElementById('tutor_year_of_study').value))) {
                                tutor_apply_button.disabled = false;
                                create_ionic_alert("Tutor application failed", "You must be a 3rd or 4th year student to apply to be a tutor!", ["OK"]);
                            } else {
                                let data = {
                                    users_email: user.getEmail(),
                                    users_skills: document.getElementById("tutor_modules").value
                                };

                                for (var key in data) {
                                    if (data[key] === "") {
                                        create_ionic_alert("Tutor application failed", "Please fill in all required fields to proceed.", ["OK"]);
                                        return;
                                    }
                                }

                                let tutor_added_response = await access_route(data, "appply_to_be_tutor");

                                if (!tutor_added_response.error) {
                                    create_ionic_alert("Tutor application successfull", "Congratulations! You have become a tutor for DKIT!", ["OK"], function () {
                                        return dismissModal(currentModal);
                                    });
                                } else {
                                    tutor_apply_button.disabled = false;
                                    create_ionic_alert("Tutor application failed", tutor_added_response.response, ["OK"], function () {
                                        return dismissModal(currentModal);
                                    });
                                }
                            }

                        });

                        document.getElementById("modal_close").addEventListener('click', () => {
                            dismissModal(currentModal);
                        });
                    });
                });
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

    user.createWebSocketConnection();

    //Create a Notifications class to store all the details and functions relating to the notifications
    //Extends User class
    if (typeof notifications_response === "string") {
        user_notifications = new Notifications(notifications_response, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
    } else {
        user_notifications = new Notifications(notifications_response.response, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
    }


    //Now that we have notifications, we need to add a badge to show all unread notifications
    user_notifications.addUnreadNotificationsToDOM();
    user_notifications.waitForNewNotifications();

    document.getElementById('user_name').innerText = user.getName();
    if (user.getStatus() === "Tutor") {
        document.getElementById('user_status').innerText = "Tutor";
    } else {
        document.getElementById('user_status').innerText = "Student";
    }

    //Lazy loading - once user clicks on tab, only then do we launch JavaScript
    document.querySelector("ion-tabs").addEventListener('ionTabsWillChange', function (event) {
        if (event.detail.tab === "notifications") {
            if (!document.getElementById("notifications_script")) {
                let notifications_script = document.createElement("script");
                notifications_script.type = "text/javascript";
                notifications_script.id = "notifications_script";
                notifications_script.src = "js/modules/index/notifications_module.js";
                document.querySelector('ion-tabs').appendChild(notifications_script);
            }
        } else if (event.detail.tab === "settings") {
            if (!document.getElementById("settings_script")) {
                let settings_script = document.createElement("script");
                settings_script.type = "text/javascript";
                settings_script.id = "settings_script";
                settings_script.src = "js/modules/index/settings_module.js";
                document.querySelector('ion-tabs').appendChild(settings_script);
            }
        }
    });

    let currentModal = null;
    const controller = document.querySelector('ion-modal-controller');

    //Create post tutorial page
    document.getElementById('post_tutorial').addEventListener('click', async function () {
        customElements.get('nav-post-tutorial') || customElements.define('nav-post-tutorial', class NavRequestTutorial extends HTMLElement {
            connectedCallback() {
                this.innerHTML = `
           <ion-header translucent>
            <ion-toolbar>
              <ion-title>Tutorial Request</ion-title>
              <ion-buttons slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
                <ion-buttons slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
              <ion-list class="fields" style="text-align:center;">
            <p><strong>Post a tutorial request</strong></p>
            <p>Please fill out the fields below to request a tutorial. Our tutors will assign you a date and time for a tutorial once they are available.</p>
            
              </ion-list>      
                <ion-list lines="full" class="ion-no-margin ion-no-padding fields">
                    <p></p>
                    <ion-item>
                        <ion-label align="center" position="stacked">Request Title <ion-text color="danger">*</ion-text></ion-label>
                        <ion-input align="center" placeholder="Brief request description" id="tutorial_title" required type="text"></ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label align="center" position="stacked">Request Description <ion-text color="danger">*</ion-text></ion-label>
                        <ion-textarea rows="6" align="center" placeholder="Tell us your request in detail" id="tutorial_description" required type="text"></ion-textarea>
                    </ion-item>

                    <ion-item lines="none">
                        <ion-label style="margin-top:-40px;" align="center" position="stacked">Offer Specific Skill<ion-text color="danger">*</ion-text></ion-label> 
                    </ion-item>

                    <ion-item style="margin-top:-30px;">

                        <ion-select class="my-select" multiple="true" cancel-text="Cancel" ok-text="Request" id="tutorial_modules" style="max-width:100%;">
                            <ion-select-option value="HTML5">HTML5</ion-select-option>
                            <ion-select-option value="CSS3">CSS3</ion-select-option>    
                            <ion-select-option value="JavaScript">JavaScript</ion-select-option>
                            <ion-select-option value="PHP">PHP</ion-select-option>
                            <ion-select-option value="Java">Java</ion-select-option>
                            <ion-select-option value="C++">C++</ion-select-option>
                            <ion-select-option value="Maths">Maths</ion-select-option>
                        </ion-select>
                    </ion-item>

                    <div class="ion-padding-top">
                        <ion-button expand="block" type="submit" class="ion-no-margin" id="request_tutorial">Request tutorial</ion-button>
                    </div>
                 
                    <p style="text-align: center; color: gray;">Please note that by requesting a tutorial you are agreeing to DKIT's <a href="#">Terms and Conditions</p>
                </ion-list>      
          </ion-content> 
        `;
                setTimeout(function () {
                    if (document.querySelector('.my-select') !== null) {
                        document.querySelector('.my-select').shadowRoot.querySelector('.select-icon').setAttribute('style', 'position:absolute; right:10px; bottom:15px');
                    }
                }, 50);

                let request_tutorial_button = document.getElementById("request_tutorial");

                request_tutorial_button.addEventListener('click', async () => {
                    request_tutorial_button.disabled = true;

                    let data = {
                        request_title: document.getElementById("tutorial_title").value,
                        request_description: document.getElementById("tutorial_description").value,
                        request_modules: document.getElementById("tutorial_modules").value,
                        users_email: user.getEmail()
                    };

                    for (var key in data) {
                        if (data[key] === "") {
                            create_ionic_alert("Tutorial request failed", "Please fill in all required fields to proceed.", ["OK"]);
                            return;
                        }
                    }

                    let tutorial_request_response = await access_route(data, "request_tutorial");

                    if (!tutorial_request_response.error) {
                        user_notifications.addToNotifications({notification_opened: false, _id: tutorial_request_response.response[1]._id, post_id: tutorial_request_response.response[0]._id, std_email: user.getEmail(), notification_avatar: "https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png", notification_title: "Tutorial request sent", notification_desc: tutorial_request_response.response[1].notification_desc, notification_desc_trunc: tutorial_request_response.response[1].notification_desc_trunc, notification_posted_on: tutorial_request_response.response[1].notification_posted_on, notification_modules: tutorial_request_response.response[1].notification_modules, notification_tags: tutorial_request_response.response[1].notification_tags});
                        user_notifications.sendNewNotification({notification_opened: false, _id: tutorial_request_response.response[2]._id, post_id: tutorial_request_response.response[0]._id, std_email: user.getEmail(), notification_avatar: "https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png", notification_title: "New tutorial request", notification_desc: tutorial_request_response.response[2].notification_desc, notification_desc_trunc: tutorial_request_response.response[2].notification_desc_trunc, notification_posted_on: tutorial_request_response.response[2].notification_posted_on, notification_modules: tutorial_request_response.response[2].notification_modules, notification_tags: tutorial_request_response.response[2].notification_tags})

                        create_ionic_alert("Tutorial request successfull", "Thank you for requesting a tutorial! A tutor will be with you as soon as possible.", ["OK"], function () {
                            document.querySelector("ion-back-button").click();
                        });
                    } else {
                        request_tutorial_button.disabled = false;
                        create_ionic_alert("Tutorial request failed", tutorial_request_response.response, ["OK"], function () {
                            document.querySelector("ion-back-button").click();
                        });
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

        nav.push('nav-post-tutorial');
    });
});
