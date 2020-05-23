import WebSocket from "ws";
import { UserModel } from "../models";
import { response } from "express";

interface IResponse {
  token: string;
  type: string;
  payload: {
    lastUpdate?: number | Date;
  };
}

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
  wss.on("connection", async (ws: any) => {
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
    ws.on("message", async (message: IResponse) => {
      // Checking if token exists
      if (message.token) {
        // Checking if user is in db and valid
        const user = await UserModel.findOne({ token: message.token });
        if (user) {
          // Managing state machine
          switch (message.type) {
            case "GET_MESSAGES":
              const messages = await UserModel.findOne({
                token: message.token,
              });

              break;
            default:
              ws.close();
              break;
          }
        }
      }
      // ws.send(JSON.stringify({ message: "got it" }));
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
