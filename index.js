require("./startup/config")();

const express = require("express");
const app = express();
const cors = require("cors");

const winston = require("winston");

app.use(express.json({extended: false}));
app.use(cors({origin:true,credentials:true}));

require("./startup/logger")();
require("./startup/mongo")();
require("./startup/routes")(app);
require("./startup/views")(app)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Listning on port ${port}`);
});
