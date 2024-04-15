# Omni SDK Starter Kit

To integrate your client application with Avaya Experience Platform™, apart from using the Omni SDK libraries, you need to write logic in your Backend Web App to fetch the JWT for each end user. Also if you want to use the Custom Push Notification Feature, you will again need to write a piece of code that performs the role of receiving Push Notification from the Avaya Experience Platform™ and forward the notifications to a Push Notification Provider of your choice.

This repository provides sample code that not only demonstrates how the backend web application service and custom push notification connector can be implemented, but by running these Node.js based applications, you can jump start on testing your client application.

> :warning: IMPORTANT
>
> The sample applications are provided are only for the purpose of reference and shouldn't be used in > production.

## Sample Backend Web App Server

A sample Node.js based application demonstrating how the Backend Web Application Server can be implemented to fetch JWT from Avaya Experience Platform™.

[GitHub](%20%20sample-web-app-server/) | [Readme](%20%20sample-web-app-server/README.md)

## Sample FCM Based Push Notification Connector

A sample Node.js based application demonstrating how the Custom Notification Server can be implemented to receive push notifications from Avaya Experience Platform™ and forward the notifications to a Push Notification Provider (Firebase Cloud Messaging for this sample application).

[GitHub](%20sample-fcm-push-notification-server/) | [Readme](%20sample-fcm-push-notification-server/README.md)
