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
        idUsuario_root: fk_root(),
        nombre_usuario_root: username,
        contrasena_usuario_root: password,
        tipo_usuario_root: 'root'
    };
    newUser.contrasena_usuario_root = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO usuario_root SET?', [newUser]);
    return done(null, newUser);
}));

passport.use('local.signin.root', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM usuario_root WHERE nombre_usuario_root = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.mathPassword(password, user.contrasena_usuario_root);
        if (validPassword) {
            done(null, user, req.flash('success', `Bienvenido ${user.nombre_usuario_root.toUpperCase()}!!!`));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'No hay una cuenta de acceso para el usuario'));
    }
}));


// Admin

passport.use('local.signin.admin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM usuario_admin WHERE Nombre_Usuario_admin = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.mathPassword(password, user.Contrasena_Usuario_admin);
        if (validPassword) {
            done(null, user, req.flash('success', `Bienvenido ${user.Nombre_Usuario_admin.toUpperCase()}!!!`));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', `El usuario ${username} no se encuentra registrado en el sistema`));
    }
}));

// Usuario


passport.serializeUser((user, done) => {
    if (user.tipo_usuario_root != undefined) {
        done(null, user.idUsuario_root);
    } else if (user.tipo_usuario_admin != undefined) {
        done(null, user.idUsuario_admin);
    } else {
        done(null, user.Codigo);
    }
});

passport.deserializeUser(async(id, done) => {
    if (id.length === undefined) {
        console.log('usuario normal');
    } else if (id.split('')[0] === 'r') {
        const rows = await pool.query('SELECT * FROM usuario_root WHERE idUsuario_root = ?', [id]);
        done(null, rows[0]);
    } else if (id.split('')[0] === 'a') {
        const rows = await pool.query('SELECT * FROM usuario_admin WHERE idUsuario_admin =?', [id]);
        done(null, rows[0]);
    }
});

let fk_root = () => {
    let result = 'r-';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};