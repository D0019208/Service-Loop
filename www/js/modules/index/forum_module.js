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
    //Check to see if we have already quereyd the database for posts, if not, we query
    if (!posts_loaded) {
        console.log("dsfds")
        posts_response = await access_route({email: user.getEmail(), user_modules: user.getModules()}, "get_all_posts");
        posts.addPosts(posts_response.response);
    }

    //We define our component, this will display all the requested Tutorials
    customElements.get('nav-all-tutorials') || customElements.define('nav-all-tutorials', class NavViewAllTutorials extends HTMLElement {
        connectedCallback() {
            //The UI of the component
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
                                                      <ion-list-header id="posts_header">
                                                          ALL REQUESTED TUTORIALS
                                                      </ion-list-header><!--<p>Manage information about you...</p>--> 

                                                      <ion-infinite-scroll threshold="100px" id="forum-infinite-scroll">
                                                          <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                                                          </ion-infinite-scroll-content>
                                                      </ion-infinite-scroll>
                                                  </ion-list>
                                              </ion-content>
                                              `;

            //Add element after another element
            let referenceNode = document.getElementById("posts_header");
            let post_list_element = document.createElement("ion-list");

            post_list_element.setAttribute("id", "forum_list");
            post_list_element.classList = "ion-activatable ripple offer";

            // Insert the new node before the reference node
            referenceNode.parentNode.insertBefore(post_list_element, referenceNode.nextSibling);

            //We set the posts length to 0 as when you first launch the component you do not see the elements scrolled thus we need to reset the value
            posts.posts_length = 0;

            //List element we are appending our tutorial requests to
            const list = document.getElementById('forum_list');
            const infiniteScroll = document.getElementById('forum-infinite-scroll');

            //The number of posts we will add, this is calculated later
            let number_of_posts_to_add;

            //If there are no tutorial requests we display a message
            if (posts.getTotalPosts() === 0) {
                document.getElementById("posts_header").innerText = "THERE ARE NO TUTORIAL REQUESTS!";
            } else {
                /*
                 * We add an event listener to the infinite-scroll element that when the scroll reaches
                 * the bottom, it appends new elements
                 */
                infiniteScroll.addEventListener('ionInfinite', async function () {
                    console.log(posts.posts_length)
                    console.log(posts.getAllPosts().length);

                    if (posts.posts_length < posts.getAllPosts().length - 1) {
                        console.log('Loading data...');
                        await wait(500);
                        infiniteScroll.complete();

                        number_of_posts_to_add = posts.getAllPosts().length - posts.posts_length;

                        posts.appendPosts(number_of_posts_to_add, list);
                        console.log('Done');

                        if (posts.posts_length > posts.getAllPosts().length - 1) {
                            console.log('No More Data');
                            infiniteScroll.disabled = true;
                        }
                    } else {
                        console.log('No More Data');
                        infiniteScroll.disabled = true;
                    }
                });

                //If we have less than 7 tutorial requests we display all of them otherwise we display only 7
                if (posts.getAllPosts().length <= 3) {
                    posts.appendPosts(posts.getAllPosts().length, list);
                } else {
                    posts.appendPosts(3, list);
                }
            }






            if (!posts_loaded) {
                posts_loaded = true;
                document.querySelector('body').addEventListener('click', async function (event) {
                    //Get closest element with specified class
                    let post = getClosest(event.target, '.post');
                    //let notification_tags = [];

                    //If there exists an element with the specified target near the clicked 
                    //if (notification !== null) {
                    //    notification_tags.push(notification.getAttribute('notification_tags'));
                    //}

                    console.log(post);
                    //If we clicked on a post
                    if (post) {
                        //Find a post from posts object that matches the ID of the clicked element.
                        let this_post = posts.getPostDetailsById(post.getAttribute('post_id'));

                        let modules = "";

                        for (let i = 0; i < this_post.post_modules.length; i++) {
                            modules += '<ion-chip class="module" color="primary"><ion-icon name="star"></ion-icon><ion-label>' + this_post.post_modules[i] + '</ion-label></ion-chip>';
                        }

                        let nav_post = document.createElement('nav-post');
                        nav_post.innerHTML = `<ion-header translucent>
                            <ion-toolbar>
                                    <ion-buttons slot="start">
                                        <ion-back-button defaultHref="/"></ion-back-button>
                                    </ion-buttons>
                                <ion-title><h1>Request Description</h1></ion-title>
                            </ion-toolbar>
                        </ion-header>
                
                        <ion-content fullscreen>
                        <ion-item style="margin-top:10px;" lines="none">
                          <ion-avatar style="width: 100px;height: 100px;" slot="start">
                            <img src="${this_post.std_avatar}">
                          </ion-avatar>
                          <ion-label>
                            <h2><strong>${this_post.std_name}</strong></h2>
                            <p>${this_post.std_email}</p>
                          </ion-label>
                        </ion-item>
                            
                            <ion-item-divider class="divider"></ion-item-divider>
                        <ion-item lines="none">
                            <ion-label>
                                <h2><strong>${this_post.post_title}</strong></h2>
                            </ion-label>
                        </ion-item>
                        <ion-item style="margin-top:-15px;" lines="none">
                            <ion-label>
                                <h2>${this_post.post_desc}</h2>
                            </ion-label>
                        </ion-item>
                            
                        ${modules}
                            
                            <ion-item-divider class="divider2"></ion-item-divider>
                            <ion-button expand="block" type="submit" class="ion-margin accept_request_btn" id="accept_request_btn">Accept Request</ion-button>
                        </ion-content>
                                              `;
















                        nav.push(nav_post);

                        let accept_tutorial_request_button;

                        let event_handler = function () {
                            device_feedback();

                            create_ionic_alert("Accept tutorial", "Are you sure you want to accept this tutorial? You cannot unasign yourself (yet) after you have accepted a tutorial.", [
                                {
                                    text: 'Accept',
                                    handler: () => {
                                        console.log('Accepted');
                                        accept_post(nav, this_post, post, true);
                                    }
                                },
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    handler: () => {
                                        console.log('Cancel')
                                    }
                                }
                            ]); 
                        };

                        let ionNavDidChangeEvent = async function () {
                            if (document.getElementById('accept_request_btn') !== null) {
                                accept_tutorial_request_button = document.getElementById('accept_request_btn');

                                accept_tutorial_request_button.addEventListener('click', event_handler, false);
                            }

                            let notifications_active_component = await nav.getActive();

                            if (notifications_active_component.component === "nav-all-tutorials") {
                                accept_tutorial_request_button.removeEventListener("click", event_handler, false);
                                nav.removeEventListener("ionNavDidChange", ionNavDidChangeEvent, false);
                            }
                        };

                        nav.addEventListener('ionNavDidChange', ionNavDidChangeEvent, false);
                    }
                });
            }
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

    nav.push('nav-all-tutorials');
} 