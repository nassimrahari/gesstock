import React from 'react';
import  CategoryList  from './CategoryList';
import CategoryCreateComponent  from './CategoryCreateComponent';
import  CategoryUpdateComponent  from './CategoryUpdateComponent';
import { PopupProvider,usePopup } from './CategoryPopupContext'; // Importer le contexte

import { Button } from '../ui/button';


const CategoryComponent = () => {

    const {setOpenCreate} = usePopup()

    return (
    
      <div className="p-5 bg-white dark:bg-gray-800">
             <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4 dark:text-white"> Categorys</h1>
                <Button onClick={() => setOpenCreate(true)} >Add  Category</Button>
             </div>
            <CategoryList />
            <CategoryCreateComponent />
            <CategoryUpdateComponent />
        </div>
    
    );
};


const  CategoryPage = () => {

    return (
     <div className="w-full p-4 dark:bg-gray-900">
    <PopupProvider>
        <CategoryComponent />
    </PopupProvider>   
    </div>
    ) 
};

export default CategoryPage;
