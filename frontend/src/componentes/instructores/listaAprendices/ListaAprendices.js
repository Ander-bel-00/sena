import React, { Fragment, useEffect, useState } from 'react';
import clienteAxios from '../../../api/axios';
import { useParams } from 'react-router-dom';

function ListaAprendices() {
    const [aprendices, setAprendices] = useState([]);
    const { numero_ficha } = useParams();
    
    const consultarApi = async () => {
        try {
            const consultarAprendices = await clienteAxios.get(`/fichas-getAprendices/${numero_ficha}`);
            setAprendices(consultarAprendices.data.aprendices); // Actualiza el estado con el array de aprendices
        } catch (error) {
            console.error('Error al obtener los aprendices:', error);
        }
    };

    useEffect(() => {
        consultarApi();
    }, [numero_ficha]);
    
    return (
        <Fragment>
            <div>
                <h1 className='text-center'>Aprendices de la Ficha {numero_ficha}</h1>
                <ul className='lista-aprendices'>
                    {Array.isArray(aprendices) && aprendices.length > 0 ? (
                        aprendices.map(aprendiz => (
                            <li key={aprendiz.id_aprendiz} className='aprendices-fichas '>
                                {aprendiz.nombres} {aprendiz.apellidos}
                            </li>
                        ))
                    ) : (
                        <li>No hay aprendices asociados a esta ficha</li>
                    )}
                </ul>
            </div>
        </Fragment>
    )
}

export default ListaAprendices;
