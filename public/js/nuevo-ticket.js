// Referencias del HTML
const newTicketButton = document.querySelector("#newTicketButton");
const newTicketLabel = document.querySelector("#lblNuevoTicket");

const socket = io();

socket.on("connect", () => {
	console.log("Conectado al servidor");

	socket.emit("last-ticket");

	// Wait for last-ticket event to receive ticket.number param
	socket.on("last-ticket", ticket => {
		if (!ticket) {
			newTicketLabel.innerHTML = "¡No hay tickets!";
			return;
		}
		showLastCreatedTicket(ticket.number);
	});

	// Emi create-ticket socket event when button is clicked
	newTicketButton.addEventListener("click", () => {
		socket.emit("create-ticket");
	});

	// Receive ticket object
	socket.on("create-ticket", ticket => {
		showLastCreatedTicket(ticket.number);
	});

	socket.on("disconnect", () => {
		console.log("Desconectado del servidor");
	});
});

function showLastCreatedTicket(ticketNumber) {
	newTicketLabel.innerHTML = `Ticket ${ticketNumber}`;
}
