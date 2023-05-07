const { TicketControl } = require("../models/ticket-control");

const ticketManager = new TicketControl();

const socketController = socket => {
	console.log("Cliente conectado", socket.id);

	socket.on("last-ticket", () => {
		socket.emit("last-ticket", ticketManager.lastTicket);
	});

	socket.on("create-ticket", () => {
		const newTicket = ticketManager.createTicket();
		socket.emit("create-ticket", newTicket);
		socket.emit("last-ticket", ticketManager.lastTicket);
	});

	socket.on("last-four", () => {
		socket.emit("last-four", ticketManager.lastFour);
	});

	socket.on("disconnect", () => {
		console.log("Cliente desconectado", socket.id);
	});

	socket.on("queue", () => {
		socket.emit("queue", ticketManager.tickets);
	});

	socket.on("desktop", desktop => {
		ticketManager.setDesktop(desktop);
		socket.emit("queue", ticketManager.tickets);
	});
};

module.exports = {
	socketController,
};
