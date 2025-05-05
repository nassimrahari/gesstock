// countsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCounts = async (req, res) => {
    try {
        const counts = {
            
             suppliers: await prisma.supplier.count(),
             categorys: await prisma.category.count(),
             products: await prisma.product.count(),
             purchases: await prisma.purchase.count(),
             purchaselines: await prisma.purchaseLine.count(),
             clients: await prisma.client.count(),
             sales: await prisma.sale.count(),
             salelines: await prisma.saleLine.count(),

        };

        res.json(counts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching counts.' });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {
    getCounts,
};