// ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {



    

    const [userAuth, setUserAuth] = useState(null);

    useEffect(() => {
        const userLocal=localStorage.getItem('user');

        try {

            const user=JSON.parse(userLocal);
            if(user){
                setUserAuth(user)
            }

        } catch (error) {
            
        }
    },[])

    return (
        <AuthContext.Provider value={{ userAuth, setUserAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth= () => useContext(AuthContext);