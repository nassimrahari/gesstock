

export default function objectToFormData(obj, formData = new FormData(), parentKey = '') {{
    for (const key in obj) {{
        if (obj.hasOwnProperty(key)) {{
            const value = obj[key];
            const formKey = parentKey ? `${{parentKey}}[${{key}}]` : key;

            if (value instanceof File || value instanceof Blob) {{
                // Si c'est un fichier ou un blob (octets)
                formData.append(formKey, value);
            }} else if (Array.isArray(value)) {{
                // Si c'est un tableau
                //value.forEach((item) => {{
                //    objectToFormData({{ [key]: item }}, formData, parentKey);
                //}});
                 formData.append(formKey, JSON.stringify(value));
            }} else if (typeof value === 'object' && value !== null) {{
                // Si c'est un objet
               // objectToFormData(value, formData, formKey);
                formData.append(formKey, JSON.stringify(value));
            }} else {{
                // Sinon, c'est une chaîne de caractères ou un nombre
                formData.append(formKey, value);
            }}
        }}
    }}
    return formData;
}}