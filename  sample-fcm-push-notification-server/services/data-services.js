const configMap = new Map();
const deviceConfigMap = new Map();
const sessionDeviceMap = new Map();
const deviceSessionMap = new Map();

module.exports.getConfigMap = () => configMap;
module.exports.getDeviceConfigMap = () => deviceConfigMap;
module.exports.getSessionDeviceMap = () => sessionDeviceMap;
module.exports.getDeviceSessionMap = () => deviceSessionMap;
