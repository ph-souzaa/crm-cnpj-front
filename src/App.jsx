import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import EmpresasPage from './pages/EmpresasPage';
import EmpresaDetalhePage from './pages/EmpresaDetalhePage';
import FunilPage from './pages/FunilPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="empresas" element={<EmpresasPage />} />
        <Route path="empresas/:id" element={<EmpresaDetalhePage />} />
        <Route path="funil" element={<FunilPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
