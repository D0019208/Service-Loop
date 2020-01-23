class Posts extends User {
    constructor(posts, name, email, status, modules, socket) {
        super(name, email, status, modules, socket);

        this.all_posts = posts.response; 

        //Check to see if there are any posts (If empty, there will be a string)
        if (typeof posts.response !== "string") {
            this.total_posts = this.all_posts.length;
        } else {
            this.total_posts = 0;
        }

        this.posts_length = 0;
        console.log(this.all_posts);
    } 

    appendPosts(number, list) {
        let posts = this.getAllPosts();

        console.log('length is', this.posts_length);
        const originalLength = this.posts_length;
        
        for (var i = 0; i < number; i++) {
            const el = document.createElement('ion-list');
            el.className = "ion-activatable ripple";

//            if (posts[i + originalLength].notification_opened) {
//                read_class = "read";
//            } else {
//                read_class = "not_read";
//            }

            el.classList.add('ion-activatable', 'ripple', "not_read"); 
  
            el.innerHTML = `
                
                <ion-item lines="none" class="post" post_id="${posts[i + originalLength]._id}" post_modules="${posts[i + originalLength].post_modules.join(', ')}">
          <ion-avatar slot="start">
            <img src="https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png">
        </ion-avatar>
        <ion-label>
            <h2>${posts[i + originalLength].post_title}</h2>
            <span>${formatDate(posts[i + originalLength].post_posted_on)}</span>
            <p>${posts[i + originalLength].post_desc_trunc}</p>
        </ion-label>
            </ion-item>
            <ion-ripple-effect></ion-ripple-effect>
            
        `;
            list.appendChild(el);

            this.posts_length += 1;
        }
    } 
    
    getPostDetailsById(post_id) {
        for (let i = 0; i < this.all_posts.length; i++) {
            if (this.all_posts[i]._id == post_id) {
                return this.all_posts[i];
            }
        }
    }

    getTotalPosts() {
        return this.total_posts;
    }

    getAllPosts() {
        return this.all_posts;
    }
}