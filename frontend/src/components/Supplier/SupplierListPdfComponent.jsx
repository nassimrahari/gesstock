// SupplierListPdfComponent.js

import React, { useState, useEffect,useRef } from 'react';
import html2pdf from 'html2pdf.js';


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const SupplierListPdfComponent = ({suppliers}) => {

    const contentRef = useRef(null);
	const [isGenerating, setIsGenerating] = useState(false); // State to manage PDF generation
	const [rowHeights, setRowHeights] = useState([]); // State to store row heights


    
        const convertToPdf = async () => {
		setIsGenerating(true); // Set generating state to true
		await generatePDF();
		setIsGenerating(false); // Reset generating state after PDF is created
	};

	const generatePDF = async () => {
		const content = contentRef.current;

		const options = {
			filename: 'suppliers.pdf',
			margin: 0,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: {
				unit: 'in',
				format: 'letter',
				orientation: 'portrait',
			},
		};

		await html2pdf().set(options).from(content).save();
	};        


    const chunkArray = (arr, chunkSize) => {
        const result = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            result.push(arr.slice(i, i + chunkSize));
        }
        return result;
    };

    const supplierChunks = chunkArray(suppliers, 15);
        

    
return (
		<div>
			<div ref={contentRef} style={{ display: `${isGenerating ? 'block' : 'none'}` }}>

                {supplierChunks.map((chunk, index) => (
                    <div key={index}>
                        <h1 className='text-center'>Supplier List (Page {index + 1})</h1>
                        <div className="px-2">
                            <Table>
                                <TableHeader>
                                
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead><TableHead>Contact Email</TableHead><TableHead>Phone Number</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {chunk.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.name}</TableCell><TableCell>{item.contact_email}</TableCell><TableCell>{item.phone_number}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    {index < supplierChunks.length - 1 && (
                            <div style={{ pageBreakAfter: 'always' }}></div>
                        )}
                    </div>
                ))}
			</div>
			<Button onClick={convertToPdf} disabled={isGenerating}>
				{isGenerating ? 'Generating PDF...' : 'Download  Supplier List as PDF'}
			</Button>
		</div>
	);
        

    
    
    
};

export default SupplierListPdfComponent;
