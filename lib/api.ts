// API utility functions for frontend

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

// Centres API
export const centresAPI = {
  getAll: (role?: string, centreId?: string, state?: string, search?: string) => {
    const params = new URLSearchParams()
    if (role) params.append('role', role)
    if (centreId) params.append('centreId', centreId)
    if (state) params.append('state', state)
    if (search) params.append('search', search)
    return apiRequest(`/centres?${params.toString()}`)
  },
  create: (data: Record<string, unknown>) => apiRequest('/centres', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: Record<string, unknown>) => apiRequest('/centres', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string, role: string) => apiRequest(`/centres?id=${id}&role=${role}`, { method: 'DELETE' }),
}

// Patients API
export const patientsAPI = {
  getAll: (role?: string, centreId?: string, status?: string, search?: string) => {
    const params = new URLSearchParams()
    if (role) params.append('role', role)
    if (centreId) params.append('centreId', centreId)
    if (status) params.append('status', status)
    if (search) params.append('search', search)
    return apiRequest(`/patients?${params.toString()}`)
  },
  create: (data: Record<string, unknown>) => apiRequest('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: Record<string, unknown>) => apiRequest('/patients', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string, role: string, centreId?: string) => {
    const params = new URLSearchParams({ id, role })
    if (centreId) params.append('centreId', centreId)
    return apiRequest(`/patients?${params.toString()}`, { method: 'DELETE' })
  },
  addMedication: (data: Record<string, unknown>) => apiRequest('/patients', { method: 'PATCH', body: JSON.stringify(data) }),
}

// Queries API
export const queriesAPI = {
  getAll: (role?: string, centreId?: string, status?: string, priority?: string) => {
    const params = new URLSearchParams()
    if (role) params.append('role', role)
    if (centreId) params.append('centreId', centreId)
    if (status) params.append('status', status)
    if (priority) params.append('priority', priority)
    return apiRequest(`/queries?${params.toString()}`)
  },
  create: (data: Record<string, unknown>) => apiRequest('/queries', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (data: Record<string, unknown>) => apiRequest('/queries', { method: 'PUT', body: JSON.stringify(data) }),
  addResponse: (data: Record<string, unknown>) => apiRequest('/queries', { method: 'PATCH', body: JSON.stringify(data) }),
}

// Orders API
export const ordersAPI = {
  getAll: (role?: string, centreId?: string, status?: string, priority?: string) => {
    const params = new URLSearchParams()
    if (role) params.append('role', role)
    if (centreId) params.append('centreId', centreId)
    if (status) params.append('status', status)
    if (priority) params.append('priority', priority)
    return apiRequest(`/orders?${params.toString()}`)
  },
  create: (data: Record<string, unknown>) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (data: Record<string, unknown>) => apiRequest('/orders', { method: 'PUT', body: JSON.stringify(data) }),
  acknowledge: (data: Record<string, unknown>) => apiRequest('/orders', { method: 'PATCH', body: JSON.stringify(data) }),
}

// Register API (includes centre admins list)
export const registerAPI = {
  getAll: (role?: string, status?: string) => {
    const params = new URLSearchParams()
    if (role) params.append('role', role)
    if (status) params.append('status', status)
    return apiRequest(`/register?${params.toString()}`)
  },
  getCentreAdmins: (role: string) => {
    const params = new URLSearchParams({ type: 'centre-admins', role })
    return apiRequest(`/register?${params.toString()}`)
  },
  create: (data: Record<string, unknown>) => apiRequest('/register', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (data: Record<string, unknown>) => apiRequest('/register', { method: 'PUT', body: JSON.stringify(data) }),
}

// Users API
export const usersAPI = {
  getByEmail: (email: string) => apiRequest(`/users?email=${encodeURIComponent(email)}`),
  create: (data: Record<string, unknown>) => apiRequest('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateProfile: (data: Record<string, unknown>) => apiRequest('/users', { method: 'PATCH', body: JSON.stringify(data) }),
}

