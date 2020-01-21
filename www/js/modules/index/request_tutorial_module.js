customElements.get('nav-post-tutorial') || customElements.define('nav-post-tutorial', class RequestTutorial extends HTMLElement {
    constructor() {
        super();
    }
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
        //Get the reference to the Request Tutorial button
        let request_tutorial_button = document.getElementById("request_tutorial");
        //Add an event listener to request a new tutorial on click
        request_tutorial_button.addEventListener('click', async () => {
            //Prevent the user from clicking the "Request Tutorial" button twice
            request_tutorial_button.disabled = true;
            //Data to pass to the server
            let data = {
                request_title: document.getElementById("tutorial_title").value,
                request_description: document.getElementById("tutorial_description").value,
                request_modules: document.getElementById("tutorial_modules").value,
                users_email: user.getEmail()
            };
            //Checking if any of the data is empty MIGHT NOT WORK
            for (var key in data) {
                if (data[key] === "") {
                    create_ionic_alert("Tutorial request failed", "Please fill in all required fields to proceed.", ["OK"]);
                    return;
                }
            }

            //Create new tutorial and get the response from the server
            let tutorial_request_response = await access_route(data, "request_tutorial");
            //If no error occured, we add a new notification to the users current notfifications that his request was successful
            if (!tutorial_request_response.error) {
                user_notifications.addToNotifications({notification_opened: false, _id: tutorial_request_response.response[1]._id, post_id: tutorial_request_response.response[0]._id, std_email: user.getEmail(), notification_avatar: "https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png", notification_title: "Tutorial request sent", notification_desc: tutorial_request_response.response[1].notification_desc, notification_desc_trunc: tutorial_request_response.response[1].notification_desc_trunc, notification_posted_on: tutorial_request_response.response[1].notification_posted_on, notification_modules: tutorial_request_response.response[1].notification_modules, notification_tags: tutorial_request_response.response[1].notification_tags});
                //Send a new notification to all tutors
                user_notifications.sendNewNotification({notification_opened: false, _id: tutorial_request_response.response[2]._id, post_id: tutorial_request_response.response[0]._id, std_email: user.getEmail(), notification_avatar: "https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png", notification_title: "New tutorial request", notification_desc: tutorial_request_response.response[2].notification_desc, notification_desc_trunc: tutorial_request_response.response[2].notification_desc_trunc, notification_posted_on: tutorial_request_response.response[2].notification_posted_on, notification_modules: tutorial_request_response.response[2].notification_modules, notification_tags: tutorial_request_response.response[2].notification_tags})

                create_ionic_alert("Tutorial request successfull", "Thank you for requesting a tutorial! A tutor will be with you as soon as possible.", ["OK"], function () {
                    document.querySelector("ion-back-button").click();
                });
            } else {
                //If an error occured, display an error and make the button clickable again
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