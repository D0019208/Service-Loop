"use strict"
var notifications_object
var unopened_notifications_counter = 0;
var user;
var user_notifications;
var tutorials;
var tutor_tutorials;
var nav;
var posts;
var notification_posts;
var current_tab;
var previous_tab;
var signaturePad;
var active_nav;

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
document.addEventListener("DOMContentLoaded", async function () {
    user = new User();
    let home_component;
    let notifications_response;
    let tab_controller = document.getElementById('tabs');
    current_tab = 'home';
    previous_tab = 'home';
    //Check to make sure that the users session has not expired
    //await user.check_session();

    //Once we are sure that the users session is valid, we populate the User class
    //user.setName(await get_secure_storage("user_name"));
    //user.setEmail(await get_secure_storage("users_email"));
    //user.setStatus(JSON.parse(await get_secure_storage("user_status")) ? "Tutor" : "Student");

    ////Set status of user to tutor
    user.setName("Nichita Postolachi");
    user.setStatus("Tutor");
    user.setEmail("nikito888@gmail.com");
    //Set status of user to student
    //user.setName("Test User");
    //user.setStatus("Student");
    //user.setEmail("D00192082@student.dkit.ie");

    //If a user is a tutor, then he has modules he can offer and thus he can view the forum
    //and he cannot apply to become a tutor again

    console.log(notifications_response);
    //Define our Navigation controller for the home tab
    nav = document.getElementById('nav-home');
    //Shows tutorial slides
    let tab_bar = document.querySelector('ion-tab-bar');
    tab_bar.style.display = 'none';
    let tutorial_slides = document.createElement('tutorial_slides');
    tutorial_slides.innerHTML = `<ion-header translucent>
      <ion-toolbar>
        <ion-title><h1>Slides</h1></ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-slides pager="true">

        <ion-slide>
            
          <img src="images/slide-1.png"/>
          
          
        </ion-slide>

        <ion-slide>
          <img src="images/slide-3.png"/>
        </ion-slide>

        <ion-slide>
          <h2>Ready to Start?</h2>
          <img src="images/success_blue1.png" alt=""/>
          <br>
          <p><input type="checkbox" name="checkbox" value="check" id="agree" /> Do not show again</p>
          <ion-button id="continue_slides" fill="clear" >Continue <ion-icon slot="end" name="arrow-forward"></ion-icon></ion-button>
        </ion-slide>

      </ion-slides>
    </ion-content>`;
    nav.push(tutorial_slides);
    
    let closeTutorial;
    let closeTutorialHandler = async function () {
        device_feedback();
        tab_bar.style.display = 'flex';
        nav.pop();
    }
    
    let ionNavDidChangeEvent = async function () {
        if (document.getElementById('continue_slides') !== null) {
            closeTutorial = document.getElementById("continue_slides");
            closeTutorial.addEventListener('click', closeTutorialHandler, false);
        }

        let active_component = await nav.getActive();

        //Remove the event listener when we no longer need it
        if (active_component.component.tagName !== "TUTORIAL_SLIDES") {
            if (typeof closeTutorial !== 'undefined') {
            closeTutorial.removeEventListener("click", closeTutorialHandler, false);
            nav.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
        }
        }
    };

    nav.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
    
    //Controler for enabling the back button for Ionic Router, needs to be updated with all new components added
    document.addEventListener("backbutton", async function () {
        let selected_tab = await tab_controller.getSelected();
        console.log(selected_tab)

        let home_active_component = await nav.getActive();
        //Checking if the main home nav router is defined
        if (typeof nav !== 'undefined') {
            //Checking if the notifications nav router is defined
            if (typeof nav_notifications !== 'undefined') {
                //We check here if there is an open component
                let can_go_back_home = await nav.canGoBack();
                //If there is an active component and the active compoent matches our criteria, we go back
                if (can_go_back_home) {
                    nav.pop();
                }

                //let notifications_active_component = await nav_notifications.getActive();
                let can_go_back_notifications = await nav_notifications.canGoBack();
                console.log(can_go_back_notifications)

                //Check if the routers have any content, if not, we go back to the previous content, if empty, go to previous tab
                if (can_go_back_notifications) {
                    nav_notifications.pop();
                } else {
                    if (current_tab !== previous_tab) {
                        tab_controller.select(previous_tab);
                    }
                }

                //If there is no active component in either the notifications router or home router, we exit the app
                if (!can_go_back_notifications && !can_go_back_home && selected_tab === "home") {
                    navigator.app.exitApp();
                }
            } else {
                //If the nav_notifications router is not defined we check if the main router can go back
                let can_go_back_home = await nav.canGoBack();
                //Check if the routers have any content, if not, we go back to the previous content, if empty, go to previous tab
                if (can_go_back_home) {
                    nav.pop();
                } else {
                    if (current_tab !== previous_tab) {
                        tab_controller.select(previous_tab);
                    }
                }

                console.log(home_active_component)

                if (!can_go_back_home && selected_tab === "home") {
                    navigator.app.exitApp();
                }
            }
        }
    }, false);
    //Create home component 
    customElements.define('nav-home', class Home extends HTMLElement {
        async connectedCallback() {
            active_nav = nav;
            if (user.getStatus() === "Tutor") {
                //user.setModules(JSON.parse(await get_secure_storage("user_modules")));
                user.setModules(["PHP", "JavaScript", "Java"]);
                home_component = `<ion-header translucent>
                            <ion-toolbar>
                                <ion-buttons slot="start">
                                    <ion-back-button></ion-back-button>
                                </ion-buttons>
                                <ion-buttons slot="end">
                                    <ion-menu-button></ion-menu-button>
                                </ion-buttons>
                                <ion-title>
                                    <h1 style="margin-left: 8%;">Student Loop</h1>
                                </ion-title>
                            </ion-toolbar>
                        </ion-header>

                        <ion-content fullscreen class="ion-padding back">
                            <!--<ion-content padding>
                                <ion-button expand="block" onclick="openMenu()">Open Menu</ion-button>
                            </ion-content>-->
                            
                            <ion-avatar id="profile_home" style="width: 80px;height: 80px; margin: auto; margin-top: -5px;" >
                                <img src="images/avatar.jpg">
                            </ion-avatar>
                            <ion-label style="text-align:center;">
                                <h1 style="color:white;"><strong id="user_name">John</strong></h1>
                                <p style="color:white;" id="user_email">D00194503@student.dkit.ie</p>
                                <br>
                                <h2 style="color:white; margin-top:-5px;"><strong id="user_status">Student</strong></h2>
                                <br>
                            </ion-label>
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
                                <ion-list class='home_buttons ion-activatable ripple' id='my_tutorials'>
                                    <h6>My tutorials</h6>
                                    <p>View all tutorials that are tutored by you</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_post' src="images/i_posts.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple' id='my_requested_tutorials'>
                                    <h6>My requested tutorials</h6>
                                    <p>View all the tutorials requested by you</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_exchange' src="images/i_exchange.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list> 
                                <!--<ion-item onclick="navigateForward()">
                                    Navigate Forward
                                </ion-item>-->


                            </div>
                        </ion-content>`;
                //We get all the users notifications based off his email and modules
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
                                    <h1 style="margin-left: 8%;">Student Loop</h1>
                                </ion-title>
                            </ion-toolbar>
                        </ion-header>

                        <ion-content fullscreen class="ion-padding back">
                            <!--<ion-content padding>
                                <ion-button expand="block" onclick="openMenu()">Open Menu</ion-button>
                            </ion-content>-->
                            <ion-avatar id="profile_home" style="width: 80px;height: 80px; margin: auto; margin-top: -5px;" >
                                <img src="images/avatar.jpg">
                            </ion-avatar>
                            <ion-label style="text-align:center;">
                                <h1 style="color:white;"><strong id="user_name">John</strong></h1>
                                <p style="color:white;" id="user_email">D00194503@student.dkit.ie</p>
                                <br>
                                <h2 style="color:white; margin-top:-5px;"><strong id="user_status">Student</strong></h2>
                                <br>
                            </ion-label>
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
                                    <p>Apply to be a tutor here</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_search' src="images/i_search.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
            
                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple' id="my_requested_tutorials">
                                    <h6>My requested tutorials</h6>
                                    <p>View all the tutorials requested by you</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_exchange' src="images/i_exchange.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>  
                            </div>
                        </ion-content>`;
                //We get all the users notificatios based only on his email as the user is not a tutor
                notifications_response = await access_route({users_email: user.getEmail(), user_tutor: {is_tutor: false, user_modules: user.getModules()}}, "get_all_notifications");
            }

            this.innerHTML = home_component;
            //Hide splashscreen
            //navigator.splashscreen.hide();

            //Update the users UI depending on what the user is
            document.getElementById('user_name').innerText = user.getName();
            if (user.getStatus() === "Tutor") {
                document.getElementById('user_status').innerText = "TUTOR";
            } else {
                document.getElementById('user_status').innerText = "STUDENT";
            }

            //Update the users Email depending on what the users email is
            document.getElementById('user_email').innerText = user.getEmail();
            //Update the users UI depending on what the user is
            document.getElementById('user_name_menu').innerText = user.getName();
            //Update the users Email depending on what the users email is
            document.getElementById('user_email_menu').innerText = user.getEmail();
            //If the user is a tutor, we display the forum else we have a button to apply to become a tutor
            if (user.getStatus() === "Tutor") {
                await include("js/modules/index/forum_module.js", "forum_script");
                let handler = () => {
                    device_feedback();
                    //Remember to move this to new file
                    all_tutorials(nav);
                };
                document.getElementById('all_tutorials').addEventListener('click', handler);
            } else {
                await include("js/modules/index/apply_to_be_tutor_module.js", "apply_to_be_tutor_script");
                //To later remove the event listener, we create a reference to the function and we pass the handler to that function so that we can later remove the event listener
                let handler = function () {
                    device_feedback();
                    apply_to_be_tutor(handler);
                };
                document.getElementById("home_tutor_application").addEventListener('click', handler, false);
            }

            user.createWebSocketConnection();
            if (user.getStatus() === "Tutor") {
                posts = new Posts({response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
                tutorials = new Tutorials({response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
                tutor_tutorials = new Tutor_Tutorials({response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
                posts.waitForNewTutorials();
            } else {
                posts = new Posts({response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
                tutorials = new Tutorials({response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
                tutor_tutorials = new Tutor_Tutorials({response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getSocket());
            }

            posts.waitForTutorialAccepted();
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
            //Create post tutorial page
            document.getElementById('post_tutorial').addEventListener('click', async function () {
                device_feedback();
                await include("js/modules/index/request_tutorial_module.js", "request_tutorial_script");
                load_request_tutorial();
            });
            //Create My Requested Tutorials page
            document.getElementById('my_requested_tutorials').addEventListener('click', async function () {
                device_feedback();
                await include("js/modules/index/my_tutorials_module.js", "my_requested_tutorials_script");
                load_my_requested_tutorials();
            });
            //Create My Profile page
            document.getElementById('profile').addEventListener('click', async function () {
                device_feedback();
                await include("js/modules/index/profile_module.js", "profile_script");
                load_profile_page(active_nav);
                closeMenu();
            });
            document.getElementById('profile_home').addEventListener('click', async function () {
                device_feedback();
                await include("js/modules/index/profile_module.js", "profile_script");
                console.log("Active now");
                console.log(active_nav);
                load_profile_page(active_nav);
                closeMenu();
            });
            //Create My Tutorials page (If user is Tutor)
            if (user.getStatus() == "Tutor") {
                user_notifications.wait_for_agreement_rejected();
                document.getElementById('my_tutorials').addEventListener('click', async function () {
                    device_feedback();
                    await include("js/modules/index/tutor_tutorials_module.js", "my_tutorials_script");
                    all_tutor_tutorials(active_nav);
                });
            }

        }

        //Callback to call when component is removed
        disconnectedCallback() {
            console.log('Custom square element removed from page.');
        }

        adoptedCallback() {
            console.log('Custom square element moved to new page.');
        }

        attributeChangedCallback(name, oldValue, newValue) {
//        switch (name) {
//            case 'value':
//                console.log(`Value changed from ${oldValue} to ${newValue}`);
//                break;
//            case 'max':
//                console.log(`You won't max-out any time soon, with ${newValue}!`);
//                break;
//        }
            console.log("Attribute changed?")
        }

    });
    document.querySelector("ion-tabs").addEventListener('click', function (event) {
        console.log("??")
        console.log(event)

        if (event.target.innerText == "Home" || event.target.parentNode.innerText == "Home" || event.target.innerText == "Notifications" || event.target.parentNode.innerText == "Notifications" || event.target.innerText == "Settings" || event.target.parentNode.innerText == "Settings") {
            console.log("test")
            nav.popToRoot();
            if (event.target.innerText == "Home") {
                if (typeof nav !== 'undefined') {
                    active_nav = nav;
                }
            } else if (event.target.innerText == "Notifications") {
                if (typeof nav_notifications !== 'undefined') {
                    active_nav = nav_notifications;
                }
            } else if (event.target.innerText == "Settings") {
                if (typeof nav_settings !== 'undefined') {
                    active_nav = nav_settings;
                }
            }

            if (typeof nav_notifications !== 'undefined') {
                nav_notifications.popToRoot();
            }
        }
    });
    //Lazy loading - once user clicks on tab, only then do we launch JavaScript
    document.querySelector("ion-tabs").addEventListener('ionTabsWillChange', async function (event) {
        previous_tab = current_tab;
        current_tab = await tab_controller.getSelected();
        console.log("previous tab " + previous_tab);
        console.log('current tab ' + current_tab)

        if (event.detail.tab === "notifications") {
            await include("js/modules/index/notifications_module.js", "notifications_script");
        } else if (event.detail.tab === "settings") {
            await include("js/modules/index/settings_module.js", "settings_script");
        }
    });
});
