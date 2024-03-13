import React, { Fragment, useEffect, useState } from 'react';
import clienteAxios from '../../api/axios';
import { useParams } from 'react-router-dom';
import './css/BitacorasAprendices.css';
import Swal from 'sweetalert2';

function Bitacoras() {
    const [documento, setDocumento] = useState({
        numero_de_bitacora: '',
        archivo: null
    });
    const [documentosAprendiz, setDocumentosAprendiz] = useState([]);
    const { id_aprendiz } = useParams();

    useEffect(() => {
        const fetchDocumentosAprendiz = async () => {
            try {
                const response = await clienteAxios.get(`/bitacoras-aprendiz/${id_aprendiz}`);
                // Ordenar las bitácoras por el número de bitácora antes de establecer el estado
                const sortedBitacoras = response.data.bitacoras.sort((a, b) => a.numero_de_bitacora - b.numero_de_bitacora);
                setDocumentosAprendiz(sortedBitacoras);
            } catch (error) {
                console.error('Error al obtener las bitácoras del aprendiz:', error);
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
        formData.append('numero_de_bitacora', documento.numero_de_bitacora);
        formData.append('archivo', documento.archivo);
    
        try {
            await clienteAxios.post(`/bitacoras-upload/${id_aprendiz}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Mostrar alerta de éxito
            Swal.fire({
                icon: 'success',
                title: 'Bitácora cargada exitosamente',
                showConfirmButton: true
            });
    
            // Actualizar la lista de documentos del aprendiz después de cargar uno nuevo
            const response = await clienteAxios.get(`/bitacoras-aprendiz/${id_aprendiz}`);
            // Ordenar las bitácoras por el número de bitácora antes de establecer el estado
            const sortedBitacoras = response.data.bitacoras.sort((a, b) => a.numero_de_bitacora - b.numero_de_bitacora);
            setDocumentosAprendiz(sortedBitacoras);
        } catch (error) {
            console.error('Error al cargar la bitácora:', error);
            // Mostrar alerta de error si falla la carga del documento
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar la bitácora',
                text: error.response.data.mensaje, // Accede al mensaje de error desde la respuesta HTTP
                showConfirmButton: true
            });
        }
    };
    
    

    const handleDownload = async (archivo) => {
        try {
            const response = await clienteAxios.get(`/bitacoras-download/${archivo}`, {
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
                <h1 className='text-center upTitle'>Carga de bitácoras</h1>
                <div className="form-docs">
                    <form onSubmit={handleSubmit}>
                        <p className='tipoDocumento'>Número de bitácora:
                            <select name="numero_de_bitacora" onChange={handleDocumentoChange} required className=''>
                                <option value="">Selecciona un número de bitácora</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                        </p>
                        <p>Selecciona un archivo: <input type='file' name="archivo" onChange={handleArchivoChange} required /></p>
                        <button type='submit'>Cargar Bitácora</button>
                    </form>
                </div>
                <div>
                    <h2>Bitácoras del Aprendiz</h2>
                    <table className="docsAprendicesTab">
                    <thead className='Thead2'>
                        <tr className='trr'>
                            <th className='thh'>ID Bitácora</th>
                            <th className='thh'>Número de bitácora</th>
                            <th className='thh'>Observaciones</th>
                            <th className='thh'>Estado</th>
                            <th className='thh'>Archivo</th>
                            <th className='thh'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='tbody2'>
                        {documentosAprendiz && documentosAprendiz.map((doc) => (
                            <tr key={doc.id_bitacora} className='trr'>
                                <td className='td-aprendiz'>{doc.id_bitacora}</td>
                                <td className='td-aprendiz'>{doc.numero_de_bitacora}</td>
                                <td className='td-aprendiz'>{doc.observaciones ? doc.observaciones : 'No hay observaciones'}</td>
                                <td className='td-aprendiz'>{doc.estado ? 'Aprobada' : 'No aprobada'}</td>
                                <td className='td-aprendiz'>{doc.archivo}</td>
                                <td className='td-aprendiz'>
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

export default Bitacoras;
