`<ion-header translucent>
            <ion-toolbar>
                    <ion-buttons slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
                <ion-title><h1>Tutorial</h1></ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content fullscreen>
            <ion-item style="margin-top:10px;" lines="none">
                <ion-avatar style="width: 100px;height: 100px;" slot="start">
                    <img src="${this_tutorial.std_avatar}">
                </ion-avatar>
                <ion-label>
                    <h2><strong>${this_tutorial.std_name}</strong></h2>
                    <p>${this_tutorial.std_email}</p>
                </ion-label><p class="date">${formatDate(this_tutorial.post_posted_on)}</p>
            </ion-item>


            <ion-item-divider class="divider"></ion-item-divider>
            <ion-item lines="none">
                <ion-label>
                    <h2><strong>${this_tutorial.post_title}</strong></h2>
                </ion-label>
            </ion-item>
            <ion-item style="margin-top:-15px;" lines="none">
                <h6>
                    ${this_tutorial.post_desc}
                </h6>
            </ion-item>
                    <ion-chip class="module" color="primary">
                <ion-icon name="star"></ion-icon>
                <ion-label>${tutorial_tag}</ion-label>
            </ion-chip>
            <!--<ion-chip class="module2" color="danger">
              <ion-icon name="close"></ion-icon>
              <ion-label>Closed</ion-label>
            </ion-chip>-->
            <ion-chip color="success">
                <ion-icon name="swap"></ion-icon>
                <ion-label>${tutorial_status}</ion-label>
            </ion-chip>
             <ion-item-divider class="divider2"></ion-item-divider>  
              <ion-item lines="none">
                <ion-label>
                    <h2><strong>Extra information</strong></h2>
                </ion-label>
            </ion-item>      
             <ion-item style="margin-top:-15px;" lines="none">
                <h6>
                    hskfdd 
                </h6>
                    <hr> 
                        <ion-button>A</ion-button> 
                    
            </ion-item>    
            <ion-item-divider class="divider2"></ion-item-divider>
            <img class="pdf_button" src="images/pdf.png" width="100px" alt=""/>
            <img class="blockchain_button" src="images/blockchain.png" width="100px" alt=""/>
        </ion-content>`