const desktopNumber = window.location.search.slice(-1);

const desktopTitle = document.querySelector("h1");

const actualTicketDesktop = document.querySelector("#actual-ticket-desktop");
const remainTicketDesktop = document.querySelector("#remain-tickets-desktop");

const nextTicketButton = document.querySelector("#next-ticket");
const attendingToLabel = document.querySelector("#attending-to");

const queueDesktop = document.querySelector("#queue-desktop");
const noTickets = document.querySelector("#no-tickets");
const lblPendientes = document.querySelector("#lblPendientes");

desktopTitle.innerHTML = `Escritorio ${desktopNumber}`;

const socket = io();

socket.on("connect", () => {
	console.log("client connected");

	socket.emit("queue");

	socket.on("queue", tickets => {
		const queue = tickets;

		const ticketsQueue = ticketWithNoDesktop(queue);
		console.log(ticketsQueue);
		if (ticketsQueue.length !== 0) noTickets.className = "d-none";

		queueDesktop.innerHTML = null;
		queueDesktop.append(
			...ticketsQueue.map(ticket => (ticket !== undefined ? ticket : ""))
		);
		lblPendientes.innerHTML = ticketsQueue.length;

		if (
			queue[0].desktop !== undefined &&
			queue[0].desktop === Number(desktopNumber)
		) {
			actualTicketDesktop.innerHTML = `Ticket ${queue[0].number}`;
		} else {
			attendingToLabel.innerHTML =
				"Presione el botón de abajo para atender un ticket.";
		}
	});

	nextTicketButton.addEventListener("click", () => {
		socket.emit("desktop", desktopNumber);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

function ticketWithNoDesktop(tickets) {
	return tickets.reverse().map(ticket => {
		if (ticket.desktop === undefined) {
			let el = document.createElement("p");
			el.setAttribute("id", `ticket-${ticket.number}`);
			el.className =
				"fw-bold mx-2 my-1 p-3 bg-white border border-1 border-black";

			el.innerHTML = `Ticket n° ${ticket.number}`;
			return el;
		} else {
			return undefined;
		}
	});
}
