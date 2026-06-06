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
      { path: 'login', element: <Login /> },
      { path: 'profile', element: <Profile /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'admin', element: <AdminPanel /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
