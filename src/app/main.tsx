import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import {Provider} from "@/shared/lib/theme/provider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <Provider defaultTheme="dark" storageKey="ui-theme">
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Toaster
                    position="top-center"
                />
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </Provider>
)
