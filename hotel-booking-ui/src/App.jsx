import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import ErrorFallback from './components/common/ErrorFallback';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-right" />
    </ErrorBoundary>
  );
}

export default App;
