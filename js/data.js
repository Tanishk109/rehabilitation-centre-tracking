// Indian States
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
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
]

// State Codes for ID Generation
const STATE_CODES = {
  Maharashtra: "MH",
  Delhi: "DL",
  Karnataka: "KA",
  "Tamil Nadu": "TN",
  Gujarat: "GJ",
  "West Bengal": "WB",
  Rajasthan: "RJ",
  "Uttar Pradesh": "UP",
  Kerala: "KL",
  Punjab: "PB",
  "Andhra Pradesh": "AP",
  Telangana: "TS",
  Bihar: "BR",
  "Madhya Pradesh": "MP",
  Haryana: "HR",
  Odisha: "OR",
  Assam: "AS",
  Jharkhand: "JH",
  Chhattisgarh: "CG",
  Uttarakhand: "UK",
  "Himachal Pradesh": "HP",
  Goa: "GA",
  Tripura: "TR",
  Meghalaya: "ML",
  Manipur: "MN",
  Nagaland: "NL",
  Mizoram: "MZ",
  "Arunachal Pradesh": "AR",
  Sikkim: "SK",
  "Jammu and Kashmir": "JK",
  Ladakh: "LA",
  Puducherry: "PY",
  Chandigarh: "CH",
}

// Addiction Types
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

// Admin Users
const ADMIN_USERS = [
  {
    id: "ADM001",
    email: "admin@rehab.gov.in",
    name: "Dr. Rajesh Kumar",
    role: "super_admin",
    centreId: null,
  },
  {
    id: "ADM002",
    email: "anil.deshmukh@rehab.gov.in",
    name: "Mr. Anil Deshmukh",
    role: "centre_admin",
    centreId: "RC-MH-001",
  },
  {
    id: "ADM003",
    email: "priya.sharma@rehab.gov.in",
    name: "Dr. Priya Sharma",
    role: "centre_admin",
    centreId: "RC-DL-001",
  },
]

// Initial Mock Data
const INITIAL_CENTRES = [
  {
    id: "RC-MH-001",
    name: "Mumbai Central Rehabilitation Centre",
    state: "Maharashtra",
    city: "Mumbai",
    address: "123, Bandra West, Mumbai - 400050",
    phone: "022-12345678",
    email: "mumbai@rehab.gov.in",
    administrator: "Mr. Anil Deshmukh",
    adminEmail: "anil.deshmukh@rehab.gov.in",
    capacity: 150,
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: "RC-DL-001",
    name: "Delhi AIIMS De-addiction Centre",
    state: "Delhi",
    city: "New Delhi",
    address: "AIIMS Campus, Ansari Nagar, New Delhi - 110029",
    phone: "011-26588500",
    email: "delhi@rehab.gov.in",
    administrator: "Dr. Priya Sharma",
    adminEmail: "priya.sharma@rehab.gov.in",
    capacity: 200,
    status: "active",
    createdAt: "2022-06-01",
  },
  {
    id: "RC-KA-001",
    name: "Bengaluru Hope Foundation Centre",
    state: "Karnataka",
    city: "Bengaluru",
    address: "45, Koramangala, Bengaluru - 560034",
    phone: "080-23456789",
    email: "bengaluru@rehab.gov.in",
    administrator: "Dr. Venkatesh Iyer",
    adminEmail: "venkatesh@rehab.gov.in",
    capacity: 100,
    status: "active",
    createdAt: "2023-03-20",
  },
  {
    id: "RC-TN-001",
    name: "Chennai Recovery Centre",
    state: "Tamil Nadu",
    city: "Chennai",
    address: "78, T. Nagar, Chennai - 600017",
    phone: "044-34567890",
    email: "chennai@rehab.gov.in",
    administrator: "Dr. Lakshmi Narayanan",
    adminEmail: "lakshmi@rehab.gov.in",
    capacity: 120,
    status: "active",
    createdAt: "2023-05-10",
  },
]

