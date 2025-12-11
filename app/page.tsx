"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { centresAPI, patientsAPI, queriesAPI, ordersAPI, usersAPI, registerAPI } from "@/lib/api"

// Types
interface User {
  id: string
  name: string
  email: string
  role: "super_admin" | "centre_admin"
  centreId: string | null
  status?: "pending" | "approved" | "rejected"
  phone?: string
  dob?: string // Date of birth
  age?: number
  aadharNumber?: string
  address?: string
  employeeCode?: string // Unique employee code
  centreName?: string
  centreAddress?: string
  centreState?: string
  centreCity?: string
  rejectionReason?: string
  createdAt?: Date | string
}

interface Centre {
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
}

interface Patient {
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
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  prescribedBy: string
  startDate: string
}

interface Query {
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
}

interface QueryResponse {
  id: string
  message: string
  respondedBy: string
  respondedAt: string
  isAdmin: boolean
}

interface Order {
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
}

interface Acknowledgement {
  centreId: string
  acknowledgedBy: string
  acknowledgedAt: string
}

// Constants
// Removed hardcoded ADMIN_USERS - all authentication should go through database

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
]

const ADDICTION_TYPES = [
  "Alcohol",
  "Cannabis/Marijuana",
  "Opioids (Heroin, Morphine)",
  "Cocaine",
  "Methamphetamine",
  "Prescription Drugs",
  "Tobacco/Nicotine",
  "Benzodiazepines",
  "Inhalants",
  "Hallucinogens",
  "Multiple Substances",
  "Other",
]

// Initial Data
const initialCentres: Centre[] = [
  {
    id: "C001",
    name: "Mumbai Central Rehabilitation Centre",
    state: "Maharashtra",
    city: "Mumbai",
    address: "123, Bandra West, Mumbai - 400050",
    phone: "022-12345678",
    email: "mumbai@rehab.gov.in",
    capacity: 150,
    administrator: "Mr. Anil Deshmukh",
    adminEmail: "anil@rehab.gov.in",
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: "C002",
    name: "Delhi AIIMS De-addiction Centre",
    state: "Delhi",
    city: "New Delhi",
    address: "AIIMS Campus, Ansari Nagar, New Delhi",
    phone: "011-26588500",
    email: "delhi@rehab.gov.in",
    capacity: 200,
    administrator: "Dr. Priya Sharma",
    adminEmail: "priya@rehab.gov.in",
    status: "active",
    createdAt: "2022-06-01",
  },
  {
    id: "C003",
    name: "Bengaluru Hope Foundation Centre",
    state: "Karnataka",
    city: "Bengaluru",
    address: "45, Koramangala, Bengaluru",
    phone: "080-23456789",
    email: "bengaluru@rehab.gov.in",
    capacity: 100,
    administrator: "Dr. Venkatesh Iyer",
    adminEmail: "venkatesh@rehab.gov.in",
    status: "active",
    createdAt: "2023-03-20",
  },
  {
    id: "C004",
    name: "Chennai Recovery Centre",
    state: "Tamil Nadu",
    city: "Chennai",
    address: "78, T. Nagar, Chennai",
    phone: "044-34567890",
    email: "chennai@rehab.gov.in",
    capacity: 120,
    administrator: "Dr. Lakshmi Narayanan",
    adminEmail: "lakshmi@rehab.gov.in",
    status: "active",
    createdAt: "2023-05-10",
  },
]

const initialPatients: Patient[] = [
  {
    id: "P001",
    centreId: "C001",
    name: "Rahul Verma",
    dob: "1992-05-15",
    age: 32,
    gender: "male",
    phone: "9876543210",
    email: "rahul@email.com",
    address: "45, Andheri East, Mumbai",
    aadharNumber: "1234-5678-9012",
    familyContactName: "Sanjay Verma (Father)",
    familyContactPhone: "9876543211",
    addictionType: "Alcohol",
    admissionDate: "2024-01-10",
    status: "under_treatment",
    medications: [
      {
        id: "MED001",
        name: "Naltrexone",
        dosage: "50mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Anil Sharma",
        startDate: "2024-01-12",
      },
    ],
  },
  {
    id: "P002",
    centreId: "C001",
    name: "Priya Patel",
    dob: "1988-11-22",
    age: 36,
    gender: "female",
    phone: "9876543220",
    email: "priya@email.com",
    address: "22, Powai, Mumbai",
    aadharNumber: "2345-6789-0123",
    familyContactName: "Meera Patel (Mother)",
    familyContactPhone: "9876543221",
    addictionType: "Prescription Drugs",
    admissionDate: "2024-02-05",
    status: "recovering",
    medications: [],
  },
  {
    id: "P003",
    centreId: "C002",
    name: "Amit Singh",
    dob: "1995-03-08",
    age: 29,
    gender: "male",
    phone: "9876543230",
    email: "amit@email.com",
    address: "12, Rohini, New Delhi",
    aadharNumber: "3456-7890-1234",
    familyContactName: "Rajesh Singh (Brother)",
    familyContactPhone: "9876543231",
    addictionType: "Opioids (Heroin, Morphine)",
    admissionDate: "2024-01-20",
    status: "under_treatment",
    medications: [],
  },
  {
    id: "P004",
    centreId: "C003",
    name: "Divya Reddy",
    dob: "1990-07-14",
    age: 34,
    gender: "female",
    phone: "9876543240",
    email: "divya@email.com",
    address: "56, Whitefield, Bengaluru",
    aadharNumber: "4567-8901-2345",
    familyContactName: "Krishna Reddy (Husband)",
    familyContactPhone: "9876543241",
    addictionType: "Alcohol",
    admissionDate: "2023-12-15",
    status: "discharged",
    medications: [],
  },
]

const initialQueries: Query[] = [
  {
    id: "QRY001",
    centreId: "C001",
    centreName: "Mumbai Central Rehabilitation Centre",
    subject: "Request for Additional Medical Staff",
    description: "Due to increased patient admissions, we require 2 additional psychiatrists.",
    priority: "high",
    status: "open",
    createdBy: "Mr. Anil Deshmukh",
    createdAt: "2024-03-01",
    responses: [],
  },
  {
    id: "QRY002",
    centreId: "C002",
    centreName: "Delhi AIIMS De-addiction Centre",
    subject: "Equipment Maintenance Required",
    description: "Several medical equipment need urgent maintenance.",
    priority: "medium",
    status: "in_progress",
    createdBy: "Dr. Priya Sharma",
    createdAt: "2024-02-25",
    responses: [
      {
        id: "RES001",
        message: "Maintenance team has been notified.",
        respondedBy: "Dr. Rajesh Kumar",
        respondedAt: "2024-02-26",
        isAdmin: true,
      },
    ],
  },
]

const initialOrders: Order[] = [
  {
    id: "ORD001",
    subject: "Monthly Patient Report Submission",
    instruction: "All centres must submit monthly patient progress reports by 5th of every month.",
    targetCentreId: null,
    targetCentreName: "All Centres",
    priority: "high",
    status: "issued",
    deadline: "2024-03-05",
    issuedBy: "Dr. Rajesh Kumar",
    issuedAt: "2024-03-01",
    acknowledgements: [],
  },
  {
    id: "ORD002",
    subject: "New Safety Protocol Implementation",
    instruction: "Implement updated safety protocols as per Ministry guidelines.",
    targetCentreId: "C001",
    targetCentreName: "Mumbai Central Rehabilitation Centre",
    priority: "critical",
    status: "acknowledged",
    deadline: "2024-03-10",
    issuedBy: "Dr. Rajesh Kumar",
    issuedAt: "2024-02-28",
    acknowledgements: [{ centreId: "C001", acknowledgedBy: "Mr. Anil Deshmukh", acknowledgedAt: "2024-03-01" }],
  },
]

// Helper functions
// Helper function to format date input (DD/MM/YYYY)
const formatDateInput = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return ""
  
  try {
    // If already in DD/MM/YYYY format, return as is
    if (typeof dateValue === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateValue.trim())) {
      const parts = dateValue.trim().split('/')
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0')
        const month = parts[1].padStart(2, '0')
        const year = parts[2]
        return `${day}/${month}/${year}`
      }
      return dateValue.trim()
    }
    
    // Try to parse YYYY-MM-DD format and convert to DD/MM/YYYY
    if (typeof dateValue === 'string') {
      const trimmed = dateValue.trim()
      const yyyymmddRegex = /^(\d{4})-(\d{2})-(\d{2})$/
      const yyyyMatch = trimmed.match(yyyymmddRegex)
      if (yyyyMatch) {
        const [, year, month, day] = yyyyMatch
        return `${day}/${month}/${year}`
      }
    }
    
    // Parse as Date object
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return ""
    
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch (error) {
    return ""
  }
}

// Helper function to parse DD/MM/YYYY to Date object
const parseDDMMYYYYDate = (dateString: string): Date | null => {
  if (!dateString) return null
  
  try {
    const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    const match = dateString.trim().match(ddmmyyyyRegex)
    if (match) {
      const [, day, month, year] = match
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    return null
  } catch (error) {
    return null
  }
}

// Helper function to auto-format date input as user types
const formatDateInputValue = (value: string): string => {
  // Remove all non-digits
  let digits = value.replace(/\D/g, '')
  
  // Limit to 8 digits (DDMMYYYY)
  if (digits.length > 8) {
    digits = digits.slice(0, 8)
  }
  
  // Add slashes automatically
  if (digits.length <= 2) {
    return digits
  } else if (digits.length <= 4) {
    return digits.slice(0, 2) + '/' + digits.slice(2)
  } else {
    return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8)
  }
}

