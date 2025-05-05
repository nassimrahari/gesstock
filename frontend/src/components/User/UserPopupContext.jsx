// PopupContext.js
import React, { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [itemEditId, setItemEditId] = useState(null);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [refreshList, setRefreshList] = useState(false); // État pour notifier le rafraîchissement

    const triggerRefresh = () => setRefreshList(prev => !prev); // Fonction pour déclencher le rafraîchissement

    return (
        <PopupContext.Provider 
        value={{
            openCreate, setOpenCreate,
            openUpdate, setOpenUpdate, 
            refreshList, triggerRefresh,
            itemEditId,setItemEditId
            
            }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => useContext(PopupContext);