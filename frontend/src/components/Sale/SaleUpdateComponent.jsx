import React, { useState, useEffect } from 'react';
import { updateSale, fetchSalesItem } from '../../services/saleService';
import { fetchClients } from '../../services/clientService';
import { fetchProducts } from '../../services/productService';
import { PlusCircle, Trash, Search, ShoppingCart } from 'lucide-react';
import { usePopup } from './SalePopupContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import SelectCommand from '../SelectCommand';
import { BACKEND_SERVER } from '@/conf';

const SaleUpdateComponent = () => {
    const [id, setId] = useState('');
    const [fieldSale_date, setFieldSale_date] = useState('');
    const [fieldClient, setFieldClient] = useState('');
    const [error, setError] = useState({});
    const [saleLines, setSaleLines] = useState([]);
    const [saleLineProductList, setSaleLineProductList] = useState([]);
    const [clientsList, setClientsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { openUpdate, setOpenUpdate, triggerRefresh, itemEditId } = usePopup();

    // Initialize sale lines
    const initiSaleLine = () => {
        setSaleLines([]);
        for (let index = 0; index < 0; index++) {
            const radom_index = String(Math.random());
            const newSaleLine = {
                uuid: radom_index,
                product: null,
                quantity: 1,
                price: null,
            };
            setSaleLines((lastValue) => [...lastValue, newSaleLine]);
        }
    }

    useEffect(() => {
        initiSaleLine();
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
            setSaleLineProductList(transformed_result);
        };
        fetchItems();
    }, []);

    // Fetch clients
    useEffect(() => {
        const fetchItems = async () => {
            const result = await fetchClients();
            const transformed_result = result.map((item) => {
                return {
                    value: item.id,
                    label: item.repr
                };
            });
            setClientsList(transformed_result);
        };
        fetchItems();
    }, []);

    // Handle sale line operations
    const deleteSaleLine = (uuid) => {
        setSaleLines(prevSaleLines => prevSaleLines.filter(item => item.uuid !== uuid));
    };

    const addSaleLine = () => {
        const radom_index = String(Math.random());
        const newSaleLine = {
            uuid: radom_index,
            product: null,
            quantity: 1,
            price: null,
        };
        setSaleLines(prevSaleLines => [...prevSaleLines, newSaleLine]);
    };

    const addProductToSale = (product) => {
        // Check if product already exists in sale lines
        const exists = saleLines.some(line => line.product === product.id);
        
        if (!exists) {
            const radom_index = String(Math.random());
            const newSaleLine = {
                uuid: radom_index,
                product: product.id,
                quantity: 1,
                price: product.price,
            };
            setSaleLines(prevSaleLines => [...prevSaleLines, newSaleLine]);
        } else {
            // Increment quantity if product already exists
            const updatedLines = saleLines.map(line => 
                line.product === product.id 
                    ? { ...line, quantity: (line.quantity || 0) + 1 } 
                    : line
            );
            setSaleLines(updatedLines);
        }
    };

    // Clean fields when modal opens/closes
    const cleanField = () => {
        setError({});
        setFieldSale_date('');
        setFieldClient('');
        setSearchTerm('');
        initiSaleLine();
    }

    useEffect(() => {
        cleanField();
    }, [openUpdate]);

    // Handle form submission
    const handleUpdate = async () => {
        // Validation: Check if any field is empty
        setError({});
        let valid = true;

        if (!fieldSale_date) {
            setError(prev => { return { ...prev, 'sale_date': 'Sale Date is required.' }; });
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['sale_date']; return newState; });
        }

        if (!fieldClient) {
            setError(prev => { return { ...prev, 'client': 'Client is required.' }; });
            valid = false; 
        } else {
            setError(prev => { const newState = { ...prev }; delete newState['client']; return newState; });
        }

        saleLines.map((line) => {
            if(line.quantity <= 0) {
                setError({'all':['Verify Quantity Value']})
                valid = false
            }

            if(line.price <= 0) {
                setError({'all':['Verify Price Value']})
                valid = false
            }
        })

        if (!valid) return; 

        // Only proceed if valid
        const data = { 
            sale_date: fieldSale_date, 
            client: fieldClient,
            saleLines 
        };
        
        try {
            await updateSale(id, data);
            setOpenUpdate(false);
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
        ? saleLineProductList.filter(product => 
            product.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : saleLineProductList;

    // Calculate total
    const calculateTotal = () => {
        return saleLines.reduce((total, line) => {
            if (line.quantity && line.price) {
                return total + (line.quantity * line.price);
            }
            return total;
        }, 0);
    };

    // Load item data when itemEditId changes
    useEffect(() => {
        const fetchItem = async () => {
            const result = await fetchSalesItem(itemEditId);
            setId(result.id);

            if(result.sale_date) {
                setFieldSale_date(result.sale_date.split("T")[0]);
            }

            if(result.clientId) {
                setFieldClient(result.clientId);
            }

            const newSaleLines = result.saleLines.map((ligne) => {
                const radom_index = String(Math.random());
                return {
                    ...ligne,
                    uuid: radom_index,
                    product: ligne.productId,
                    quantity: Number(ligne.quantity),
                    price: Number(ligne.price),
                }
            });
            setSaleLines(newSaleLines);
        };

        if(itemEditId) fetchItem();
    }, [itemEditId, openUpdate]);

    return (
        <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
            <DialogContent className="sm:max-w-[1200px]"
                style={{
                    maxHeight: "calc(100vh)",
                    overflowY: "auto"
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Modifier Vente</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
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

                        <div className="bg-gray-50 rounded-md p-2 flex-grow overflow-y-auto" style={{ maxHeight: "350px" }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filteredProducts.map((product) => (
                                    <Card key={product.value} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardContent className="p-3">
                                            <img 
                                                src={product.image ? `${BACKEND_SERVER}${product.image}` : '/placeholder-product.png'} 
                                                alt={product.label} 
                                                className="w-full h-32 object-contain mb-2 bg-white"
                                            />
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-gray-500">Réf: {product.ref}</p>
                                                    <p className="font-medium text-sm">{product.label}</p>
                                                </div>
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => addProductToSale(product)}
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

                    {/* Right column - Sale form */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                        {/* Form header with errors */}
                        {error?.all && (
                            <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                                {error?.all.map((item_error, index) => (
                                    <p key={index} className="text-red-600 text-sm">{item_error}</p>
                                ))}
                            </div>
                        )}

                        {/* Client field */}
                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-sm font-medium">
                                Client
                            </Label>
                            <SelectCommand
                                options={clientsList}
                                value={fieldClient}
                                onChange={setFieldClient}
                                placeholder="Sélectionner un client"
                            />
                            {error['client'] && <p className="text-red-600 text-xs">{error['client']}</p>}
                        </div>

                        {/* Sale date field */}
                        <div className="space-y-2">
                            <Label htmlFor="sale_date" className="text-sm font-medium">
                                Date de vente
                            </Label>
                            <Input
                                type="date"
                                id="sale_date"
                                value={fieldSale_date}
                                onChange={e => setFieldSale_date(e.target.value)}
                            />
                            {error['sale_date'] && <p className="text-red-600 text-xs">{error['sale_date']}</p>}
                        </div>

                        {/* Sale lines */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">
                                    Produits
                                </Label>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={addSaleLine} 
                                    className="h-7 text-xs"
                                >
                                    <PlusCircle className="h-3 w-3 mr-1" /> 
                                    Ajouter ligne
                                </Button>
                            </div>

                            <div className="max-h-[250px] overflow-y-auto pr-1">
                                {saleLines.length === 0 ? (
                                    <div className="text-center py-6 text-gray-500">
                                        <ShoppingCart className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                        <p>Aucun produit ajouté</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {saleLines.map(saleLine => (
                                            <div key={saleLine.uuid} className="bg-gray-50 rounded-md p-3 relative">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => deleteSaleLine(saleLine.uuid)}
                                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div>
                                                            <Label className="text-sm font-medium">Produit</Label>
                                                            <SelectCommand
                                                                options={saleLineProductList}
                                                                value={saleLine.product}
                                                                onChange={(value) => {
                                                                    const updatedSaleLines = saleLines.map(item => 
                                                                        item.uuid === saleLine.uuid ? { ...item, product: value } : item
                                                                    );
                                                                    setSaleLines(updatedSaleLines);
                                                                }}
                                                                placeholder="Sélectionner un produit"
                                                                className="mb-2"
                                                            />
                                                        </div>
                                                      
                                                        <div>
                                                            <Label className="text-xs text-gray-500">Quantité</Label>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                step="1"
                                                                value={saleLine.quantity || ''}
                                                                onChange={e => {
                                                                    const updatedSaleLines = saleLines.map(item => 
                                                                        item.uuid === saleLine.uuid ? { ...item, quantity: Number(e.target.value) } : item
                                                                    );
                                                                    setSaleLines(updatedSaleLines);
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
                                                                value={saleLine.price || ''}
                                                                onChange={e => {
                                                                    const updatedSaleLines = saleLines.map(item => 
                                                                        item.uuid === saleLine.uuid ? { ...item, price: Number(e.target.value) } : item
                                                                    );
                                                                    setSaleLines(updatedSaleLines);
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
                    <Button variant="outline" onClick={() => setOpenUpdate(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleUpdate}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SaleUpdateComponent;