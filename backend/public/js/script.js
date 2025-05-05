document.getElementById('send-btn').addEventListener('click', async () => {
    const method = document.getElementById('method').value;
    const endpoint = document.getElementById('endpoint').value;
    const paramsInput = document.getElementById('params').value;
    const jsonInput = document.getElementById('json-input').value;
    const responseOutput = document.getElementById('response-output');

    try {
        // Construct URL with query parameters
        let url = endpoint;
        if (paramsInput) {
            const params = JSON.parse(paramsInput);
            const queryString = new URLSearchParams(params).toString();
            url += '?' + queryString;
        }
    
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: ['POST', 'PUT', 'PATCH'].includes(method) ? jsonInput : null,
        });

        try {
            const data = await response.json();
            responseOutput.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            console.error(error)
        }
        
    } catch (error) {
        responseOutput.textContent = `Error: ${error.message}`;
    }
});