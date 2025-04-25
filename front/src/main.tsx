import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/cartcontext';
import { UserProvider } from './context/userContext.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';


createRoot(document.getElementById('root')!).render(
<StrictMode>
  <Provider store={store}>
      <UserProvider> {/* Add this wrapper */}
      
        <CartProvider>
         <App />
        </CartProvider>
      </UserProvider>
  </Provider>
    
</StrictMode>,
)
