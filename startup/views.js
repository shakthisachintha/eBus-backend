var hbs = require('express-handlebars');


module.exports = function (app) {
    app.engine('hbs', hbs({ extname: "hbs", defaultLayout: "layout", layoutsDir: __dirname + '/../views/layouts' }));
    app.set('view engine', 'hbs');
}