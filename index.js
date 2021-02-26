const express = require("express");
require("dotenv").config();
const { dbConnection } = require("./database/config");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const errorMiddleware = require("./middlewares/errors");

//base de datos
dbConnection();

//cors
app.use(cors());

app.use(express.static("public"));
app.use(express.json());

app.use(cookieParser());

app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/order.routes"));
app.use("/api", require("./routes/product.routes"));
app.use("/api", require("./routes/person.routes"));

app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${process.env.PORT} en ${process.env.NODE_ENV} mode`
  );
});

process.on("unhandlerRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
