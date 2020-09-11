const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const pool = require('../db/database');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const createPDF = async(id_carrera, id_busqueda) => {
    const carrera = await pool.query(`select * from carrera where idCarrera=${id_carrera}`);
    if (id_busqueda === 1 || id_busqueda === 2 || id_busqueda === 3) {
        const data = await pool.query(`SELECT * FROM usuario WHERE Carrera_idCarrera = ${id_carrera} AND Tipo_idTipo=${id_busqueda}`);
        const infotable = table(data);
        const structDocument = {
            content: [
                { text: `Listado ${carrera[0].Descripcion_carrera}`, sontSize: 14, bold: true, margin: [0, 20, 0, 8] },
                {
                    table: {
                        headerRows: 1,
                        body: infotable
                    },
                    layout: 'lightHorizontalLines'
                }
            ]
        }
        return structDocument;
    } else if (id_busqueda === 4) {
        const data = await pool.query(`select * from materia where Carrera_idCarrera=${id_carrera}`);

    }
}

const table = (input) => {
    const info = []
    info.push([{ text: 'Codigo', style: 'tableHeader' }, { text: 'Correo', style: 'tableHeader' }, { text: 'Carrera', style: 'tableHeader' }, { text: 'Tipo', style: 'tableHeader' }]);
    for (i of input) {
        const { Codigo, Correo_usuario, Carrera_idCarrera, Tipo_idTipo } = i
        info.push([Codigo, Correo_usuario, Carrera_idCarrera, Tipo_idTipo]);
    }
    return info;
}




module.exports = {
    createPDF
}