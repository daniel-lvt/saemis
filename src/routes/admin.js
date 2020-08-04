const express = require('express');
const router = express.Router();
const pool = require('../db/database');
const passport = require('passport');
const { encryptPassword, matchPassword } = require('../lib/helpers');
/*
queda pendiente 
    pendiente
        usuario
            crud
                validacion y verificacion de datos 
                informacion que se recibe de la pagina => validar
                informacion que llega del servidor => validar
                redireccion y finalizacion de sesion cuando se cree el acceso
        curso
            crud
        data
            generar reporte pdf
            cargar contenido en masa de usuarios
        setting
            validar cambio de contraseña cuando se realice el login
        
*/
//functions get

router.get('/', (req, res) => {
    res.render('./admin/admin')
})

router.get('/user', async(req, res) => {
    const dataDB_tipo = await pool.query('SELECT * FROM tipo');
    const dataDB_carrera = await pool.query('SELECT * FROM carrera');
    const dataDB_usuarios = await pool.query('SELECT u.Codigo, u.Nombre_usuario,u.Correo_usuario,u.NombreUsuario_usuario,c.Nombre_carrera,t.Nombre_tipo from usuario u,carrera c,tipo t where u.Carrera_IdCarrera=c.idCarrera and u.Tipo_idTipo=t.idTipo')

    res.render('./admin/user', {
        dataDB_carrera,
        dataDB_tipo,
        dataDB_usuarios
    });
});

router.get('/course', async(req, res) => {
    const dataDB_tipo = await pool.query('SELECT * FROM tipo');
    const dataDB_carrera = await pool.query('SELECT * FROM carrera');
    const dataDB_usuarios = await pool.query('SELECT u.Codigo, u.Nombre_usuario,u.Correo_usuario,u.NombreUsuario_usuario,c.Nombre_carrera,t.Nombre_tipo from usuario u,carrera c,tipo t where u.Carrera_IdCarrera=c.idCarrera and u.Tipo_idTipo=t.idTipo')
    const dataDB_teachers = await pool.query(`SELECT u.Codigo, u.Nombre_usuario,u.Correo_usuario,u.NombreUsuario_usuario,c.Nombre_carrera,t.Nombre_tipo from usuario u,carrera c,tipo t where u.Carrera_IdCarrera=c.idCarrera and u.Tipo_idTipo=t.idTipo and Nombre_tipo='docente'`);

    res.render('./admin/course', {
        dataDB_carrera,
        dataDB_tipo,
        dataDB_usuarios,
        dataDB_teachers
    });
});

router.get('/data', async(req, res) => {
    // revisar si toda la informacion de las consultas es necesaria
    const dataDB_tipo = await pool.query('SELECT * FROM tipo');
    const dataDB_carrera = await pool.query('SELECT * FROM carrera');
    const dataDB_usuarios = await pool.query('SELECT u.Codigo, u.Nombre_usuario,u.Correo_usuario,u.NombreUsuario_usuario,c.Nombre_carrera,t.Nombre_tipo from usuario u,carrera c,tipo t where u.Carrera_IdCarrera=c.idCarrera and u.Tipo_idTipo=t.idTipo')

    res.render('./admin/data', {
        dataDB_carrera,
        dataDB_tipo,
        dataDB_usuarios
    });
});

router.get('/setting', async(req, res) => {
    res.render('./admin/setting');
});

router.get('/logout', async(req, res) => {

});

router.get('/user/edit/:id', async(req, res) => {
    const { id } = req.params;
    const dataEdit = await pool.query(`SELECT u.Codigo, u.Nombre_usuario,u.Correo_usuario,u.NombreUsuario_usuario,c.Nombre_carrera,t.Nombre_tipo from usuario u,carrera c,tipo t where u.Carrera_IdCarrera=c.idCarrera and u.Tipo_idTipo=t.idTipo and u.Codigo=${id}`)
    const dataDB_tipo = await pool.query('SELECT * FROM tipo');
    const dataDB_carrera = await pool.query('SELECT * FROM carrera');

    res.render('./admin/user_edit', {
        dataEdit,
        dataDB_tipo,
        dataDB_carrera,
        id
    });
});

router.get('/user/delete/:id', async(req, res) => {
    const { id } = req.params;
    const d = await pool.query(`SELECT *FROM usuario WHERE Codigo=${id}`);
    const del = await pool.query(`DELETE FROM usuario WHERE Codigo=${id}`);
    req.flash('success', `Se ha eliminado ${d[0].Nombre_usuario} satisfactoriamente`);
    res.redirect('/admin/user');
});

// functions post

router.post('/course', (req, res) => {
    console.log(req.body)
});


router.post('/user/edit/:id', async(req, res) => {

    const { option_tipo, option_carrera } = req.body;
    const { id } = req.params;
    const option_change_tipo = option_tipo.split('-')[0];
    const option_change_race = option_carrera.split('-')[0];
    const verificacionid = await pool.query(`SELECT * FROM usuario WHERE Codigo=${id}`);
    const { Carrera_idCarrera, Tipo_idTipo } = verificacionid[0];

    if (Carrera_idCarrera == option_change_race && Tipo_idTipo == option_change_tipo) {
        console.log('no se han presentado cambios dentro de la aplicacion');
    } else if (Carrera_idCarrera != option_change_race && Tipo_idTipo != option_change_tipo) {
        const updatecarrera = await pool.query(`UPDATE usuario SET Tipo_idTipo=${option_change_race} WHERE Codigo=${id}`);
        const updatetipo = await pool.query(`UPDATE usuario SET Tipo_idTipo=${option_change_tipo} WHERE Codigo=${id}`); // verificar la validacion de la base de datos
        req.flash('success', 'Se ha actualizado el tipo y la carrera satisfactoriamente');
        res.redirect('/admin/user')

    } else if (Carrera_idCarrera == option_change_race && Tipo_idTipo != option_change_tipo) {
        const updatetipo = await pool.query(`UPDATE usuario SET Tipo_idTipo=${option_change_tipo} WHERE Codigo=${id}`);
        req.flash('success', 'Se ha actualizado el tipo satisfactoriamente');
        res.redirect('/admin/user')

    } else if (Carrera_idCarrera != option_change_race && Tipo_idTipo == option_change_tipo) {
        const updatecarrera = await pool.query(`UPDATE usuario SET Tipo_idTipo=${option_change_race} WHERE Codigo=${id}`);
        req.flash('success', 'Se ha actualizado la carrera satisfactoriamente');
        res.redirect('/admin/user')
    }

});

router.post('/user/add', async(req, res, next) => {
    passport.authenticate('local.user', {
        successRedirect: '/admin/user',
        failureRedirect: '/profile/profile',
        failureFlash: true
    })(req, res, next);
})


module.exports = router;