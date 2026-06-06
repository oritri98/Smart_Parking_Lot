import './index.css';
import AppRouter from './routes/AppRouter';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}
