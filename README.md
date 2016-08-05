# Heroes of the Storm Web Application

## Introduction
This is a crude, example application which demonstrates using a ServiceWorker to cache assets so that if the user were to go offline, the page would still load and serve as if it were online. It has been built upon the [rehabstudio FE Skeleton](https://github.com/rehabstudio/fe-skeleton) so any specifics about installation or setup can be read from that repositorys documentation.

## Installation
To install and run the application, do the following:

```
npm install
gulp server
```

## Learning Resources
* [Your first offline web app | Web Fundamentals - Google Developers](https://developers.google.com/web/fundamentals/getting-started/your-first-offline-web-app/)
* [Making an offline web app with Service Workers | Ole Michelsen](http://ole.michelsen.dk/blog/making-an-offline-webapp-with-service-workers.html)
* [slightlyoff / ServiceWorker](https://github.com/slightlyoff/ServiceWorker)

## Live Example
This code has been uploaded to a [Heroku application](https://hots-serviceworker.herokuapp.com/). If you load it once with internet connection then disable your network (either via throttling in dev tools or physically disconnecting from your network) and refresh the application, it should load instantly (served from ServiceWorker) and be fully usable.