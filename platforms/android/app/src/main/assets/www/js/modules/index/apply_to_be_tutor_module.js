/*
 * A function that handles the interaction for applying to be a tutor. Once the tutor application is successful, we need to remove the event listener
 * calling this function and update the data
 * 
 * @param {function} handler - This is the reference to this function, we need this to remove the event listener
 * 
 * @returns {Null} This function DOES NOT return anything
 */
function apply_to_be_tutor(handler) {
    customElements.get('nav-apply_to_be_tutor') || customElements.define('nav-apply_to_be_tutor', class Apply_To_Be_Tutor extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.innerHTML = `
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>Tutor application form</ion-title>
            <ion-buttons onclick="device_feedback()" slot="start">
                <ion-back-button id="apply_to_be_tutor_back" defaultHref="/"></ion-back-button>
              </ion-buttons>
              <ion-buttons slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
              <ion-list class="fields" style="text-align:center;">
            <p>Please complete this form to apply to become a tutor. A member of DkIT will contact you via email.</p>
            
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
            <ion-label align="center">Subject offered <ion-text color="danger">*</ion-text></ion-label>
                <ion-select multiple="true" cancel-text="Cancel" ok-text="Add skills" id="tutor_modules">
                  <ion-select-option value="Java">Java</ion-select-option>
                            <ion-select-option value="ASP.NET">ASP.NET</ion-select-option>
                            <ion-select-option value="CSS">CSS</ion-select-option>
                            <ion-select-option value="Databases">Databases</ion-select-option>
                            <ion-select-option value="HTML">HTML</ion-select-option>
                            <ion-select-option value="Java">Java</ion-select-option>
                            <ion-select-option value="JavaScript">JavaScript</ion-select-option>
                            <ion-select-option value="Networking">Networking</ion-select-option>
                            <ion-select-option value="Visual Basic">Visual Basic</ion-select-option>
                </ion-select>
        </ion-item>

        <div class="ion-padding-top">
          <ion-button expand="block" type="button" class="ion-no-margin" id="tutor_apply">Apply to be a tutor</ion-button>
        </div>
            <p style="text-align: center; color: gray;">By agreeing to be a tutor for DKIT, you agree to our <a href="#">Terms and Conditions</a></p>

          </ion-content>
        `;

            let tutor_apply_button = document.getElementById("tutor_apply");

            tutor_apply_button.addEventListener('click', async function () {
                device_feedback();
                tutor_apply_button.disabled = true;


                let data = {
                    users_email: user.getEmail(),
                    users_skills: document.getElementById("tutor_modules").value
                };

                if (data["users_email"] === "" || data["users_skills"].length === 0) {
                    tutor_apply_button.disabled = false;
                    create_ionic_alert("Tutor application failed", "Please fill in all required fields to proceed.", ["OK"]);
                    return;
                }

                let tutor_added_response = await access_route(data, "appply_to_be_tutor");

                if (!tutor_added_response.error) {
                    //We update the user so he becomes a tutor
                    user.setStatus("Tutor");
                    user.setModules(document.getElementById("tutor_modules").value);
                    
                    set_secure_storage("user_status", true);
                    set_secure_storage("user_modules", document.getElementById("tutor_modules").value); 
                    user.ascendToTutor(user_notifications, document.getElementById("tutor_modules").value, handler); 
                } else {
                    tutor_apply_button.disabled = false;
                    create_ionic_alert("Tutor application failed", tutor_added_response.response, ["OK"]);
                }


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

    });
    nav.push('nav-apply_to_be_tutor');
}