const INITIAL_PATIENTS = [
  {
    id: "PT-RCMH001-0001",
    centreId: "RC-MH-001",
    name: "Rahul Verma",
    dob: "1992-05-15",
    age: 32,
    gender: "male",
    phone: "9876543210",
    email: "rahul.v@email.com",
    address: "45, Andheri East, Mumbai - 400069",
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
    id: "PT-RCMH001-0002",
    centreId: "RC-MH-001",
    name: "Priya Patel",
    dob: "1988-11-22",
    age: 36,
    gender: "female",
    phone: "9876543220",
    email: "priya.p@email.com",
    address: "22, Powai, Mumbai - 400076",
    aadharNumber: "2345-6789-0123",
    familyContactName: "Meera Patel (Mother)",
    familyContactPhone: "9876543221",
    addictionType: "Prescription Drugs",
    admissionDate: "2024-02-05",
    status: "recovering",
    medications: [
      {
        id: "MED002",
        name: "Buprenorphine",
        dosage: "8mg",
        frequency: "Twice daily",
        prescribedBy: "Dr. Anil Sharma",
        startDate: "2024-02-07",
      },
    ],
  },
  {
    id: "PT-RCDL001-0001",
    centreId: "RC-DL-001",
    name: "Amit Singh",
    dob: "1995-03-08",
    age: 29,
    gender: "male",
    phone: "9876543230",
    email: "amit.s@email.com",
    address: "12, Rohini, New Delhi - 110085",
    aadharNumber: "3456-7890-1234",
    familyContactName: "Rajesh Singh (Brother)",
    familyContactPhone: "9876543231",
    addictionType: "Opioids (Heroin, Morphine)",
    admissionDate: "2024-01-20",
    status: "under_treatment",
    medications: [
      {
        id: "MED003",
        name: "Methadone",
        dosage: "30mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Priya Sharma",
        startDate: "2024-01-22",
      },
    ],
  },
  {
    id: "PT-RCKA001-0001",
    centreId: "RC-KA-001",
    name: "Divya Reddy",
    dob: "1990-07-14",
    age: 34,
    gender: "female",
    phone: "9876543240",
    email: "divya.r@email.com",
    address: "56, Whitefield, Bengaluru - 560066",
    aadharNumber: "4567-8901-2345",
    familyContactName: "Krishna Reddy (Husband)",
    familyContactPhone: "9876543241",
    addictionType: "Alcohol",
    admissionDate: "2023-12-15",
    status: "discharged",
    medications: [],
  },
]

const INITIAL_QUERIES = [
  {
    id: "QRY-001",
    centreId: "RC-MH-001",
    centreName: "Mumbai Central Rehabilitation Centre",
    subject: "Request for Additional Medical Staff",
    description: "Due to increased patient admissions, we require 2 additional psychiatrists and 3 nurses.",
    priority: "high",
    status: "open",
    createdBy: "Mr. Anil Deshmukh",
    createdAt: "2024-03-01",
    responses: [],
  },
  {
    id: "QRY-002",
    centreId: "RC-DL-001",
    centreName: "Delhi AIIMS De-addiction Centre",
    subject: "Equipment Maintenance Required",
    description: "Several medical equipment need urgent maintenance and calibration.",
    priority: "medium",
    status: "in_progress",
    createdBy: "Dr. Priya Sharma",
    createdAt: "2024-02-25",
    responses: [
      {
        id: "RES-001",
        message: "Maintenance team has been notified. Expected completion by March 10th.",
        respondedBy: "Dr. Rajesh Kumar",
        respondedAt: "2024-02-26",
        isAdmin: true,
      },
    ],
  },
]

const INITIAL_ORDERS = [
  {
    id: "ORD-001",
    subject: "Monthly Patient Report Submission",
    instruction:
      "All centres must submit their monthly patient progress reports by the 5th of every month. Reports should include: patient statistics, recovery rates, and medication inventory status.",
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
    id: "ORD-002",
    subject: "New COVID-19 Safety Protocol Implementation",
    instruction:
      "Implement the updated COVID-19 safety protocols as per Ministry guidelines. Ensure all staff are briefed and proper PPE stock is maintained.",
    targetCentreId: "RC-MH-001",
    targetCentreName: "Mumbai Central Rehabilitation Centre",
    priority: "urgent",
    status: "acknowledged",
    deadline: "2024-03-10",
    issuedBy: "Dr. Rajesh Kumar",
    issuedAt: "2024-02-28",
    acknowledgements: [
      {
        centreId: "RC-MH-001",
        acknowledgedBy: "Mr. Anil Deshmukh",
        acknowledgedAt: "2024-03-01",
      },
    ],
  },
]

// Data Store Class
class DataStore {
  constructor() {
    this.initializeData()
  }

