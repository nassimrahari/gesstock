//countsService.js
import { BACKEND_SERVER } from "../conf";

const BASE_URL=`${BACKEND_SERVER}/api/counts`

export const fetchCounts = async () => {
    const response = await fetch(`${BASE_URL}/`);
    return response.json();
};