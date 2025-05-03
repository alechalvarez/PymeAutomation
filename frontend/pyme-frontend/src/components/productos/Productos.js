import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // En una aplicación real, esto sería: const response = await fetch('https://tu-api/api/productos');
        // const data = await response.json();
        
        // Datos de ejemplo para el prototipo
        const mockData = [
          {
            productoID: 1,
            codigoProducto: 'PROD001',
            nombreProducto: 'Laptop HP',
            categoria: 'Electrónicos',
            stockActual: 15,
            stockMinimo: 5,
            precioUnitario: 750000,
            proveedor: 'TecnoImport'
          },
          {
            productoID: 2,
            codigoProducto: 'PROD002',
            nombreProducto: 'Impresora Canon',
            categoria: 'Electrónicos',
            stockActual: 8,
            stockMinimo: 10,
            precioUnitario: 450000,
            proveedor: 'TecnoImport'
          },
          {
            productoID: 3,
            codigoProducto: 'PROD003',
            nombreProducto: 'Escritorio Ejecutivo',
            categoria: 'Muebles',
            stockActual: 4,
            stockMinimo: 3,
            precioUnitario: 680000,
            proveedor: 'MuebleríaModerna'
          },
          {
            productoID: 4,
            codigoProducto: 'PROD004',
            nombreProducto: 'Silla Ergonómica',
            categoria: 'Muebles',
            stockActual: 12,
            stockMinimo: 10,
            precioUnitario: 320000,
            proveedor: 'MuebleríaModerna'
          },
          {
            productoID: 5,
            codigoProducto: 'PROD005',
            nombreProducto: 'Resma Papel',
            categoria: 'Insumos',
            stockActual: 45,
            stockMinimo: 20,
            precioUnitario: 12000,
            proveedor: 'Papelería Nacional'
          }
        ];
        
        setProductos(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        // En una aplicación real, esto sería: await fetch(`https://tu-api/api/productos/${id}`, { method: 'DELETE' });
        setProductos(productos.filter(producto => producto.productoID !== id));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const handleStockUpdate = async (id, cantidad) => {
    try {
      // En una aplicación real, esto sería una llamada a la API
      setProductos(productos.map(producto => 
        producto.productoID === id 
          ? { ...producto, stockActual: Math.max(0, producto.stockActual + cantidad) }
          : producto
      ));
    } catch (error) {
      console.error('Error al actualizar stock:', error);
    }
  };

  const filteredProductos = productos.filter(producto => 
    producto.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLowStock = (producto) => {
    return producto.stockActual < producto.stockMinimo;
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
        <h1>Gestión de Productos</h1>
        <Link to="/productos/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Nuevo Producto
        </Link>
      </div>
      
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Buscar producto..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.length > 0 ? (
              filteredProductos.map(producto => (
                <tr key={producto.productoID} className={isLowStock(producto) ? 'table-warning' : ''}>
                  <td>{producto.codigoProducto}</td>
                  <td>{producto.nombreProducto}</td>
                  <td>{producto.categoria}</td>
                  <td>
                    <span className={isLowStock(producto) ? 'text-danger fw-bold' : ''}>
                      {producto.stockActual}
                    </span>
                    {isLowStock(producto) && (
                      <span className="badge bg-danger ms-2">¡Bajo Stock!</span>
                    )}
                  </td>
                  <td>${producto.precioUnitario.toLocaleString('es-CO')}</td>
                  <td>{producto.proveedor}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleStockUpdate(producto.productoID, -1)}
                        disabled={producto.stockActual <= 0}
                      >
                        -
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleStockUpdate(producto.productoID, 1)}
                      >
                        +
                      </button>
                      <Link to={`/productos/edit/${producto.productoID}`} className="btn btn-sm btn-info">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(producto.productoID)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No hay productos que coincidan con la búsqueda</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;