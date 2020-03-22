class Push_Notifications {
    constructor(appId) {
        this.appId = appId;
    }

    initialize() {
        window.plugins.OneSignal
                .startInit(this.appId)
                .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
                .handleNotificationReceived(async function (notificationData) {
                   //await include("js/modules/index/notifications_module.js", "notifications_script");
                   //document.getElementById('tab-button-notifications').click();
                }).endInit();
    }

    set_user_id(id) {
        window.plugins.OneSignal.setExternalUserId(id);
    }

    send_notification(title, body, to, key, post, notification) {
        access_route({title: title, body: body, to: to, key: key, notification: notification, post: post}, "push_notification", false);
    }
}