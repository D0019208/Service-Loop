# Student Loop

Student Loop is a mobile platform where students can become tutors, to teach other students in the course they are studying.
The main goal is to facilitate one-to-one tutorials of college subjects between students in the same course using their devices, moderated by admin users.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
No prerequisites needed to launch the app!
```

### Installing

A step by step series of examples that tell you how to get a development env running

1.) Download or pull the repository

```
git pull origin master
```

2.) In the app repository downloaded, go to www -> js -> modules -> index and locate "home_modules.js" and change the code like below as we do not have access to phone functionality in a browser so we need to set the information manually.

Change this:
```
document.addEventListener("deviceready", async function () {
```
To this:
```
document.addEventListener("DOMContentLoaded", async function () {
```

"deviceready" is a cordova event listener that wait for the phone to be ready, since we are not on a phone and we do not have access to this event listener we would be stuck on a blank screen.

Now we need to check how we get the information itself, you can choose to be either a "Tutor" or "Studet" with any name you want but the email must match an email from the database.

Change this:
```
//Check to make sure that the users session has not expired
await user.check_session();

//Once we are sure that the users session is valid, we populate the User class
user.setName(await get_secure_storage("user_name"));
user.setEmail(await get_secure_storage("users_email"));
user.setStatus(JSON.parse(await get_secure_storage("user_status")) ? "Tutor" : "Student");

//Set status of user to tutor
//user.setName("John Doe");
//user.setStatus("Tutor");
//user.setEmail("D00192082@student.dkit.ie");
```
To this:
```
//Check to make sure that the users session has not expired
await user.check_session();

//Once we are sure that the users session is valid, we populate the User class
//user.setName(await get_secure_storage("user_name"));
//user.setEmail(await get_secure_storage("users_email"));
//user.setStatus(JSON.parse(await get_secure_storage("user_status")) ? "Tutor" : "Student");

//Set status of user to tutor
user.setName(ANY NAME);
user.setStatus(A STRING, "Tutot" OR "Student");
user.setEmail(ANY EMAIL FROM DATABASE);
```

This part sets your skills, if you are a tutor, you will only be able to tutor posts that match these skills.

Change this:
```
user.setModules(JSON.parse(await get_secure_storage("user_modules")));
//user.setModules(["PHP", "JavaScript", "Java"]);
```
To this:
```
//user.setModules(JSON.parse(await get_secure_storage("user_modules")));
user.setModules(["PHP", "JavaScript", "Java"]);
```

Now we need to hide the function call that is ment to hide the splashscreen

Change this:
````
//Hide splashscreen
navigator.splashscreen.hide();
````

To this:
````
//Hide splashscreen
//navigator.splashscreen.hide();
````

3.) In www -> js -> modules, find "common_functions.js", there we need to comment out the code that provides device feedback

Change this:
```
   window.plugins.deviceFeedback.isFeedbackEnabled(function (feedback) {
        if (feedback.haptic && feedback.acoustic) {
            window.plugins.deviceFeedback.haptic();
            window.plugins.deviceFeedback.acoustic();
        } else if (feedback.haptic) {
            window.plugins.deviceFeedback.haptic();
        } else if (feedback.acoustic) {
            window.plugins.deviceFeedback.acoustic();
        }
    });
```
To this:
```
//    window.plugins.deviceFeedback.isFeedbackEnabled(function (feedback) {
//        if (feedback.haptic && feedback.acoustic) {
//            window.plugins.deviceFeedback.haptic();
//            window.plugins.deviceFeedback.acoustic();
//        } else if (feedback.haptic) {
//            window.plugins.deviceFeedback.haptic();
//        } else if (feedback.acoustic) {
//            window.plugins.deviceFeedback.acoustic();
//        }
//    });
```

Now you should be able to launch and run the app in a browser, to simulate a Tutor <--> Student interaction, open two broswers and change the Name, Email and Status values.

## Deployment

To deploy the application you first need to do the opposite of everything we just did to make it work on the browser.

1.) In the app repository, go to www -> js -> modules -> index and locate "home_modules.js" and change the code like below to utilize all our phones functionality

Change this:
```
document.addEventListener("DOMContentLoaded", async function () {
```
To this:
```
document.addEventListener("deviceready", async function () {
```

"DOMContentLoaded" waits for the DOM to render, however this does not mean that all the device functionality is ready, this is why we use the 'deviceready' event listener. Without it we will have no native functionality.

Now we need to check how we get the information itself, our informaton will be stored on the phone itself using secure storage

Change this:
```
//Check to make sure that the users session has not expired
await user.check_session();

//Once we are sure that the users session is valid, we populate the User class
//user.setName(await get_secure_storage("user_name"));
//user.setEmail(await get_secure_storage("users_email"));
//user.setStatus(JSON.parse(await get_secure_storage("user_status")) ? "Tutor" : "Student");

//Set status of user to tutor
user.setName(ANY NAME);
user.setStatus(A STRING, "Tutot" OR "Student");
user.setEmail(ANY EMAIL FROM DATABASE);
```
To this:
```
//Check to make sure that the users session has not expired
await user.check_session();

//Once we are sure that the users session is valid, we populate the User class
user.setName(await get_secure_storage("user_name"));
user.setEmail(await get_secure_storage("users_email"));
user.setStatus(JSON.parse(await get_secure_storage("user_status")) ? "Tutor" : "Student");

//Set status of user to tutor
//user.setName("John Doe");
//user.setStatus("Tutor");
//user.setEmail("D00192082@student.dkit.ie");
```

This part sets your skills, if you are a tutor, you will only be able to tutor posts that match these skills.

Change this:
```
//user.setModules(JSON.parse(await get_secure_storage("user_modules")));
user.setModules(["PHP", "JavaScript", "Java"]);
```
To this:
```
user.setModules(JSON.parse(await get_secure_storage("user_modules")));
//user.setModules(["PHP", "JavaScript", "Java"]);
```

Now we need to uncomment the function call that is ment to hide the splashscreen

Change this:
````
//Hide splashscreen
//navigator.splashscreen.hide();
````

To this:
````
//Hide splashscreen
navigator.splashscreen.hide();
````

3.) In www -> js -> modules, find "common_functions.js", there we need to uncomment the code that provides device feedback

Change this:
```
//    window.plugins.deviceFeedback.isFeedbackEnabled(function (feedback) {
//        if (feedback.haptic && feedback.acoustic) {
//            window.plugins.deviceFeedback.haptic();
//            window.plugins.deviceFeedback.acoustic();
//        } else if (feedback.haptic) {
//            window.plugins.deviceFeedback.haptic();
//        } else if (feedback.acoustic) {
//            window.plugins.deviceFeedback.acoustic();
//        }
//    });

```
To this:
```
   window.plugins.deviceFeedback.isFeedbackEnabled(function (feedback) {
        if (feedback.haptic && feedback.acoustic) {
            window.plugins.deviceFeedback.haptic();
            window.plugins.deviceFeedback.acoustic();
        } else if (feedback.haptic) {
            window.plugins.deviceFeedback.haptic();
        } else if (feedback.acoustic) {
            window.plugins.deviceFeedback.acoustic();
        }
    });
```

Now you should be able to compile the app by uploading it to Phonegap.

## Built With

* [Cordova](https://cordova.apache.org/) - The mobile application development framework used

## Authors

* **Nichita Postolachi** - *All major functionality* - [D0019208](https://github.com/D0019208)
* **German Luter** - *UI and functionality* - [D00194503REAL](https://github.com/D00194503REAL) 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
