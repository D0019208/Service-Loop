function load_profile_page(nav_controller) {
    customElements.get('nav-profile') || customElements.define('nav-profile', class Profile extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            var currentModal;

            this.innerHTML = `
            <ion-header translucent>
            <ion-toolbar>
            <ion-buttons onclick="device_feedback()" slot="start">
                                <ion-back-button default-href="home"></ion-back-button>
                            </ion-buttons>
                            <ion-buttons onclick="device_feedback()" slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
                <ion-title><h1>Profile</h1></ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content fullscreen>
        <ion-item style="margin-top:15px;" lines="none">
          <ion-avatar class="profile_avatar">
            <img src="images/avatar.jpg">
          </ion-avatar>
            <div class='avatar'></div>
        </ion-item>
            <ion-fab>
                <ion-fab-button>
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
            
            
                <ion-list-header class="collapsible">
                        <strong>MY TUTORIALS</strong>
                </ion-list-header>
            <ion-list class="content">
                <ion-item>
                  <ion-label>Open Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">1</ion-note>
                </ion-item>
                <ion-item>
                  <ion-label>Ongoing Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">2</ion-note>
                </ion-item>

                <ion-item>
                  <ion-label>Pending Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">1</ion-note>
                </ion-item>
                
                <ion-item>
                  <ion-label>Finished Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">35</ion-note>
                </ion-item>
            </ion-list>
            
                <ion-list-header class="collapsible">
                    <strong>MY TUTORED TUTORIALS</strong>
                </ion-list-header>
            <ion-list class="content">
                <ion-item>
                  <ion-label>Ongoing Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">2</ion-note>
                </ion-item>

                <ion-item>
                  <ion-label>Pending Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">1</ion-note>
                </ion-item>
                
                <ion-item>
                  <ion-label>Finished Tutorials</ion-label>
                  <ion-note style='font-size: 0.9em;' slot="end" color="primary">35</ion-note>
                </ion-item>
            </ion-list>
            
            <ion-list>
                <ion-list-header>
                  <strong>SKILLS</strong>
                </ion-list-header>
                <ion-button id="edit_skills" class='edit_skills' fill="outline" slot="end">Edit</ion-button>
                <ion-list style='margin-left:10px;'>
                  <ion-chip color="primary">
                    <ion-icon name="star"></ion-icon>
                    <ion-label>JavaScript</ion-label>
                  </ion-chip>
                  <ion-chip color="primary">
                    <ion-icon name="star"></ion-icon>
                    <ion-label>C++</ion-label>
                  </ion-chip>
                  <ion-chip color="primary">
                    <ion-icon name="star"></ion-icon>
                    <ion-label>Java</ion-label>
                  </ion-chip>
                    <ion-chip color="primary">
                    <ion-icon name="star"></ion-icon>
                    <ion-label>PHP</ion-label>
                  </ion-chip>
                    <ion-chip color="primary">
                    <ion-icon name="star"></ion-icon>
                    <ion-label>Web Development</ion-label>
                  </ion-chip>
                </ion-list>
            </ion-list>
        </ion-content>
<ion-modal-controller></ion-modal-controller>

<ion-alert-controller></ion-alert-controller>
        `;

            //Change user's info
            document.getElementById('user_name_profile').innerText = user.getName();
            document.getElementById('user_email_profile').innerText = user.getEmail();
            if (user.getStatus() === "Tutor") {
                document.getElementById('user_status_profile').innerText = "TUTOR";
            } else {
                document.getElementById('user_status_profile').innerText = "STUDENT";
            }
            console.log(user.getModules());
            
            //var button = document.activeElement.tagName;
            //button.onclick = addItem;

            document.querySelector('body').addEventListener('click', function (event) {
                if (event.target.className.toLowerCase().includes('close')) {

                    event.target.parentElement.remove(event.target.parentElement.outerHTML);

                }
            });

            //ACCORDION
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

            document.getElementById("edit_skills").addEventListener("click", async function () {
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
                          <ion-item class='hide_this_input'>
                              <ion-input></ion-input>
                          </ion-item>
                          <p class="skills_text">Enter your skills bellow</p>
                          <ion-item id="p">
                              <ion-label class="add_skill_label" position="stacked">Add Skills <ion-text color="danger">*</ion-text></ion-label>
                              <ion-input id="item" placeholder="JavaScript" required type="text"></ion-input> 
                          </ion-item>
                          
                          <ion-button id="add_skill" fill="outline">Add Skill</ion-button> 
                          <div>
                              <ion-button id="save_button" expand="block" type="submit" class="ion-no-margin">Save</ion-button>
                          </div>
                          </ion-list> 
              </ion-content>
              `

                let modal_created = await createModal(controller, modal_content);

                modal_created.present().then(() => {
                    currentModal = modal_created;

                    function addItem() {
                        var textInput = document.getElementById("item");  //getting text input
                        var skill = textInput.value;   //getting value of text input element
                        var p = document.getElementById("p");  //getting element <ul> to add element to
                        if (skill.length > 2) {

                            var li = '<ion-chip outline color="primary"><ion-icon name="build"></ion-icon><ion-label class="add_skill_label skill">' + skill + '</ion-label><ion-icon class="close" name="close-circle"></ion-icon></ion-chip>';  //creating li element to add
                            p.insertAdjacentHTML('afterend', li);    //inserting text into newly created <li> element
                            document.getElementById('item').value = '';


                        } else {
                            //Add error handling for too small skill
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

                            create_toast("Skill must be at least 3 characters long.", "dark", 2000, toast_buttons);
                        }
                    }

                    document.getElementById('item').addEventListener('keypress', (event) => {
                        if (event.keyCode == '13') {
                            addItem();
                        }
                    });

                    document.getElementById('add_skill').addEventListener('click', (event) => {
                        addItem();
                    });

                    document.getElementById('save_button').addEventListener('click', () => {
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

                        create_toast("Skills saved successfully.", "dark", 2000, toast_buttons);
                        dismissModal(currentModal);
                    });

                    document.getElementById("modal_close").addEventListener('click', () => {
                        device_feedback();
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

