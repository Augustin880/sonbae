import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/ui/layouts/AppLayout';
import { BasicsPage } from '@/ui/pages/BasicsPages';
import { DashboardPage } from '@/ui/pages/DashboardPage';
import { DepartmentPage } from '@/ui/pages/DepartmentPage';
import { DepartmentsPage } from '@/ui/pages/DepartmentsPage';
import { DocumentsPage } from '@/ui/pages/DocumentsPage';
import { IntranetSectionPage } from '@/ui/pages/IntranetSectionPage';
import { JobRolePage } from '@/ui/pages/JobRolePage';
import { NotFoundPage } from '@/ui/pages/NotFoundPage';
import { ProcessesPage } from '@/ui/pages/ProcessesPage';
import { StructurePage } from '@/ui/pages/StructurePage';

const sectionRoutes = [
  { path: 'understand/presentation', category: 'Comprendre le club' },
  { path: 'understand/roles-deployment', category: 'Comprendre le club' },
  { path: 'understand/charters-labels', category: 'Comprendre le club' },
  { path: 'understand/governance-responsibilities', category: 'Comprendre le club' },
  { path: 'understand/institutional-legal-docs', category: 'Comprendre le club' },
  { path: 'understand/optional-annex', category: 'Comprendre le club' },
  { path: 'functional-relays', category: 'Opérations' },
  { path: 'news', category: 'Espace' },
  { path: 'calendar', category: 'Espace' },
  { path: 'contacts-support', category: 'Support' },
];

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="understand/structure" element={<StructurePage />} />
        <Route path="processes-evolutions" element={<ProcessesPage />} />
        <Route
          path="basics/operations-systems"
          element={<BasicsPage kind="operations" path="/basics/operations-systems" />}
        />
        <Route
          path="basics/numbers-kpis"
          element={<BasicsPage kind="kpis" path="/basics/numbers-kpis" />}
        />
        <Route
          path="basics/calculator"
          element={<BasicsPage kind="calculator" path="/basics/calculator" />}
        />
        {sectionRoutes.map((route) => (
          <Route
            element={<IntranetSectionPage category={route.category} path={`/${route.path}`} />}
            key={route.path}
            path={route.path}
          />
        ))}
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="departments/:departmentId" element={<DepartmentPage />} />
        <Route path="roles/:roleId" element={<JobRolePage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
