import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import Navbar from './components/layout/Navbar';
import Dashboard from './components/Dashboard';
import Clientes from './components/clientes/Clientes';
import ClienteForm from './components/clientes/ClienteForm';
import Productos from './components/productos/Productos';
import ProductoForm from './components/productos/ProductoForm';
import Facturas from './components/facturas/Facturas';
import FacturaForm from './components/facturas/FacturaForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/add" element={<ClienteForm />} />
            <Route path="/clientes/edit/:id" element={<ClienteForm />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/add" element={<ProductoForm />} />
            <Route path="/productos/edit/:id" element={<ProductoForm />} />
            <Route path="/facturas" element={<Facturas />} />
            <Route path="/facturas/add" element={<FacturaForm />} />
            <Route path="/facturas/edit/:id" element={<FacturaForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;