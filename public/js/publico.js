// Referencias del HTML
const lblTicket1 = document.querySelector("#lblTicket1");
const lblTicket2 = document.querySelector("#lblTicket2");
const lblTicket3 = document.querySelector("#lblTicket3");
const lblTicket4 = document.querySelector("#lblTicket4");

//
const lblEscritorio1 = document.querySelector("#lblEscritorio1");
const lblEscritorio2 = document.querySelector("#lblEscritorio2");
const lblEscritorio3 = document.querySelector("#lblEscritorio3");
const lblEscritorio4 = document.querySelector("#lblEscritorio4");

// Squares

const firstPlace = document.querySelector("#first-ticket");
const secondPlace = document.querySelector("#second-ticket");
const thirdPlace = document.querySelector("#third-ticket");
const fourthPlace = document.querySelector("#fourth-ticket");

const ticketsPlacesArray = [fourthPlace, thirdPlace, secondPlace, firstPlace];

const labelTicketArray = [lblTicket4, lblTicket3, lblTicket2, lblTicket1];

const lblDesktopArray = [
	lblEscritorio4,
	lblEscritorio3,
	lblEscritorio2,
	lblEscritorio1,
];

const socket = io();

socket.on("connect", () => {
	console.log("Conectado desde cliente (publico)");

	socket.on("desktop-assing", () => {
		socket.emit("last-four");
	});

	socket.emit("last-four");

	socket.on("last-four", lastFourArray => {
		const lastFourTickets = lastFourArray;
		console.log(lastFourArray);

		ticketsPlacesArray.map((place, index) => {
			if (index === 3) return (place.className = "bg-dark");
			return !lastFourArray[index]
				? (place.className = "d-none")
				: (place.className = "d-auto");
		});

		labelTicketArray.map((label, ticketNumber) => {
			lastFourTickets[ticketNumber]
				? (label.innerHTML = `Ticket N° ${lastFourTickets[ticketNumber].number}`)
				: (label.innerHTML = `Espere`);
		});

		lblDesktopArray.map((label, desktopNumber) => {
			!lastFourTickets[desktopNumber].desktop
				? (label.innerHTML = `Sin escritorio`)
				: (label.innerHTML = `Escritorio ${lastFourTickets[desktopNumber].desktop}`);
		});
	});
});

socket.on("disconnect", () => {
	console.log("Desconectado del servidor");
});
