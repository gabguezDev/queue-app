// Referencias del HTML

const socket = io();

socket.on("connect", () => {
	console.log("Conectado desde cliente");
});

socket.on("disconnect", () => {
	console.log("Desconectado del servidor");
});

socket.on("enviar-mensaje", payload => {
	console.log("enviar mensaje (cliente)");
	console.log(payload);
});
