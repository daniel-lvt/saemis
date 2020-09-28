const express = require('express');
const router = express.Router();
const pool = require('../db/database');

router.get('/', async(req, res) => {
    const id_user = req.user.Codigo;
    const cursos = await pool.query(`select Materia_idMateria,Nombre_materia,Grupo_materia from contenidocurso c join materia m where m.idMateria=c.Materia_idMateria and Usuario_Codigo=${id_user}`);
    res.render('./user/user', {
        cursos,
    });
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
        const foro = await pool.query(`select * from foro`);
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

module.exports = router;