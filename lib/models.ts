// Database Models/Interfaces for MongoDB

export interface User {
  _id?: string
  id: string
  name: string
  email: string
  role: "super_admin" | "centre_admin"
  centreId: string | null
  password?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Centre {
  _id?: string
  id: string
  name: string
  state: string
  city: string
  address: string
  phone: string
  email: string
  capacity: number
  administrator: string
  adminEmail: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt?: Date
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  prescribedBy: string
  startDate: string
}

export interface Patient {
  _id?: string
  id: string
  centreId: string
  name: string
  dob: string
  age: number
  gender: string
  phone: string
  email: string
  address: string
  aadharNumber: string
  familyContactName: string
  familyContactPhone: string
  addictionType: string
  admissionDate: string
  status: "admitted" | "under_treatment" | "recovering" | "discharged"
  medications: Medication[]
  createdAt?: Date
  updatedAt?: Date
}

export interface QueryResponse {
  id: string
  message: string
  respondedBy: string
  respondedAt: string
  isAdmin: boolean
}

export interface Query {
  _id?: string
  id: string
  centreId: string
  centreName: string
  subject: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in_progress" | "resolved" | "closed"
  createdBy: string
  createdAt: string
  responses: QueryResponse[]
  updatedAt?: Date
}

export interface Acknowledgement {
  centreId: string
  acknowledgedBy: string
  acknowledgedAt: string
}

export interface Order {
  _id?: string
  id: string
  subject: string
  instruction: string
  targetCentreId: string | null
  targetCentreName: string
  priority: "low" | "medium" | "high" | "critical"
  status: "issued" | "acknowledged" | "in_progress" | "completed"
  deadline: string
  issuedBy: string
  issuedAt: string
  acknowledgements: Acknowledgement[]
  updatedAt?: Date
}

