const pdf = require('html-pdf');
const pool = require('../db/database');

const config = {

    "directory": "./files/downloads",

    "height": "10.5in",
    "width": "8in",

    "border": {
        "top": "2in",
        "right": "1in",
        "bottom": "2in",
        "left": "1.5in"
    },

    paginationOffset: 1, // Override the initial pagination number
    "header": {
        "height": "1in",
        "contents": '<div style="text-align: center;">Informe SAEMIS</div>'
    },
    "footer": {
        "height": "28mm",
        "contents": {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    },

}

const dataInfo = async(id_carrera, id_busqueda) => {

    if (id_busqueda === 1 || id_busqueda === 2 || id_busqueda === 3) {
        const data = await pool.query(`SELECT * FROM usuario WHERE Carrera_idCarrera = ${id_carrera} AND Tipo_idTipo=${id_busqueda}`);
        let pico = `
        <table >
            <thead >
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Codigo</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Carrera</th>
                    <th scope="col">Tipo de Usuario</th>
                </tr>
            </thead>
            <tbody>
                <tr>
        `;
        const base = `
                </tr>
            </tbody>
        </table>
        `;

        for (x of data) {
            pico += `<td>${x.Nombre_usuario}</td>`;
            pico += `<td>${x.Codigo}</td>`;
            pico += `<td>${x.Correo_usuario}</td>`;
            pico += `<td>${x.Carrera_idCarrera}</td>`;
            pico += `<td>${x.Tipo_idTipo}</td>`;
            pico += `<br>`;
        }
        pico += base;
        var options = { format: 'Letter' };
        pdf.create(pico, config).toFile('./files/downloads/reporte.pdf', (err, res) => {
            if (err) {
                console.log(err)
            } else {
                console.log(res)
            }
        });

    } else if (id_busqueda === 4) {
        const data = await pool.query('SELECT * FROM materia WHERE Carrera_idCarrera = ?', [id_carrera]);
        console.log(data)
    }
};


module.exports = {
    dataInfo
}