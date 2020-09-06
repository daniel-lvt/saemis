const express = require('express');
const router = express.Router();
const pool = require('../db/database');
const helpers = require('../lib/helpers');
const passport = require('passport');
const { isNotLoggedIn, isloggedIn } = require('../lib/auth');

router.get('/', isloggedIn, (req, res) => {
    res.render('root/root');
});

router.get('/city', isloggedIn, async(req, res) => {
    const city = await pool.query('SELECT * FROM ciudad');
    res.render('./root/city', {
        city
    });
});

router.get('/setting', isloggedIn, (req, res) => {
    res.render('./root/setting');
});

router.get('/user', isloggedIn, async(req, res) => {
    const programas = await pool.query('select carrera.idCarrera,carrera.Nombre_carrera,c.nombre_Ciudad,j.tipo_jornada from ciudad as c ,jornada j, carrera LEFT JOIN usuario_admin ON carrera.idCarrera=usuario_admin.Carrera_idCarrera where usuario_admin.idUsuario_admin is NULL and carrera.Ciudad_idCiudad = c.idCiudad and carrera.Jornada_idJornada=j.idJornada');
    const user_table = await pool.query('select ua.idUsuario_admin, ua.Nombre_Usuario_admin, ua.correo, ua.tipo_usuario_admin, c.Nombre_carrera,cd.nombre_Ciudad,j.tipo_jornada from usuario_admin ua, carrera c, ciudad cd, jornada j where ua.Carrera_idCarrera = c.idCarrera and cd.idCiudad=c.Ciudad_idCiudad and c.Jornada_idJornada=j.idJornada');
    res.render('./root/user', {
        programas,
        user_table
    });
});
router.get('/program', isloggedIn, async(req, res) => {
    const jornada = await pool.query("SELECT * FROM jornada");
    const ciudad = await pool.query("SELECT * FROM ciudad")
    const carrera = await pool.query("SELECT ca.idCarrera,ca.Nombre_carrera,ca.Descripcion_carrera,ci.nombre_Ciudad,j.tipo_jornada from carrera ca,ciudad ci,jornada j where ca.Ciudad_idCiudad=ci.idCiudad and ca.Jornada_idJornada=j.idJornada");
    res.render('./root/program', {
        jornada,
        ciudad,
        carrera
    });
});
router.get('/program/edit/:id', isloggedIn, async(req, res) => {
    const { id } = req.params;
    const data_edit = await pool.query("SELECT ca.idCarrera,ca.Nombre_carrera,ca.Descripcion_carrera,ci.nombre_Ciudad,j.tipo_jornada from carrera ca,ciudad ci,jornada j where ca.Ciudad_idCiudad=ci.idCiudad and ca.Jornada_idJornada=j.idJornada and ca.idCarrera=?", [id]);
    res.render('./root/program_edit', {
        data_edit,
        id
    });
});

router.get('/program/delete/:id', isloggedIn, async(req, res) => {
    const { id } = req.params;
    const usuario_admin = await pool.query("select * from usuario_admin where Carrera_idCarrera = ?", [id]);
    if (usuario_admin.length > 0) {
        req.flash('message', `No puede eliminar un programa que actualmente este siendo utilizado por un usuario`);
        res.redirect('/root/program');
    } else {
        const d = await pool.query('SELECT * FROM carrera where idCarrera=?', [id]);
        const del = await pool.query('DELETE FROM carrera where idCarrera=?', [id]);
        req.flash('success', `Se ha eliminado satisfactoriamente ${d[0].Descripcion_carrera} de la base de datos`);
        res.redirect('/root/program');
    }
});

router.get('/user/delete/:id', isloggedIn, async(req, res) => {
    const { id } = req.params;
    const d = await pool.query('DELETE FROM usuario_admin where idUsuario_admin = ?', [id]);
    req.flash('success', `Se ha eliminado satisfactoriamente el usuario de la base de datos`)
    res.redirect('/root/user');
});

router.post('/password', isloggedIn, async(req, res) => {
    const { current_password, new_password, new_password_repeat } = req.body;
    if (new_password === new_password_repeat) {
        const user = req.session.passport.user;
        const rows = await pool.query('SELECT * FROM usuario_root where idUsuario_root = ?', [user]);
        if (rows.length > 0) {
            const data = rows[0];
            const validPassword = await helpers.mathPassword(current_password, data.contrasena_usuario_root);
            if (validPassword) {
                const encryp = await helpers.encryptPassword(new_password);
                const data = await pool.query(`UPDATE usuario_root SET contrasena_usuario_root='${encryp}' WHERE idUsuario_root="${user}"`);
                req.flash('success', 'la contraseña ha sido actualizada');
                res.redirect('/root/setting');
            } else {
                req.flash('success', 'la contraseña digitada no es valida por favor ingrese de nuevo los datos');
                res.redirect('/root/setting');
            }
        }
    } else {
        req.flash('message', 'los valores en torno a la nueva contraseña no concuerdan, por favor ingrese la informacion de nuevo');
        res.redirect('/root/setting');
    }
});


router.post('/user/add', isloggedIn, async(req, res) => {
    const { option_carrera, mail, code } = req.body;
    const carrera_info = option_carrera.split('-');
    const usuario = mail.split('@')[0];
    const newUser = {
        idUsuario_admin: 'a-' + code,
        Nombre_Usuario_admin: usuario,
        Contrasena_Usuario_admin: usuario + code,
        correo: mail,
        tipo_usuario_admin: 'admin',
        Carrera_idCarrera: Number(carrera_info[0])
    };
    newUser.Contrasena_Usuario_admin = await helpers.encryptPassword(newUser.Contrasena_Usuario_admin);
    const data = await pool.query('INSERT INTO usuario_admin SET ?', [newUser]);
    req.flash('success', `Ha sido agregado un usuario administrador para ${carrera_info[1]}`);
    res.redirect('/root/user');
});

router.post('/program/edit/:id', isloggedIn, async(req, res) => {
    const { id } = req.params;
    const { new_name, new_description } = req.body;
    const data = await pool.query(`UPDATE carrera SET Nombre_carrera='${new_name}',Descripcion_carrera='${new_description}' WHERE idCarrera=${id}`);
    req.flash('success', `La informacion ha sido actualizada satisfactoriamente para ${new_name}`)
    res.redirect('/root/program');
});


router.post('/program/add', isloggedIn, async(req, res) => {
    console.log(req.body)
    const { option_tipo, option_carrera, corto, descripcion } = req.body;
    const carrera = {
        Nombre_carrera: corto,
        Descripcion_carrera: descripcion,
        Ciudad_idCiudad: option_carrera.split('-')[0],
        Jornada_idJornada: option_tipo.split('-')[0]
    }
    const result = await pool.query('INSERT INTO carrera set?', [carrera]);
    req.flash('success', `se ha agregado ${descripcion} satisfactoriamente`);
    res.redirect('/root/program')
});

router.post('/city', isloggedIn, async(req, res) => {
    const { city } = req.body;
    const newCity = {
        nombre_Ciudad: city
    }
    const result = await pool.query('INSERT INTO ciudad set?', [newCity]);
    req.flash('success', `se ha agregado ${city} satisfactoriamente`);
    res.redirect('/root/city')
});

module.exports = router;