  initializeData() {
    if (!localStorage.getItem("nrcms_initialized")) {
      localStorage.setItem("nrcms_centres", JSON.stringify(INITIAL_CENTRES))
      localStorage.setItem("nrcms_patients", JSON.stringify(INITIAL_PATIENTS))
      localStorage.setItem("nrcms_queries", JSON.stringify(INITIAL_QUERIES))
      localStorage.setItem("nrcms_orders", JSON.stringify(INITIAL_ORDERS))
      localStorage.setItem("nrcms_initialized", "true")
    }
  }

  // Centres
  getCentres() {
    return JSON.parse(localStorage.getItem("nrcms_centres") || "[]")
  }

  getCentreById(id) {
    return this.getCentres().find((c) => c.id === id)
  }

  addCentre(centre) {
    const centres = this.getCentres()
    centres.push(centre)
    localStorage.setItem("nrcms_centres", JSON.stringify(centres))
  }

  updateCentre(id, data) {
    const centres = this.getCentres()
    const index = centres.findIndex((c) => c.id === id)
    if (index !== -1) {
      centres[index] = { ...centres[index], ...data }
      localStorage.setItem("nrcms_centres", JSON.stringify(centres))
    }
  }

  deleteCentre(id) {
    const centres = this.getCentres().filter((c) => c.id !== id)
    localStorage.setItem("nrcms_centres", JSON.stringify(centres))
  }

  generateCentreId(state) {
    const code = STATE_CODES[state] || "XX"
    const centres = this.getCentres().filter((c) => c.state === state)
    const num = String(centres.length + 1).padStart(3, "0")
    return `RC-${code}-${num}`
  }

  // Patients
  getPatients() {
    return JSON.parse(localStorage.getItem("nrcms_patients") || "[]")
  }

  getPatientById(id) {
    return this.getPatients().find((p) => p.id === id)
  }

  getPatientsByCentre(centreId) {
    return this.getPatients().filter((p) => p.centreId === centreId)
  }

  addPatient(patient) {
    const patients = this.getPatients()
    patients.push(patient)
    localStorage.setItem("nrcms_patients", JSON.stringify(patients))
  }

  updatePatient(id, data) {
    const patients = this.getPatients()
    const index = patients.findIndex((p) => p.id === id)
    if (index !== -1) {
      patients[index] = { ...patients[index], ...data }
      localStorage.setItem("nrcms_patients", JSON.stringify(patients))
    }
  }

  deletePatient(id) {
    const patients = this.getPatients().filter((p) => p.id !== id)
    localStorage.setItem("nrcms_patients", JSON.stringify(patients))
  }

  generatePatientId(centreId) {
    const cleanId = centreId.replace(/-/g, "")
    const patients = this.getPatientsByCentre(centreId)
    const num = String(patients.length + 1).padStart(4, "0")
    return `PT-${cleanId}-${num}`
  }

  // Queries
  getQueries() {
    return JSON.parse(localStorage.getItem("nrcms_queries") || "[]")
  }

  getQueryById(id) {
    return this.getQueries().find((q) => q.id === id)
  }

  addQuery(query) {
    const queries = this.getQueries()
    queries.push(query)
    localStorage.setItem("nrcms_queries", JSON.stringify(queries))
  }

  updateQuery(id, data) {
    const queries = this.getQueries()
    const index = queries.findIndex((q) => q.id === id)
    if (index !== -1) {
      queries[index] = { ...queries[index], ...data }
      localStorage.setItem("nrcms_queries", JSON.stringify(queries))
    }
  }

  generateQueryId() {
    const queries = this.getQueries()
    const num = String(queries.length + 1).padStart(3, "0")
    return `QRY-${num}`
  }

  // Orders
  getOrders() {
    return JSON.parse(localStorage.getItem("nrcms_orders") || "[]")
  }

  getOrderById(id) {
    return this.getOrders().find((o) => o.id === id)
  }

  addOrder(order) {
    const orders = this.getOrders()
    orders.push(order)
    localStorage.setItem("nrcms_orders", JSON.stringify(orders))
  }

  updateOrder(id, data) {
    const orders = this.getOrders()
    const index = orders.findIndex((o) => o.id === id)
    if (index !== -1) {
      orders[index] = { ...orders[index], ...data }
      localStorage.setItem("nrcms_orders", JSON.stringify(orders))
    }
  }

  generateOrderId() {
    const orders = this.getOrders()
    const num = String(orders.length + 1).padStart(3, "0")
    return `ORD-${num}`
  }
}

// Initialize Data Store
const dataStore = new DataStore()
