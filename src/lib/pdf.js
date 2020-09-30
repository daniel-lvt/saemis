const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const pool = require('../db/database');
const datauri = require('datauri');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

//mirar como integrar imagenes en el pdf

const createPDF = async(id_carrera, id_busqueda, valor_reporte) => {
    const content = await datauri('src/public/img/logo-SAEMIS.png');
    const carrera = await pool.query(`select * from carrera where idCarrera=${id_carrera}`);
    const today = new Date();
    const f = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    const h = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const outDate = f + '  ' + h;
    if (id_busqueda === 1 || id_busqueda === 2 || id_busqueda === 3) {
        const data = await pool.query(`SELECT u.Codigo, u.Nombre_usuario,u.Correo_usuario,u.NombreUsuario_usuario,c.Nombre_carrera,t.Nombre_tipo from usuario u,carrera c,tipo t where u.Carrera_IdCarrera=c.idCarrera and u.Tipo_idTipo=t.idTipo and c.idCarrera =${id_carrera} and u.Tipo_idTipo=${id_busqueda};`);
        const infotable = table(data);
        const structDocument = {
            content: [
                { text: `Reporte ${valor_reporte}`, style: 'header' },
                { text: `Listado de ${valor_reporte} del programa ${carrera[0].Descripcion_carrera}`, sontSize: 12, bold: true, margin: [0, 20, 0, 8] },
                {
                    table: {
                        headerRows: 1,
                        body: infotable
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            footer: {
                columns: [
                    { text: 'La informacion suministrada en el presente documento esta ligada al contenido almacenado en el  Sistema de Apoyo de Monitorias, SAEMIS', style: 'small' },
                    { text: `Reporte generado ${outDate} \nSAEMIS`, style: 'small' }
                ]
            },
            styles: st
        }
        return structDocument;
    } else if (id_busqueda === 4) {
        //falta trabajo de contruccion de esta seccion
        //# Nombre_materia Grupo_materia Carrera_id docente numero de alumnos monitor
        const data = await pool.query(`select * from materia where Carrera_idCarrera=${id_carrera}`);
        const infotable = tableM(data);
        const structDocument = {
            content: [
                { text: `Reporte ${valor_reporte}`, style: 'header' },
                { text: `El siguiente listado es generado desde la escuela de ${carrera[0].Descripcion_carrera}`, sontSize: 12, bold: true, margin: [0, 20, 0, 8] },
                {
                    table: {
                        headerRows: 1,
                        body: infotable
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            footer: {
                columns: [
                    { text: 'La informacion suministrada en el presente documento esta ligada al contenido que se encuentra almacenado en el  Sistema de Apoyo de Monitorias, SAEMIS', style: 'small' },
                    { text: `Informacion generada`, style: 'small' }
                ]
            },
            styles: st
        }
        return structDocument;
    } else if (id_busqueda === 5) {
        const data = await pool.query(`select Materia_idMateria,Nombre_materia,Grupo_materia from contenidocurso c join materia m where m.idMateria=c.Materia_idMateria and Usuario_Codigo=${id_carrera}`);
        const infotable = tableReport(data);
        const structDocument = {
            content: [
                { text: `Reporte ${valor_reporte}`, style: 'header' },
                { text: `Informe de Cursos del usuario con codigo ${id_carrera}`, sontSize: 12, bold: true, margin: [0, 20, 0, 8] },
                {
                    table: {
                        headerRows: 1,
                        body: infotable
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            footer: {
                columns: [
                    { text: 'La informacion suministrada en el presente documento esta ligada al contenido que se encuentra almacenado en el  Sistema de Apoyo de Monitorias, SAEMIS', style: 'small' },
                    { text: `Informacion generada`, style: 'small' }
                ]
            },
            styles: st
        };
        return structDocument;

    }
}

const tableReport = (input) => {
    const info = []
    info.push([{ text: '#', style: 'tableHeader' }, { text: '#', style: 'nombre grupo' }, { text: '#', style: 'grupo' }]);
    let idx = 1;
    for (i of input) {
        const { Nombre_materia, Grupo_materia } = i;
        info.push([idx, Nombre_materia, Grupo_materia]);
        idx += 1;
    }
    return info;
}



const table = (input) => {
    const info = [];
    info.push([{ text: '#', style: 'tableHeader' }, { text: 'Codigo', style: 'tableHeader' }, { text: 'Nombre', style: 'tableHeader' }, { text: 'Correo', style: 'tableHeader' }, { text: 'Carrera', style: 'tableHeader' }, { text: 'Tipo', style: 'tableHeader' }]);
    let idx = 1;
    for (i of input) {
        const { Codigo, Nombre_usuario, Correo_usuario, Nombre_carrera, Nombre_tipo } = i;
        info.push([idx, Codigo, Nombre_usuario, Correo_usuario, Nombre_carrera, Nombre_tipo]);
        idx += 1;
    }
    return info;
}
const tableM = (input) => {
    const info = [];
    // Nombre_materia Grupo_materia docente numero de alumnos monitor
    info.push([{ text: '', style: 'tableHeader' }, { text: 'nombre', style: 'tableHeader' }, { text: 'grupo', style: 'tableHeader' }, { text: 'docente', style: 'tableHeader' }, { text: 'monitor', style: 'tableHeader' }, { text: '# alumnos', style: 'tableHeader' }]);
    let idx = 1;
    for (i of input) {

        idx += 1;
    }
    return info;
}
const st = {
    header: {
        fontSize: 18,
        bold: true
    },
    subheader: {
        fontSize: 15,
        bold: true
    },
    quote: {
        italics: true
    },
    small: {
        italics: true,
        fontSize: 8,
        margin: [20, 0]
    }
}

module.exports = {
    createPDF
}