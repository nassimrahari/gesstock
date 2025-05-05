import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext'; // Importer le contexte
import { AuthProvider } from './contexts/AuthContext';

import SupplierPage from './components/Supplier/SupplierPage';
import CategoryPage from './components/Category/CategoryPage';
import ProductPage from './components/Product/ProductPage';
import PurchasePage from './components/Purchase/PurchasePage';
import PurchaseLinePage from './components/PurchaseLine/PurchaseLinePage';
import ClientPage from './components/Client/ClientPage';
import SalePage from './components/Sale/SalePage';
import SaleLinePage from './components/SaleLine/SaleLinePage';

import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';


import { RequestPasswordReset } from './components/Auth/RequestPasswordReset';
import { ResetPassword } from './components/Auth/ResetPassword';

import { ChangePassword } from './components/Auth/ChangePassword';
import { ProfilePage } from './components/Auth/ProfilePage';

import Header from './components/Header';
import HeaderSite from './components/HeaderSite';

import Home from './components/Home';


import { useSidebar,SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from "@/components/app-sidebar"
import ProtectedRoute from './components/ProtectedRoute';



const MainContent = () => {
    const { darkMode, setDarkMode } = useTheme()
    const location = useLocation()
    const { open } = useSidebar()
  
    const isEmptyPage = ["/login", "/register", "/password/reset", "/reset-password"].includes(location.pathname)
  
    return (
        <main className='w-full border-red-500 bg-gray-100 dark:bg-gray-900'
        style={{
            width: open ? !isEmptyPage ? "calc(100vw - 275px)":"100vw" : "100vw",
          }}
        >

   {!isEmptyPage ? (
                         <Header darkMode={darkMode} setDarkMode={setDarkMode}></Header>

            ):(
                <HeaderSite darkMode={darkMode} setDarkMode={setDarkMode}></HeaderSite>
            )}
 
   
     <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                             <Route path="/logout" element={<Logout />} />

                             <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/password/change" element={<ChangePassword />} />
                            <Route path="/password/reset" element={<RequestPasswordReset />} />
                            <Route path="/reset-password" element={<ResetPassword />} />

                            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
                            
                                 <Route path='/suppliers' element={<ProtectedRoute element={<SupplierPage/>}  />} />
     <Route path='/categorys' element={<ProtectedRoute element={<CategoryPage/>}  />} />
     <Route path='/products' element={<ProtectedRoute element={<ProductPage/>}  />} />
     <Route path='/purchases' element={<ProtectedRoute element={<PurchasePage/>}  />} />
     <Route path='/purchaselines' element={<ProtectedRoute element={<PurchaseLinePage/>}  />} />
     <Route path='/clients' element={<ProtectedRoute element={<ClientPage/>}  />} />
     <Route path='/sales' element={<ProtectedRoute element={<SalePage/>}  />} />
     <Route path='/salelines' element={<ProtectedRoute element={<SaleLinePage/>}  />} />
                        </Routes>
                    </Suspense>
  </main>
    )
  }

const AppContent = () => {
    const { darkMode, setDarkMode } = useTheme(); // Utiliser le contexte
    
    const location = useLocation(); // Obtenir l'emplacement actuel

    const isLoginPage = location.pathname === '/login';
    const isEmptyPage = ['/login', '/register', '/password/reset','/reset-password'].includes(location.pathname);

    return (
        <div className={darkMode?'dark':''}>
        <SidebarProvider>
      {!isEmptyPage && <AppSidebar />}
      <MainContent/>

           
    </SidebarProvider>
          
    </div>
    );
};

const App = () => (
    <AuthProvider>
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    </AuthProvider>
);


export default App;
