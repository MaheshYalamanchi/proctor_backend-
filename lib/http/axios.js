let instance = {
  baseURL: process.env.DATA_SERVICE_ENDPOINT,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};
let instance_socket_io = {
  baseURL: process.env.SOCKET_IO,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};
module.exports = {
  instance,
  instance_socket_io
};
