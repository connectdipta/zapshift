import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom";
import { router } from './routes/Routes.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppMotionProvider from './components/AppMotionProvider.jsx';

const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppMotionProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AppMotionProvider>
    </QueryClientProvider>
  </StrictMode>,
)
