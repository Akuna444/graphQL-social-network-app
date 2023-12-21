const socket = require("socket.io");
let io;

module.exports = {
  init: (httpServer) => {
    io = socket(httpServer, {
      cors: {
        origin: "*",
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket is not intialized");
    }
    return io;
  },
};
