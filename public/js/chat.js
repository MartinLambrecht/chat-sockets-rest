var url = window.location.hostname.includes("localhost")
	? "http://localhost:8080/api/auth/"
	: "https://restserver-curso-fher.herokuapp.com/api/auth/";

//Global
let user = null;
let socket = null;
//References

const txtUid = document.querySelector("#txtUid");
const txtMessage = document.querySelector("#txtMessage");
const ulUsers = document.querySelector("#ulUsers");
const ulMessage = document.querySelector("#ulMessage");
const btnExit = document.querySelector("#btnExit");

const getData = async () => {
	const fetchUserData = async (token) => {
		return fetch(url, { headers: { xToken: token } });
	};

	const token = localStorage.getItem("xToken");

	if (token.length < 10) {
		window.location = "index.html";
		throw new Error("Invalid/missing token.");
	}
	const data = await fetchUserData(token).then((res) => res.json());
	//Set user globally
	user = data.user;
	//Refresh Token
	localStorage.xToken = data.token;
	//Connect socket
	await connectSocket();
	//Change window name
	document.title = user.name;
};

const connectSocket = async () => {
	socket = io({ extraHeaders: { xToken: localStorage.getItem("xToken") } });

	socket.on("connect", () => {
		console.log("Socket On-Line.");
	});
	socket.on("disconnect", () => {
		console.log("Socket Off-Line.");
	});
	socket.on("recive-message", renderMessages);
	socket.on("active-users", renderActiveUsers);
	socket.on("private-message", ({ from, message }) => {
		alert(`Private message from: ${from}\n${message}`);
	});
};

const renderMessages = (last10Messages) => {
	let chatHtml = "";
	last10Messages.forEach((message) => {
		chatHtml += `
		<li>
		<p>
			<span class="text-primary">${message.name} [${message.uid}]: </span>
			<span class="primary">${message.message}</span>
		</p>
		</li>
		`;
	});
	ulMessage.innerHTML = chatHtml;
};

const renderActiveUsers = (usersArr) => {
	let usersHtml = "";
	usersArr.forEach((user) => {
		usersHtml += `
		<li>
			<p>
				<h5 class="text-success">${user.name}</h5>
				<span class="fs-6 text-muted">${user.uid}</span>
			</p>
		</li>
		`;
	});
	ulUsers.innerHTML = usersHtml;
};

txtMessage.addEventListener("keydown", (e) => {
	const message = txtMessage.value;
	if (e.keyCode == 13 && !!message) {
		const uid = txtUid.value;
		socket.emit("send-message", [message, uid]);
		txtMessage.value = "";
	}
});
btnExit.addEventListener("click", () => {
	localStorage.xToken = "";
	window.location = "index.html";
});

const main = async () => {
	await getData();
};

main();
