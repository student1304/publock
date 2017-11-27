"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageChain_1 = require("./MessageChain");
const SimplePeer = require("simple-peer");
const wrtc = require("wrtc");
class Publock {
    constructor(messageChain = new MessageChain_1.MessageChain()) {
        this.idCounter = 0;
        this.messageChain = messageChain;
        this.connections = new Map();
        this.initialiseOfferingConnection();
        this.initialiseAnsweringConnection();
    }
    get messageChain() {
        return this._messageChain;
    }
    set messageChain(newMessageChain) {
        this._messageChain = newMessageChain;
    }
    // Methods
    initialiseOfferingConnection() {
        let newPeer = new SimplePeer({ initiator: true, wrtc: wrtc });
        newPeer.on('signal', data => {
            this.offer = JSON.stringify(data);
        });
        newPeer.on('connect', () => {
            this.connections.set(newPeer._id, newPeer);
            this.initialiseOfferingConnection();
        });
        newPeer.on('data', data => {
            this.dataReceived(this.connections.get(newPeer._id), data);
        });
        newPeer.on('error', error => {
            console.log(error);
            newPeer.destroy();
        });
        this.offeringConnection = newPeer;
    }
    initialiseAnsweringConnection() {
        let newPeer = new SimplePeer({ wrtc: wrtc });
        newPeer.on('signal', data => {
            this.answer = JSON.stringify(data);
        });
        newPeer.on('connect', () => {
            this.connections.set(newPeer._id, newPeer);
            this.initialiseAnsweringConnection();
        });
        newPeer.on('data', data => {
            this.dataReceived(this.connections.get(newPeer._id), data);
        });
        newPeer.on('error', error => {
            console.log(error);
            newPeer.destroy();
        });
        this.answeringConnection = newPeer;
    }
    answerConnection(offer) {
        this.answeringConnection.signal(offer);
    }
    connectToPeer(answer) {
        this.offeringConnection.signal(answer);
    }
    dataReceived(connectionId, data) {
        console.log(connectionId + " sent: " + data);
    }
    sendData(connectionId, data) {
        this.connections.get(connectionId).send(data);
    }
}
exports.Publock = Publock;
/*let p1 = new SimplePeer({ initiator: true, wrtc: wrtc});
let p2 = new SimplePeer({ wrtc: wrtc });

console.log("created peers.");

p1.on('error', err => console.log('error', err));
p2.on('error', err => console.log('error', err));

console.log("errors bound.");

p1.on('data', data => {
    console.log("p1 received:" + data);
    p2.destroy();
    p1.destroy();
});
p2.on('data', data => console.log("p2 received:" + data));

console.log("data bound");


p1.on('connect', () => console.log("P1 connected to something"));
p2.on('connect', () => {
    console.log("P2 connected to something");
    p2.send("test");
});

console.log("connection bound");

p1.on('signal', data => {
    console.log("p1._id: " + p1._id);
    p2.signal(data);
});
p2.on('signal', data => {
    console.log("p2._id: " + p2._id);
    p1.signal(data);
})


console.log("signal bound");*/ 