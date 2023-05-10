const TicketControl = require("../models/ticket-control");

const ticketManager = new TicketControl();

const socketController = socket => {
	console.log("Cliente conectado", socket.id);

	// Listen to last-four event
	socket.on("last-four", () => {
		socket.emit("last-four", ticketManager.getLastFourTickets());
	});

	// Listen to get-queue event and emit tickets array
	socket.on("get-queue", () =>
		socket.emit("get-queue", ticketManager.getNonAttendedTickets())
	);

	// Listen to new-ticket event and emit tickets array
	socket.on("new-ticket", () => {
		ticketManager.enqueueTicket();
		socket.emit("last-ticket", ticketManager.getLastTicket());
	});

	socket.on("last-ticket", () => {
		socket.emit("last-ticket", ticketManager.getLastTicket());
	});

	socket.on("attend-next-ticket", (desktopNumber, ticketToDequeue) => {
		if (ticketToDequeue !== undefined || typeof ticketToDequeue !== NaN) {
			ticketManager.dequeueTicket(ticketToDequeue);
		}
		socket.emit(
			"attend-next-ticket",
			ticketManager.attendTicket(desktopNumber)
		);
	});

	socket.on("actual-attending-ticket", desktopNumber =>
		socket.emit(
			"actual-attending-ticket",
			ticketManager.getTicketByDesktop(desktopNumber)
		)
	);

	socket.on("dequeue-ticket", (ticketToDequeue, desktopNumber) => {
		ticketManager.dequeueTicket(ticketToDequeue, desktopNumber);
	});

	socket.on("disconnect", () => console.log("Client disconnected", socket.id));
};

module.exports = {
	socketController,
};
