import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import GastosList from './screens/GastosList';
import GastoForm from './screens/GastoForm';
import Balance from './screens/Balance';
import Deudas from './screens/Deudas';
import Configuracion from './screens/Configuracion';
import { ROUTES } from './constants';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Dashboard con layout propio */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Otras rutas con Layout */}
            <Route path="/" element={<Layout />}>
              <Route path="gastos" element={<GastosList />} />
              <Route path="gastos/nuevo" element={<GastoForm />} />
              <Route path="gastos/editar/:id" element={<GastoForm />} />
              <Route path="balance" element={<Balance />} />
              <Route path="deudas" element={<Deudas />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;