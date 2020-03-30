"use strict"
var notifications_object;
var blockchain;
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
var push;

var new_message_ping = new Audio('sounds/new_message.mp3');
//var localhost = false;
var localhost = false;

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
let start = localhost ? "DOMContentLoaded" : "deviceready";
document.addEventListener(start, async function () {
    user = new User();
    let home_component;
    let notifications_response;
    let tab_controller = document.getElementById('tabs');
    let tutorial_slides_status = localStorage.getItem("tutorial_slides");
    current_tab = 'home';
    previous_tab = 'home';
    let name;

    if (!localhost) {
        //Once we are sure that the users session is valid, we populate the User class 
        name = await get_secure_storage("user_name");
        user.setName(name.replace(/\s+$/, ''));
        user.setEmail(await get_secure_storage("users_email"));

        if (IsJsonString(await get_secure_storage("user_status"))) {
            user.setStatus(JSON.parse(await get_secure_storage("user_status")) ? "Tutor" : "Student");
        }
    }

    if (localhost) {
        //Set status of user to tutor
//        user.setName("John Doe".replace(/\s+$/, ''));
//        user.setStatus("Student");
//        user.setEmail("D00192082@student.dkit.ie");

        //Set status of user to tutor
        user.setName("Nichita Postolachi".replace(/\s+$/, ''));
        user.setStatus("Tutor");
        user.setEmail("nikito888@gmail.com");
    }

    if (!localhost) {
        //Check to make sure that the users session has not expired
        await user.check_session(user.getEmail());
    } else {
        await user.check_session_local(user.getEmail())
    }
    //If a user is a tutor, then he has modules he can offer and thus he can view the forum
    //and he cannot apply to become a tutor again

    console.log(notifications_response);
    //Define our Navigation controller for the home tab
    nav = document.getElementById('nav-home');

    //Shows tutorial slides
    let tab_bar = document.querySelector('ion-tab-bar');
    //tab_bar.style.display = 'none';
    let tutorial_slides = document.createElement('tutorial_slides');
    tutorial_slides.innerHTML = `<ion-header translucent>
      <ion-toolbar>
        <ion-title><h1>Slides</h1></ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-slides pager="true">
        <div id="swipe" class="swipe-hint swipe-horizontal">
            <img src="images/swipe.png" alt=""/>
        </div>

        <ion-slide id="slide-1" style="background-color: black;">

              <img id="slide-1-img" style="opacity:0.4;" src="images/slide-1.png"/>
          
          
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
    //nav.push(tutorial_slides);



    if (tutorial_slides_status !== "false") {
        //Shows tutorial slides
        let tab_bar = document.querySelector('ion-tab-bar');
        tab_bar.style.display = 'none';
        let tutorial_slides = document.createElement('tutorial_slides');
        tutorial_slides.innerHTML = `<ion-header translucent>
          <ion-toolbar>
            <ion-title><h1>Tutorial</h1></ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content id="slides-content" fullscreen>
          <ion-slides pager="true">
            <div id="swipe" class="swipe-hint swipe-horizontal">
                <img src="images/swipe.png" alt=""/>
            </div>
        
            <ion-slide id="slide-1" style="background-color: black;">

              <img id="slide-1-img" style="opacity:0.4;" src="images/slide-1.png"/>


            </ion-slide>

            <ion-slide>
              <img src="images/slide-3.png"/>
            </ion-slide>

            <ion-slide>
              <h2>Ready to Start?</h2>
              <img src="images/success_blue1.png" alt=""/>
              <br>
              <p>
                <input type="checkbox" name="slides_check" id="show_tutorial_slides" value="slides_check"/>
                <label for="show_tutorial_slides">Do not show again</label> 
              </p>
              
              <ion-button id="continue_slides" fill="clear" >Continue <ion-icon slot="end" name="arrow-forward"></ion-icon></ion-button>
            </ion-slide>

          </ion-slides>
        </ion-content>`;
        nav.push(tutorial_slides);

        //Close Tutorial Slides
        let closeTutorial;
        let closeTutorialHandler = async function () {
            device_feedback();
            tab_bar.style.display = 'flex';
            var checkBox = document.getElementById("show_tutorial_slides");
            if (checkBox.checked == true) {
                localStorage.setItem("tutorial_slides", "false");
            } else {
                localStorage.setItem("tutorial_slides", "true");
            }
            nav.pop();
        }

        //Remove swipe gesture from the slides
        let removeSwipe;
        let removeSwipeHandler = async function () {
            document.getElementById("swipe").style.display = "none";
            document.getElementById("slide-1-img").style.opacity = "1";
            document.getElementById("slide-1").style.backgroundColor = "white";
        }

        let ionNavDidChangeEvent = async function () {
            if (document.getElementById('continue_slides') !== null) {
                closeTutorial = document.getElementById("continue_slides");
                closeTutorial.addEventListener('click', closeTutorialHandler, false);

                removeSwipe = document.getElementById("slides-content");
                removeSwipe.addEventListener('touchstart', removeSwipeHandler, false);


            }

            let active_component = await nav.getActive();


            //nav.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);

            //Remove the event listener when we no longer need it
            if (active_component.component.tagName !== "TUTORIAL_SLIDES") {
                if (typeof closeTutorial !== 'undefined') {
                    closeTutorial.removeEventListener("click", closeTutorialHandler, false);
                    removeSwipe.removeEventListener("touchstart", removeSwipeHandler, false);
                    nav.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
                }
            }
        };
        nav.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
    }

    //Create home component 
    customElements.define('nav-home', class Home extends HTMLElement {
        async connectedCallback() {
            active_nav = nav;
            document.getElementById('menu_avatar').src = user.getAvatar();

            if (user.getStatus() === "Tutor") {
                if (!localhost) {
                    user.setModules(JSON.parse(await get_secure_storage("user_modules")));
                } else {
                    user.setModules(["HTML", "JavaScript", "Java"]);
                }

                home_component = `<ion-header translucent>
                            <ion-toolbar>
                                <ion-buttons slot="start">
                                    <ion-back-button></ion-back-button>
                                </ion-buttons>
                                <ion-buttons onclick="device_feedback()" slot="end">
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
                                <img id="user_avatar_home" src=${user.getAvatar()}>
                            </ion-avatar>
                            <ion-label style="text-align:center;">
                                <h1 style="color:white;"><strong id="user_name">John</strong></h1>
                                <p style="color:white;" id="user_email">D00194503@student.dkit.ie</p>




                                <br>
                                <h2 style="color:white; margin-top:-5px;"><strong id="user_status">Student</strong></h2>
                                <br>
                            </ion-label>
                            <div class="white2"></div>
                            <div class="white_backgound">
                                <br><br><br>
                                <!--<ion-button expand="block" >Post Offer</ion-button>
                                <ion-button expand="block" >Look For Offer</ion-button>
                                <ion-button expand="block" >My Posts</ion-button>
                                <ion-button expand="block" >Ongoing Exchanges</ion-button>-->

                                <ion-list class='home_buttons ion-activatable ripple' id="post_tutorial">
                                    <h6>Request a tutorial</h6>
                                    <p>Request a tutorial from one of our available tutors</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_post' src="images/i_post.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>

                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple' id="all_tutorials">
                                    <h6>All tutorial requests</h6>
                                    <p>View all available requests</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_search' src="images/i_search.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
            
                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple' id='my_tutorials'>
                                    <h6>My tutorials</h6>
                                    <p>View tutorials accepted by me</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_post' src="images/i_posts.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
                                <hr><hr> 
                                <ion-list class='home_buttons ion-activatable ripple' id='my_requested_tutorials'>
                                    <h6>My requested tutorials</h6>
                                    <p>View my requests</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_exchange' src="images/i_exchange.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
                                
                                <hr><hr> 
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
                                <ion-buttons onclick="device_feedback()" slot="end">
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
                                <img id="user_avatar_home" src="${user.getAvatar()}">
                            </ion-avatar>
                            <ion-label style="text-align:center;">
                                <h1 style="color:white;"><strong id="user_name">John</strong></h1>
                                <p style="color:white;" id="user_email">D00194503@student.dkit.ie</p>
                                <br>
                                <h2 style="color:white; margin-top:-5px;"><strong id="user_status">Student</strong></h2>
                                <br>
                            </ion-label>
                            <div class="white2"></div>
                            <div class="white_backgound">
                                <br><br><br>
                                <!--<ion-button expand="block" >Post Offer</ion-button>
                                <ion-button expand="block" >Look For Offer</ion-button>
                                <ion-button expand="block" >My Posts</ion-button>
                                <ion-button expand="block" >Ongoing Exchanges</ion-button>-->

                                <ion-list class='home_buttons ion-activatable ripple' id="post_tutorial">
                                    <h6>Request a tutorial</h6>
                                    <p>Request a tutorial from one of our available tutors</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_post' src="images/i_post.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>

                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple' id="home_tutor_application">
                                    <h6>Apply to be a tutor</h6>
                                    <p>Submit an application to become a tutor today!</p>
                                    <img class='b_circle' src="images/circle.png" alt=""/>
                                    <img class='i_search' src="images/i_search.png" alt=""/>
                                    <ion-ripple-effect></ion-ripple-effect>
                                </ion-list>
            
                                <hr><hr>
                                <ion-list class='home_buttons ion-activatable ripple' id="my_requested_tutorials">
                                    <h6>My requested tutorials</h6>
                                    <p>View my requests</p>
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
            if (!localhost) {
                navigator.splashscreen.hide();
            }
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
                posts = new Posts(user.getId(), {response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getAvatar(), user.getOpenTutorials(), user.getPendingTutorials(), user.getOngoingTutorials(), user.getDoneTutorials(), user.getPendingTutoredTutorials(), user.getOngoingTutoredTutorials(), user.getDoneTutoredTutorials(), user.getSocket());
                tutorials = new Tutorials(user.getId(), {response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getAvatar(), user.getOpenTutorials(), user.getPendingTutorials(), user.getOngoingTutorials(), user.getDoneTutorials(), user.getPendingTutoredTutorials(), user.getOngoingTutoredTutorials(), user.getDoneTutoredTutorials(), user.getSocket());
                tutor_tutorials = new Tutor_Tutorials(user.getId(), {response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getAvatar(), user.getOpenTutorials(), user.getPendingTutorials(), user.getOngoingTutorials(), user.getDoneTutorials(), user.getPendingTutoredTutorials(), user.getOngoingTutoredTutorials(), user.getDoneTutoredTutorials(), user.getSocket());
                posts.waitForNewTutorials();
            } else {
                posts = new Posts(user.getId(), {response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getAvatar(), user.getOpenTutorials(), user.getPendingTutorials(), user.getOngoingTutorials(), user.getDoneTutorials(), user.getPendingTutoredTutorials(), user.getOngoingTutoredTutorials(), user.getDoneTutoredTutorials(), user.getSocket());
                tutorials = new Tutorials(user.getId(), {response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getAvatar(), user.getOpenTutorials(), user.getPendingTutorials(), user.getOngoingTutorials(), user.getDoneTutorials(), user.getPendingTutoredTutorials(), user.getOngoingTutoredTutorials(), user.getDoneTutoredTutorials(), user.getSocket());
                tutor_tutorials = new Tutor_Tutorials(user.getId(), {response: []}, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getAvatar(), user.getOpenTutorials(), user.getPendingTutorials(), user.getOngoingTutorials(), user.getDoneTutorials(), user.getPendingTutoredTutorials(), user.getOngoingTutoredTutorials(), user.getDoneTutoredTutorials(), user.getSocket());
            }

            blockchain = new Blockchain();

            posts.waitForTutorialAccepted();
            //Create a Notifications class to store all the details and functions relating to the notifications
            //Extends User class
            if (typeof notifications_response === "string") {
                user_notifications = new Notifications(user.getId(), notifications_response, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getAvatar(), user.getOpenTutorials(), user.getPendingTutorials(), user.getOngoingTutorials(), user.getDoneTutorials(), user.getPendingTutoredTutorials(), user.getOngoingTutoredTutorials(), user.getDoneTutoredTutorials(), user.getSocket());
            } else {
                user_notifications = new Notifications(user.getId(), notifications_response.response, user.getName(), user.getEmail(), user.getStatus(), user.getModules(), user.getAvatar(), user.getOpenTutorials(), user.getPendingTutorials(), user.getOngoingTutorials(), user.getDoneTutorials(), user.getPendingTutoredTutorials(), user.getOngoingTutoredTutorials(), user.getDoneTutoredTutorials(), user.getSocket());
            }

            //Setup push notifications
            if (!localhost) {
                push = new Push_Notifications("c08fd8bd-bfbf-4dd3-bc07-61d214842ccd");
                push.initialize();
                push.set_user_id(user.getEmail());
            }

            //Now that we have notifications, we need to add a badge to show all unread notifications
            user_notifications.addUnreadNotificationsToDOM();
            user_notifications.waitForNewNotifications();
            //Create post tutorial page
            document.getElementById('post_tutorial').addEventListener('click', async function () {
                device_feedback();
                await include("js/modules/index/request_tutorial_module.js", "request_tutorial_script");
                load_request_tutorial(active_nav);
            });
            //Create My Requested Tutorials page
            document.getElementById('my_requested_tutorials').addEventListener('click', async function () {
                device_feedback();
                await include("js/modules/index/my_tutorials_module.js", "my_requested_tutorials_script");
                load_my_requested_tutorials(active_nav);
            });
            //Create My Profile page
            document.getElementById('profile').addEventListener('click', async function () {
                device_feedback();

                if (active_nav.getElementsByTagName("NAV-PROFILE").length === 0) {
                    await include("js/modules/index/profile_module.js", "profile_script");
                    load_profile_page(active_nav);
                }
                closeMenu();
            });
            document.getElementById('request_tutorial_menu').addEventListener('click', async function () {
                device_feedback();

                if (active_nav.getElementsByTagName("NAV-POST-TUTORIAL").length === 0) {
                    await include("js/modules/index/request_tutorial_module.js", "request_tutorial_script");
                    load_request_tutorial(active_nav);
                }
                closeMenu();
            });
            document.getElementById('my_tutorials_menu').addEventListener('click', async function () {
                device_feedback();

                if (active_nav.getElementsByTagName("NAV-MY-REQUESTED-TUTORIALS").length === 0) {
                    await include("js/modules/index/my_tutorials_module.js", "my_requested_tutorials_script");
                    load_my_requested_tutorials(active_nav);
                }
                closeMenu();
            });
            document.getElementById('profile_home').addEventListener('click', async function () {
                device_feedback();

                if (active_nav.getElementsByTagName("NAV-PROFILE").length === 0) {
                    await include("js/modules/index/profile_module.js", "profile_script");
                    load_profile_page(active_nav);
                }

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
        console.log("Which tab clicked?")
        console.log(event)
        if (event.target.innerText == "Home" || event.target.parentNode.innerText == "Home") {
            device_feedback();

            if (typeof nav !== 'undefined') {
                active_nav = nav;

                nav.popToRoot();

                if (typeof nav_notifications !== 'undefined') {
                    nav_notifications.popToRoot();
                }

                if (typeof nav_settings !== 'undefined') {
                    nav_settings.popToRoot();
                }
            }
        } else if (event.target.innerText == "Notifications" || event.target.parentNode.innerText.includes("Notifications") || event.target.parentNode.innerText == "Notifications" || event.target.innerText.includes("Notifications")) {
            device_feedback();

            if (typeof nav_notifications !== 'undefined') {
                active_nav = nav_notifications;

                nav_notifications.popToRoot();

                if (typeof nav !== 'undefined') {
                    nav.popToRoot();
                }

                if (typeof nav_settings !== 'undefined') {
                    nav_settings.popToRoot();
                }
            }
        } else if (event.target.innerText == "Settings" || event.target.parentNode.innerText == "Settings") {
            device_feedback();

            if (typeof nav_settings !== 'undefined') {
                active_nav = nav_settings;

                nav_settings.popToRoot();

                if (typeof nav !== 'undefined') {
                    nav.popToRoot();
                }

                if (typeof nav_notifications !== 'undefined') {
                    nav_notifications.popToRoot();
                }
            }
        }
    });

    //Lazy loading - once user clicks on tab, only then do we launch JavaScript
    document.querySelector("ion-tabs").addEventListener('ionTabsWillChange', async function (event) {
        previous_tab = current_tab;
        current_tab = await tab_controller.getSelected();


        if (current_tab === 'home') {
            active_nav = nav;
        } else if (current_tab === 'notifications') {
            if (typeof nav_notifications !== 'undefined') {
                active_nav = nav_notifications;
            }
        } else {
            if (typeof nav_settings !== 'undefined') {
                active_nav = nav_settings;
            }
        }

        if (event.detail.tab === "notifications") {
            await include("js/modules/index/notifications_module.js", "notifications_script");
        } else if (event.detail.tab === "settings") {
            await include("js/modules/index/settings_module.js", "settings_script");
        }
    });


    //Controler for enabling the back button for Ionic Router, needs to be updated with all new components added
    document.addEventListener("backbutton", async function () {
        let selected_tab = await tab_controller.getSelected();
        let can_go_back = await active_nav.canGoBack();

        if (typeof currentModal !== 'undefined' && currentModal !== null) {
            currentModal = dismissModal(currentModal);
        } else {
            if (can_go_back) {
                active_nav.pop();
            }

            if (!can_go_back && selected_tab === "home") {
                navigator.app.exitApp();
            }

            if (!can_go_back && selected_tab !== "home") {
                if (current_tab !== previous_tab) {
                    tab_controller.select(previous_tab);
                }
            }
        }

    }, false);
});