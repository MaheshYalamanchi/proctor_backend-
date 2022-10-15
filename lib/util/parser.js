module.exports = {
  parserResponse: function(resJSON, list, callback) {
    var keys = Object.values(resJSON);
    var newObject = {};
    keys.map((val, i) => (newObject[list[i]] = val));
    callback(newObject);
  },
  parserResponsev2: async (resJSON, list) => {
    var keys = Object.values(resJSON);
    var newObject = {};
    keys.map((val, i) => (newObject[list[i]] = val));
    return newObject;
  }
};
