export default function socketHandler(io) {
    try {
        io.on("connection", (socket) => {
            console.log("A client connected:", socket.id);

            socket.on("joinTable", ({ tableId }) => {
                const roomName = `table-${tableId}`;
                socket.join(roomName);
                console.log(`Socket ${socket.id} joined ${roomName}`);
            });

            socket.on("leaveTable", ({ tableId }) => {
                const roomName = `table-${tableId}`;
                socket.leave(roomName);
                console.log(`Socket ${socket.id} left ${roomName}`);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });


        });
    } catch (error) {
        console.error("❌ socket error:", error);
        throw error;
    }

}