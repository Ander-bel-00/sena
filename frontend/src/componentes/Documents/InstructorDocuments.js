import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/documents-instructores.css';
import clienteAxios from '../../api/axios';

function InstructorDocuments() {
    const [documentosAprendiz, setDocumentosAprendiz] = useState([]);
    const [numeroFicha, setNumeroFicha] = useState('');
    const [nombreAprendiz, setNombreAprendiz] = useState('');
    

    useEffect(() => {
        const fetchDocumentosAprendiz = async () => {
            try {
                const response = await clienteAxios.get(`/documentos-aprendiz-getAll`);
                setDocumentosAprendiz(response.data.documentos);
            } catch (error) {
                console.error('Error al obtener los documentos del aprendiz:', error);
            }
        };

        fetchDocumentosAprendiz();
    }, []);

    const handleDownload = async (archivo) => {
        try {
            const response = await clienteAxios.get(`/documentos-download/${archivo}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', archivo);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error al descargar el archivo:', error);
        }
    };

    // Función para manejar cambios en el campo de búsqueda de número de ficha
    const handleNumeroFichaChange = (event) => {
        setNumeroFicha(event.target.value);
    };

    // Función para manejar cambios en el campo de búsqueda de nombre de aprendiz
    const handleNombreAprendizChange = (event) => {
        setNombreAprendiz(event.target.value);
    };

    // Filtrar documentos basados en los valores de los campos de búsqueda
    const documentosFiltrados = documentosAprendiz.filter(documento => {
    // Filtrar por número de ficha si se ha proporcionado
    if (numeroFicha && !documento.numero_ficha.toString().includes(numeroFicha.toString())) {
        return false;
    }
    // Filtrar por nombre de aprendiz si se ha proporcionado
    if (nombreAprendiz && !documento.nombres.toLowerCase().includes(nombreAprendiz.toLowerCase())) {
        return false;
    }
    // Si no se proporciona ningún filtro o coincide con los filtros, mantener el documento
    return true;
    });


    return (
        <div>
            <h2 className='text-center' style={{color: '#39a900'}}>Documentos de los Aprendices</h2>
            <div>
                <p className='inline-block pr-4'>Buscar por numero de ficha: 
                  <input 
                      type='search' 
                      placeholder='Numero de ficha' 
                      value={numeroFicha} 
                      onChange={handleNumeroFichaChange}
                      className='pl-2 border-b-2'
                  />
                </p>
                <p className='inline-block'>Buscar por nombres del Aprendiz: 
                  <input 
                      type='search' 
                      placeholder='Nombres del aprendiz' 
                      value={nombreAprendiz} 
                      onChange={handleNombreAprendizChange}
                      className='pl-2 border-b-2'
                  />
                </p>
            </div>
            <table className='docsTab'>
                <thead className='Thead'>
                    <tr className='tr'>
                        <th className='th'>Tipo de Archivo</th>
                        <th className='th'>Número De Documento De Identidad</th>
                        <th className='th'>Nombres</th>
                        <th className='th'>Apellidos</th>
                        <th className='th'>Número de Ficha</th>
                        <th className='th'>Programa de Formación</th>
                        <th className='th'>Archivo</th>
                        <th className='th'>Acciones</th>
                    </tr>
                </thead>
                <tbody className='tbody'>
                    {documentosFiltrados.map((documento) => (
                        <tr key={documento.id_documento} className='tr'>
                            <td className='td'>{documento.tipo_documento}</td>
                            <td className='td'>{documento.numero_documento}</td>
                            <td className='td'>{documento.nombres}</td>
                            <td className='td'>{documento.apellidos}</td>
                            <td className='td'>{documento.numero_ficha}</td>
                            <td className='td'>{documento.programa_formacion}</td>
                            <td className='td'>{documento.archivo}</td>
                            <td className='td'>
                                <button onClick={() => handleDownload(documento.archivo)} className='btnDownloadInstruc'>Descargar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InstructorDocuments;
