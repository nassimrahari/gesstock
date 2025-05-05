
    
        
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {formatDate}  = require('../services/formatDate');






class SaleLineController {
    async getAll(req, res) {
        try {
            const items = await prisma.saleLine.findMany({
            

                include: {
                    sale: true,
                    product: true,
                    },

                orderBy: {
                    id: 'desc', // This orders by id in descending order
                },
            });
            // Transformation des items avant de les renvoyer
                const transformedItems = await Promise.all(
                    items.map(async (item) => {
                    
                        
                        
                        return {
                        id: item.id,
                    sale:{
                        id: item.sale.id,
                        sale_date: item.sale.sale_date,
                        client: item.sale.client,
                        repr: (() => {try {return `Sale on ${item.sale?.sale_date}`;} catch (error) {return `Object Sale(${item.id})`;}})(),

                    },
                    product:{
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        category: item.product.category,
                        image: item.product.image,
                        repr: (() => {try {return `${item.product?.name}`;} catch (error) {return `Object Product(${item.id})`;}})(),

                    },
                    quantity: item.quantity,
                    price: item.price,
                    repr: (() => {try {return `${item?.quantity} of ${item?.product} in Sale`;} catch (error) {return `Object SaleLine(${item.id})`;}})(),

                        
                        
                         };
                    
                   
                    })
                 );


         

                
    
                res.json(transformedItems);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items' });
        }
    }
        
        async create(req, res) {
            try {
const { sale, product, quantity, price } = req.body;









                
                let messages = {};
        
            if(quantity<=0){
                messages={...messages,quantity:'Quantity  must be a positive integer'};

            }
            
                if (price < 0 || price > 100000000) {
                    messages = {...messages, price: 'Price must be between 0 and 100000000'};
                }
                
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.saleLine.create({
                    data: {
                        saleId: sale,
                        productId: product,
                        quantity: quantity,
                        price: price
                    }
                });

                

        

                res.status(201).json(item);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error creating item' });
            }
        }
        

        
        async getById(req, res) {
            try {
                const item = await prisma.saleLine.findUnique(
                    { 
                        where: { id: Number(req.params.id) },
                        include: {} 
                    
                    }
                );
                if (!item) {
                    return res.status(404).json({ message: 'Item not found' });
                }
                res.json(item);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error fetching item' });
            }
        }
        
        

        
        async update(req, res) {
            try {
            
const { sale, product, quantity, price } = req.body;

                const saleLineId = Number(req.params.id);









                
                let messages = {};
        
            if(quantity<=0){
                messages={...messages,quantity:'Quantity  must be a positive integer'};

            }
            
                if (price < 0 || price > 100000000) {
                    messages = {...messages, price: 'Price must be between 0 and 100000000'};
                }
                
                if (Object.keys(messages).length ) {
                    return res.status(400).json({ messages });
                }
        
                const item = await prisma.saleLine.update({
                    where: { id: saleLineId },
                    data: {
                        saleId: sale,
                        productId: product,
                        quantity: quantity,
                        price: price
                    }
                });

                
                res.json(item);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error updating item' });
            }
        }
        

        async delete(req, res) {
            try {
                await prisma.saleLine.delete({ where: { id: Number(req.params.id) } });
                res.status(204).json({ message: 'Item Deleted' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting item' });
            }
        }
}

module.exports = new SaleLineController();
