const io = require("socket.io")();
const socketapi = {
    io: io
}

io.on("connection", (socket) => {
    let now = new Date();
    console.log("[INFO] new connection: [" + socket.id + "]",
        socket.request.connection.remoteAddress);
    socket.on("message", (data) => {
        console.log(`[message] from ${data.clientID} via socket id: ${socket.id}`);
        socket.broadcast.emit("message", data);
    });

    socket.on("/esp/envir", (data) => {
        console.log(`[/esp/envir] from ${data.clientID} via socket id: ${socket.id}`);
        socket.broadcast.emit("/web/envir", data);
    })

    socket.on('time_eat', (eattime) => {
        io.emit('time_eat', eattime)
        let hour = eattime.split(':')[0]
        let minute = eattime.split(':')[1]
        var etm_time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0) - now;
        if (etm_time < 0) {
            etm_time += 86400000; // it's after 10am, try 10am tomorrow.
        }
        setTimeout(function () {
            io.emit("feed", "it's time")
            console.log("it's time to eat")
        }, etm_time);

        console.log(eattime)
    })
    socket.on('time_drink', (drinktime) => {
        io.emit('time_drink', drinktime)
        console.log(drinktime)
        let hour = drinktime.split(':')[0]
        let minute = drinktime.split(':')[1]
        var etm_time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0) - now;
        if (etm_time < 0) {
            etm_time += 86400000; // it's after 10am, try 10am tomorrow.
        }
        setTimeout(function () {
            io.emit("water", "it's time")
            console.log("it's time to drink")
        }, etm_time);
    })

    /**************************** */
    //xu ly chung
    socket.on("reconnect", function () {
        console.log("[" + socket.id + "] reconnect.");
    });
    socket.on("disconnect", () => {
        console.log("[" + socket.id + "] disconnect.");
    });
    socket.on("connect_error", (err) => {
        console.log(err.stack);
    });
})

module.exports = socketapi;