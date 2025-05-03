import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        // En una aplicación real, esto sería: const response = await fetch('https://tu-api/api/facturas');
        // const data = await response.json();
        
        // Datos de ejemplo para el prototipo
        const mockData = [
          {
            facturaID: 1,
            numeroFactura: 'F-2025-001',
            fechaFactura: '2025-04-15',
            cliente: 'Comercial Andina',
            montoTotal: 1500000,
            estado: 'Pagada'
          },
          {
            facturaID: 2,
            numeroFactura: 'F-2025-002',
            fechaFactura: '2025-04-22',
            cliente: 'Distribuidora del Valle',
            montoTotal: 2350000,
            estado: 'Pendiente'
          },
          {
            facturaID: 3,
            numeroFactura: 'F-2025-003',
            fechaFactura: '2025-04-25',
            cliente: 'Tecnología Express',
            montoTotal: 3800000,
            estado: 'Pendiente'
          },
          {
            facturaID: 4,
            numeroFactura: 'F-2025-004',
            fechaFactura: '2025-04-28',
            cliente: 'Soluciones Empresariales',
            montoTotal: 950000,
            estado: 'Pagada'
          },
          {
            facturaID: 5,
            numeroFactura: 'F-2025-005',
            fechaFactura: '2025-04-30',
            cliente: 'Grupo Tecnológico',
            montoTotal: 1750000,
            estado: 'Pendiente'
          }
        ];
        
        setFacturas(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar facturas:', error);
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta factura?')) {
      try {
        // En una aplicación real, esto sería: await fetch(`https://tu-api/api/facturas/${id}`, { method: 'DELETE' });
        setFacturas(facturas.filter(factura => factura.facturaID !== id));
      } catch (error) {
        console.error('Error al eliminar factura:', error);
      }
    }
  };

  const handleStatusChange = async (id, nuevoEstado) => {
    try {
      // En una aplicación real, esto sería una llamada a la API
      setFacturas(facturas.map(factura => 
        factura.facturaID === id 
          ? { ...factura, estado: nuevoEstado }
          : factura
      ));
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const filteredFacturas = facturas.filter(factura => {
    const matchesSearch = 
      factura.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || factura.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Pagada':
        return <span className="badge bg-success">Pagada</span>;
      case 'Pendiente':
        return <span className="badge bg-warning">Pendiente</span>;
      default:
        return <span className="badge bg-secondary">{estado}</span>;
    }
  };

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
        <h1>Gestión de Facturas</h1>
        <Link to="/facturas/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Nueva Factura
        </Link>
      </div>
      
      <div className="row mb-3">
        <div className="col-md-8">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar por número de factura o cliente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Pagada">Pagada</option>
          </select>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>No. Factura</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacturas.length > 0 ? (
              filteredFacturas.map(factura => (
                <tr key={factura.facturaID}>
                  <td>{factura.numeroFactura}</td>
                  <td>{new Date(factura.fechaFactura).toLocaleDateString('es-CO')}</td>
                  <td>{factura.cliente}</td>
                  <td>${factura.montoTotal.toLocaleString('es-CO')}</td>
                  <td>{getStatusBadge(factura.estado)}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/facturas/view/${factura.facturaID}`} className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-eye"></i>
                      </Link>
                      {factura.estado === 'Pendiente' && (
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleStatusChange(factura.facturaID, 'Pagada')}
                        >
                          <i className="bi bi-check-circle"></i>
                        </button>
                      )}
                      <Link to={`/facturas/edit/${factura.facturaID}`} className="btn btn-sm btn-info">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => window.print()}
                      >
                        <i className="bi bi-printer"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(factura.facturaID)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay facturas que coincidan con la búsqueda</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resumen de Facturas</h5>
              <p className="card-text">Total de facturas: {facturas.length}</p>
              <p className="card-text">Facturas pendientes: {facturas.filter(f => f.estado === 'Pendiente').length}</p>
              <p className="card-text">
                Monto total pendiente: ${facturas
                  .filter(f => f.estado === 'Pendiente')
                  .reduce((sum, f) => sum + f.montoTotal, 0)
                  .toLocaleString('es-CO')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facturas;