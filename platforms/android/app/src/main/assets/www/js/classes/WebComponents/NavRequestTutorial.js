class NavHome extends HTMLElement {
    constructor() {
    super();
  }
  
    connectedCallback() {
        this.innerHTML = `
        <ion-header translucent>
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
                                <ion-list class='home_buttons ion-activatable ripple'>
                                    <h6>Look For Offer</h6>
                                    <p>Some text about look for offer</p>
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
}