const express = require('express');
const router = express.Router();
const pool = require('../db/database');

router.get('/', async(req, res) => {
    const id_user = req.user.Codigo;
    console.log(id_user);
    const cursos = await pool.query(`select Materia_idMateria,Nombre_materia,Grupo_materia from contenidocurso c join materia m where m.idMateria=c.Materia_idMateria and Usuario_Codigo=${id_user}`);
    res.render('./user/user', {
        cursos
    });
});

module.exports = router;