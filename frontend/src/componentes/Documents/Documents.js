import React, { Fragment, useState, useEffect } from 'react';
import clienteAxios from '../../api/axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './css/documets-aprendiz.css';

function Documents() {
    const [documento, setDocumento] = useState({
        tipo_documento: '',
        archivo: null
    });
    const [documentosAprendiz, setDocumentosAprendiz] = useState([]);
    const { id_aprendiz } = useParams();

    useEffect(() => {
        const fetchDocumentosAprendiz = async () => {
            try {
                const response = await clienteAxios.get(`/documentos-aprendiz/${id_aprendiz}`);
                setDocumentosAprendiz(response.data.documentos);
            } catch (error) {
                console.error('Error al obtener los documentos del aprendiz:', error);
            }
        };

        fetchDocumentosAprendiz();
    }, [id_aprendiz]);

    const handleDocumentoChange = (e) => {
        setDocumento({
            ...documento,
            [e.target.name]: e.target.value
        });
    };

    const handleArchivoChange = (e) => {
        setDocumento({
            ...documento,
            archivo: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('tipo_documento', documento.tipo_documento);
        formData.append('archivo', documento.archivo);

        try {
            await clienteAxios.post(`/documentos-upload/${id_aprendiz}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Mostrar alerta de éxito
            Swal.fire({
                icon: 'success',
                title: 'Documento cargado exitosamente',
                showConfirmButton: true
            });

            // Actualizar la lista de documentos del aprendiz después de cargar uno nuevo
            const response = await clienteAxios.get(`/documentos-aprendiz/${id_aprendiz}`);
            setDocumentosAprendiz(response.data.documentos);
        } catch (error) {
            console.error('Error al cargar el documento:', error);
            // Mostrar alerta de error si falla la carga del documento
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar el documento',
                text: 'Hubo un error al cargar el documento. Por favor, inténtalo de nuevo más tarde.',
                showConfirmButton: true
            });
        }
    };

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

    return (
        <Fragment>
            <div className='docs-content'>
                <h1 className='text-center upTitle'>Carga de documentos</h1>
                <div className="form-docs">
                    <form onSubmit={handleSubmit}>
                        <p className='tipoDocumento'>Tipo de documento:
                            <select name="tipo_documento" onChange={handleDocumentoChange} required className=''>
                                <option value="">Selecciona un tipo de documento</option>
                                <option value="Documento de Identidad">Documento de Identidad</option>
                                <option value="Carnet Destruido">Carnet Destruido</option>
                                <option value="Certificado Pruebas TYT">Certificado Pruebas TYT</option>
                                <option value="Formulario de Diligenciamiento">Formulario de Diligenciamiento</option>
                            </select>
                        </p>
                        <p>Selecciona un archivo: <input type='file' name="archivo" onChange={handleArchivoChange} required /></p>
                        <button type='submit'>Cargar Documento</button>
                    </form>
                </div>
                <div className="table-container">
                    <h2>Documentos del Aprendiz</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID Documento</th>
                                <th>Tipo de Documento</th>
                                <th>Archivo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentosAprendiz.map((doc) => (
                                <tr key={doc.id_documento}>
                                    <td>{doc.id_documento}</td>
                                    <td>{doc.tipo_documento}</td>
                                    <td>{doc.archivo}</td>
                                    <td>
                                        <button onClick={() => handleDownload(doc.archivo)}
                                        className='btnDownload'>Descargar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );
}

export default Documents;
