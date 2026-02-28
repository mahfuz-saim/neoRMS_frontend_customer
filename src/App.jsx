/* ─────────────────────────────────────────────────────────────────
   App — root entry point.
   All providers and routing are handled inside AppRoutes so that
   context providers which depend on React Router (AuthProvider,
   CartProvider) can be nested inside <BrowserRouter>.
   ───────────────────────────────────────────────────────────────── */
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return <AppRoutes />;
}

export default App;
