const express = require('express');
const router = express.Router();
const pool = require('../db/database');
const helpers = require('../lib/helpers');
const { createPDF } = require('../lib/pdf');

router.get('/', async(req, res) => {
    const id_user = req.user.Codigo;
    const cursos = await pool.query(`select Materia_idMateria,Nombre_materia,Grupo_materia from contenidocurso c join materia m where m.idMateria=c.Materia_idMateria and Usuario_Codigo=${id_user}`);

    res.render('./user/user', {
        cursos,
    });
});

router.get('/report', async(req, res) => {
    res.render('./user/reports')
});

router.get('/course/add-forum/:id', async(req, res) => {
    console.log(req.user);
    const { id } = req.params;
    const course = await pool.query('select * from materia where idMateria=?', [id]);
    console.log(course)
    res.render('./user/create_forum', {
        course,
        id
    });
});

router.post('/course/add-forum/:id', async(req, res) => {
    const { Codigo, Nombre_usuario, Carrera_idCarrera, Tipo_idTipo } = req.user;
    const { titulo, descripcion, archivo } = req.body;
    const { id } = req.params;
    const newForo = {
        idMateria: Number(id),
        title: titulo,
        Descripcion: descripcion,
        url_Image: archivo.length > 0 ? url_Image : null,
        Usuario_Codigo: Codigo,
        Usuario_Carrera_idCarrera: Carrera_idCarrera,
        Usuario_Tipo_idTipo: Tipo_idTipo
    };
    const data = await pool.query('insert into foro set?', [newForo]);
    res.redirect(`/user/course/${id}`);
});

router.post('/prueba', (req, res) => {
    console.log('informacion dentro');
    console.log(req.body);
    console.log('informacion fuera');
    res.redirect('/user');
});

router.get('/course/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const course = await pool.query('select * from materia where idMateria= ?', [id]);
        const docente = await pool.query(`select * from usuario where Codigo=(select Usuario_Codigo from contenidocurso where Materia_idMateria =${id} and Codigo_Docente is not null)`);
        const monitor = await pool.query(`select * from usuario where Codigo=(select Usuario_Codigo from contenidocurso where Materia_idMateria =${id} and Codigo_Monitor is not null)`);
        //revisar doble salida de monitores mirar la validacion de este campo
        const foro = await pool.query(`select * from foro where idMateria=${id}`);
        res.render('./user/course', {
            course,
            docente,
            monitor,
            foro
        });
    } catch (error) {
        res.send('Errores no vergas');
    }
});

router.post('/course/forum/add-comment/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { Codigo, Carrera_idCarrera, Tipo_idTipo } = req.user;
        const { comentario } = req.body;
        const infoForo = await pool.query(`select * from foro where idForo=${id}`);
        const newCommentforo = {
            comentario
        }
        const data = await pool.query('insert into comentario set?', [newCommentforo]);
        console.log(data)
        const dataforo = {
            Usuario_Codigo: Codigo,
            Usuario_Carrera_idCarrera: Carrera_idCarrera,
            Usuario_Tipo_idTipo: Tipo_idTipo,
            Foro_idForo: id,
            Foro_Usuario_Codigo: infoForo[0].Usuario_Codigo,
            Foro_Usuario_Carrera_idCarrera: infoForo[0].Usuario_Carrera_idCarrera,
            Foro_Usuario_Tipo_idTipo: infoForo[0].Usuario_Tipo_idTipo,
            comentario_idcomentario: data.insertId
        }
        const entradaforo = await pool.query('insert into usuario_has_foro set?', [dataforo]);
        req.flash('success', 'Un nuevo comentario ha sido agregado')
        res.redirect(`/user/course/forum/${id}`);
    } catch (error) {
        console.log(error)
    }
});

router.get('/course/forum/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const dataforum = await pool.query(`select * from foro where idForo=${id}`);
        const { idMateria, Usuario_Codigo, Usuario_Carrera_idCarrera, Usuario_Tipo_idTipo } = dataforum[0];
        const { Nombre_usuario } = req.user;
        const materia = await pool.query(`select Nombre_materia,Grupo_materia from materia where idMateria=${idMateria}`);
        const usuario = await pool.query(`select Nombre_usuario from usuario where Codigo=${Usuario_Codigo}`);
        const carrera = await pool.query(`select Descripcion_carrera from carrera where idCarrera=${Usuario_Carrera_idCarrera}`);
        const tipoUsuario = await pool.query(`select Nombre_tipo from tipo where idTipo=${Usuario_Tipo_idTipo}`);
        const comentariosforo = await pool.query(`select u.Nombre_usuario,c.comentario,c.fecha_comentario,t.Nombre_tipo from usuario_has_foro uf, usuario u, tipo t, comentario c where uf.Usuario_Codigo=u.Codigo and c.idcomentario=uf.comentario_idcomentario and t.idTipo=uf.Usuario_Tipo_idTipo and uf.Foro_idForo=${id}`);
        res.render('./user/forum', {
            dataforum,
            materia,
            usuario,
            carrera,
            tipoUsuario,
            Nombre_usuario,
            comentariosforo,
            id
        });
    } catch (err) {
        res.send(err);
    }
});
router.get('/setting', (req, res) => {
    res.render('./user/setting');
});
router.post('/setting/report/', async(req, res) => {
    const { option_tipo } = req.body;
    const { Codigo } = req.user;

    const infoPDF = (out, tipo) => {
        const pdfDoc = pdfMake.createPdf(out);
        pdfDoc.getBase64((da) => {
            res.writeHead(200, {
                'Content-Type': 'application/dpf',
                'Content-Disposition': `attachment;filename="${tipo}-${Date.now()}.pdf"`
            });
            const download = Buffer.from(da.toString('utf-8'), 'base64');
            res.end(download);
        });
    }

    if (option_tipo === 'Participacion') {
        //revisar el flujo de la informacion en llegada 
        const data = await createPDF(Codigo, 5, 'participacion');
        infoPDF(data, 'participacion');
    }

});

router.post('/password', async(req, res) => {
    const { current_password, new_password, new_password_repeat } = req.body;
    const codigo = req.user.Codigo;
    const contraseñaUsuario = req.user.Contrasena_usuario;
    if (new_password === new_password_repeat) {
        const rows = await pool.query(`SELECT * FROM usuario where Codigo =${codigo}`);
        if (rows.length > 0) {
            const data = rows[0];
            const validPassword = await helpers.mathPassword(current_password, contraseñaUsuario);
            if (validPassword) {
                const encryp = await helpers.encryptPassword(new_password);
                const data = await pool.query(`UPDATE usuario SET Contrasena_usuario='${encryp}' WHERE Codigo="${codigo}"`);
                req.flash('success', 'la contraseña ha sido actualizada');
                res.redirect('/user/setting');
            } else {
                req.flash('message', 'la contraseña digitada no es valida por favor ingrese de nuevo los datos');
                res.redirect('/user/setting');
            }
        }
    } else {
        req.flash('message', 'los valores en torno a la nueva contraseña no concuerdan, por favor ingrese la informacion de nuevo');
        res.redirect('/user/setting');
    }
});


module.exports = router;