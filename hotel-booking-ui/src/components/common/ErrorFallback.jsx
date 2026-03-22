import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-red-100 max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. An unexpected error has occurred in the application.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-8text-left overflow-auto border border-gray-200">
          <p className="text-sm font-mono text-red-600 mb-0 break-words text-left">
            {error.message}
          </p>
        </div>

        <button
          onClick={resetErrorBoundary}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
