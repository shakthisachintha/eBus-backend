const express = require("express");
const app = express();

const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logger")();
require("./startup/routes")(app);
require("./startup/mongo")();
require("./startup/config")();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Listning on port ${port}`);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Listning on port ${port}`);
});
