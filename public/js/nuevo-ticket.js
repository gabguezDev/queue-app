// Referencias del HTML
const newTicketButton = document.querySelector("#newTicketButton");
const newTicketLabel = document.querySelector("#lblNuevoTicket");

const socket = io();

socket.on("connect", () => {
	console.log("Conectado al servidor");

	socket.emit("last-ticket");

	socket.on("last-ticket", ticket => {
		newTicketLabel.innerHTML = ticket
			? `Ticket n° ${ticket.number}`
			: `No hay tickets`;
	});

	newTicketButton.addEventListener("click", () => {
		socket.emit("new-ticket");
		socket.emit("last-ticket");
	});

	socket.on("disconnect", () => {
		console.log("Desconectado del servidor");
	});
});
