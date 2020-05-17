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
                                                      <ion-buttons onclick="device_feedback()" slot="start">
                                                      <ion-back-button defaultHref="/"></ion-back-button>
                                                    </ion-buttons>
                                                      <ion-buttons onclick="device_feedback()" slot="end">
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
                                                      </ion-list-header>
            
                                                        <ion-refresher slot="fixed" id="forum_refresher">
                                                           <ion-refresher-content></ion-refresher-content>
                                                        </ion-refresher>

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
            const forum_refresher = document.getElementById('forum_refresher');

            forum_refresher.addEventListener('ionRefresh', async () => {
                let load_more_response = await access_route({email: user.getEmail(), user_modules: user.getModules()}, "get_all_posts");

                if (typeof load_more_response.response !== "string") {
                    //Update the posts object with the new reloaded values
                    posts.update_with_new_posts(load_more_response);
                }

                forum_refresher.complete();
            });


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
                    if (posts.posts_length < posts.getAllPosts().length - 1) {
                        await wait(500);
                        infiniteScroll.complete();

                        number_of_posts_to_add = posts.getAllPosts().length - posts.posts_length;

                        posts.appendPosts(number_of_posts_to_add, list);

                        if (posts.posts_length > posts.getAllPosts().length - 1) {
                            infiniteScroll.disabled = true;
                        }
                    } else {
                        infiniteScroll.disabled = true;
                    }
                });

                //If we have less than 7 tutorial requests we display all of them otherwise we display only 7
                if (posts.getAllPosts().length <= 4) {
                    posts.appendPosts(posts.getAllPosts().length, list);
                } else {
                    posts.appendPosts(4, list);
                }
            }






            if (!posts_loaded) {
                posts_loaded = true;
                document.querySelector('body').addEventListener('click', async function (event) {
                    //Get closest element with specified class
                    let post = getClosest(event.target, '.post');
                    let active_component = await nav.getActive();
                    
                    //If we clicked on a post
                    //NEEDS TO BE CHANGED!!!!!!!
                    if (post && active_component.component == "nav-all-tutorials") {
                        //Find a post from posts object that matches the ID of the clicked element.
                        load_new_tutorial_request_component(nav, {post_id: post.getAttribute('post_id')}, {post: post, is_forum: true});
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