require("./startup/config")();

const express = require("express");
const app = express();
const cors = require("cors");

const winston = require("winston");

app.use(express.json({extended: false}));
app.use(cors({origin:true,credentials:true}));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.get(
//   '/',
//   (req,res)=>{
//     res.send("hello");
//   }
// )

require("./startup/logger")();
require("./startup/mongo")();
require("./startup/routes")(app);
require("./startup/views")(app)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Listning on port ${port}`);
});
