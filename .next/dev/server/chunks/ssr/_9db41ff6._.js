module.exports = [
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// API utility functions for frontend
__turbopack_context__.s([
    "apiRequest",
    ()=>apiRequest,
    "centresAPI",
    ()=>centresAPI,
    "ordersAPI",
    ()=>ordersAPI,
    "patientsAPI",
    ()=>patientsAPI,
    "queriesAPI",
    ()=>queriesAPI,
    "usersAPI",
    ()=>usersAPI
]);
const API_URL = ("TURBOPACK compile-time value", "/api") || '/api';
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}
const centresAPI = {
    getAll: (role, centreId, state, search)=>{
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        if (centreId) params.append('centreId', centreId);
        if (state) params.append('state', state);
        if (search) params.append('search', search);
        return apiRequest(`/centres?${params.toString()}`);
    },
    create: (data)=>apiRequest('/centres', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    update: (data)=>apiRequest('/centres', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    delete: (id, role)=>apiRequest(`/centres?id=${id}&role=${role}`, {
            method: 'DELETE'
        })
};
const patientsAPI = {
    getAll: (role, centreId, status, search)=>{
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        if (centreId) params.append('centreId', centreId);
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        return apiRequest(`/patients?${params.toString()}`);
    },
    create: (data)=>apiRequest('/patients', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    update: (data)=>apiRequest('/patients', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    delete: (id, role, centreId)=>{
        const params = new URLSearchParams({
            id,
            role
        });
        if (centreId) params.append('centreId', centreId);
        return apiRequest(`/patients?${params.toString()}`, {
            method: 'DELETE'
        });
    },
    addMedication: (data)=>apiRequest('/patients', {
            method: 'PATCH',
            body: JSON.stringify(data)
        })
};
const queriesAPI = {
    getAll: (role, centreId, status, priority)=>{
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        if (centreId) params.append('centreId', centreId);
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        return apiRequest(`/queries?${params.toString()}`);
    },
    create: (data)=>apiRequest('/queries', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    updateStatus: (data)=>apiRequest('/queries', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    addResponse: (data)=>apiRequest('/queries', {
            method: 'PATCH',
            body: JSON.stringify(data)
        })
};
const ordersAPI = {
    getAll: (role, centreId, status, priority)=>{
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        if (centreId) params.append('centreId', centreId);
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        return apiRequest(`/orders?${params.toString()}`);
    },
    create: (data)=>apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    updateStatus: (data)=>apiRequest('/orders', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    acknowledge: (data)=>apiRequest('/orders', {
            method: 'PATCH',
            body: JSON.stringify(data)
        })
};
const usersAPI = {
    getByEmail: (email)=>apiRequest(`/users?email=${encodeURIComponent(email)}`),
    create: (data)=>apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify(data)
        })
};
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/app/page.tsx'\n\nawait isn't allowed in non-async function");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=_9db41ff6._.js.map