const formatDate = (date: string) => {
  if (!date) return "N/A"
  
  // If already in DD/MM/YYYY format, return as is
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date.trim())) {
    return date.trim()
  }
  
  // Try to parse and format
  const parsedDate = parseDDMMYYYYDate(date) || new Date(date)
  if (isNaN(parsedDate.getTime())) return "N/A"
  
  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const year = parsedDate.getFullYear()
  return `${day}/${month}/${year}`
}

const calculateAge = (dob: string) => {
  if (!dob) return 0
  
  // Parse DD/MM/YYYY format
  const birthDate = parseDDMMYYYYDate(dob) || new Date(dob)
  if (isNaN(birthDate.getTime())) return 0
  
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

const formatStatus = (status: string) => {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

// Profile Form Component
const ProfileForm = ({ user, onUpdate, readOnly = false }: { user: User; onUpdate: (updatedUser: User) => void; readOnly?: boolean }) => {
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    dob: user.dob || "",
    age: user.age || "",
    aadharNumber: user.aadharNumber || "",
    address: user.address || "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Calculate age from DOB helper function (accepts DD/MM/YYYY format)
  const calculateAgeFromDOB = (dob: string): number | "" => {
    if (!dob) return ""
    const birthDate = parseDDMMYYYY(dob)
    if (!birthDate) return ""
    
    const today = new Date()
    if (birthDate > today) return ""
    
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age >= 0 && age <= 150 ? age : ""
  }

  // Format date for input (DD/MM/YYYY format)
  const formatDateForInput = (dateValue: string | Date | undefined): string => {
    if (!dateValue) return ""
    
    try {
      // If it's already a string in DD/MM/YYYY format, return as is
      if (typeof dateValue === 'string') {
        const trimmed = dateValue.trim()
        // Check if already in DD/MM/YYYY format
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
          // Normalize to DD/MM/YYYY with leading zeros
          const parts = trimmed.split('/')
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0')
            const month = parts[1].padStart(2, '0')
            const year = parts[2]
            return `${day}/${month}/${year}`
          }
          return trimmed
        }
        
        // Try to parse YYYY-MM-DD format and convert to DD/MM/YYYY
        const yyyymmddRegex = /^(\d{4})-(\d{2})-(\d{2})$/
        const match = trimmed.match(yyyymmddRegex)
        if (match) {
          const [, year, month, day] = match
          return `${day}/${month}/${year}`
        }
      }
      
      // Parse the date and format it as DD/MM/YYYY
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', dateValue)
        return ""
      }
      
      // Format as DD/MM/YYYY
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch (error) {
      console.error('Error formatting date:', error, dateValue)
      return ""
    }
  }
  
  // Convert DD/MM/YYYY to Date object for calculations
  const parseDDMMYYYY = (dateString: string): Date | null => {
    if (!dateString) return null
    
    try {
      const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
      const match = dateString.trim().match(ddmmyyyyRegex)
      if (match) {
        const [, day, month, year] = match
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        if (!isNaN(date.getTime())) {
          return date
        }
      }
      return null
    } catch (error) {
      return null
    }
  }

  // Update profileData when user prop changes
  useEffect(() => {
    setProfileData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      dob: formatDateForInput(user.dob),
      age: user.age || "",
      aadharNumber: user.aadharNumber || "",
      address: user.address || "",
    })
  }, [user])

  // Auto-calculate age when DOB changes
  useEffect(() => {
    if (profileData.dob && profileData.dob.trim() !== '') {
      const birthDate = parseDDMMYYYY(profileData.dob)
      if (birthDate) {
        const calculatedAge = calculateAgeFromDOB(profileData.dob)
        if (calculatedAge !== "" && calculatedAge !== profileData.age) {
          setProfileData(prev => ({ ...prev, age: calculatedAge }))
        }
      }
    }
    // Note: We don't clear age when DOB is cleared to allow manual age entry
  }, [profileData.dob]) // Only depend on dob, not age to avoid infinite loop

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Calculate age if DOB is provided
      let finalData: Record<string, string | number | undefined> = {}
      
      // Only include fields that have non-empty values
      if (profileData.name && profileData.name.trim() !== '') {
        finalData.name = profileData.name.trim()
      }
      if (profileData.phone && profileData.phone.trim() !== '') {
        finalData.phone = profileData.phone.trim()
      }
      if (profileData.dob && profileData.dob.trim() !== '') {
        const dobString = profileData.dob.trim()
        const birthDate = parseDDMMYYYY(dobString)
        
        // Validate date format (DD/MM/YYYY)
        if (!birthDate) {
          alert("Invalid date of birth format. Please use DD/MM/YYYY format (e.g., 15/05/1990).")
          setSaving(false)
          return
        }
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const normalizedBirthDate = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())
        normalizedBirthDate.setHours(0, 0, 0, 0)
        
        // Validate date is not in the future
        if (normalizedBirthDate > today) {
          alert("Date of birth cannot be in the future. Please enter a valid date.")
          setSaving(false)
          return
        }
        
        // Validate date is reasonable (not more than 150 years ago)
        const minDate = new Date()
        minDate.setFullYear(today.getFullYear() - 150)
        minDate.setHours(0, 0, 0, 0)
        if (normalizedBirthDate < minDate) {
          alert("Date of birth is too far in the past. Please enter a valid date.")
          setSaving(false)
          return
        }
        
        // Store in DD/MM/YYYY format
        finalData.dob = dobString
        // Calculate age from DOB
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        
        // Validate calculated age
        if (age < 0 || age > 150) {
          alert("Invalid age calculated from date of birth. Please check the date.")
          setSaving(false)
          return
        }
        
        finalData.age = age
      } else if (profileData.age && (typeof profileData.age === 'number' || (typeof profileData.age === 'string' && profileData.age.trim() !== ''))) {
        const ageNum = typeof profileData.age === 'number' ? profileData.age : parseInt(profileData.age)
        if (!isNaN(ageNum) && ageNum > 0) {
          finalData.age = ageNum
        }
      }
      if (profileData.aadharNumber && profileData.aadharNumber.trim() !== '') {
        finalData.aadharNumber = profileData.aadharNumber.trim()
      }
      if (profileData.address && profileData.address.trim() !== '') {
        finalData.address = profileData.address.trim()
      }

      // Ensure DOB is in correct format (DD/MM/YYYY) if provided
      if (finalData.dob && typeof finalData.dob === 'string') {
        const dobString = finalData.dob.trim()
        const birthDate = parseDDMMYYYY(dobString)
        
        // Validate date format (DD/MM/YYYY)
        if (!birthDate) {
          alert("Invalid date format. Please use DD/MM/YYYY format (e.g., 15/05/1990).")
          setSaving(false)
          return
        }
        
        // Normalize to DD/MM/YYYY format
        const day = String(birthDate.getDate()).padStart(2, '0')
        const month = String(birthDate.getMonth() + 1).padStart(2, '0')
        const year = birthDate.getFullYear()
        finalData.dob = `${day}/${month}/${year}`
      }

      const response = await usersAPI.updateProfile({
        userId: user.id,
        email: user.email,
        ...finalData,
      })

      if (response.success) {
        const updatedUser = { ...user, ...response.data }
        onUpdate(updatedUser)
        setIsEditing(false)
        alert("Profile updated successfully!")
      } else {
        alert(response.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      
      // Provide user-friendly error messages
      if (errorMessage.includes('pattern') || errorMessage.includes('validation')) {
        alert("Invalid data format. Please check all fields and ensure dates are in DD/MM/YYYY format (e.g., 15/05/1990).")
      } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        alert("User not found. Please refresh the page and try again.")
      } else {
        alert(`Error updating profile: ${errorMessage}. Please check the console for details.`)
      }
    } finally {
      setSaving(false)
    }
  }

  if (!isEditing) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="detail-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h4>Personal Information</h4>
            {!readOnly && (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Name</label>
              <span>{profileData.name || "Not set"}</span>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <span>{profileData.email || "Not set"}</span>
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <span>{profileData.phone || "Not set"}</span>
            </div>
            <div className="detail-item">
              <label>Date of Birth</label>
              <span>{profileData.dob || "Not set"}</span>
            </div>
            <div className="detail-item">
              <label>Age</label>
              <span>{profileData.age ? `${profileData.age} years` : "Not set"}</span>
            </div>
            <div className="detail-item">
              <label>Aadhar Number</label>
              <span>{profileData.aadharNumber || "Not set"}</span>
            </div>
            <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
              <label>Address</label>
              <span>{profileData.address || "Not set"}</span>
            </div>
            <div className="detail-item">
              <label>Employee Code</label>
              <span style={{ fontWeight: "600", color: "var(--navy-blue)" }}>{user.employeeCode || "Not assigned"}</span>
            </div>
            {user.role === "centre_admin" && user.centreName && (
              <>
                <div className="detail-item">
                  <label>Centre Name</label>
                  <span>{user.centreName}</span>
                </div>
                {user.centreCity && user.centreState && (
                  <div className="detail-item">
                    <label>Centre Location</label>
                    <span>{user.centreCity}, {user.centreState}</span>
                  </div>
                )}
              </>
            )}
            <div className="detail-item">
              <label>Role</label>
              <span className="badge badge-active">{user.role === "super_admin" ? "Super Admin" : "Centre Admin"}</span>
            </div>
            <div className="detail-item">
              <label>User ID</label>
              <span>{user.id}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <form onSubmit={handleSave}>
        <div className="detail-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h4>Edit Personal Information</h4>
            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
                disabled
                style={{ background: "var(--gray-100)", cursor: "not-allowed" }}
              />
              <small style={{ color: "var(--gray-600)", fontSize: "0.85rem" }}>Email cannot be changed</small>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Enter phone number"
                maxLength={10}
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="text"
                value={profileData.dob || ""}
                onChange={(e) => {
                  let value = e.target.value
                  // Allow only digits and slashes
                  value = value.replace(/[^\d\/]/g, '')
                  
                  // Auto-format as user types (DD/MM/YYYY)
                  if (value.length > 0 && !value.includes('/')) {
                    // Add slashes automatically
                    if (value.length <= 2) {
                      // DD
                      value = value
                    } else if (value.length <= 4) {
                      // DDMM
                      value = value.slice(0, 2) + '/' + value.slice(2)
                    } else if (value.length <= 8) {
                      // DDMMYYYY
                      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8)
                    } else {
                      // Limit to DD/MM/YYYY
                      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8)
                    }
                  }
                  
                  setProfileData({ ...profileData, dob: value })
                }}
                placeholder="DD/MM/YYYY"
                maxLength={10}
                pattern="\d{2}/\d{2}/\d{4}"
              />
              <small style={{ color: "var(--gray-600)", fontSize: "0.85rem" }}>
                Format: DD/MM/YYYY (e.g., 15/05/1990)
              </small>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={profileData.age || ""}
                onChange={(e) => {
                  const newAge = e.target.value === "" ? "" : parseInt(e.target.value)
                  setProfileData({ ...profileData, age: newAge })
                }}
                placeholder={profileData.dob ? "Auto-calculated from DOB" : "Enter age manually"}
                min={0}
                max={150}
                disabled={!!profileData.dob}
                style={profileData.dob ? { background: "var(--gray-100)", cursor: "not-allowed" } : {}}
              />
              <small style={{ color: "var(--gray-600)", fontSize: "0.85rem" }}>
                {profileData.dob 
                  ? "Auto-calculated from Date of Birth (cannot be edited)" 
                  : "Enter age manually or provide Date of Birth to auto-calculate"}
              </small>
            </div>
            <div className="form-group">
              <label>Aadhar Number</label>
              <input
                type="text"
                value={profileData.aadharNumber}
                onChange={(e) => setProfileData({ ...profileData, aadharNumber: e.target.value.replace(/\D/g, "").slice(0, 12) })}
                placeholder="12-digit Aadhar number"
                maxLength={12}
                pattern="[0-9]{12}"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              placeholder="Enter your address"
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [centres, setCentres] = useState<Centre[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [queries, setQueries] = useState<Query[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [pendingRegistrations, setPendingRegistrations] = useState<User[]>([])
  const [centreAdmins, setCentreAdmins] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)

  // Filters
  const [centreSearch, setCentreSearch] = useState("")
  const [stateFilter, setStateFilter] = useState("")
  const [patientSearch, setPatientSearch] = useState("")
  const [centreFilter, setCentreFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [queryStatusFilter, setQueryStatusFilter] = useState("")
  const [queryPriorityFilter, setQueryPriorityFilter] = useState("")
  const [querySearch, setQuerySearch] = useState("")
  const [orderStatusFilter, setOrderStatusFilter] = useState("")
  const [orderPriorityFilter, setOrderPriorityFilter] = useState("")
  const [orderSearch, setOrderSearch] = useState("")

  // Form states - using Record for flexible form handling
  const [formData, setFormData] = useState<Record<string, string | number | null | undefined>>({})

  useEffect(() => {
    const savedUser = localStorage.getItem("nrcms_current_user")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const fetchAllData = useCallback(async () => {
    if (!currentUser) return
    
    setLoading(true)
    try {
      // Fetch all data in parallel (without filters - filters applied client-side)
      // Use Promise.allSettled to handle individual failures gracefully
      const [centresResult, patientsResult, queriesResult, ordersResult] = await Promise.allSettled([
        centresAPI.getAll(
          currentUser.role,
          currentUser.centreId || undefined,
          undefined, // Fetch all, filter client-side
          undefined
        ),
        patientsAPI.getAll(
          currentUser.role,
          currentUser.centreId || undefined,
          undefined, // Fetch all, filter client-side
          undefined
        ),
        queriesAPI.getAll(
          currentUser.role,
          currentUser.centreId || undefined,
          undefined, // Fetch all, filter client-side
          undefined
        ),
        ordersAPI.getAll(
          currentUser.role,
          currentUser.centreId || undefined,
          undefined, // Fetch all, filter client-side
          undefined
        ),
      ])

      // Handle each result individually
      if (centresResult.status === 'fulfilled' && centresResult.value.success) {
        setCentres(centresResult.value.data || [])
      } else {
        console.error("Error fetching centres:", centresResult.status === 'rejected' ? centresResult.reason : centresResult.value)
        setCentres([])
      }

      if (patientsResult.status === 'fulfilled' && patientsResult.value.success) {
        setPatients(patientsResult.value.data || [])
      } else {
        console.error("Error fetching patients:", patientsResult.status === 'rejected' ? patientsResult.reason : patientsResult.value)
        setPatients([])
      }

      if (queriesResult.status === 'fulfilled' && queriesResult.value.success) {
        setQueries(queriesResult.value.data || [])
      } else {
        console.error("Error fetching queries:", queriesResult.status === 'rejected' ? queriesResult.reason : queriesResult.value)
        setQueries([])
      }

      if (ordersResult.status === 'fulfilled' && ordersResult.value.success) {
        setOrders(ordersResult.value.data || [])
      } else {
        console.error("Error fetching orders:", ordersResult.status === 'rejected' ? ordersResult.reason : ordersResult.value)
        setOrders([])
      }

      // Fetch pending registrations and centre admins for super admin
      if (currentUser.role === "super_admin") {
        fetchPendingRegistrations()
        fetchCentreAdmins()
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      // Don't fallback to initial data - keep empty arrays if API fails
      setCentres([])
      setPatients([])
      setQueries([])
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  // Fetch all data from database when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchAllData()
    } else {
      setLoading(false)
    }
  }, [currentUser, fetchAllData])

  // Refresh data when page changes (to ensure latest data)
  useEffect(() => {
    if (currentUser && currentPage) {
      fetchAllData()
    }
  }, [currentPage, currentUser, fetchAllData])

  const fetchPendingRegistrations = useCallback(async () => {
    if (!currentUser || currentUser.role !== "super_admin") return
    try {
      const response = await fetch(`/api/register?status=pending&role=${currentUser.role}`)
      const data = await response.json()
      if (data.success) {
        setPendingRegistrations(data.data)
      }
    } catch (error) {
      console.error("Error fetching registrations:", error)
    }
  }, [currentUser])

  const fetchCentreAdmins = useCallback(async () => {
    if (!currentUser || currentUser.role !== "super_admin") return
    try {
      const response = await registerAPI.getCentreAdmins(currentUser.role)
      if (response.success) {
        setCentreAdmins(response.data || [])
      }
    } catch (error) {
      console.error("Error fetching centre admins:", error)
    }
  }, [currentUser])

  // Fetch pending registrations and centre admins for super admin
  useEffect(() => {
    if (currentUser?.role === "super_admin") {
      fetchPendingRegistrations()
      fetchCentreAdmins()
    }
  }, [currentUser, fetchPendingRegistrations, fetchCentreAdmins])

  const handleApproveRegistration = async (userId: string, action: "approve" | "reject", rejectionReason?: string) => {
    try {
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action,
          role: currentUser?.role,
          approvedBy: currentUser?.name,
          rejectionReason,
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert(action === "approve" ? "Registration approved successfully!" : "Registration rejected.")
        fetchPendingRegistrations()
        // Refresh centres list if approved
        if (action === "approve") {
          window.location.reload()
        }
      } else {
        alert(data.error || "Failed to process registration")
      }
    } catch (error) {
      alert("Error processing registration")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    if (!password) {
      alert("Password is required")
      return
    }

    try {
      // Try to fetch user from database with password verification
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
      const data = await response.json()

      if (data.success && data.data) {
        const user = data.data
        // Check if user is approved (for centre admins)
        if (user.role === 'centre_admin' && user.status && user.status !== 'approved') {
          if (user.status === 'pending') {
            alert('Your registration is pending approval. Please wait for super admin approval.')
            return
          } else if (user.status === 'rejected') {
            alert(user.rejectionReason || 'Your registration has been rejected. Please contact support.')
            return
          }
        }
      setCurrentUser(user)
      localStorage.setItem("nrcms_current_user", JSON.stringify(user))
    } else {
        alert(data.error || "Invalid email or password!")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed. Please check your connection and try again.")
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("nrcms_current_user")
  }

  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title)
    setModalContent(content)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalTitle("")
    setModalContent(null)
    setFormData({})
  }

  // Filter functions
  const getFilteredCentres = () => {
    let filtered = centres
    if (currentUser?.role === "centre_admin") {
      filtered = filtered.filter((c) => c.id === currentUser.centreId)
    }
    if (centreSearch) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(centreSearch.toLowerCase()) ||
          c.id.toLowerCase().includes(centreSearch.toLowerCase()),
      )
    }
    if (stateFilter) {
      filtered = filtered.filter((c) => c.state === stateFilter)
    }
    return filtered
  }

  const getFilteredPatients = () => {
    let filtered = patients
    if (currentUser?.role === "centre_admin") {
      filtered = filtered.filter((p) => p.centreId === currentUser.centreId)
    }
    if (patientSearch) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
          p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
          p.aadharNumber.includes(patientSearch),
      )
    }
    if (centreFilter) {
      filtered = filtered.filter((p) => p.centreId === centreFilter)
    }
    if (statusFilter) {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }
    return filtered
  }

  const getFilteredQueries = () => {
    let filtered = queries
    if (currentUser?.role === "centre_admin") {
      filtered = filtered.filter((q) => q.centreId === currentUser.centreId)
    }
    if (queryStatusFilter) {
      filtered = filtered.filter((q) => q.status === queryStatusFilter)
    }
    if (queryPriorityFilter) {
      filtered = filtered.filter((q) => q.priority === queryPriorityFilter)
    }
    if (querySearch) {
      filtered = filtered.filter(
        (q) =>
          q.id.toLowerCase().includes(querySearch.toLowerCase()) ||
          q.subject.toLowerCase().includes(querySearch.toLowerCase()) ||
          (q.centreName && q.centreName.toLowerCase().includes(querySearch.toLowerCase()))
      )
    }
    return filtered
  }

  const getFilteredOrders = () => {
    let filtered = orders
    if (currentUser?.role === "centre_admin") {
      filtered = filtered.filter((o) => o.targetCentreId === currentUser.centreId || o.targetCentreId === null)
    }
    if (orderStatusFilter) {
      filtered = filtered.filter((o) => o.status === orderStatusFilter)
    }
    if (orderPriorityFilter) {
      filtered = filtered.filter((o) => o.priority === orderPriorityFilter)
    }
    if (orderSearch) {
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
          o.subject.toLowerCase().includes(orderSearch.toLowerCase()) ||
          (o.targetCentreName && o.targetCentreName.toLowerCase().includes(orderSearch.toLowerCase()))
      )
    }
    return filtered
  }

  // Stats
  const filteredCentresForStats =
    currentUser?.role === "centre_admin" ? centres.filter((c) => c.id === currentUser.centreId) : centres
  const filteredPatientsForStats =
    currentUser?.role === "centre_admin" ? patients.filter((p) => p.centreId === currentUser.centreId) : patients
  const filteredQueriesForStats =
    currentUser?.role === "centre_admin" ? queries.filter((q) => q.centreId === currentUser.centreId) : queries
  const filteredOrdersForStats =
    currentUser?.role === "centre_admin"
      ? orders.filter((o) => o.targetCentreId === currentUser.centreId || o.targetCentreId === null)
      : orders

  const stats = {
    totalCentres: filteredCentresForStats.length,
    totalPatients: filteredPatientsForStats.length,
    totalStates: [...new Set(filteredCentresForStats.map((c) => c.state))].length,
    pendingQueries: filteredQueriesForStats.filter((q) => q.status === "open" || q.status === "in_progress").length,
  }

  const centresByState = INDIAN_STATES.map((state) => ({
    state,
    count: filteredCentresForStats.filter((c) => c.state === state).length,
  })).filter((s) => s.count > 0)

  const patientsByStatus = [
    {
      status: "admitted",
      count: filteredPatientsForStats.filter((p) => p.status === "admitted").length,
      color: "#3b82f6",
    },
    {
      status: "under_treatment",
      count: filteredPatientsForStats.filter((p) => p.status === "under_treatment").length,
      color: "#f59e0b",
    },
    {
      status: "recovering",
      count: filteredPatientsForStats.filter((p) => p.status === "recovering").length,
      color: "#10b981",
    },
    {
      status: "discharged",
      count: filteredPatientsForStats.filter((p) => p.status === "discharged").length,
      color: "#6b7280",
    },
  ]

  const addictionStats = ADDICTION_TYPES.map((type) => ({
    type,
    count: filteredPatientsForStats.filter((p) => p.addictionType === type).length,
  })).filter((a) => a.count > 0)

  // CRUD Operations
  const saveCentre = async (isEdit: boolean, centreId?: string) => {
    // Access control: Centre admin can only update their own centre
    if (currentUser?.role === "centre_admin") {
      if (!isEdit || !centreId || centreId !== currentUser.centreId) {
        alert("You can only update your own centre details!")
        return
      }
    } else if (currentUser?.role !== "super_admin") {
      alert("Only super admin can manage centres!")
      return
    }

    try {
      if (isEdit && centreId) {
        const response = await centresAPI.update({
          ...formData,
          id: centreId,
          role: currentUser?.role,
          centreId: currentUser?.role === "centre_admin" ? currentUser.centreId : centreId,
        })
        if (response.success) {
          await fetchAllData() // Refresh data
          alert("Centre updated successfully!")
        } else {
          alert(response.error || "Failed to update centre")
        }
      } else {
        // Only super admin can create centres
        if (currentUser?.role !== "super_admin") {
          alert("Only super admin can create centres!")
          return
        }
        const response = await centresAPI.create({
          ...formData,
          role: currentUser.role,
        })
        if (response.success) {
          await fetchAllData() // Refresh data
          alert("Centre created successfully!")
        } else {
          alert(response.error || "Failed to create centre")
        }
      }
      closeModal()
    } catch (error) {
      console.error("Error saving centre:", error)
      alert("Error saving centre. Please try again.")
    }
  }

  const deleteCentre = async (id: string) => {
    // Access control: Only super admin can delete centres
    if (currentUser?.role !== "super_admin") {
      alert("Only super admin can delete centres!")
      return
    }

    if (confirm("Are you sure you want to delete this centre?")) {
      try {
        const response = await centresAPI.delete(id, currentUser.role)
        if (response.success) {
          await fetchAllData() // Refresh data
          alert("Centre deleted successfully!")
        } else {
          alert(response.error || "Failed to delete centre")
        }
      } catch (error) {
        console.error("Error deleting centre:", error)
        alert("Error deleting centre. Please try again.")
      }
    }
  }

  const savePatient = async (isEdit: boolean, patientId?: string) => {
    // Access control: Centre admin can only manage patients from their centre
    if (currentUser?.role === "centre_admin") {
      // Validate that centreId exists for centre admin
      if (!currentUser.centreId) {
        alert("Error: Centre ID not found. Please contact support.")
        return
      }
      
      if (isEdit && patientId) {
        const existingPatient = patients.find((p) => p.id === patientId)
        if (existingPatient && existingPatient.centreId !== currentUser.centreId) {
          alert("You don't have permission to edit patients from other centres!")
          return
        }
        // Ensure centre admin cannot change the centreId
        formData.centreId = currentUser.centreId
      } else {
        // New patient must belong to centre admin's centre
        formData.centreId = currentUser.centreId
      }
    }

    try {
      const age = calculateAge((formData.dob as string) || "")
      // Build patient data - ensure role and centreId are included
      const patientData: Record<string, unknown> = {
        ...formData,
        age,
        role: currentUser?.role || "",
        centreId: currentUser?.role === "centre_admin" ? currentUser.centreId : (formData.centreId as string),
      }
      
      // Ensure centreId is set for centre admin
      if (currentUser?.role === "centre_admin") {
        if (!currentUser.centreId) {
          alert("Error: Centre ID not found. Please contact support.")
          return
        }
        patientData.centreId = currentUser.centreId
      }

      if (isEdit && patientId) {
        const response = await patientsAPI.update({
          ...patientData,
          id: patientId,
        })
        if (response.success) {
          await fetchAllData() // Refresh data
          alert("Patient updated successfully!")
        } else {
          alert(response.error || "Failed to update patient")
        }
      } else {
        const response = await patientsAPI.create(patientData)
        if (response.success) {
          await fetchAllData() // Refresh data
          alert("Patient created successfully!")
        } else {
          alert(response.error || "Failed to create patient")
        }
    }
    closeModal()
    } catch (error) {
      console.error("Error saving patient:", error)
      alert("Error saving patient. Please try again.")
    }
  }

  const deletePatient = async (id: string) => {
    // Access control: Centre admin can only delete patients from their centre
    if (currentUser?.role === "centre_admin") {
      const patient = patients.find((p) => p.id === id)
      if (patient && patient.centreId !== currentUser.centreId) {
        alert("You don't have permission to delete patients from other centres!")
        return
      }
    }

    if (confirm("Are you sure you want to delete this patient?")) {
      try {
        const response = await patientsAPI.delete(id, currentUser?.role || "", currentUser?.centreId || undefined)
        if (response.success) {
          await fetchAllData() // Refresh data
          alert("Patient deleted successfully!")
        } else {
          alert(response.error || "Failed to delete patient")
        }
      } catch (error) {
        console.error("Error deleting patient:", error)
        alert("Error deleting patient. Please try again.")
      }
    }
  }

  const saveQuery = async () => {
    // Access control: Centre admin can only create queries for their centre
    if (currentUser?.role === "centre_admin") {
      if (!currentUser.centreId) {
        alert("Error: Centre ID not found. Please contact support.")
        return
      }
      formData.centreId = currentUser.centreId
    }

    try {
      const response = await queriesAPI.create({
        ...formData,
        createdBy: currentUser?.name || "",
        role: currentUser?.role,
        centreId: currentUser?.role === "centre_admin" ? currentUser.centreId : formData.centreId,
      })
      if (response.success) {
        await fetchAllData() // Refresh data
        alert("Query submitted successfully!")
        closeModal()
      } else {
        alert(response.error || "Failed to submit query")
      }
    } catch (error) {
      console.error("Error saving query:", error)
      alert("Error submitting query. Please try again.")
    }
  }

  const addQueryResponse = async (queryId: string, message: string) => {
    // Access control: Centre admin can only respond to queries from their centre
    if (currentUser?.role === "centre_admin") {
      if (!currentUser.centreId) {
        alert("Error: Centre ID not found. Please contact support.")
        return
      }
      const query = queries.find((q) => q.id === queryId)
      if (query && query.centreId !== currentUser.centreId) {
        alert("You don't have permission to respond to queries from other centres!")
        return
      }
    }

    try {
      const response = await queriesAPI.addResponse({
        queryId,
        message,
        respondedBy: currentUser?.name || "",
        role: currentUser?.role,
        centreId: currentUser?.role === "centre_admin" ? currentUser.centreId : undefined,
      })
      if (response.success) {
        await fetchAllData() // Refresh data
        alert("Response added successfully!")
      } else {
        alert(response.error || "Failed to add response")
      }
    } catch (error) {
      console.error("Error adding response:", error)
      alert("Error adding response. Please try again.")
    }
  }

  const updateQueryStatus = async (queryId: string, status: Query["status"]) => {
    // Access control: Only super admin can update query status
    if (currentUser?.role !== "super_admin") {
      alert("Only super admin can update query status!")
      return
    }
    try {
      const response = await queriesAPI.updateStatus({
        id: queryId,
        status,
        role: currentUser.role,
      })
      if (response.success) {
        await fetchAllData() // Refresh data
      } else {
        alert(response.error || "Failed to update query status")
      }
    } catch (error) {
      console.error("Error updating query status:", error)
      alert("Error updating query status. Please try again.")
    }
  }

  const saveOrder = async () => {
    // Access control: Only super admin can create orders
    if (currentUser?.role !== "super_admin") {
      alert("Only super admin can issue orders!")
      return
    }

    try {
      const response = await ordersAPI.create({
      ...formData,
      issuedBy: currentUser?.name || "",
        role: currentUser.role,
      })
      if (response.success) {
        await fetchAllData() // Refresh data
        alert("Order issued successfully!")
    closeModal()
      } else {
        alert(response.error || "Failed to issue order")
      }
    } catch (error) {
      console.error("Error saving order:", error)
      alert("Error issuing order. Please try again.")
    }
  }

  const acknowledgeOrder = async (orderId: string) => {
    // Access control: Centre admin can only acknowledge orders for their centre
    if (currentUser?.role === "centre_admin") {
      if (!currentUser.centreId) {
        alert("Error: Centre ID not found. Please contact support.")
        return
      }
      const order = orders.find((o) => o.id === orderId)
      if (order && order.targetCentreId !== null && order.targetCentreId !== currentUser.centreId) {
        alert("You don't have permission to acknowledge orders for other centres!")
        return
      }
    }

    try {
      const response = await ordersAPI.acknowledge({
        orderId,
        acknowledgedBy: currentUser?.name || "",
        role: currentUser?.role,
        centreId: currentUser?.role === "centre_admin" ? currentUser.centreId : undefined,
      })
      if (response.success) {
        await fetchAllData() // Refresh data
        alert("Order acknowledged successfully!")
      } else {
        alert(response.error || "Failed to acknowledge order")
      }
    } catch (error) {
      console.error("Error acknowledging order:", error)
      alert("Error acknowledging order. Please try again.")
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    // Access control: Centre admin can only update orders for their centre
    if (currentUser?.role === "centre_admin") {
      if (!currentUser.centreId) {
        alert("Error: Centre ID not found. Please contact support.")
        return
      }
      const order = orders.find((o) => o.id === orderId)
      if (order && order.targetCentreId !== null && order.targetCentreId !== currentUser.centreId) {
        alert("You don't have permission to update orders for other centres!")
        return
      }
      // Centre admin can only mark as completed, not other statuses
      if (status !== "completed") {
        alert("You can only mark orders as completed!")
        return
      }
    }

    try {
      const response = await ordersAPI.updateStatus({
        id: orderId,
        status,
        role: currentUser?.role,
        centreId: currentUser?.role === "centre_admin" ? currentUser.centreId : undefined,
      })
      if (response.success) {
        await fetchAllData() // Refresh data
      } else {
        alert(response.error || "Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Error updating order status. Please try again.")
    }
  }

  const addMedication = async (patientId: string) => {
    // Access control: Centre admin can only add medications to patients from their centre
    if (currentUser?.role === "centre_admin") {
      const patient = patients.find((p) => p.id === patientId)
      if (patient && patient.centreId !== currentUser.centreId) {
        alert("You don't have permission to add medications to patients from other centres!")
        return
      }
    }

    try {
      const response = await patientsAPI.addMedication({
        patientId,
        medication: formData,
        role: currentUser?.role,
        centreId: currentUser?.centreId || undefined,
      })
      if (response.success) {
        await fetchAllData() // Refresh data
        alert("Medication added successfully!")
    closeModal()
      } else {
        alert(response.error || "Failed to add medication")
      }
    } catch (error) {
      console.error("Error adding medication:", error)
      alert("Error adding medication. Please try again.")
    }
  }

  // Form Components
  const CentreForm = ({ centre }: { centre?: Centre }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        saveCentre(!!centre, centre?.id)
      }}
    >
      <div className="form-row">
        <div className="form-group">
          <label>Centre Name *</label>
          <input
            type="text"
            value={(formData.name as string) || centre?.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>State *</label>
          <select
            value={(formData.state as string) || centre?.state || ""}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
            disabled={currentUser?.role === "centre_admin" && !!centre}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {currentUser?.role === "centre_admin" && !!centre && (
            <small style={{ color: "var(--gray-500)", fontSize: "0.85rem", display: "block", marginTop: "4px" }}>
              State cannot be changed (affects centre ID)
            </small>
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            value={(formData.city as string) || centre?.city || ""}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Capacity *</label>
          <input
            type="number"
            value={(formData.capacity as number) || centre?.capacity || ""}
            onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label>Address *</label>
        <textarea
            value={(formData.address as string) || centre?.address || ""}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={2}
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            value={(formData.phone as string) || centre?.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={(formData.email as string) || centre?.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Administrator Name *</label>
          <input
            type="text"
            value={(formData.administrator as string) || centre?.administrator || ""}
            onChange={(e) => setFormData({ ...formData, administrator: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Administrator Email *</label>
          <input
            type="email"
            value={(formData.adminEmail as string) || centre?.adminEmail || ""}
            onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label>Status *</label>
        <select
          value={(formData.status as string) || centre?.status || "active"}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {centre ? "Update" : "Add"} Centre
        </button>
      </div>
    </form>
  )

  const PatientForm = ({ patient }: { patient?: Patient }) => {
    const availableCentres =
      currentUser?.role === "centre_admin" ? centres.filter((c) => c.id === currentUser.centreId) : centres
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          savePatient(!!patient, patient?.id)
        }}
      >
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={(formData.name as string) || patient?.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="text"
              value={formatDateInput((formData.dob as string) || patient?.dob || "")}
              onChange={(e) => {
                const formatted = formatDateInputValue(e.target.value)
                setFormData({ ...formData, dob: formatted })
              }}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              required
            />
            <small style={{ color: "var(--gray-600)", fontSize: "0.85rem" }}>
              Format: DD/MM/YYYY (e.g., 15/05/1990)
            </small>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Gender *</label>
            <select
              value={(formData.gender as string) || patient?.gender || ""}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              value={(formData.phone as string) || patient?.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Address *</label>
          <textarea
            value={(formData.address as string) || patient?.address || ""}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={2}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Aadhar Number *</label>
            <input
              type="text"
              value={(formData.aadharNumber as string) || patient?.aadharNumber || ""}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
              placeholder="XXXX-XXXX-XXXX"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={(formData.email as string) || patient?.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Family Contact Name *</label>
            <input
              type="text"
              value={(formData.familyContactName as string) || patient?.familyContactName || ""}
              onChange={(e) => setFormData({ ...formData, familyContactName: e.target.value })}
              placeholder="Name (Relation)"
              required
            />
          </div>
          <div className="form-group">
            <label>Family Phone *</label>
            <input
              type="tel"
              value={(formData.familyContactPhone as string) || patient?.familyContactPhone || ""}
              onChange={(e) => setFormData({ ...formData, familyContactPhone: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Addiction Type *</label>
            <select
              value={(formData.addictionType as string) || patient?.addictionType || ""}
              onChange={(e) => setFormData({ ...formData, addictionType: e.target.value })}
              required
            >
              <option value="">Select</option>
              {ADDICTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Centre *</label>
            <select
              value={(formData.centreId as string) || patient?.centreId || (currentUser?.role === "centre_admin" ? currentUser.centreId : "") || ""}
              onChange={(e) => setFormData({ ...formData, centreId: e.target.value })}
              required
              disabled={currentUser?.role === "centre_admin"}
            >
              <option value="">Select Centre</option>
              {availableCentres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {currentUser?.role === "centre_admin" && (
              <small style={{ color: "var(--gray-500)", fontSize: "0.85rem", display: "block", marginTop: "4px" }}>
                Centre is fixed to your assigned centre
              </small>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Admission Date *</label>
            <input
              type="text"
              value={formatDateInput((formData.admissionDate as string) || patient?.admissionDate || "")}
              onChange={(e) => {
                const formatted = formatDateInputValue(e.target.value)
                setFormData({ ...formData, admissionDate: formatted })
              }}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              required
            />
            <small style={{ color: "var(--gray-600)", fontSize: "0.85rem" }}>
              Format: DD/MM/YYYY (e.g., 15/05/2024)
            </small>
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select
              value={(formData.status as string) || patient?.status || "admitted"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="admitted">Admitted</option>
              <option value="under_treatment">Under Treatment</option>
              <option value="recovering">Recovering</option>
              <option value="discharged">Discharged</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={closeModal}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {patient ? "Update" : "Add"} Patient
          </button>
        </div>
      </form>
    )
  }

  const QueryForm = () => {
    const availableCentres =
      currentUser?.role === "centre_admin" ? centres.filter((c) => c.id === currentUser.centreId) : centres
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          saveQuery()
        }}
      >
        <div className="form-group">
          <label>Centre *</label>
          <select
            value={(formData.centreId as string) || (currentUser?.role === "centre_admin" ? currentUser.centreId : "") || ""}
            onChange={(e) => setFormData({ ...formData, centreId: e.target.value })}
            required
            disabled={currentUser?.role === "centre_admin"}
          >
            <option value="">Select Centre</option>
            {availableCentres.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Subject *</label>
          <input
            type="text"
            value={(formData.subject as string) || ""}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea
            className="response-textarea"
            value={(formData.description as string) || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
            placeholder="Describe your query in detail..."
          />
        </div>
        <div className="form-group">
          <label>Priority *</label>
          <select
            value={(formData.priority as string) || "medium"}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={closeModal}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit Query
          </button>
        </div>
      </form>
    )
  }

  const OrderForm = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        saveOrder()
      }}
    >
      <div className="form-group">
        <label>Target Centre</label>
        <select
          value={formData.targetCentreId || ""}
          onChange={(e) => setFormData({ ...formData, targetCentreId: e.target.value || null })}
        >
          <option value="">All Centres</option>
          {centres.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Subject *</label>
        <input
          type="text"
          value={formData.subject || ""}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Instructions *</label>
        <textarea
          className="response-textarea"
          value={formData.instruction || ""}
          onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
          rows={4}
          required
          placeholder="Enter detailed instructions for the centres..."
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Priority *</label>
          <select
            value={formData.priority || "medium"}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="form-group">
          <label>Deadline *</label>
          <input
            type="text"
            value={formatDateInput(String(formData.deadline || ""))}
            onChange={(e) => {
              const formatted = formatDateInputValue(e.target.value)
              setFormData({ ...formData, deadline: formatted })
            }}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            required
          />
          <small style={{ color: "var(--gray-600)", fontSize: "0.85rem" }}>
            Format: DD/MM/YYYY (e.g., 15/05/2024)
          </small>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Issue Order
        </button>
      </div>
    </form>
  )

  const MedicationForm = ({ patientId }: { patientId: string }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        addMedication(patientId)
      }}
    >
      <div className="form-row">
        <div className="form-group">
          <label>Medication Name *</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Dosage *</label>
          <input
            type="text"
            value={formData.dosage || ""}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            placeholder="e.g., 50mg"
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Frequency *</label>
          <input
            type="text"
            value={formData.frequency || ""}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            placeholder="e.g., Once daily"
            required
          />
        </div>
        <div className="form-group">
          <label>Start Date *</label>
          <input
            type="text"
            value={formatDateInput(String(formData.startDate || ""))}
            onChange={(e) => {
              const formatted = formatDateInputValue(e.target.value)
              setFormData({ ...formData, startDate: formatted })
            }}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label>Prescribed By *</label>
        <input
          type="text"
          value={formData.prescribedBy || ""}
          onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
          required
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Add Medication
        </button>
      </div>
    </form>
  )

  const PatientDetails = ({ patient }: { patient: Patient }) => {
    // Access control: Centre admin can only view patients from their centre
    if (currentUser?.role === "centre_admin" && patient.centreId !== currentUser.centreId) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "var(--red)" }}>
          <h3>Access Denied</h3>
          <p>You don't have permission to view patients from other centres.</p>
        </div>
      )
    }

    const centre = centres.find((c) => c.id === patient.centreId)
    return (
      <div className="patient-details">
        <div className="detail-section">
          <h4>Personal Information</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Patient ID</label>
              <span>{patient.id}</span>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <span className={`badge badge-${patient.status}`}>{formatStatus(patient.status)}</span>
            </div>
            <div className="detail-item">
              <label>Date of Birth</label>
              <span>{formatDate(patient.dob)}</span>
            </div>
            <div className="detail-item">
              <label>Age</label>
              <span>{patient.age || calculateAge(patient.dob)} years</span>
            </div>
            <div className="detail-item">
              <label>Gender</label>
              <span>{patient.gender}</span>
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <span>{patient.phone}</span>
            </div>
            <div className="detail-item">
              <label>Address</label>
              <span>{patient.address}</span>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <span>{patient.email || "N/A"}</span>
            </div>
          </div>
        </div>
        <div className="detail-section">
          <h4>Identity & Emergency Contact</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Aadhar Number</label>
              <span>{patient.aadharNumber}</span>
            </div>
            <div className="detail-item">
              <label>Family Contact</label>
              <span>{patient.familyContactName}</span>
            </div>
            <div className="detail-item">
              <label>Family Phone</label>
              <span>{patient.familyContactPhone}</span>
            </div>
          </div>
        </div>
        <div className="detail-section">
          <h4>Treatment Information</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Centre</label>
              <span>{centre?.name || "Unknown"}</span>
            </div>
            <div className="detail-item">
              <label>Addiction Type</label>
              <span>{patient.addictionType}</span>
            </div>
            <div className="detail-item">
              <label>Admission Date</label>
              <span>{formatDate(patient.admissionDate)}</span>
            </div>
          </div>
        </div>
        <div className="detail-section">
          <div className="section-header">
            <h4>Medications</h4>
            <button
              className="btn btn-primary btn-small"
              onClick={() => {
                setFormData({})
                openModal("Add Medication", <MedicationForm patientId={patient.id} />)
              }}
            >
              + Add Medication
            </button>
          </div>
          {patient.medications.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Prescribed By</th>
                  <th>Start Date</th>
                </tr>
              </thead>
              <tbody>
                {patient.medications.map((med) => (
                  <tr key={med.id}>
                    <td>{med.name}</td>
                    <td>{med.dosage}</td>
                    <td>{med.frequency}</td>
                    <td>{med.prescribedBy}</td>
                    <td>{formatDate(med.startDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-text">No medications prescribed yet.</p>
          )}
        </div>
      </div>
    )
  }

  const QueryDetails = ({ query }: { query: Query }) => {
    const [responseText, setResponseText] = useState("")
    return (
      <div className="query-details">
        <div className="detail-section">
          <div className="detail-grid">
            <div className="detail-item">
              <label>Query ID</label>
              <span>{query.id}</span>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <span className={`badge badge-${query.status}`}>{formatStatus(query.status)}</span>
            </div>
            <div className="detail-item">
              <label>Priority</label>
              <span className={`badge priority-${query.priority}`}>{query.priority.toUpperCase()}</span>
            </div>
            <div className="detail-item">
              <label>Centre</label>
              <span>{query.centreName}</span>
            </div>
            <div className="detail-item">
              <label>Created By</label>
              <span>{query.createdBy}</span>
            </div>
            <div className="detail-item">
              <label>Created On</label>
              <span>{formatDate(query.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="detail-section">
          <h4>Subject</h4>
          <p>{query.subject}</p>
        </div>
        <div className="detail-section">
          <h4>Description</h4>
          <p>{query.description}</p>
        </div>
        <div className="detail-section">
          <h4>Responses</h4>
          {query.responses.length > 0 ? (
            <div className="responses-list">
              {query.responses.map((res) => (
                <div key={res.id} className={`response-item ${res.isAdmin ? "admin-response" : ""}`}>
                  <div className="response-header">
                    <strong>{res.respondedBy}</strong>
                    <span>{formatDate(res.respondedAt)}</span>
                  </div>
                  <p>{res.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No responses yet.</p>
          )}
        </div>
        <div className="detail-section response-section">
          <h4>Add Response</h4>
          <textarea
            className="response-textarea"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            rows={4}
            placeholder="Type your response here..."
          />
          <div className="form-actions">
            {currentUser?.role === "super_admin" && (
              <select
                className="status-dropdown"
                onChange={(e) => {
                  if (e.target.value) {
                    updateQueryStatus(query.id, e.target.value as Query["status"])
                    closeModal()
                  }
                }}
                defaultValue=""
              >
                <option value="">Change Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            )}
            <button
              className="btn btn-primary"
              onClick={() => {
                if (responseText.trim()) {
                  addQueryResponse(query.id, responseText)
                  setResponseText("")
                }
              }}
            >
              Send Response
            </button>
          </div>
        </div>
      </div>
    )
  }

  const OrderDetails = ({ order }: { order: Order }) => (
    <div className="order-details">
      <div className="detail-section">
        <div className="detail-grid">
          <div className="detail-item">
            <label>Order ID</label>
            <span>{order.id}</span>
          </div>
          <div className="detail-item">
            <label>Status</label>
            <span className={`badge badge-${order.status}`}>{formatStatus(order.status)}</span>
          </div>
          <div className="detail-item">
            <label>Priority</label>
            <span className={`badge priority-${order.priority}`}>{order.priority.toUpperCase()}</span>
          </div>
          <div className="detail-item">
            <label>Target</label>
            <span>{order.targetCentreName}</span>
          </div>
          <div className="detail-item">
            <label>Issued By</label>
            <span>{order.issuedBy}</span>
          </div>
          <div className="detail-item">
            <label>Issued On</label>
            <span>{formatDate(order.issuedAt)}</span>
          </div>
          <div className="detail-item">
            <label>Deadline</label>
            <span>{formatDate(order.deadline)}</span>
          </div>
        </div>
      </div>
      <div className="detail-section">
        <h4>Subject</h4>
        <p>{order.subject}</p>
      </div>
      <div className="detail-section">
        <h4>Instructions</h4>
        <p>{order.instruction}</p>
      </div>
      {order.acknowledgements.length > 0 && (
        <div className="detail-section">
          <h4>Acknowledgements</h4>
          <div className="ack-list">
            {order.acknowledgements.map((ack, i) => (
              <div key={i} className="ack-item">
                <span>{ack.acknowledgedBy}</span>
                <span>{formatDate(ack.acknowledgedAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="form-actions">
        {currentUser?.role === "centre_admin" && order.status === "issued" && (
          <button
            className="btn btn-primary"
            onClick={() => {
              acknowledgeOrder(order.id)
              closeModal()
            }}
          >
            Acknowledge Order
          </button>
        )}
        {currentUser?.role === "centre_admin" && order.status === "acknowledged" && (
          <button
            className="btn btn-success"
            onClick={() => {
              updateOrderStatus(order.id, "completed")
              closeModal()
            }}
          >
            Mark as Completed
          </button>
        )}
        {currentUser?.role === "super_admin" && (
          <select
            className="status-dropdown"
            onChange={(e) => {
              if (e.target.value) {
                updateOrderStatus(order.id, e.target.value as Order["status"])
                closeModal()
              }
            }}
            defaultValue=""
          >
            <option value="">Change Status</option>
            <option value="issued">Issued</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        )}
      </div>
    </div>
  )

  // Login Page
  if (!currentUser) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <div className="emblem">
              <div className="ashoka-chakra"></div>
            </div>
            <h1>NRCMS</h1>
            <p>National Rehabilitation Centre Management System</p>
            <span className="govt-text">Government of India</span>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" required />
              <div style={{ textAlign: "right", marginTop: "8px" }}>
                <a
                  href="/forgot-password"
                  style={{
                    color: "var(--navy-blue)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                  }}
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              Sign In
            </button>
            <div className="demo-credentials">
              <p><strong>Demo Credentials:</strong></p>
              <p>Super Admin: admin@rehab.gov.in</p>
              <p>password: admin123</p>
              <p>Centre Admin: anil.deshmukh@rehab.gov.in</p>
              <p>password: admin123</p>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--gray-200)" }}>
              <p style={{ color: "var(--gray-600)", marginBottom: "10px" }}>New Centre Admin?</p>
              <a
                href="/register"
                style={{
                  color: "var(--navy-blue)",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                }}
              >
                Register Your Centre →
              </a>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Helper function to open add query modal
  const openAddQueryModal = () => {
    // Reset formData first - ensure it's completely empty for new query
    const initialData: Record<string, string | number | null | undefined> = {}
    if (currentUser?.role === "centre_admin" && currentUser.centreId) {
      initialData.centreId = currentUser.centreId
    }
    setFormData(initialData)
    openModal("Raise Query", <QueryForm />)
  }

  // Helper function to open add order modal
  const openAddOrderModal = () => {
    setFormData({})
    openModal("Issue Order", <OrderForm />)
  }

  // Main Application
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className="ashoka-chakra small"></div>
            <span>NRCMS</span>
          </div>
          <nav className="nav">
            <a
              href="#"
              className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage("dashboard")
              }}
            >
              Dashboard
            </a>
            {currentUser?.role === "super_admin" && (
              <a
                href="#"
                className={`nav-link ${currentPage === "centres" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage("centres")
                }}
              >
                Centres
              </a>
            )}
            {currentUser?.role === "centre_admin" && (
              <a
                href="#"
                className={`nav-link ${currentPage === "my-centre" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage("my-centre")
                }}
              >
                My Centre
              </a>
            )}
            <a
              href="#"
              className={`nav-link ${currentPage === "patients" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage("patients")
              }}
            >
              Patients
            </a>
            <a
              href="#"
              className={`nav-link ${currentPage === "support" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage("support")
              }}
            >
              Support
            </a>
            <a
              href="#"
              className={`nav-link ${currentPage === "orders" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage("orders")
              }}
            >
              Orders
            </a>
            {currentUser?.role === "super_admin" && (
              <a
                href="#"
                className={`nav-link ${currentPage === "approvals" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage("approvals")
                }}
              >
                Approvals
                {pendingRegistrations.length > 0 && (
                  <span style={{
                    marginLeft: "8px",
                    background: "var(--red)",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "0.75rem",
                  }}>
                    {pendingRegistrations.length}
                  </span>
                )}
              </a>
            )}
            <a
              href="#"
              className={`nav-link ${currentPage === "profile" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage("profile")
              }}
            >
              Profile
            </a>
            {currentUser?.role === "super_admin" && (
              <a
                href="#"
                className={`nav-link ${currentPage === "centre-admins" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage("centre-admins")
                }}
              >
                Centre Admins
              </a>
            )}
          </nav>
        </div>
        <div className="header-right">
          <span className="user-info">
            {currentUser.name} ({currentUser.role === "super_admin" ? "Super Admin" : "Centre Admin"})
          </span>
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard */}
      {currentPage === "dashboard" && (
        <div className="page-content">
          <div className="page-header">
            <h1>Dashboard</h1>
            <p>
              {currentUser?.role === "centre_admin"
                ? `Overview of ${filteredCentresForStats[0]?.name || "your centre"}`
                : "Overview of rehabilitation centres across India"}
            </p>
          </div>
          <div className="stats-grid">
            <div className="stat-card saffron">
              <div className="stat-icon">🏥</div>
              <div className="stat-info">
                <h3>{stats.totalCentres}</h3>
                <p>{currentUser?.role === "centre_admin" ? "Your Centre" : "Total Centres"}</p>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalPatients}</h3>
                <p>Total Patients</p>
              </div>
            </div>
            <div className="stat-card blue">
              <div className="stat-icon">📍</div>
              <div className="stat-info">
                <h3>{stats.totalStates}</h3>
                <p>{currentUser?.role === "centre_admin" ? "State" : "States Covered"}</p>
              </div>
            </div>
            <div className="stat-card purple">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>{stats.pendingQueries}</h3>
                <p>Pending Queries</p>
              </div>
            </div>
          </div>
          <div className="dashboard-grid">
            <div className="card">
              <h3>Centres by State</h3>
              <div className="chart-bars">
                {centresByState.map((s) => (
                  <div key={s.state} className="bar-item">
                    <span className="bar-label">{s.state}</span>
                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{ width: `${(s.count / Math.max(...centresByState.map((x) => x.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="bar-value">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>Patient Status</h3>
              <div className="status-legend">
                {patientsByStatus.map((s) => (
                  <div key={s.status} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: s.color }}></span>
                    <span>
                      {formatStatus(s.status)}: {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>Addiction Types</h3>
              <div className="addiction-stats">
                {addictionStats.map((a) => (
                  <div key={a.type} className="addiction-item">
                    <span>{a.type}</span>
                    <span className="count">{a.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>Recent Orders</h3>
              <div className="recent-list">
                {filteredOrdersForStats.slice(0, 3).map((o) => (
                  <div key={o.id} className="recent-item">
                    <span className={`badge priority-${o.priority}`}>{o.priority}</span>
                    <span>{o.subject}</span>
                  </div>
                ))}
                {filteredOrdersForStats.length === 0 && <p className="no-data">No orders yet</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Centre page for centre admin to view/edit their own centre */}
      {currentPage === "my-centre" && currentUser?.role === "centre_admin" && (
        <div className="page-content">
          <div className="page-header">
            <h1>My Centre</h1>
            <p>View and manage your rehabilitation centre details</p>
          </div>
          {(() => {
            const myCentre = centres.find((c) => c.id === currentUser.centreId)
            if (!myCentre) return <p>Centre not found</p>
            // Function to open edit modal
            const openEditCentreModal = (centreToEdit: Centre) => {
              setFormData(centreToEdit as unknown as Record<string, string | number | null | undefined>)
              openModal("Edit Centre Details", <CentreForm centre={centreToEdit} />)
            }
            return (
              <div className="centre-detail-card">
                <div className="detail-header">
                  <h2>{myCentre.name}</h2>
                  <span className="centre-id">{myCentre.id}</span>
                </div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>State</label>
                    <span>{myCentre.state}</span>
                  </div>
                  <div className="detail-item">
                    <label>City</label>
                    <span>{myCentre.city}</span>
                  </div>
                  <div className="detail-item">
                    <label>Address</label>
                    <span>{myCentre.address}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Patients</label>
                    <span>{patients.filter((p) => p.centreId === myCentre.id).length}</span>
                  </div>
                  <div className="detail-item">
                    <label>Contact</label>
                    <span>{myCentre.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <span>{myCentre.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Capacity</label>
                    <span>{myCentre.capacity} beds</span>
                  </div>
                  <div className="detail-item">
                    <label>Administrator</label>
                    <span>{myCentre.administrator}</span>
                  </div>
                </div>
                <div className="detail-actions">
                  <button className="btn btn-primary" onClick={() => openEditCentreModal(myCentre)}>
                    Edit Centre Details
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Centres - Only for Super Admin */}
      {currentPage === "centres" && currentUser?.role === "super_admin" && (
        <div className="page-content">
          <div className="page-header">
            <h1>Rehabilitation Centres</h1>
            {currentUser.role === "super_admin" && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFormData({})
                  openModal("Add New Centre", <CentreForm />)
                }}
              >
                + Add Centre
              </button>
            )}
          </div>
          <div className="filters">
            <input
              type="text"
              placeholder="Search centres..."
              className="search-input"
              value={centreSearch}
              onChange={(e) => setCentreSearch(e.target.value)}
            />
            <select className="select-input" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="">All States</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Centre ID</th>
                  <th>Name</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Patients</th>
                  <th>Administrator</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredCentres().length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-state">
                      No centres found
                    </td>
                  </tr>
                ) : (
                  getFilteredCentres().map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.id}</strong>
                      </td>
                      <td>{c.name}</td>
                      <td>{c.state}</td>
                      <td>{c.city}</td>
                      <td>{patients.filter((p) => p.centreId === c.id).length}</td>
                      <td>{c.administrator}</td>
                      <td>
                        <span className={`badge badge-${c.status}`}>{formatStatus(c.status)}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-outline btn-small"
                            onClick={() =>
                              openModal(
                                c.name,
                                <div className="detail-grid">
                                  <div className="detail-item">
                                    <label>ID</label>
                                    <span>{c.id}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>State</label>
                                    <span>{c.state}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>City</label>
                                    <span>{c.city}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Address</label>
                                    <span>{c.address}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Phone</label>
                                    <span>{c.phone}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Email</label>
                                    <span>{c.email}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Capacity</label>
                                    <span>{c.capacity}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Administrator</label>
                                    <span>{c.administrator}</span>
                                  </div>
                                </div>,
                              )
                            }
                          >
                            View
                          </button>
                          {currentUser.role === "super_admin" && (
                            <button
                              className="btn btn-outline btn-small"
                              onClick={() => {
                                setFormData(c as unknown as Record<string, string | number | null | undefined>)
                                openModal("Edit Centre", <CentreForm centre={c} />)
                              }}
                            >
                              Edit
                            </button>
                          )}
                          {currentUser.role === "super_admin" && (
                            <button className="btn btn-danger btn-small" onClick={() => deleteCentre(c.id)}>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patients Page */}
      {currentPage === "patients" && (
        <div className="page-content">
          <div className="page-header">
            <h1>Patients</h1>
            <p>
              {currentUser?.role === "centre_admin"
                ? "Manage patient records for your centre"
                : "Manage patient records across all centres"}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                // Reset formData first - ensure it's completely empty for new patient
                const initialData: Record<string, string | number | null | undefined> = {}
                if (currentUser?.role === "centre_admin" && currentUser.centreId) {
                  initialData.centreId = currentUser.centreId
                }
                setFormData(initialData)
                openModal("Add New Patient", <PatientForm />)
              }}
            >
              + Add Patient
            </button>
          </div>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by name, ID or Aadhar..."
              className="search-input"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
            {currentUser?.role === "super_admin" && (
              <select value={centreFilter} onChange={(e) => setCentreFilter(e.target.value)}>
                <option value="">All Centres</option>
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="admitted">Admitted</option>
              <option value="under_treatment">Under Treatment</option>
              <option value="recovering">Recovering</option>
              <option value="discharged">Discharged</option>
            </select>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Centre</th>
                  <th>Addiction Type</th>
                  <th>Status</th>
                  <th>Admitted On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredPatients().length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-state">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  getFilteredPatients().map((p) => {
                    const centre = centres.find((c) => c.id === p.centreId)
                    return (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.id}</strong>
                        </td>
                        <td>{p.name}</td>
                        <td>{p.age || calculateAge(p.dob)}</td>
                        <td>{centre?.name || "Unknown"}</td>
                        <td>{p.addictionType}</td>
                        <td>
                          <span className={`badge badge-${p.status}`}>{formatStatus(p.status)}</span>
                        </td>
                        <td>{formatDate(p.admissionDate)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-outline btn-small"
                              onClick={() => openModal(p.name, <PatientDetails patient={p} />)}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-outline btn-small"
                              onClick={() => {
                                setFormData(p as unknown as Record<string, string | number | null | undefined>)
                                openModal("Edit Patient", <PatientForm patient={p} />)
                              }}
                            >
                              Edit
                            </button>
                            <button className="btn btn-danger btn-small" onClick={() => deletePatient(p.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Support Page */}
      {currentPage === "support" && (
        <div className="page-content">
          <div className="page-header">
            <h1>Support & Queries</h1>
            <p>
              {currentUser?.role === "centre_admin"
                ? "Raise queries and get support from headquarters"
                : "Manage support queries from all centres"}
            </p>
            {/* Only centre admin can raise new queries */}
            {currentUser?.role === "centre_admin" && (
              <button className="btn btn-primary" onClick={openAddQueryModal}>
                + Raise Query
              </button>
            )}
          </div>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by Query ID, Subject or Centre..."
              className="search-input"
              value={querySearch}
              onChange={(e) => setQuerySearch(e.target.value)}
            />
            <select
              className="select-input"
              value={queryStatusFilter}
              onChange={(e) => setQueryStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className="select-input"
              value={queryPriorityFilter}
              onChange={(e) => setQueryPriorityFilter(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Query ID</th>
                  <th>Subject</th>
                  <th>Centre</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredQueries().length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      No queries found
                    </td>
                  </tr>
                ) : (
                  getFilteredQueries().map((q) => (
                    <tr key={q.id}>
                      <td>
                        <strong>{q.id}</strong>
                      </td>
                      <td>{q.subject}</td>
                      <td>{q.centreName}</td>
                      <td>
                        <span className={`badge priority-${q.priority}`}>{q.priority.toUpperCase()}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${q.status}`}>{formatStatus(q.status)}</span>
                      </td>
                      <td>{formatDate(q.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className={`btn btn-small ${currentUser?.role === "super_admin" ? "btn-primary" : "btn-outline"}`}
                            onClick={() => openModal(`Query: ${q.subject}`, <QueryDetails query={q} />)}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Page */}
      {currentPage === "orders" && (
        <div className="page-content">
          <div className="page-header">
            <h1>Orders & Instructions</h1>
            <p>
              {currentUser?.role === "centre_admin"
                ? "View orders and instructions from headquarters"
                : "Issue orders and instructions to centres"}
            </p>
            {currentUser?.role === "super_admin" && (
              <button className="btn btn-primary" onClick={openAddOrderModal}>
                + Issue Order
              </button>
            )}
          </div>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by Order ID, Subject or Centre..."
              className="search-input"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
            />
            <select
              className="select-input"
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="issued">Issued</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="select-input"
              value={orderPriorityFilter}
              onChange={(e) => setOrderPriorityFilter(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Subject</th>
                  <th>Target</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredOrders().length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  getFilteredOrders().map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong>{o.id}</strong>
                      </td>
                      <td>{o.subject}</td>
                      <td>{o.targetCentreName}</td>
                      <td>
                        <span className={`badge priority-${o.priority}`}>{o.priority.toUpperCase()}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${o.status}`}>{formatStatus(o.status)}</span>
                      </td>
                      <td>{formatDate(o.deadline)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-outline btn-small"
                            onClick={() => openModal(`Order: ${o.subject}`, <OrderDetails order={o} />)}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approvals Page - Super Admin Only */}
      {currentPage === "approvals" && currentUser?.role === "super_admin" && (
        <div className="page-content">
          <div className="page-header">
            <h1>Registration Approvals</h1>
            <p>Review and approve centre admin registration requests</p>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Centre Name</th>
                  <th>Location</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      No pending registrations
                    </td>
                  </tr>
                ) : (
                  pendingRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <strong>{reg.name}</strong>
                      </td>
                      <td>{reg.email}</td>
                      <td>{reg.phone || "N/A"}</td>
                      <td>{reg.centreName}</td>
                      <td>
                        {reg.centreCity}, {reg.centreState}
                      </td>
                      <td>{reg.createdAt ? formatDate(new Date(reg.createdAt as string | Date).toISOString().split('T')[0]) : "N/A"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-outline btn-small"
                            onClick={() =>
                              openModal(
                                `Registration Details: ${reg.name}`,
                                <div className="detail-section">
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <label>Name</label>
                                      <span>{reg.name}</span>
                                    </div>
                                    <div className="detail-item">
                                      <label>Email</label>
                                      <span>{reg.email}</span>
                                    </div>
                                    <div className="detail-item">
                                      <label>Phone</label>
                                      <span>{reg.phone || "N/A"}</span>
                                    </div>
                                    <div className="detail-item">
                                      <label>Centre Name</label>
                                      <span>{reg.centreName}</span>
                                    </div>
                                    <div className="detail-item">
                                      <label>State</label>
                                      <span>{reg.centreState}</span>
                                    </div>
                                    <div className="detail-item">
                                      <label>City</label>
                                      <span>{reg.centreCity}</span>
                                    </div>
                                    <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
                                      <label>Address</label>
                                      <span>{reg.centreAddress}</span>
                                    </div>
                                  </div>
                                  <div className="form-actions" style={{ marginTop: "20px" }}>
                                    <button
                                      className="btn btn-success"
                                      onClick={() => {
                                        handleApproveRegistration(reg.id, "approve")
                                        closeModal()
                                      }}
                                    >
                                      ✓ Approve
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      onClick={() => {
                                        const reason = prompt("Enter rejection reason (optional):")
                                        handleApproveRegistration(reg.id, "reject", reason || undefined)
                                        closeModal()
                                      }}
                                    >
                                      ✗ Reject
                                    </button>
                                  </div>
                                </div>
                              )
                            }
                          >
                            View
                          </button>
                          <button
                            className="btn btn-success btn-small"
                            onClick={() => handleApproveRegistration(reg.id, "approve")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => {
                              const reason = prompt("Enter rejection reason (optional):")
                              handleApproveRegistration(reg.id, "reject", reason || undefined)
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Profile Page - For Both Super Admin and Centre Admin */}
      {currentPage === "profile" && currentUser && (
        <div className="page-content">
          <div className="page-header">
            <h1>My Profile</h1>
            <p>View and update your personal information</p>
          </div>
          
          <ProfileForm user={currentUser} onUpdate={async (updatedUser) => {
            setCurrentUser(updatedUser)
            localStorage.setItem("nrcms_current_user", JSON.stringify(updatedUser))
            alert("Profile updated successfully!")
          }} />
        </div>
      )}

      {/* Centre Admins Page - Super Admin Only */}
      {currentPage === "centre-admins" && currentUser?.role === "super_admin" && (
        <div className="page-content">
          <div className="page-header">
            <h1>Centre Admins</h1>
            <p>View all centre administrator profiles</p>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Centre Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {centreAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-state">
                      No centre admins found
                    </td>
                  </tr>
                ) : (
                  centreAdmins.map((admin) => {
                    const adminCentre = centres.find((c) => c.id === admin.centreId)
                    return (
                      <tr key={admin.id}>
                        <td>
                          <strong style={{ color: "var(--navy-blue)" }}>
                            {admin.employeeCode || "N/A"}
                          </strong>
                        </td>
                        <td>
                          <strong>{admin.name}</strong>
                        </td>
                        <td>{admin.email}</td>
                        <td>{admin.phone || "N/A"}</td>
                        <td>{adminCentre?.name || admin.centreName || "N/A"}</td>
                        <td>
                          {adminCentre 
                            ? `${adminCentre.city}, ${adminCentre.state}`
                            : admin.centreCity && admin.centreState
                            ? `${admin.centreCity}, ${admin.centreState}`
                            : "N/A"}
                        </td>
                        <td>
                          <span className={`badge badge-${admin.status || "approved"}`}>
                            {formatStatus(admin.status || "approved")}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-small"
                            onClick={() => openModal(
                              `Profile: ${admin.name}`,
                              <ProfileForm 
                                user={admin} 
                                onUpdate={async () => {
                                  await fetchCentreAdmins()
                                  closeModal()
                                }} 
                                readOnly={true}
                              />
                            )}
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalTitle}</h2>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-content">{modalContent}</div>
          </div>
        </div>
      )}
    </div>
  )
}
