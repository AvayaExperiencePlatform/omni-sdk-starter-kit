var express = require('express');
const bodyParser = require('body-parser');
const dataServices = require('../services/data-services');
const admin = require('firebase-admin');


var router = express.Router();
var jsonParser = bodyParser.json();

var getConfigMap = () => { return dataServices.getConfigMap(); };
var getDeviceConfigMap = () => { return dataServices.getDeviceConfigMap(); };
var getSessionDeviceMap = () => { return dataServices.getSessionDeviceMap(); };

  
  router.post(
    "/",
    jsonParser,
    (req, res) => {

      var notification;

      if(req.originalUrl.includes("/axp-callback/")) {
        //callback from AXP containing the data
        notification = {
            sessionId: req.body.sessionId,
            message: {
              data: req.body,
            }
          };
      } else {
        //basic send notification API to test sending notification directly
        notification = req.body;
      }
      
      console.info("post notification by sessionId", notification);
      var notificationId = "";
      try {
        var sessionId = notification.sessionId;
        notificationId = handlePostNotificationBySessionId(sessionId, notification);
        //res.status(200).json({ notificationId: notificationId });
        //res.sendStatus(200);
        res.status(200).send();
      } catch (e) {
        console.error("error occurred while sending notification: ", e);
        switch (e.message) {
          case "sessionId not found":
            console.error("sessionId not found")
            // res
            //   .status(404)
            //   .json({ message: "sessionId [" + sessionId + "] not found" });
            break;
          case "deviceToken not found":
            console.error("deviceToken not found")
            // res.status(404).json({
            //   message: "deviceToken for sessionId [" + sessionId + "] not found",
            // });
            break;
          case "configId not found":
            console.error("ConfigId not found")
            // res.status(404).json({
            //   message: "configId for sessionId [" + sessionId + "] not found",
            // });
            break;
          case "default":
            res.status(500).json({
              message:
                "failed to send notification for sessionId [" +
                sessionId +
                "]. error: " +
                e.message,
            });
        }
      }
  
      console.debug("post notification by sessionId %s completed", sessionId);
    }
  );
  
  function postNotificationByDeviceToken(deviceToken, notification) {
    var deviceData = getDeviceConfigMap().get(deviceToken);
    if (!deviceData) throw new Error("deviceToken not found");
  
    console.info(
      "config [%s] found for device token [%s]",
      deviceData.configId,
      deviceToken
    );
  
    return postNotification(deviceData.configId, deviceToken, notification);
  }
  
  function handlePostNotificationBySessionId(sessionId, notification) {
    var deviceToken = getSessionDeviceMap().get(sessionId);
    if (!deviceToken) throw new Error("sessionId not found");
  
    console.info(
      "device token [%s] found for session [%s]",
      deviceToken,
      sessionId
    );
  
    return postNotificationByDeviceToken(deviceToken, notification);
  }
  
  function postNotification(configId, deviceToken, notification) {
    var config = getConfigMap().get(configId);
    if (!config) throw new Error("configId not found");
  
    console.info('processing notification:', notification)
  
    var fcmAdminApp = config.fcmAdminApp;
    notification.message.token = deviceToken;
  
    if (!fcmAdminApp) {
      // Initialize firebase and save it in the config
      console.info("Initializing firebase admin with configId", configId);
      try{
      fcmAdminApp = admin.initializeApp({
        credential: admin.credential.cert(config.fcmServiceAccountConfig),
      }, 'fcm_admin_app_' + configId);
      config.fcmAdminApp = fcmAdminApp;
    } catch(e){
        console.error("error occurred while initializing firebase admin: ", e);
        if(e.ErrorInfo.getCode() == 'app/duplicate-app'){
          config.fcmAdminApp = admin.app('fcm_admin_app_' + configId)
        }
    }
      console.info("Initialization of firebase admin with configId %s complete", configId);
    } else {
      console.info("fcm admin found for configId", configId);
    }
  
    console.info('Sending notification: ', notification.message)
  
    fcmAdminApp
      .messaging()
      .send(notification.message)
      .then((response) => {
        // Response is a message ID string.
        console.info("Successfully sent message: ", response);
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
      });
  }


module.exports = router;