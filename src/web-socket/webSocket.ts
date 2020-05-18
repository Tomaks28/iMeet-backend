import WebSocket from "ws";

const socketList: Array<string> = [];
const blockList: Array<string> = [
  "192.168.1.100",
  "192.168.1.29",
  "192.168.1.59",
];
const banList: Array<string> = [];
const messages: Array<string> = [];

// const blocked = (ws: WebSocket) => {
//   const ip = ws._socket.remoteAddress.toString();
//   const result = blockList.find((blockedIp) => {
//     return blockedIp === ip;
//   });
//   if (result) {
//     return true;
//   } else {
//     return false;
//   }
// };

// const banned = (ws) => {
//   return false;
// };

const addSocketToList = (ip: string) => {
  socketList.push(ip);
  //   printConnexions(true);
};

// const removeSocketfromList = (ip) => {
//   const index = socketList.findIndex((socket) => {
//     return socket === ip;
//   });

//   if (index !== -1) {
//     socketList.splice(index, 1);
//   }
//   printConnexions(true);
// };

// const printConnexions = (show) => {
//   if (show) {
//     console.log("Connexions : ", socketList);
//   }
// };

const realTimeManager = () => {
  const wss = new WebSocket.Server(
    { port: process.env.WEBSOCKET_PORT || 8080 } as WebSocket.ServerOptions,
    () => {
      console.log(`WebSocket started at ` + process.env.WEBSOCKET_PORT);
    }
  );
  wss.on("connection", (ws: any) => {
    // Middleware to check if connection is authorized
    // if (blocked(ws)) {
    //   ws.send(JSON.stringify({ message: "Blocked" }));
    //   ws.close();
    // }
    // if (banned(ws)) {
    //   ws.send(JSON.stringify({ message: "Banned" }));
    //   ws.close();
    // }
    // addSocketToList(ws._socket.remoteAddress); //TODO
    addSocketToList(ws._socket.remoteAddress);
    ws.on("message", (message: string) => {
      console.log(message);
      ws.send(JSON.stringify({ message: "got it" }));
    });
    ws.on("close", () => {
      //   removeSocketfromList(ws._socket.remoteAddress);
    });
    ws.on("error", (error: any) => {
      console.log(error);
    });
  });
};

export { realTimeManager };
