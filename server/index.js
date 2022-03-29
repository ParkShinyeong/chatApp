const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credential: true,
  },
});

io.on("connection", (socket) => {
  socket.on("message", ({ name, message }) => {
    io.emit("message", { name, message });
  });
});

// app.use("/", (req, res) => {
//   res.send("HELLO WORLD");
// });

server.listen(4000, function () {
  console.log("listening on port 4000");
});
