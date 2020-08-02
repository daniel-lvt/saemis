const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../db/database');
const helpers = require('../lib/helpers');

// Root

passport.use('local.signup.root', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {

    const newUser = {
        nombre_usuario_root: username,
        contrasena_usuario_root: password
    };
    newUser.contrasena_usuario_root = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO usuario_root SET?', [newUser]);
    newUser.idUsuario_root = result.insertId;
    return done(null, newUser);
    console.log(newUser)
}));

passport.use('local.signin.root', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM usuario_root WHERE nombre_usuario_root = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        console.log('-----------');
        console.log(user.contrasena_usuario_root);
        console.log('-----------');
        const validPassword = await helpers.mathPassword(password, user.contrasena_usuario_root);
        if (validPassword) {
            done(null, user, req.flash('success', `Bienvenido ${user.nombre_usuario_root.toUpperCase()}!!!`));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'el usuario no se encuentra registrado'));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.idUsuario_root);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM usuario_root WHERE idUsuario_root = ?', [id]);
    done(null, rows[0]);
})

// Admin




// Usuario