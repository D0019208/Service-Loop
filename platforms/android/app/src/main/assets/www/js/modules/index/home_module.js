"use strict"

/*
 ******************************************************************************************************************
 ******************************************************************************************************************
 **************************************************DOM STARTS******************************************************
 ******************************************************************************************************************
 ******************************************************************************************************************
 */
//deviceready
//DOMContentLoaded
document.addEventListener("deviceready", async function () { 
    await check_session();

    document.querySelector("ion-tabs").addEventListener('ionTabsWillChange', function (event) {  
        if (event.detail.tab === "notifications") {
            let notifications_script = document.createElement("script");
            notifications_script.type = "text/javascript";
            notifications_script.src = "js/modules/index/notifications_module.js";
            document.querySelector('ion-tabs').appendChild(notifications_script);
        } else if(event.detail.tab === "settings") {
            let settings_script = document.createElement("script");
            settings_script.type = "text/javascript";
            settings_script.src = "js/modules/index/settings_module.js";
            document.querySelector('ion-tabs').appendChild(settings_script);
        }
    });
});
