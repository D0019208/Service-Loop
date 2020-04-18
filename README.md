# Student Loop

Student Loop is a mobile platform where students can become tutors, to teach other students in the course they are studying.
The main goal is to facilitate one-to-one tutorials of college subjects between students in the same course using their devices, moderated by admin users.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
To run the app in localhost mode, please follow the instructions to download and setup the Student Loop Server repository at https://github.com/D0019208/Service-Loop-Server
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
let localhost = false;
```
To this:
```
let localhost = true;
```

3.) Run index.html


Now you should be able to launch and run the app in a browser, to simulate a Tutor <--> Student interaction, open two tabs and change the Name, Email, Module and Status values in home_module.js

## Deployment

To deploy the application you first need to do the opposite of everything we just did to make it work on the browser.

1.) In the app repository, go to www -> js -> modules -> index and locate "home_modules.js" and change the code like below to utilize all our phones functionality

Change this:
```
let local_host = true;
```
To this:
```
let local_host = false;
```

2.1) If you have cordova installed and setup on your PC, run the following command:

Change this:
```
cordova run
```

2.2) If you DO NOT have cordova installed and setup on your PC, zip the folder and upload it Phonegap:


## Built With

* [Cordova](https://cordova.apache.org/) - The mobile application development framework used

## Authors

* **Nichita Postolachi** - *All major functionality* - [D0019208](https://github.com/D0019208)
* **German Luter** - *UI and functionality* - [D00194503REAL](https://github.com/D00194503REAL) 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
