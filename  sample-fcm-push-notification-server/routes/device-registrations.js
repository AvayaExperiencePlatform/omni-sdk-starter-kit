var express = require('express');
const bodyParser = require("body-parser");
const dataServices = require('../services/data-services');

var router = express.Router();
var jsonParser = bodyParser.json();

router.put(
    "/:deviceToken",
    jsonParser,
    (req, res) => {
      var deviceToken = req.params.deviceToken;
      console.debug("register device", deviceToken, req.body);
      var deviceData = handleRegisterDevice(deviceToken, req.body);
      if (deviceData) {
        res.status(200).json(deviceData);
      } else {
        res
          .status(404)
          .json({ message: "configId [" + req.body.configId + "] not found" });
      }
      console.debug("device registered", deviceToken, req.body);
    }
  );
  
  router.get("/:deviceToken", (req, res) => {
    var deviceToken = req.params.deviceToken;
    console.debug("get device registration", deviceToken);
    var deviceData = handleGetDeviceRegistration(deviceToken);
    if (deviceData) {
      res.status(200).json(deviceData);
    } else {
      res
        .status(404)
        .json({ message: "deviceToken [" + deviceToken + "] not found" });
    }
    console.debug("get device registration", deviceToken, deviceData);
  });
  
  router.post(
    "/",
    jsonParser,
    (req, res) => {
      if(req.originalUrl.includes(":search")) {
        console.debug(
          "search device registration by sessionId",
          req.body.sessionId
        );
        deviceData = handleSearchDeviceRegistrationBySessionId(req.body.sessionId);
        if (deviceData) {
          res.status(200).json(deviceData);
        } else {
          res
          .status(404)
          .json({ message: "sessionId [" + req.body.sessionId + "] not found" });
        }
        console.debug("search device registration", deviceToken, deviceData);

      }

    }
  );
  
  router.get("/", (req, res) => {
    console.debug("list device registrations");
    res.status(200).json(handleListDeviceRegistrations());
    console.debug("device registered", req.body);
  });
  
  router.delete(
    "/:deviceToken",
    (req, res) => {
      var deviceToken = req.params.deviceToken;
      console.debug("delete device registration", deviceToken);
      var deviceData = handleDeleteDeviceRegistration(deviceToken);
      if (deviceData) {
        res.status(204).json();
      } else {
        res
          .status(404)
          .json({ message: "deviceToken [" + deviceToken + "] not found" });
      }
      console.debug("deleted device registration", deviceToken, req.body);
    }
  );

  var getConfigMap = () => { return dataServices.getConfigMap(); };
  var getDeviceConfigMap = () => { return dataServices.getDeviceConfigMap(); };
  var getSessionDeviceMap = () => { return dataServices.getSessionDeviceMap(); };
  
  function handleRegisterDevice(deviceToken, deviceData) {
    var config = getConfigMap().get(deviceData.configId);
    if (!config) return null;
    deviceData.deviceToken = deviceToken;
    getDeviceConfigMap().set(deviceToken, deviceData);
  
    if (deviceData.sessionId) {
      const prevSessionId = dataServices.getDeviceSessionMap().get(deviceToken);
      if(prevSessionId) {
        getSessionDeviceMap.delete(prevSessionId);
      }
      getSessionDeviceMap().set(deviceData.sessionId, deviceToken);
    }
  
    return deviceData;
  }
  
  function handleGetDeviceRegistration(deviceToken) {
    return getDeviceConfigMap().get(deviceToken);
  }
  
  function handleSearchDeviceRegistrationBySessionId(sessionId) {
    var deviceToken = getSessionDeviceMap().get(sessionId);
    if (!deviceToken) return null;
    return getDeviceConfigMap().get(deviceToken);
  }
  
  function handleListDeviceRegistrations() {
    let deviceRegistrationList = [];
    for (let deviceRegistration of getDeviceConfigMap().values()) {
      deviceRegistrationList.push(deviceRegistration);
    }
    return deviceRegistrationList;
  }
  
  function handleDeleteDeviceRegistration(deviceToken) {
    var deviceConfig = getDeviceConfigMap().get(deviceToken);
    if (!deviceConfig) return null;
    sessionId = deviceConfig.sessionId;
  
    if (sessionId && getSessionDeviceMap().get(sessionId) == deviceToken) {
      getSessionDeviceMap().delete(sessionId);
    }
  
    getDeviceConfigMap().delete(deviceToken);
  
    return deviceConfig;
  }


module.exports = router;