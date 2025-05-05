import React, { useEffect, useState } from 'react';
import { fetchCounts } from '@/services/countsService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Tag, Users, ShoppingCart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Home = () => {
    const [counts, setCounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCounts = async () => {
            try {
                const data = await fetchCounts();
                setCounts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        getCounts();
    }, []);

    // Mock sales data
    const salesData = [
        { month: 'Jan', sales: 4000, transactions: 24 },
        { month: 'Feb', sales: 3000, transactions: 13 },
        { month: 'Mar', sales: 5000, transactions: 18 },
        { month: 'Apr', sales: 2780, transactions: 19 },
        { month: 'May', sales: 1890, transactions: 10 },
        { month: 'Jun', sales: 4390, transactions: 25 },
        { month: 'Jul', sales: 3490, transactions: 22 },
        { month: 'Aug', sales: 4000, transactions: 28 },
        { month: 'Sep', sales: 4300, transactions: 30 },
        { month: 'Oct', sales: 5100, transactions: 32 },
        { month: 'Nov', sales: 6000, transactions: 35 },
        { month: 'Dec', sales: 7200, transactions: 40 },
    ];

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    const countItems = [
        { title: 'Suppliers', value: counts?.suppliers, icon: Users },
        { title: 'Categories', value: counts?.categorys, icon: Tag },
        { title: 'Purchases', value: counts?.purchases, icon: ShoppingCart },
        { title: 'Clients', value: counts?.clients, icon: User },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {countItems.map((item, index) => (
                    <Card key={item.title} className="dark:bg-gray-800">
                        <CardHeader className={`flex flex-row ${index%2?'bg-gray-100':""} ${index%2?'dark:bg-gray-900':""} items-center justify-between space-y-0 pb-2`}>
                            <CardTitle className="text-sm font-medium">
                                {item.title}
                            </CardTitle>
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Line Chart */}
            <div className="mt-8">
                <Card className="dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold dark:text-white">
                            Sales Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={salesData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="left" orientation="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        yAxisId="left" 
                                        type="monotone" 
                                        dataKey="sales" 
                                        name="Sales (Ar)" 
                                        stroke="#8884d8" 
                                        strokeWidth={2}
                                        activeDot={{ r: 8 }} 
                                    />
                                    <Line 
                                        yAxisId="right" 
                                        type="monotone" 
                                        dataKey="transactions" 
                                        name="Transactions" 
                                        stroke="#82ca9d" 
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Home;