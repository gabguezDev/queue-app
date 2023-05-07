const fs = require("fs");
const path = require("path");
const { isNumberObject } = require("util/types");

class Ticket {
	#number;
	#desktop;

	constructor() {
		this.#desktop;
		this.#number;
	}

	get number() {
		return this.#number;
	}

	get desktop() {
		return this.#desktop;
	}

	set number(num) {
		this._number = num;
	}

	set desktop(desk) {
		this._desktop = desk;
	}

	toJSON() {
		return { number: this._number, desktop: this._desktop };
	}
}

class TicketControl {
	static number = 0; // Number to assign to tickets of the day (Like a counter)

	constructor() {
		this.tickets = []; // List of all tickets of today
		this.lastFour = []; // Last four tickets
		this.lastTicket = null;
		this.peekTicket = null;
		this.today = new Date().toLocaleDateString("en-GB"); // Today Date
		this.dbPath = path.join(__dirname, "../db/tickets.json"); // Saving path

		this.init();
	}

	init() {
		try {
			// Try to get data from tickets.json
			const existFileData = fs.existsSync(this.dbPath);

			if (existFileData) {
				const data = JSON.parse(
					fs.readFileSync(this.dbPath, { encoding: "utf-8" })
				);

				if (data && this.today === data.today) {
					this.tickets = data.tickets;
					this.lastFour = data.lastFour;
					this.lastTicket = data.lastTicket;
					this.peekTicket = data.peekTicket;
					TicketControl.number = data.number;
				}

				return;
			}

			throw new Error();
		} catch (error) {
			// If error exists print it to console
			console.log(
				"El archivo tickets.json no existe. Se creará uno nuevo en ../db/tickets.json"
			);
			const newData = {
				tickets: this.tickets,
				lastFour: this.lastFour,
				today: this.today,
				lastTicket: this.lastTicket,
				peekTicket: this.peekTicket,
				number: TicketControl.number,
			};
			fs.writeFileSync(this.dbPath, JSON.stringify(newData));
		}
	}

	createTicket() {
		const newTicket = new Ticket();

		newTicket.number = ++TicketControl.number;

		this.enqueueTicket(newTicket.toJSON());

		return newTicket.toJSON();
	}

	enqueueTicket(ticket) {
		this.tickets.unshift(ticket);
		this.lastTicket = ticket;
		if (this.lastFour.length < 4) {
			this.lastFour.unshift(ticket);
		}
		this.peekTicket =
			this.lastFour.slice(-1).length != 0 ? this.lastFour.slice(-1)[0] : null;
		this.saveDB();
	}

	dequeueTicket() {
		if (this.tickets.length !== 0) {
			this.tickets.pop();
			this.lastFour.pop();
			this.lastTicket = this.lastFour[0];
			this.lastFour = this.tickets
				.slice(-1, -4)
				.map(ticket => ticket !== undefined && ticket);
			this.peekTicket = this.lastFour[0];
			this.saveTickets();
		}
	}

	saveDB() {
		const data = {
			tickets: this.tickets,
			lastFour: this.lastFour,
			today: this.today,
			lastTicket: this.lastTicket,
			peekTicket: this.peekTicket,
			number: TicketControl.number,
		};
		fs.writeFileSync(this.dbPath, JSON.stringify(data));
	}

	setDesktop(desktop) {
		if (this.tickets.length !== 0)
			this.tickets.slice(-1)[0].desktop = Number(desktop);

		if (this.lastFour.length < 4) {
			this.lastFour = this.tickets.slice(-1, -4);
		}
		this.saveDB();
	}

	get peekTicket() {
		return this._peekTicket;
	}

	set peekTicket(ticket) {
		this._peekTicket = ticket;
	}

	get lastTicket() {
		return this._lastTicket;
	}

	set lastTicket(ticket) {
		this._lastTicket = ticket;
	}

	get lastFour() {
		return this._lastFour;
	}

	set lastFour(lastFour) {
		this._lastFour = lastFour;
	}

	get tickets() {
		return this._tickets;
	}

	set tickets(__tickets) {
		this._tickets = __tickets;
	}
}

module.exports = { TicketControl };
