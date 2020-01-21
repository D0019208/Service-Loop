/*
 * A function that handles the interaction for applying to be a tutor. Once the tutor application is successful, we need to remove the event listener
 * calling this function and update the data
 * 
 * @param {function} handler - This is the reference to this function, we need this to remove the event listener
 * 
 * @returns {Null} This function DOES NOT return anything
 */
async function apply_to_be_tutor(handler) {
    let currentModal = null;
    const controller = document.querySelector('ion-modal-controller');

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

    modal_created.present().then(function () {
        currentModal = modal_created;
        let tutor_apply_button = document.getElementById("tutor_apply");

        tutor_apply_button.addEventListener('click', async function() {
            tutor_apply_button.disabled = true;

            
                let data = {
                    users_email: user.getEmail(),
                    users_skills: document.getElementById("tutor_modules").value
                };
                
                if(data["users_email"] === "" || data["users_skills"].length === 0) {
                    tutor_apply_button.disabled = false;
                    create_ionic_alert("Tutor application failed", "Please fill in all required fields to proceed.", ["OK"]);
                    return;
                } 

                let tutor_added_response = await access_route(data, "appply_to_be_tutor");

                if (!tutor_added_response.error) {
                    //We update the user so he becomes a tutor
                    user.ascendToTutor(user_notifications, document.getElementById("tutor_modules").value, handler)
                    user.setModules(document.getElementById("tutor_modules").value);
                    
                    create_ionic_alert("Tutor application successfull", "Congratulations! You have become a tutor for DKIT!", ["OK"], function () {
                        return dismissModal(currentModal);
                    });
                } else {
                    tutor_apply_button.disabled = false;
                    create_ionic_alert("Tutor application failed", tutor_added_response.response, ["OK"]);
                }
            

        });

        document.getElementById("modal_close").addEventListener('click', () => {
            dismissModal(currentModal);
        });
    });
}