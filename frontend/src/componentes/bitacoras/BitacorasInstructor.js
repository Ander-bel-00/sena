import React, { useEffect, useState } from 'react';
import clienteAxios from '../../api/axios';
import './css/BitacorasInstructor.css';
import Modal from 'react-modal';

function BitacorasInstructor() {
    const [bitacoras, setBitacoras] = useState([]);
    const [numeroFicha, setNumeroFicha] = useState('');
    const [nombreAprendiz, setNombreAprendiz] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [bitacoraSeleccionada, setBitacoraSeleccionada] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchBitacoras = async () => {
            try {
                const response = await clienteAxios.get(`/bitacoras-aprendiz-getAll`);
                setBitacoras(response.data.bitacoras);
            } catch (error) {
                console.error('Error al obtener las bitácoras:', error);
            }
        };

        fetchBitacoras();
    }, []);

    const enviarObservacion = async () => {
        try {
            await clienteAxios.post(`/enviar-observacion/${bitacoraSeleccionada.id_bitacora}`, { observaciones });
            const response = await clienteAxios.get(`/bitacoras-aprendiz-getAll`);
            setBitacoras(response.data.bitacoras);
            // Limpiar el textarea después de enviar la observación
            setObservaciones('');
            closeModal(); // Cerrar el modal después de enviar la observación
        } catch (error) {
            console.error('Error al enviar observaciones:', error);
        }
    };
    

    const aprobarBitacora = async (idBitacora) => {
        try {
            await clienteAxios.put(`/aprobar-bitacora/${idBitacora}`);
            // Actualizar el estado local para reflejar la aprobación y vaciar las observaciones
            setBitacoras(prevBitacoras =>
                prevBitacoras.map(bitacora => {
                    if (bitacora.id_bitacora === idBitacora) {
                        return { ...bitacora, estado: true, observaciones: '' };
                    }
                    return bitacora;
                })
            );
        } catch (error) {
            console.error('Error al aprobar la bitácora:', error);
        }
    };
    

    const handleNumeroFichaChange = (event) => {
        setNumeroFicha(event.target.value);
    };

    const handleNombreAprendizChange = (event) => {
        setNombreAprendiz(event.target.value);
    };

    const handleObservacionChange = (event) => {
        setObservaciones(event.target.value);
    };

    const openModal = (bitacora) => {
        setBitacoraSeleccionada(bitacora);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const bitacorasFiltradas = bitacoras.filter(bitacora => {
        if (numeroFicha && !bitacora.numero_ficha.toString().includes(numeroFicha.toString())) {
            return false;
        }
        if (nombreAprendiz && !bitacora.nombres.toLowerCase().includes(nombreAprendiz.toLowerCase())) {
            return false;
        }
        return true;
    });

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
        <div>
            <h2 className='text-center' style={{ color: '#39a900' }}>Bitácoras de los aprendices</h2>
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
                        <th className='th'>N° bitácora</th>
                        <th className='th'>N° Documento</th>
                        <th className='th'>Nombres</th>
                        <th className='th'>Apellidos</th>
                        <th className='th'>N° Ficha</th>
                        <th className='th'>Programa de Formación</th>
                        <th className='th'>Observaciones</th>
                        <th className='th'>Estado</th>
                        <th className='th'>Acciones</th>
                    </tr>
                </thead>
                <tbody className='tbody'>
                {bitacorasFiltradas.map((bitacora) => (
                    <tr key={bitacora.id_bitacora} className='tr'>
                        <td className='td-instru'>{bitacora.numero_de_bitacora}</td>
                        <td className='td-instru'>{bitacora.numero_documento}</td>
                        <td className='td-instru'>{bitacora.nombres}</td>
                        <td className='td-instru'>{bitacora.apellidos}</td>
                        <td className='td-instru'>{bitacora.numero_ficha}</td>
                        <td className='td-instru'>{bitacora.programa_formacion}</td>
                        <td className='td-instru'>{bitacora.observaciones ? bitacora.observaciones : 'No hay observaciones'}</td>
                        <td className='td-instru'>{bitacora.estado ? 'Aprobada' : 'No aprobada'}</td>
                        <td className='td-instru'>
                            <div className="textarea-container">
                                <div className="button-container">
                                    <div>
                                        {!bitacora.estado && (
                                            <button onClick={() => openModal(bitacora)} className='btnEnviarObservacion'>Agregar Observación</button>
                                        )}
                                        {!bitacora.estado &&
                                            <button onClick={() => aprobarBitacora(bitacora.id_bitacora)} className='flex btnAprobar'> <p>Aprobar</p></button>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button onClick={() => handleDownload(bitacora.archivo)} className='btnDownloadInstru flex'>Descargar bitácora</button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Agregar Observación Modal"
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="modal-content">
                    <h2 className='text-center'>Agregar Observación</h2>
                    <textarea
                        rows='4'
                        placeholder='Escriba aquí sus observaciones'
                        value={observaciones}
                        onChange={handleObservacionChange} // Actualizar el estado de observacion
                    />
                    <button onClick={enviarObservacion} className='btnEnviar'>Enviar Observación</button>
                </div>
            </Modal>
        </div>
    );
}

export default BitacorasInstructor;
