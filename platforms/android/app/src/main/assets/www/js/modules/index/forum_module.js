let posts_response;
let posts_loaded = false;

/*
 * A function that handles the forum functionality
 * 
 * @param {null} No parameters passed in
 * 
 * @returns {Null} This function DOES NOT return anything
 */
async function all_tutorials(nav) { 
    if (!posts_loaded) {
        posts_response = await access_route({user_modules: user.getModules()}, "get_all_posts");
    }
    console.log(posts_response);

    customElements.get('nav-all-tutorials') || customElements.define('nav-all-tutorials', class NavViewAllTutorials extends HTMLElement {
        constructor() {
            super();
        }

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

            //Add a new JS file to handle interaction of forum

        }

        disconnectedCallback() {
            posts_loaded = true;
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
}