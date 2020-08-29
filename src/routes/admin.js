const express = require('express');
const router = express.Router();
const pool = require('../db/database');
const { isNotLoggedIn, isloggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers');
const { upload } = require('../lib/file');
const xlsx = require('node-xlsx');
const { dataInfo } = require('../lib/reports');


router.get('/', isloggedIn, async(req, res) => {
    const carrera = req.user.Carrera_idCarrera;
    const db_carrera = await pool.query('select idCarrera,Nombre_carrera,Descripcion_carrera from carrera where idCarrera = ?', [carrera]);
    const { idCarrera, Nombre_carrera, Descripcion_carrera } = db_carrera[0];
    res.render('./admin/admin', {
        idCarrera,
        Nombre_carrera,
        Descripcion_carrera
    });
});

router.get('/user', isloggedIn, async(req, res) => {
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

router.get('/setting', isloggedIn, async(req, res) => {
    res.render('./admin/setting');
});

router.get('/user/edit/:id', isloggedIn, async(req, res) => {
    const { id } = req.params;
    const carrera = req.user.Carrera_idCarrera;
    const dataEdit = await pool.query(`SELECT u.Codigo, u.Nombre_usuario,u.Correo_usuario,u.NombreUsuario_usuario,c.Nombre_carrera,t.Nombre_tipo from usuario u,carrera c,tipo t where u.Carrera_IdCarrera=c.idCarrera and u.Tipo_idTipo=t.idTipo and u.Codigo=${id} and u.Carrera_idCarrera=${carrera}`)
    const dataDB_tipo = await pool.query('SELECT * FROM tipo');
    const dataDB_carrera = await pool.query('SELECT * FROM carrera');
    res.render('./admin/user_edit', {
        dataEdit,
        dataDB_tipo,
        dataDB_carrera,
        id
    });
});

router.get('/user/delete/:id', isloggedIn, async(req, res) => {
    const { id } = req.params;
    const carrera = req.user.Carrera_idCarrera;
    const d = await pool.query(`SELECT *FROM usuario WHERE Codigo=${id} and Carrera_idCarrera=${carrera}`);
    const del = await pool.query(`DELETE FROM usuario WHERE Codigo=${id} and Carrera_idCarrera=${carrera}`);
    req.flash('success', `Se ha eliminado ${d[0].Nombre_usuario} satisfactoriamente`);
    res.redirect('/admin/user');
});

router.post('/course/add', isloggedIn, async(req, res) => {
    const carrera = req.user.Carrera_idCarrera;
    const { name, grupo } = req.body;
    const newCurse = {
        Nombre_materia: name,
        Grupo_materia: grupo,
        Carrera_idCarrera: carrera
    }
    const data = await pool.query('INSERT INTO materia set?', [newCurse]);
    req.flash('success', `Ha sido agregado el curso de ${name}`);
    res.redirect('/admin/course');
});

router.post('/user/edit/:id', isloggedIn, async(req, res) => {
    const { option_tipo } = req.body;
    const carrera = req.user.Carrera_idCarrera;
    const { id } = req.params;
    const option_change_tipo = option_tipo.split('-')[0];
    const verificacionid = await pool.query(`SELECT * FROM usuario WHERE Codigo=${id} and Carrera_idCarrera =${carrera}`);
    const { Tipo_idTipo } = verificacionid[0];
    if (Tipo_idTipo == option_change_tipo) {
        req.flash('message', 'No se han presentado cambios');
        res.redirect('/admin/user');
    } else if (Tipo_idTipo != option_change_tipo) {
        const updatetipo = await pool.query(`UPDATE usuario SET Tipo_idTipo=${option_change_tipo} WHERE Codigo=${id} and Carrera_idCarrera=${carrera}`); // verificar la validacion de la base de datos
        req.flash('success', 'Se ha actualizado el tipo satisfactoriamente');
        res.redirect('/admin/user');
    }
});

router.get('/course', isloggedIn, async(req, res) => {
    const carrera = req.user.Carrera_idCarrera;
    const dataDB_course = await pool.query('Select * from materia where Carrera_idCarrera = ?', [carrera]);
    res.render('./admin/course', {
        dataDB_course
    });
});

router.post('/user/add', isloggedIn, async(req, res, next) => {
    const { option_tipo, option_carrera, mail, code } = req.body;
    const usuario = mail.split('@')[0];
    const busqueda = usuario.split('.');
    const tipo = option_tipo.split('-')[0];
    const carrera = option_carrera.split('-')[0];

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

router.post('/password', isloggedIn, async(req, res) => {
    const { current_password, new_password, new_password_repeat } = req.body;
    if (new_password === new_password_repeat) {
        const user = req.session.passport.user;
        const rows = await pool.query('SELECT * FROM usuario_admin where idUsuario_admin = ?', [user]);
        if (rows.length > 0) {
            const data = rows[0];
            const validPassword = await helpers.mathPassword(current_password, data.Contrasena_Usuario_admin);
            if (validPassword) {
                const encryp = await helpers.encryptPassword(new_password);
                const data = await pool.query(`UPDATE usuario_admin SET Contrasena_Usuario_admin='${encryp}' WHERE idUsuario_admin="${user}"`);
                req.flash('success', 'la contraseña ha sido actualizada');
                res.redirect('/admin/setting');
            } else {
                req.flash('success', 'la contraseña digitada no es valida por favor ingrese de nuevo los datos');
                res.redirect('/admin/setting');
            }
        }
    } else {
        req.flash('message', 'los valores en torno a la nueva contraseña no concuerdan, por favor ingrese la informacion de nuevo');
        res.redirect('/admin/setting');
    }
});

router.get('/course/delete/:id', async(req, res) => {
    const { id } = req.params;
    const carrera = req.user.Carrera_idCarrera;
    const name = await pool.query(`SELECT Nombre_materia,Grupo_materia from materia WHERE idMateria = ${id} and Carrera_idCarrera = ${carrera}`);
    const data = await pool.query(`DELETE FROM materia WHERE idMateria = ${id} and Carrera_idCarrera = ${carrera}`);
    req.flash('success', `Se ha eliminado ${name[0].Nombre_materia} con grupo ${name[0].Grupo_materia} satisfactoriamente`);
    res.redirect('/admin/course');
});

router.get('/course/edit/:id', async(req, res) => {
    const carrera = req.user.Carrera_idCarrera;
    const { id } = req.params;
    const data = await pool.query(`SELECT * FROM materia WHERE idMateria = ${id} and Carrera_idCarrera = ${carrera}`);
    res.render('./admin/course_edit', {
        data
    });
});

router.post('/course/edit/:id', async(req, res) => {
    const { id } = req.params;
    const { name, group } = req.body;
    const data = await pool.query('SELECT * FROM materia WHERE idMateria = ? ', [id]);

    if (data[0].Nombre_materia != name && data[0].Grupo_materia != group) {
        const update = await pool.query(`UPDATE materia SET Nombre_materia='${name}',Grupo_materia='${group}'  WHERE idMateria=${id}`);
        req.flash('success', 'Se ha actualizado nombre y grupo satisfactoriamente');
        res.redirect('/admin/course');
    } else if (data[0].Nombre_materia == name && data[0].Grupo_materia != group) {
        const update = await pool.query(`UPDATE materia SET Grupo_materia='${group}'  WHERE idMateria=${id}`);
        req.flash('success', 'Se ha actualizado grupo satisfactoriamente');
        res.redirect('/admin/course');
    } else if (data[0].Nombre_materia != name && data[0].Grupo_materia == group) {
        const update = await pool.query(`UPDATE materia SET Nombre_materia='${name}' WHERE idMateria=${id}`);
        req.flash('success', 'Se ha actualizado nombre satisfactoriamente');
        res.redirect('/admin/course');
    }
    console.log(data[0])
    res.redirect('/admin/course');
});


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

// --------------------------- carga de usuarios, se puede mejorar bastante

router.post('/data/upload', upload.single('file'), async(req, res) => {
    const carrera = req.user.Carrera_idCarrera;
    const data = pool.query('DELETE FROM usuario WHERE Carrera_idCarrera = ? ', [carrera]);
    const workSheetsFromFile = xlsx.parse(req.file.path);
    const ce = workSheetsFromFile[0].data.length;
    const cd = workSheetsFromFile[1].data.length;
    let ca = 0,
        cb = 0
    while (ca != ce) {
        const data = workSheetsFromFile[0].data[ca];
        user(data, carrera, 1);
        ca++;
    }
    while (cb != cd) {
        const data = workSheetsFromFile[1].data[cb];
        user(data, carrera, 2);
        cb++;
    }
    req.flash('success', 'Los Usuarios han sido subidos con exito');
    res.redirect('/admin/user');
});

const user = async(data, carrera, id) => {
    const codigo = data[0];
    const correo = data[1];
    const usuario = correo.split('@')[0];
    const busqueda = usuario.split('.');
    const segundo_nombre = validate_nombre(busqueda);
    const new_user = {
        Codigo: codigo,
        Nombre_usuario: busqueda[0].toLowerCase() + ' ' + segundo_nombre.toLowerCase(),
        Correo_usuario: correo,
        Contrasena_usuario: usuario + codigo,
        NombreUsuario_usuario: usuario,
        Carrera_IdCarrera: carrera,
        Tipo_idTipo: id
    }
    new_user.Contrasena_usuario = await helpers.encryptPassword(new_user.Contrasena_usuario);
    const result = await pool.query('INSERT INTO usuario set?', [new_user]);
}


// ---------------------------------------------------------------------------

// -----------------------------------proceso-------------------------------------------


router.post('/data/report/data', async(req, res) => {
    // retorno de la informacion excel
});
router.post('/data/report/info', async(req, res) => {
    // retorno de la informacion pdf
    const idCarrera = req.user.Carrera_idCarrera;
    const { option_tipo } = req.body;
    if (option_tipo === 'Estudiantes') {
        dataInfo(idCarrera, 1);
    } else if (option_tipo === 'Docentes') {
        dataInfo(idCarrera, 2);
    } else if (option_tipo === 'Monitores') {
        dataInfo(idCarrera, 3);
    } else {
        dataInfo(idCarrera, 4);
    }
    // dataEstudiantes(idCarrera);
});

router.get('/course/setting/:id', async(req, res) => {
    const { id } = req.params;
    const carrera = req.user.Carrera_idCarrera;
    const data = await pool.query('SELECT * FROM materia WHERE idMateria =?', [id]);
    const estudiantes = await pool.query(`SELECT u.Codigo, u.Nombre_usuario,u.Correo_usuario,u.NombreUsuario_usuario,c.Nombre_carrera,t.Nombre_tipo from usuario u,carrera c,tipo t where u.Carrera_IdCarrera=c.idCarrera and u.Tipo_idTipo=t.idTipo and c.idCarrera =${carrera} and t.Nombre_tipo="estudiante"`);
    res.render('./admin/course_setting', {
        data,
        estudiantes,
        id
    });
});

router.post('/course/setting/add-students/:id', async(req, res) => {
    const { id } = req.params;
    const data = Object.keys(req.body).map(x => parseInt(x));
    const out = data.slice(0, data.length - 1);
    let i = 0;
    while (i != (out.length)) {
        const contenido_curso = {
            Materia_idMateria: id,
            Usuario_Codigo: out[i],
        }
        const ins = await pool.query('insert into contenidocurso set?', [contenido_curso]);
        i += 1;
    }
    req.flash('success', 'Los estudiantes han sido agregados al curso');
    res.redirect(`/admin/course/setting/${id}`);
});

router.get('/data', isloggedIn, async(req, res) => {
    // revisar si toda la informacion de las consultas es necesaria
    // consultar con modulos que mas informacion debemos de proporcionar en data
    const dataDB_tipo = await pool.query('SELECT * FROM tipo');
    const dataDB_carrera = await pool.query('SELECT * FROM carrera');
    const dataDB_usuarios = await pool.query('SELECT u.Codigo, u.Nombre_usuario,u.Correo_usuario,u.NombreUsuario_usuario,c.Nombre_carrera,t.Nombre_tipo from usuario u,carrera c,tipo t where u.Carrera_IdCarrera=c.idCarrera and u.Tipo_idTipo=t.idTipo');
    res.render('./admin/data', {
        dataDB_carrera,
        dataDB_tipo,
        dataDB_usuarios
    });
});

module.exports = router;