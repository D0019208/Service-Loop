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

2.) In the app repository downloaded, go to www -> js -> modules -> index and locate "home_modules.js" and change the code like below

Change this:
```
document.addEventListener("deviceready", async function () {
```
To this:
```
document.addEventListener("DOMContentLoaded", async function () {
```

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

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
