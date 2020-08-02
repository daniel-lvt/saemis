const express = require('express');
const router = express.Router();
const pool = require('../db/database');

router.get('/', (req, res) => {
    res.render('root/root');
});

router.get('/city', async(req, res) => {
    const city = await pool.query('SELECT * FROM ciudad');
    res.render('./root/city', {
        city
    });
});

router.get('/user', (req, res) => {
    res.render('./root/user');
});
router.get('/program', async(req, res) => {
    const jornada = await pool.query("SELECT * FROM jornada");
    const ciudad = await pool.query("SELECT * FROM ciudad")
    const carrera = await pool.query("SELECT ca.idCarrera,ca.Nombre_carrera,ca.Descripcion_carrera,ci.nombre_Ciudad,j.tipo_jornada from carrera ca,ciudad ci,jornada j where ca.Ciudad_idCiudad=ci.idCiudad and ca.Jornada_idJornada=j.idJornada");
    res.render('./root/program', {
        jornada,
        ciudad,
        carrera
    });
});
router.get('/program/edit/:id', async(req, res) => {
    const { id } = req.params;
    const data_edit = await pool.query("SELECT ca.idCarrera,ca.Nombre_carrera,ca.Descripcion_carrera,ci.nombre_Ciudad,j.tipo_jornada from carrera ca,ciudad ci,jornada j where ca.Ciudad_idCiudad=ci.idCiudad and ca.Jornada_idJornada=j.idJornada and ca.idCarrera=?", [id]);
    res.render('./root/program_edit', {
        data_edit,
        id
    });
});

router.get('/program/delete/:id', async(req, res) => {
    const { id } = req.params;
    const d = await pool.query('SELECT * FROM carrera where idCarrera=?', [id]);
    const del = await pool.query('DELETE FROM carrera where idCarrera=?', [id])
    req.flash('success', `Se ha eliminado satisfactoriamente ${d[0].Descripcion_carrera} de la base de datos`)
    res.redirect('/root/program');
});

router.post('/program/edit/:id', async(req, res) => {
    const { id } = req.params;
    const { new_name, new_description } = req.body;
    const data = await pool.query(`UPDATE carrera SET Nombre_carrera='${new_name}',Descripcion_carrera='${new_description}' WHERE idCarrera=${id}`);
    req.flash('success', `La informacion ha sido actualizada satisfactoriamente para ${new_name}`)
    res.redirect('/root/program');
});



router.post('/program/add', async(req, res) => {
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

router.post('/city', async(req, res) => {
    const { city } = req.body;
    const newCity = {
        nombre_Ciudad: city
    }
    const result = await pool.query('INSERT INTO ciudad set?', [newCity]);
    req.flash('success', `se ha agregado ${city} satisfactoriamente`);
    res.redirect('/root/city')
});


module.exports = router;