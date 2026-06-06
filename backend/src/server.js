import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`=======================================================`);
  console.log(` Eurosia Defender X Decoupled Core Backend online      `);
  console.log(` Transceiver frequency bridged on port: ${PORT}       `);
  console.log(` Running in '${process.env.NODE_ENV || "development"}' environment             `);
  console.log(`=======================================================`);
});
