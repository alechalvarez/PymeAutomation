import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        // En una aplicación real, esto sería: const response = await fetch('https://tu-api/api/clientes');
        // const data = await response.json();
        
        // Datos de ejemplo para el prototipo
        const mockData = [
          {
            clienteID: 1,
            nombreEmpresa: 'Comercial Andina',
            nombreContacto: 'Juan Pérez',
            email: 'jperez@comercialandina.com',
            telefono: '317-555-1234',
            ciudad: 'Bogotá',
            nit: '900.123.456-7'
          },
          {
            clienteID: 2,
            nombreEmpresa: 'Distribuidora del Valle',
            nombreContacto: 'María Rodríguez',
            email: 'mrodriguez@distribuidoravalle.com',
            telefono: '320-555-7890',
            ciudad: 'Cali',
            nit: '900.234.567-8'
          },
          {
            clienteID: 3,
            nombreEmpresa: 'Tecnología Express',
            nombreContacto: 'Carlos Gómez',
            email: 'cgomez@tecnologiaexpress.com',
            telefono: '315-555-4321',
            ciudad: 'Medellín',
            nit: '900.345.678-9'
          }
        ];
        
        setClientes(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        // En una aplicación real, esto sería: await fetch(`https://tu-api/api/clientes/${id}`, { method: 'DELETE' });
        setClientes(clientes.filter(cliente => cliente.clienteID !== id));
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  const filteredClientes = clientes.filter(cliente => 
    cliente.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nombreContacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Clientes</h1>
        <Link to="/clientes/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Nuevo Cliente
        </Link>
      </div>
      
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Buscar cliente..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Contacto</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Ciudad</th>
              <th>NIT</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map(cliente => (
                <tr key={cliente.clienteID}>
                  <td>{cliente.nombreEmpresa}</td>
                  <td>{cliente.nombreContacto}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.ciudad}</td>
                  <td>{cliente.nit}</td>
                  <td>
                    <Link to={`/clientes/edit/${cliente.clienteID}`} className="btn btn-sm btn-info me-2">
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(cliente.clienteID)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No hay clientes que coincidan con la búsqueda</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;