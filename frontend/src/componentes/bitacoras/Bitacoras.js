import React, { Fragment, useEffect, useState } from 'react';
import clienteAxios from '../../api/axios';
import { useParams } from 'react-router-dom';
import './css/BitacorasAprendices.css';
import Swal from 'sweetalert2';
import Modal from 'react-modal';

function Bitacoras() {
    const [documento, setDocumento] = useState({
        numero_de_bitacora: '',
        archivo: null
    });
    const [documentosAprendiz, setDocumentosAprendiz] = useState([]);
    const { id_aprendiz } = useParams();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [bitacoraToUpdate, setBitacoraToUpdate] = useState(null);

    useEffect(() => {
        const fetchDocumentosAprendiz = async () => {
            try {
                const response = await clienteAxios.get(`/bitacoras-aprendiz/${id_aprendiz}`);
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
    
            Swal.fire({
                icon: 'success',
                title: 'Bitácora cargada exitosamente',
                showConfirmButton: true
            });
    
            const response = await clienteAxios.get(`/bitacoras-aprendiz/${id_aprendiz}`);
            const sortedBitacoras = response.data.bitacoras.sort((a, b) => a.numero_de_bitacora - b.numero_de_bitacora);
            setDocumentosAprendiz(sortedBitacoras);
        } catch (error) {
            console.error('Error al cargar la bitácora:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar la bitácora',
                text: error.response.data.mensaje,
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

    const handleActualizar = async (bitacora) => {
        setModalIsOpen(true);
        setBitacoraToUpdate(bitacora);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    const handleFileSelected = async (e) => {
        handleCloseModal();

        const nuevoArchivo = e.target.files[0];
        if (nuevoArchivo && bitacoraToUpdate) {
            try {
                const formData = new FormData();
                formData.append('archivo', nuevoArchivo);
    
                await clienteAxios.put(`/bitacoras-update/${bitacoraToUpdate.id_bitacora}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                const response = await clienteAxios.get(`/bitacoras-aprendiz/${id_aprendiz}`);
                const sortedBitacoras = response.data.bitacoras.sort((a, b) => a.numero_de_bitacora - b.numero_de_bitacora);
                setDocumentosAprendiz(sortedBitacoras);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Bitácora actualizada exitosamente',
                    showConfirmButton: true
                });
            } catch (error) {
                console.error('Error al actualizar la bitácora:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar la bitácora',
                    text: error.response.data.mensaje,
                    showConfirmButton: true
                });
            }
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
                                {[...Array(12).keys()].map(num => (
                                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                                ))}
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
                            <th className='thh'>Número de bitácora</th>
                            <th className='thh'>Observaciones</th>
                            <th className='thh'>Estado</th>
                            <th className='thh'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='tbody2'>
                        {documentosAprendiz && documentosAprendiz.map((doc) => (
                            <tr key={doc.id_bitacora} className='trr'>
                                <td className='td-aprendiz'>{doc.numero_de_bitacora}</td>
                                <td className='td-aprendiz'>{doc.observaciones ? doc.observaciones : 'No hay observaciones'}</td>
                                <td className='td-aprendiz'>{doc.estado ? 'Aprobada' : 'No aprobada'}</td>
                                <td className='td-aprendiz'>
                                    <div className='btn-content'>
                                        <button onClick={() => handleDownload(doc.archivo)} className='btnDownload'>Descargar</button>
                                        {doc.observaciones && (
                                            <button onClick={() => handleActualizar(doc)} 
                                            className='btnActualizar'>Actualizar Bitácora</button>
                                        )}
                                    </div>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal}>
                <h2>Selecciona un nuevo archivo</h2>
                <input type='file' name='nuevoArchivo' onChange={handleFileSelected} required />
                <button onClick={handleCloseModal}>Cancelar</button>
            </Modal>
        </Fragment>
    );
}

export default Bitacoras;