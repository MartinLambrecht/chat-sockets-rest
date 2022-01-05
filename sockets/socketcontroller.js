const { Socket } = require("socket.io");
const { getUserFromJWT } = require("../helpers/tokens");
const Chat = require("../models/chat");

const chat = new Chat();

const socketcontroller = async (socket = new Socket(), io) => {
	const user = await getUserFromJWT(socket.handshake.headers.xtoken);
	if (!user) {
		return socket.disconnect();
	}

	//Add connected users to the chat and emit change
	chat.connectUser(user);
	io.emit("active-users", chat.usersArr);
	socket.emit("recive-message", chat.last10);

	//Recive a public message to send
	socket.on("send-message", ([message, uid]) => {
		if (!!uid) {
			io.to(uid).emit("private-message", { from: user.name, message });
			console.log("private");
		} else {
			chat.sendMessage(user.id, user.name, message);
			io.emit("recive-message", chat.last10);
		}
	});

	//Recive a private message to send
	socket.join(user.id);

	socket.on("send-private-message", ([message, uid]) => {});

	//Eliminate when disconnected
	socket.on("disconnect", () => {
		chat.disconnectUser(user.id);
		io.emit("active-users", chat.usersArr);
	});
};

module.exports = { socketcontroller };
