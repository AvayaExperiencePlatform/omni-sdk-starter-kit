var express = require('express');
const bodyParser = require("body-parser");
const uuid = require("uuid");
const dataServices = require('../services/data-services');

var router = express.Router();
var jsonParser = bodyParser.json();


router.post("/", jsonParser, (req, res) => {
    console.debug("create config invoked");
    var body = req.body;
    body.configId = handleCreateConfig(body).configId;
    res.status(201).json(body);
    console.debug("created config");
  });
  
  router.put("/:configId", jsonParser, (req, res) => {
    console.debug("update config invoked", req.params.configId);
    var body = req.body;
    body.configId = handleUpdateConfig(req.params.configId, body).configId;
    res.status(200).json(body);
    console.debug("updated config");
  });
  
  router.get("/:configId", (req, res) => {
    console.debug("get config invoked", req.params.configId);
    var configId = req.params.configId;
    var config = handleGetConfig(configId);
    if (config) {
      res.status(200).json(config);
    } else {
      res.status(404).json({ message: "configId [" + configId + "] not found" });
    }
    console.debug("get config");
  });
  
  router.get("/", (req, res) => {
    console.debug("list configs invoked");
    res.status(200).json(handleListConfig());
    console.debug("listed configs");
  });
  
  router.delete("/:configId", (req, res) => {
    console.debug("delete config invoked", req.params.configId);
    handleDeleteConfig(req.params.configId);
    res.status(204).json();
    console.debug("deleted config");
  });

  var getConfigMap = () => { return dataServices.getConfigMap(); };
  
  function handleCreateConfig(config) {
    var configId = uuid.v4();
    config.configId = configId;
    getConfigMap().set(configId, config);
    return config;
  }
  

  function handleUpdateConfig(configId, config) {
    var storedConfig = getConfigMap().get(configId);
  
    if (null == storedConfig) {
      storedConfig = {};
      storedConfig.configId = configId;
    }
  
    storedConfig.fcmServiceAccountConfig = config.fcmServiceAccountConfig;
    getConfigMap().set(configId, storedConfig);
  
    config.configId = configId;
    return config;
  }
  
  function handleGetConfig(configId) {
    var config = {};
    var storedConfig = getConfigMap().get(configId);
  
    if (!storedConfig) return null;
  
    config.configId = storedConfig.configId;
    config.fcmServiceAccountConfig = storedConfig.fcmServiceAccountConfig;
    return config;
  }
  
  function handleListConfig() {
    let configList = [];
    for (let storedConfig of getConfigMap().values()) {
      var config = {};
      config.configId = storedConfig.configId;
      config.fcmServiceAccountConfig = storedConfig.fcmServiceAccountConfig;
      configList.push(config);
    }
    return configList;
  }
  
  function handleDeleteConfig(configId) {
    getConfigMap().delete(configId);
  }


module.exports = router;