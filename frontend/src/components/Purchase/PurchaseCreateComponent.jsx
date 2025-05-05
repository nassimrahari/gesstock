import React, { useState, useEffect } from 'react';
import { createPurchase } from '../../services/purchaseService';
import { fetchSuppliers } from '../../services/supplierService';
import { fetchProducts } from '../../services/productService';
import { PlusCircle, Trash, Search, Package, ShoppingCart } from 'lucide-react';
import { usePopup } from './PurchasePopupContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import SelectCommand from '../SelectCommand';

import { BACKEND_SERVER } from '@/conf';

const PurchaseCreateComponent = () => {
    const [fieldPurchase_date, setFieldPurchase_date] = useState('');
    const [fieldSupplier, setFieldSupplier] = useState('');
    const [error, setError] = useState({});
    const [purchaseLines, setPurchaseLines] = useState([]);
    const [purchaseLineProductList, setPurchaseLineProductList] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { openCreate, setOpenCreate, triggerRefresh } = usePopup();

    // Initialize purchase lines
    const initiPurchaseLine = () => {
        setPurchaseLines([]);
        for (let index = 0; index < 0; index++) {
            const radom_index = String(Math.random());
            const newPurchaseLine = {
                uuid: radom_index,
                product: null,
                quantity: null,
                price: null,
            };
            setPurchaseLines((lastValue) => [...lastValue, newPurchaseLine]);
        }
    }

    useEffect(() => {
        initiPurchaseLine();
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchItems = async () => {
            const result = await fetchProducts();
            const transformed_result = result.map((item) => {
                return {
                    ...item,
                    value: item.id,
                    label: item.repr,
                    name: item.name || item.repr,
                    ref: item.id
                };
            });
            setPurchaseLineProductList(transformed_result);
        };
        fetchItems();
    }, []);

    // Fetch suppliers
    useEffect(() => {
        const fetchItems = async () => {
            const result = await fetchSuppliers();
            const transformed_result = result.map((item) => {
                return {
                    value: item.id,
                    label: item.repr
                };
            });
            setSuppliersList(transformed_result);
        };
        fetchItems();
    }, []);

    // Handle purchase line operations
    const deletePurchaseLine = (uuid) => {
        setPurchaseLines(prevPurchaseLines => prevPurchaseLines.filter(item => item.uuid !== uuid));
    };

    const addPurchaseLine = () => {
        const radom_index = String(Math.random());
        const newPurchaseLine = {
            uuid: radom_index,
            product: null,
            quantity: 1, // Default to 1
            price: null,
        };
        setPurchaseLines(prevPurchaseLines => [...prevPurchaseLines, newPurchaseLine]);
    };

    const addProductToPurchase = (product) => {

        
        // Check if product already exists in purchase lines
        const exists = purchaseLines.some(line => line.product === product.id);
        
        if (!exists) {
            const radom_index = String(Math.random());
            const newPurchaseLine = {
                uuid: radom_index,
                product: product.id,
                quantity: 1,
                price: product.price,
            };
            setPurchaseLines(prevPurchaseLines => [...prevPurchaseLines, newPurchaseLine]);
        } else {
            // Increment quantity if product already exists
            const updatedLines = purchaseLines.map(line => 
                line.product === productId 
                    ? { ...line, quantity: (line.quantity || 0) + 1 } 
                    : line
            );
            setPurchaseLines(updatedLines);
        }
    };

    // Clean fields when modal opens/closes
    const cleanField = () => {
        setError({});
        setFieldPurchase_date('');
        setFieldSupplier('');
        setSearchTerm('');
        initiPurchaseLine();
    }

    useEffect(() => {
        cleanField();
    }, [openCreate]);

    // Handle form submission
    const handleCreate = async () => {
        // Validation: Check if any field is empty
        setError({});
        let valid = true;

        if (!fieldPurchase_date) {
            setError(prev => { return { ...prev, 'purchase_date': 'Purchase Date is required.' }; });
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['purchase_date']; return newState; });
        }

        if (!fieldSupplier) {
            setError(prev => { return { ...prev, 'supplier': 'Supplier is required.' }; });
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['supplier']; return newState; });
        }

       



        purchaseLines.map((line) => {
            if(line.quantity<=0){
               

                setError({'all':['Verify Quantity Value']})
                valid=false
            }

            if(line.price<=0){
               

                setError({'all':['Verify Price Value']})
                valid=false
            }
        })

        if (!valid) return; 

        // Only proceed if valid
        const data = { 
            purchase_date: fieldPurchase_date, 
            supplier: fieldSupplier,
            purchaseLines 
        };
        
        try {
            await createPurchase(data);
            setOpenCreate(false);
            triggerRefresh(); // refresh list
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(error.response.data);
                if (error.response.data.messages) {
                    setError(error.response.data.messages);
                }
            }
        }
    };

    // Filter products based on search term
    const filteredProducts = searchTerm 
        ? purchaseLineProductList.filter(product => 
            product.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : purchaseLineProductList;

    // Get product name from ID
    const getProductName = (productId) => {
        const product = purchaseLineProductList.find(p => p.value === productId);
        return product ? product.label : 'Produit inconnu';
    };

    // Calculate total
    const calculateTotal = () => {
        return purchaseLines.reduce((total, line) => {
            if (line.quantity && line.price) {
                return total + (line.quantity * line.price);
            }
            return total;
        }, 0);
    };

    return (
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogContent className="sm:max-w-[1200px]"
                style={{
                    maxHeight: "calc(100vh)",
                    overflowY: "auto"
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Ajout Achat</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 bg-background">
                    {/* Left column - Products catalog */}
                    <div className="space-y-4">
                        <div className="flex space-x-2">
                            <div className="relative flex-grow">
                                <Input
                                    type="text"
                                    placeholder="Rechercher des produits..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pr-8 w-full"
                                />
                                <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>

                        <div className="bg-background rounded-md p-2 flex-grow overflow-y-auto" style={{ maxHeight: "350px" }}>
                            <div className="bg-background grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filteredProducts.map((product) => (
                                    <Card key={product.value} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardContent className="p-3">
                                            <img src={`${BACKEND_SERVER}${product.image}`} alt={product.label} className="w-full h-auto mb-2" />
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-gray-500">Réf: {product.ref}</p>
                                                    <p className="font-medium text-sm">{product.label}</p>
                                                </div>
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => addProductToPurchase(product)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <PlusCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column - Purchase form */}
                    <div className="bg-background rounded-lg border border-gray-200 p-4 space-y-4">
                        {/* Form header with errors */}
                        {error?.all && (
                            <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                                {error?.all.map((item_error, index) => (
                                    <p key={index} className="text-red-600 text-sm">{item_error}</p>
                                ))}
                            </div>
                        )}

                        {/* Supplier field */}
                        <div className="space-y-2">
                            <Label htmlFor="supplier" className="text-sm font-medium">
                                Fournisseur
                            </Label>
                            <SelectCommand
                                options={suppliersList}
                                value={fieldSupplier}
                                onChange={setFieldSupplier}
                                placeholder="Sélectionner un fournisseur"
                            />
                            {error['supplier'] && <p className="text-red-600 text-xs">{error['supplier']}</p>}
                        </div>

                        {/* Purchase date field */}
                        <div className="space-y-2">
                            <Label htmlFor="purchase_date" className="text-sm font-medium">
                                Date d'achat
                            </Label>
                            <Input
                                type="date"
                                id="purchase_date"
                                value={fieldPurchase_date}
                                onChange={e => setFieldPurchase_date(e.target.value)}
                            />
                            {error['purchase_date'] && <p className="text-red-600 text-xs">{error['purchase_date']}</p>}
                        </div>

                        {/* Purchase lines */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">
                                    Produits
                                </Label>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={addPurchaseLine} 
                                    className="h-7 text-xs"
                                >
                                    <PlusCircle className="h-3 w-3 mr-1" /> 
                                    Ajouter ligne
                                </Button>
                            </div>

                            <div className="max-h-[250px] overflow-y-auto pr-1">
                                {purchaseLines.length === 0 ? (
                                    <div className="text-center py-6 text-gray-500">
                                        <ShoppingCart className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                        <p>Aucun produit ajouté</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {purchaseLines.map(purchaseLine => (
                                            <div key={purchaseLine.uuid} className="bg-background rounded-md p-3 relative">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => deletePurchaseLine(purchaseLine.uuid)}
                                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                    <Label className="text-sm font-medium">Produit</Label>

                                                    <SelectCommand
                                                        options={purchaseLineProductList}
                                                        value={purchaseLine.product}
                                                        onChange={(value) => {
                                                            const updatedPurchaseLines = purchaseLines.map(item => 
                                                                item.uuid === purchaseLine.uuid ? { ...item, product: value } : item
                                                            );
                                                            setPurchaseLines(updatedPurchaseLines);
                                                        }}
                                                        placeholder="Sélectionner.."
                                                        className="mb-2"
                                                    />
                                                    </div>
                                                  
                                                        <div>
                                                            <Label className="text-xs text-gray-500">Quantité</Label>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                step="1"
                                                                value={purchaseLine.quantity || ''}
                                                                onChange={e => {
                                                                    const updatedPurchaseLines = purchaseLines.map(item => 
                                                                        item.uuid === purchaseLine.uuid ? { ...item, quantity: Number(e.target.value) } : item
                                                                    );
                                                                    setPurchaseLines(updatedPurchaseLines);
                                                                }}
                                                                placeholder="Qté"
                                                                className="h-8 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-gray-500">Prix unitaire</Label>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                value={purchaseLine.price || ''}
                                                                onChange={e => {
                                                                    const updatedPurchaseLines = purchaseLines.map(item => 
                                                                        item.uuid === purchaseLine.uuid ? { ...item, price: Number(e.target.value) } : item
                                                                    );
                                                                    setPurchaseLines(updatedPurchaseLines);
                                                                }}
                                                                placeholder="Prix"
                                                                className="h-8 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Total section */}
                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center font-medium">
                                <span>Total:</span>
                                <span>{calculateTotal().toFixed(2)} Ar</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <DialogFooter className="border-t pt-3">
                    <Button variant="outline" onClick={() => setOpenCreate(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleCreate}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PurchaseCreateComponent;