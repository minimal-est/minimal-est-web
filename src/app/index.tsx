import {AppProvider} from "@/app/providers";
import {Router} from "@/app/router";
import './index.css';
import {setupInterceptors} from "@/shared/api";
import { useAuthStore } from "@/entities/user/lib";

setupInterceptors({
    getState: () => ({ accessToken: useAuthStore.getState().accessToken }),
    setAccessToken: (token) => useAuthStore.getState().setAccessToken(token),
    signOut: () => useAuthStore.getState().signOut(),
});

const App = () => {
    return (
        <AppProvider>
            <Router />
        </AppProvider>
    )
}

export default App;