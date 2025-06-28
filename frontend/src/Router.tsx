import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FormPage from '@/pages/Form.page';
import ApplicationsTablePage from '@/pages/ApplicationsTable.page';
import ApplicationDetailPage from '@/pages/ApplicationDetail.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FormPage />,
  },
  {
    path: '/applications',
    element: <ApplicationsTablePage />
  },
  {
    path: '/applications/:id',
    element: <ApplicationDetailPage />
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
