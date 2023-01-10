/**
 * socket.js
 * @description :: socket connection with server
 */

const socketData = require('../../model/socketData');
const dbService = require('../../utils/dbService');
module.exports = function (httpServer){
  const io = require('socket.io')(httpServer,{ cors:{ origin: '*' } });
  io.on('connection', (socket) => {
    io.on('event', async (data) => {
      if (data.message){
        const user = await dbService.findOne(socketData,{ message:data.message });
        if (user){
          await dbService.update(socketData,{ id :socket.id },{ message:data.message });
        }
        else {
          const input = {
            message:data.message,
            socketId: socket.id
          };
          await dbService.createOne(socketData,input);
        }
      }
      else {
        const input = { socketId: socket.id };
        await dbService.createOne(socketData,input);
      }
    });
  });
};
