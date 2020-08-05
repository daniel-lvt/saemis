const express = require('express');
const router = express.Router();
const pool = require('../db/database');
const passport = require('passport');
const { encryptPassword, matchPassword } = require('../lib/helpers');
const helpers = require('../lib/helpers');
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

router.get('/', async(req, res) => {
    const carrera = req.user.Carrera_idCarrera;
    const db_carrera = await pool.query('select idCarrera,Nombre_carrera,Descripcion_carrera from carrera where idCarrera = ?', [carrera]);
    const { idCarrera, Nombre_carrera, Descripcion_carrera } = db_carrera[0];

    res.render('./admin/admin', {
        idCarrera,
        Nombre_carrera,
        Descripcion_carrera
    });
});

router.get('/user', async(req, res) => {
    const carrera = req.user.Carrera_idCarrera;
    const dataDB_tipo = await pool.query('SELECT * FROM tipo');
    const dataDB_usuarios = await pool.query('SELECT u.Codigo, u.Nombre_usuario,u.Correo_usuario,u.NombreUsuario_usuario,c.Nombre_carrera,t.Nombre_tipo from usuario u,carrera c,tipo t where u.Carrera_IdCarrera=c.idCarrera and u.Tipo_idTipo=t.idTipo and c.idCarrera =?', [carrera])
    const db_carrera = await pool.query('select idCarrera,Nombre_carrera,Descripcion_carrera from carrera where idCarrera = ?', [carrera]);
    const { idCarrera, Nombre_carrera } = db_carrera[0];

    res.render('./admin/user', {
        idCarrera,
        Nombre_carrera,
        dataDB_tipo,
        dataDB_usuarios
    });
});


//mirar como trabajar luego
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
    const { option_tipo } = req.body;
    const { id } = req.params;
    const option_change_tipo = option_tipo.split('-')[0];
    const verificacionid = await pool.query(`SELECT * FROM usuario WHERE Codigo=${id}`);
    const { Tipo_idTipo } = verificacionid[0];
    if (Tipo_idTipo == option_change_tipo) {
        req.flash('message', 'No se han presentado cambios');
        res.redirect('/admin/user');
    } else if (Tipo_idTipo != option_change_tipo) {
        const updatetipo = await pool.query(`UPDATE usuario SET Tipo_idTipo=${option_change_tipo} WHERE Codigo=${id}`); // verificar la validacion de la base de datos
        req.flash('success', 'Se ha actualizado el tipo satisfactoriamente');
        res.redirect('/admin/user');
    }
});

router.post('/user/add', async(req, res, next) => {
    const { option_tipo, option_carrera, mail, code } = req.body;
    const usuario = mail.split('@')[0];
    const busqueda = usuario.split('.');
    const tipo = option_tipo.split('-')[0];
    const carrera = option_carrera.split('-')[0];
    const validate_nombre = (entrada) => {
        const info = entrada[1]
        const e = new Number(info[info.length - 2]);
        if (e >= 0) {
            const retorno = info.slice(0, info.length - 2);
            return retorno;
        } else {
            return info;
        }
    }
    let segundo_nombre = validate_nombre(busqueda);

    const new_user = {
        Codigo: code,
        Nombre_usuario: busqueda[0].toLowerCase() + ' ' + segundo_nombre.toLowerCase(),
        Correo_usuario: mail,
        Contrasena_usuario: code,
        NombreUsuario_usuario: usuario,
        Carrera_IdCarrera: carrera,
        Tipo_idTipo: tipo
    }
    new_user.Contrasena_usuario = await helpers.encryptPassword(code);
    const result = await pool.query('INSERT INTO usuario set?', [new_user]);
    req.flash('success', `Se ha agregado un nuevo usuario con codigo ${code}`);
    res.redirect('/admin/user');
});


module.exports = router;