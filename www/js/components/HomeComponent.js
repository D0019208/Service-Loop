class Home extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        let home_component;
        let notifications_response;

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
            //We get all the users notificatios based only on his email as the user is not a tutor
            notifications_response = await access_route({users_email: user.getEmail(), user_tutor: {is_tutor: false, user_modules: user.getModules()}}, "get_all_notifications");
        }

        this.innerHTML = home_component;

        //Update the users UI depending on what the user is
        document.getElementById('user_name').innerText = user.getName();
        if (user.getStatus() === "Tutor") {
            document.getElementById('user_status').innerText = "Tutor";
        } else {
            document.getElementById('user_status').innerText = "Student";
        }

        //If the user is a tutor, we display the forum else we have a button to apply to become a tutor
        if (user.getStatus() === "Tutor") {
            let handler = () => {
                //Remember to move this to new file
                all_tutorials(nav);
            };
            document.getElementById('all_tutorials').addEventListener('click', handler);
        } else {
            //To later remove the event listener, we create a reference to the function and we pass the handler to that function so that we can later remove the event listener
            let handler = function () {
                apply_to_be_tutor(handler);
            };
            document.getElementById("home_tutor_application").addEventListener('click', handler, false);
        }

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

        //Create post tutorial page
        document.getElementById('post_tutorial').addEventListener('click', async function () {
            customElements.get('nav-post-tutorial') || customElements.define('nav-post-tutorial', RequestTutorial);
            nav.push('nav-post-tutorial');
        });
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

}