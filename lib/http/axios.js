let instance = {
  baseURL: process.env.DATA_SERVICE_ENDPOINT,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};
module.exports = {
  instance
};
