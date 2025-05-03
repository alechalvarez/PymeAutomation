import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProductos: 0,
    totalFacturas: 0,
    facturasPendientes: 0,
    productosStockBajo: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En una aplicación real, esto se conectaría a la API
    // Por ahora, usamos datos de ejemplo
    setTimeout(() => {
      setStats({
        totalClientes: 15,
        totalProductos: 48,
        totalFacturas: 127,
        facturasPendientes: 12,
        productosStockBajo: 8
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>;
  }

  return (
    <div className="dashboard">
      <h1 className="mb-4">Panel de Control</h1>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Clientes</div>
            <div className="card-body">
              <h5 className="card-title">{stats.totalClientes}</h5>
              <p className="card-text">Total de clientes registrados</p>
              <Link to="/clientes" className="btn btn-light btn-sm">Gestionar</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Productos</div>
            <div className="card-body">
              <h5 className="card-title">{stats.totalProductos}</h5>
              <p className="card-text">Total de productos en inventario</p>
              <Link to="/productos" className="btn btn-light btn-sm">Gestionar</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card text-white bg-info mb-3">
            <div className="card-header">Facturas</div>
            <div className="card-body">
              <h5 className="card-title">{stats.totalFacturas}</h5>
              <p className="card-text">Total de facturas emitidas</p>
              <Link to="/facturas" className="btn btn-light btn-sm">Gestionar</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card border-warning mb-3">
            <div className="card-header text-warning">Alertas</div>
            <div className="card-body">
              <p className="card-text">
                <i className="bi bi-exclamation-triangle"></i> {stats.facturasPendientes} facturas pendientes de pago
              </p>
              <p className="card-text">
                <i className="bi bi-exclamation-triangle"></i> {stats.productosStockBajo} productos con stock bajo
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card border-primary mb-3">
            <div className="card-header text-primary">Acciones Rápidas</div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/clientes/add" className="btn btn-outline-primary btn-sm">Nuevo Cliente</Link>
                <Link to="/productos/add" className="btn btn-outline-primary btn-sm">Nuevo Producto</Link>
                <Link to="/facturas/add" className="btn btn-outline-primary btn-sm">Nueva Factura</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;