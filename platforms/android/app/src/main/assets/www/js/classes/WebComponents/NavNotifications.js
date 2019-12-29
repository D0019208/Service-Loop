class NavNotifications extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
          <ion-header translucent>
                        <ion-toolbar>
                            <ion-buttons slot="start">
                                <!--<ion-back-button default-href="home"></ion-back-button>-->
                            </ion-buttons>
                            <ion-buttons slot="end">
                                <ion-menu-button></ion-menu-button>
                            </ion-buttons>
                            <ion-title>
                                <h1>Notifications</h1>
                            </ion-title>
                        </ion-toolbar>
                    </ion-header>

                    <ion-content fullscreen>
                        <!-- <h2><a href="login.html">Home</a></h2>-->
                        <ion-list>
                            <ion-list-header id="notifications_header">
                                NOTIFICATIONS
                            </ion-list-header><!--<p>Manage information about you...</p>-->

                            <ion-list id="list"></ion-list>

                            <ion-infinite-scroll threshold="100px" id="infinite-scroll">
                                <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
                                </ion-infinite-scroll-content>
                            </ion-infinite-scroll>
                        </ion-list>
                    </ion-content>
        `;
    }
}