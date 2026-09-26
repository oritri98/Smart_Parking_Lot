import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import ParkingStatus from '../pages/ParkingStatus';
import Analytics from '../pages/Analytics';
import CameraMonitoring from '../pages/CameraMonitoring';
import Rules from '../pages/Rules';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import AdminLogin from '../pages/AdminLogin';
import Profile from '../pages/Profile';
import Notifications from '../pages/Notifications';
import AdminPanel from '../pages/AdminPanel';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'parking-status', element: <ParkingStatus /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'camera', element: <CameraMonitoring /> },
      { path: 'rules', element: <Rules /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },

      // Public login — Student / Faculty / Staff (Coming Soon)
      { path: 'login', element: <Login /> },

      // Hidden admin login — not linked from anywhere in the UI
      // Access by typing the URL directly: /aust-ipms-admin
      { path: 'aust-ipms-admin', element: <AdminLogin /> },

      // Admin control panel — protected, redirects to AdminLogin if not authenticated
      { path: 'admin', element: <AdminPanel /> },

      // User pages
      { path: 'profile', element: <Profile /> },
      { path: 'notifications', element: <Notifications /> },

      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
