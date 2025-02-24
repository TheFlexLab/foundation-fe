import { Routes, Route } from 'react-router-dom';
import Maintenance from '../pages/Maintenance/maintenance';

export function MaintenanceRouter() {
  return (
    <Routes>
      <Route path="*" element={<Maintenance />} />
    </Routes>
  );
}
