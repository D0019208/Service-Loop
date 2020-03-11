function load_profile_page(nav_controller) {
    customElements.get('nav-profile') || customElements.define('nav-profile', class Profile extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            var currentModal;
            //Displays correct profile page based on user's status
            if (user.getStatus() === "Tutor") { 
                this.innerHTML = `
            <ion-header translucent>
            <ion-toolbar>
            <ion-buttons slot="start">
                        <ion-back-button onclick="device_feedback()" default-href="home"></ion-back-button>
                    </ion-buttons>
                    <ion-buttons slot="end">
                        <ion-menu-button></ion-menu-button>
                    </ion-buttons>
                <ion-title><h1>Profile</h1></ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content fullscreen>
        <ion-item style="margin-top:15px;" lines="none">
          <ion-avatar class="profile_avatar">
            <img id="user_avatar" src="${user.getAvatar() + "?" + performance.now()}">
          </ion-avatar>
            <div class='avatar'></div>
        </ion-item>
            <ion-fab>
                <ion-fab-button id="cameraTakePicture">
                  <ion-icon name="camera"></ion-icon>
                </ion-fab-button>
            </ion-fab>
            
        <ion-item lines="none" style="text-align:center;">
            <ion-label>
                <h2><strong id="user_name_profile">John</strong></h2>
                <p id="user_email_profile">D00194503@student.dkit.ie</p>
                <br>
                <h2><strong id="user_status_profile">TUTOR</strong></h2>
            </ion-label>
        </ion-item>
            
            <ion-item-divider class="divider"></ion-item-divider>
            
            
                <ion-list-header class="collapsible" onclick="device_feedback()">
                        <strong>MY TUTORIALS</strong>
                </ion-list-header>
            <ion-list class="content">
                <ion-item>
                  <ion-label>Open Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getOpenTutorials()}</ion-note>
                </ion-item>
                
                <ion-item>
                  <ion-label>Pending Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getPendingTutorials()}</ion-note>
                </ion-item>
                
                <ion-item>
                  <ion-label>Ongoing Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getOngoingTutorials()}</ion-note>
                </ion-item>
                
                <ion-item>
                  <ion-label>Finished Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getDoneTutorials()}</ion-note>
                </ion-item>
            </ion-list>
            
                <ion-list-header class="collapsible" onclick="device_feedback()">
                    <strong>MY TUTORED TUTORIALS</strong>
                </ion-list-header>
            <ion-list class="content">
                <ion-item>
                  <ion-label>Pending Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getPendingTutoredTutorials()}</ion-note>
                </ion-item>
                
                <ion-item>
                  <ion-label>Ongoing Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getOngoingTutoredTutorials()}</ion-note>
                </ion-item>

                <ion-item>
                  <ion-label>Finished Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getDoneTutoredTutorials()}</ion-note>
                </ion-item>
            </ion-list>
            
            <ion-list>
                <ion-list-header>
                  <strong>SKILLS</strong>
                </ion-list-header>
                <ion-button id="edit_skills" class='edit_skills' fill="outline" slot="end">Edit</ion-button>
                <ion-list id="profile_skills" style='margin-left:10px;'>
                </ion-list>
            </ion-list>
        </ion-content>
<ion-modal-controller></ion-modal-controller>

<ion-alert-controller></ion-alert-controller>
        `;
            } else {
                this.innerHTML = `
            <ion-header translucent>
            <ion-toolbar>
            <ion-buttons slot="start">
                                <ion-back-button onclick="device_feedback()" default-href="home"></ion-back-button>
                            </ion-buttons>
                            <ion-buttons slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
                <ion-title><h1>Profile</h1></ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content fullscreen>
        <ion-item style="margin-top:15px;" lines="none">
          <ion-avatar class="profile_avatar">
            <img id="user_avatar" src="${user.getAvatar() + "?" + performance.now()}">
          </ion-avatar>
            <div class='avatar'></div>
        </ion-item>
            <ion-fab>
                <ion-fab-button id="cameraTakePicture">
                  <ion-icon name="camera"></ion-icon>
                </ion-fab-button>
            </ion-fab>
            
        <ion-item lines="none" style="text-align:center;">
            <ion-label>
                <h2><strong id="user_name_profile">John</strong></h2>
                <p id="user_email_profile">D00194503@student.dkit.ie</p>
                <br>
                <h2><strong id="user_status_profile">TUTOR</strong></h2>
            </ion-label>
        </ion-item>
            
            <ion-item-divider class="divider"></ion-item-divider>
            
            
                <ion-list-header onclick="device_feedback()">
                        <strong>MY TUTORIALS</strong>
                </ion-list-header>
            <ion-list>
                <ion-item>
                  <ion-label>Open Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getOpenTutorials()}</ion-note>
                </ion-item>
                
                <ion-item>
                  <ion-label>Pending Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getPendingTutorials()}</ion-note>
                </ion-item>
                
                <ion-item>
                  <ion-label>Ongoing Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getOngoingTutorials()}</ion-note>
                </ion-item>
                
                <ion-item>
                  <ion-label>Finished Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">${user.getDoneTutorials()}</ion-note>
                </ion-item>
            </ion-list>
        </ion-content>
<ion-modal-controller></ion-modal-controller>

<ion-alert-controller></ion-alert-controller>
        `;
            }

            //Change user's info
            document.getElementById('user_name_profile').innerText = user.getName();
            document.getElementById('user_email_profile').innerText = user.getEmail();
            //Change user's skills
            if (user.getStatus() === "Tutor") {
                for (var i = 0; i < user.modules.length; i++) {
                    document.getElementById('profile_skills').innerHTML += ('<ion-chip color="primary"><ion-icon name="star"></ion-icon><ion-label>' + user.modules[i] + '</ion-label></ion-chip>');
                }
            }
            if (user.getStatus() === "Tutor") {
                document.getElementById('user_status_profile').innerText = "TUTOR";
            } else {
                document.getElementById('user_status_profile').innerText = "STUDENT";
            } 

            //var button = document.activeElement.tagName;
            //button.onclick = addItem;

            document.querySelector('body').addEventListener('click', function (event) {
                if (event.target.className.toLowerCase().includes('close')) {

                    event.target.parentElement.remove(event.target.parentElement.outerHTML);

                }
            });

            //ACCORDION for 'my tutorials' and 'my tutored tutorials'
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }

            //Displays gallery(for the user to select new avatar) when user clicks on the avatar
            document.getElementById("cameraTakePicture").addEventListener("click", cameraTakePicture);
            function cameraTakePicture() {
                navigator.camera.getPicture(onSuccess, onFail, {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
                });

                function onSuccess(imageData) {
                    var profile_avatar = document.getElementById('user_avatar');
                    profile_avatar.src = "data:image/jpeg;base64," + imageData;
                    
                    var home_avatar = document.getElementById("user_avatar_home");
                    home_avatar.src = "data:image/jpeg;base64," + imageData;
                    
                    (async () => {
                        let response = await access_route({email: user.getEmail(), image: imageData}, "update_avatar"); 
                        user.setAvatar(response); 
                    })();

                }

                function onFail(message) {
                    alert('Failed because: ' + message);
                }
            }

            //Displays edit skill page
            document.getElementById("edit_skills").addEventListener("click", async function () {
                device_feedback();
                let controller = document.querySelector('ion-modal-controller');

                let modal_content = `
                <ion-header translucent>
                  <ion-toolbar>
                    <ion-title>Edit Skills</ion-title>
                    <ion-buttons onclick="device_feedback()" slot="end">
                      <ion-button id="modal_close">Close</ion-button>
                    </ion-buttons>
                  </ion-toolbar>
                </ion-header>
                <ion-content fullscreen> 
                      <ion-list lines="full" class="ion-no-margin ion-no-padding fields3">
                    <ion-item>
                        <ion-select class="my-select" multiple="true" selected-text="Click to edit skills" cancel-text="Cancel" ok-text="save" id="profile_tutorial_modules" style="max-width:100%;">
                            <ion-select-option value="HTML5">HTML5</ion-select-option>
                            <ion-select-option value="CSS3">CSS3</ion-select-option>    
                            <ion-select-option value="JavaScript">JavaScript</ion-select-option>
                            <ion-select-option value="PHP">PHP</ion-select-option>
                            <ion-select-option value="Java">Java</ion-select-option>
                            <ion-select-option value="C++">C++</ion-select-option>
                            <ion-select-option value="Maths">Maths</ion-select-option>
                        </ion-select>
                    </ion-item>
                    <div id="p"></div>

                    <div>
                        <ion-button id="save_button" expand="block" type="submit" class="ion-no-margin">Save</ion-button>
                    </div>
                          </ion-list> 
              </ion-content>
              `

                let modal_created = await createModal(controller, modal_content);

                modal_created.present().then(() => {
                    currentModal = modal_created;

                    //Function that adds skill to the page
                    function addItem() { 
                        device_feedback();
                        var textInput = document.getElementById("profile_tutorial_modules");  //getting text input
                        var skill = textInput.value;   //getting value of text input element
                        var p = document.getElementById("p");  //getting element <ul> to add element to
                        p.innerHTML = "";
                        for (var i = 0; i < skill.length; i++) {
                            var li = '<ion-chip outline color="primary"><ion-icon name="star"></ion-icon><ion-label class="add_skill_label skill">' + skill[i] + '</ion-label></ion-chip>';  //creating li element to add
                            p.insertAdjacentHTML('afterbegin', li);    //inserting text into newly created <li> element
                        }
                    }
                    //Moves select icon to the side
                    setTimeout(function () {
                        if (document.querySelector('.my-select') !== null) {
                            document.querySelector('.my-select').shadowRoot.querySelector('.select-icon').setAttribute('style', 'position:absolute; right:10px; bottom:15px');
                        }
                    }, 100);
                    //Runs addItem() function when user clicks save button in the select menu
                    const ion_select = document.querySelector('ion-select');
                    ion_select.addEventListener('ionChange', function () {
                        addItem();
                    });
                    ion_select.value = user.getModules(); 

                    document.getElementById('save_button').addEventListener('click', () => {
                        device_feedback();
                        let toast_buttons = [
                            {
                                side: 'end',
                                text: 'Close',
                                role: 'cancel',
                                handler: () => {
                                    console.log('Cancel clicked');
                                }
                            }
                        ];
                        //USE THIS TO REMOVE ELEMENT FROM MAIN PROFILE PAGE ON SAVE
                        //console.log(document.getElementById('profile_skills').children);
                        
                        console.log(document.getElementById('p').children);
                        let skills_array = [];
                        let skills_list = document.getElementById('p').children;
                        
                        for(let i = 0; i < skills_list.length; i++) {
                            skills_array.push(skills_list[i].innerText);
                        } 
                        
                        console.log(skills_array);
                        
                        access_route({users_email: user.getEmail(), skills: skills_array}, "edit_skills", false);

                        create_toast("Skills saved successfully.", "dark", 2000, toast_buttons); 
                        
                        dismissModal(currentModal);
                    });

                    document.getElementById("modal_close").addEventListener('click', () => {
                        dismissModal(currentModal);
                    });
                });
            })

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

    nav_controller.push('nav-profile');
}

