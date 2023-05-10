const fs = require("fs");
const path = require("path");

class TicketControl {
	#tickets = new Array();
	static #number = 0;
	#filePath = path.join(__dirname, "../db/tickets.json");
	#existFile;
	#today;

	constructor() {
		this.#today = new Date().toLocaleDateString("en-GB");
		this.init();
	}

	// INITIALIZER
	init() {
		try {
			this.#existFile = fs.existsSync(this.#filePath);
			const today = new Date().toLocaleDateString("en-GB");
			if (this.#existFile) {
				const data = JSON.parse(
					fs.readFileSync(this.#filePath, {
						encoding: "utf-8",
					})
				);
				if (data.today === today) {
					this.tickets = data.tickets;
					TicketControl.#number = data.tickes.length === 0 ? 0 : data.number;
					return;
				}
			}

			throw new Error();
		} catch (error) {
			this.tickets = [];

			this.persistTickets(this.tickets);
		}
	}

	// GETTERS AND SETTERS
	get tickets() {
		return this.#tickets;
	}

	set tickets(value) {
		this.#tickets = value;
		return this.#tickets;
	}

	// METHODS

	persistTickets(tickets) {
		const data = {
			tickets: tickets ? tickets : this.#tickets,
			number: TicketControl.#number,
			today: this.#today,
		};
		fs.writeFileSync(this.#filePath, JSON.stringify(data));
		console.log("tickets.json modificado.");
	}

	enqueueTicket() {
		const newTicket = { number: ++TicketControl.#number };
		this.#tickets.push(newTicket);

		this.persistTickets();
		return this.tickets;
	}

	dequeueTicket(ticketNumber) {
		this.tickets = this.#tickets.filter(
			ticket => ticket.number !== ticketNumber
		);

		this.persistTickets();
		return this.tickets;
	}

	attendTicket(desktopNumber) {
		const ticket = this.#tickets.findIndex(
			ticket => ticket.desktop === undefined
		);

		this.#tickets[ticket].desktop = desktopNumber;

		this.persistTickets();

		return this.tickets[ticket];
	}

	getLastFourTickets() {
		const lastTicketArray = this.#tickets
			.slice(0, 4)
			.filter(ticket => ticket !== undefined);

		return lastTicketArray.reverse();
	}

	getNonAttendedTickets() {
		const nonAttendedTickets = this.#tickets.filter(
			ticket => ticket.desktop === undefined
		);

		return nonAttendedTickets;
	}

	getTicketByDesktop(desktopNumber) {
		const nonAttendedTickets = this.#tickets.filter(
			ticket => ticket.desktop === desktopNumber
		);

		return nonAttendedTickets[0];
	}

	getFirstTicket() {
		const lastTicketArray = this.#tickets.slice(-1);

		if (lastTicketArray !== 0) {
			return lastTicketArray[0];
		}

		return;
	}

	getLastTicket() {
		const lastTicket = this.#tickets.slice(-1);
		console.log(lastTicket);
		return lastTicket[0];
	}

	getQueueLength() {
		return this.#tickets.length;
	}
}

module.exports = TicketControl;
