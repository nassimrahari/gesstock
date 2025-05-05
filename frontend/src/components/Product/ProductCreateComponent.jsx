import React, { useState, useEffect, useRef } from 'react';
import { createProduct } from '../../services/productService';
import { fetchCategorys } from '../../services/categoryService';
import { usePopup } from './ProductPopupContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import SelectCommand from '../SelectCommand';
import objectToFormData from '@/lib/objectToFormData';

const ProductCreateComponent = () => {
    const [fieldName, setFieldName] = useState('');
    const [fieldPrice, setFieldPrice] = useState(null);
    const [fieldCategory, setFieldCategory] = useState('');
    const [fieldImage, setFieldImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState({});
    const [categorysList, setCategorysList] = useState([]);
    const fileInputRef = useRef(null);
    const { openCreate, setOpenCreate, triggerRefresh } = usePopup();

    useEffect(() => {
        const fetchItems = async () => {
            const result = await fetchCategorys();
            const transformed_result = result.map((item) => {
                return {
                    value: item.id,
                    label: item.repr
                };
            });
            setCategorysList(transformed_result);
        };
        fetchItems();
    }, []);

    const cleanField = () => {
        setError({});
        setFieldName('');
        setFieldPrice('');
        setFieldCategory('');
        setFieldImage(null);
        setPreviewImage(null);
    };

    useEffect(() => {
        cleanField();
    }, [openCreate]);

    // Handle paste event for images
    useEffect(() => {
        const handlePaste = (event) => {
            if (!openCreate) return;
            
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            for (let item of items) {
                if (item.type.indexOf('image') === 0) {
                    const blob = item.getAsFile();
                    const url = URL.createObjectURL(blob);
                    setFieldImage(blob);
                    setPreviewImage(url);
                    break;
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [openCreate]);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFieldImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Handle drag and drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            setFieldImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleCreate = async () => {
        setError({});
        let valid = true;

        if (!fieldName) {
            setError(prev => { return { ...prev, 'name': 'Name is required.' }; });
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['name']; return newState; });
        }

        if (!fieldPrice) {
            setError(prev => { return { ...prev, 'price': 'Price is required.' }; });
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['price']; return newState; });
        }

        if (!fieldCategory) {
            setError(prev => { return { ...prev, 'category': 'Category is required.' }; });
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['category']; return newState; });
        }

        if (!valid) return; 

        const data = { name: fieldName, price: fieldPrice, category: fieldCategory, image: fieldImage };
        const formData = objectToFormData(data);
        
        try {
            await createProduct(formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setOpenCreate(false);
            triggerRefresh();
        } catch (error) {
            if (error.response?.status === 400 && error.response.data?.messages) {
                setError(error.response.data.messages);
            }
        }
    };

    return (
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogContent className="sm:max-w-[420px]" style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}>
                <DialogHeader>
                    <DialogTitle>Create Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {error?.all && (
                        <>
                            {error?.all.map((item_error, index) => (
                                <p key={index} className="text-red-600">{item_error}</p>
                            ))}
                        </>
                    )}  

                    <div className="items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            value={fieldName}
                            onChange={e => setFieldName(e.target.value)} 
                            className="col-span-3"
                        />                
                        {error['name'] && <p className="text-red-600">{error['name']}</p>}  
                    </div>

                    <div className="items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price</Label>
                        <Input
                            type="number"
                            step="0.1"
                            id="price"
                            value={fieldPrice}
                            onChange={e => setFieldPrice(Number(e.target.value))} 
                            className="col-span-3"
                        />                
                        {error['price'] && <p className="text-red-600">{error['price']}</p>}  
                    </div>

                    <div className="items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <SelectCommand
                            options={categorysList}
                            value={fieldCategory}
                            onChange={setFieldCategory} 
                        />
                        {error['category'] && <p className="text-red-600">{error['category']}</p>}  
                    </div>

                    <div className="items-center gap-4">
                        <Label htmlFor="image" className="text-right">Image</Label>
                        <div 
                            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            {previewImage ? (
                                <div className="flex flex-col items-center">
                                    <img 
                                        src={previewImage} 
                                        alt="Preview" 
                                        className="max-h-40 mb-2 rounded"
                                    />
                                    <p className="text-sm text-gray-500">Click to change or paste another image</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-500">Drag & drop image here, paste from clipboard, or click to select</p>
                                    <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, GIF</p>
                                </>
                            )}
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                id="image"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        {error['image'] && <p className="text-red-600">{error['image']}</p>}  
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenCreate(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProductCreateComponent;