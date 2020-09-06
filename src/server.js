const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const compression = require('compression')

const { database } = require('./config/database_keys');
const app = express();
require('./lib/passport');

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

app.use(session({
    secret: 'datass',
    store: new MySQLStore(database),
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(compression())

app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    if (req.user != undefined) {
        app.locals.usuario_root = req.user.tipo_usuario_root == 'root' ? true : false;
        app.locals.usuario_admin = req.user.tipo_usuario_admin == 'admin' ? true : false;
        app.locals.usuario_estudiante = req.user.Tipo_idTipo == 1 ? true : false;
        app.locals.usuario_docente = req.user.Tipo_idTipo == 2 ? true : false;
        app.locals.usuario_monitor = req.user.Tipo_idTipo == 3 ? true : false;
    }
    next();
});

app.use(require('./routes'));
app.use('/root', require('./routes/root'));
app.use('/admin', require('./routes/admin'));
app.use('/user', require('./routes/user'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log('server on port :', app.get('port'));
});