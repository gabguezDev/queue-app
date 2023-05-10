const desktop = {
	number: window.location.search.slice(-1),
	titleEl: document.querySelector("h1"),
	actualTicketEl: document.querySelector("#actual-ticket-desktop"),
	queueEl: document.querySelector("#queue-desktop"),
	queueCountEl: document.querySelector("#lblPendientes"),
	noTicketsEl: document.querySelector("#no-tickets"),
	attendingToEl: document.querySelector("#attending-to"),
	nextTicketButtonEl: document.querySelector("#next-ticket"),
};

desktop.titleEl.innerHTML = `Escritorio ${desktop.number}`;

//Socket Handler
const socket = io();

//On Socket CONNECT
socket.on("connect", () => {
	console.log("client connected");

	// Ask for tickets queue
	socket.emit("get-queue");

	socket.emit("actual-attending-ticket", Number(desktop.number));

	socket.on("actual-attending-ticket", actualTicket => {
		if (actualTicket) {
			desktop.actualTicketEl.innerHTML = `Ticket ${actualTicket.number}`;
		}
	});

	// Listen get-queue event
	socket.on("get-queue", nonAttendedTickets => {
		if (nonAttendedTickets.length !== 0) {
			desktop.queueEl.innerHTML = "";
			const els = nonAttendedTickets.map(ticket => {
				const ticketDiv = document.createElement("div");
				ticketDiv.id = `ticket-${ticket.number}`;
				ticketDiv.className = "py-1 my-2";
				ticketDiv.innerHTML = `Ticket ${ticket.number}`;
				return ticketDiv;
			});
			desktop.queueEl.append(...els);
			return;
		}
		desktop.nextTicketButtonEl.setAttribute("disabled", true);
	});

	// Listen to click event at nextTicketButton
	desktop.nextTicketButtonEl.addEventListener("click", () => {
		const finishAttendingTicket = Number(
			desktop.actualTicketEl.innerHTML.split(" ")[1]
		);
		console.log(finishAttendingTicket);
		socket.emit(
			"attend-next-ticket",
			Number(desktop.number),
			finishAttendingTicket
		);
	});

	socket.on("attend-next-ticket", attendingToTicket => {
		console.log(attendingToTicket);
		socket.emit("get-queue");
		desktop.actualTicketEl.innerHTML = `Ticket ${attendingToTicket.number}`;
	});

	//On Socket DISCONNECT
	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});
