require("./startup/config")();

const express = require("express");
const app = express();

const winston = require("winston");

require("./startup/logger")();
require("./startup/mongo")();
require("./startup/routes")(app);
require("./startup/views")(app)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Listning on port ${port}`);
});
