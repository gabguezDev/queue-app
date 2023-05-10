const places = [
	{
		labelTicket: document.querySelector("#lblTicket4"),
		labelDesktop: document.querySelector("#lblEscritorio4"),
	},
	{
		labelTicket: document.querySelector("#lblTicket3"),
		labelDesktop: document.querySelector("#lblEscritorio3"),
	},
	{
		labelTicket: document.querySelector("#lblTicket2"),
		labelDesktop: document.querySelector("#lblEscritorio2"),
	},
	{
		labelTicket: document.querySelector("#lblTicket1"),
		labelDesktop: document.querySelector("#lblEscritorio1"),
	},
];

const socket = io();

socket.on("connect", () => {
	console.log("Conectado desde cliente (publico)");

	socket.emit("last-four");

	socket.on("last-four", lastFour => {
		places.map(({ labelDesktop, labelTicket }, index) => {
			labelTicket.innerHTML = lastFour[index]
				? `Ticket ${lastFour[index].number}`
				: "No hay ticket";

			labelDesktop.innerHTML =
				!!lastFour[index] && !!lastFour[index].desktop
					? `Escritorio ${lastFour[index].desktop}`
					: "Sin atender";
		});
	});
});

socket.on("disconnect", () => {
	console.log("Desconectado del servidor");
});
