// Global State
let currentUser = null
let currentPage = "dashboard"

// Mock Data (for demonstration purposes)
// In a real app, this would come from an API or a separate data module
const ADMIN_USERS = [
  { id: "admin1", name: "Super Admin", email: "super@example.com", role: "super_admin", centreId: null },
  { id: "admin2", name: "Centre A Admin", email: "centreA@example.com", role: "centre_admin", centreId: "C001" },
  { id: "admin3", name: "Centre B Admin", email: "centreB@example.com", role: "centre_admin", centreId: "C002" },
]

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
]

const ADDICTION_TYPES = [
  "Alcoholism",
  "Opioid Addiction",
  "Nicotine Addiction",
  "Cocaine Addiction",
  "Amphetamine Addiction",
  "Cannabis Addiction",
  "Gambling Addiction",
  "Prescription Drug Abuse",
]

const dataStore = {
  centres: [
    {
      id: "C001",
      name: "Hope Foundation Mumbai",
      state: "Maharashtra",
      city: "Mumbai",
      address: "123 Hope St, Mumbai",
      phone: "022-12345678",
      email: "mumbai@hope.org",
      capacity: 50,
      administrator: "Mr. Patil",
      adminEmail: "patil@hope.org",
      status: "active",
      createdAt: "2023-01-15",
    },
    {
      id: "C002",
      name: "Serenity Centre Delhi",
      state: "Delhi",
      city: "Delhi",
      address: "456 Serenity Ave, Delhi",
      phone: "011-98765432",
      email: "delhi@serenity.org",
      capacity: 40,
      administrator: "Ms. Sharma",
      adminEmail: "sharma@serenity.org",
      status: "active",
      createdAt: "2023-02-20",
    },
    {
      id: "C003",
      name: "Phoenix Rehab Bengaluru",
      state: "Karnataka",
      city: "Bengaluru",
      address: "789 Phoenix Rd, Bengaluru",
      phone: "080-11223344",
      email: "bengaluru@phoenix.org",
      capacity: 60,
      administrator: "Dr. Rao",
      adminEmail: "rao@phoenix.org",
      status: "inactive",
      createdAt: "2023-03-10",
    },
  ],
  patients: [
    {
      id: "P1001",
      centreId: "C001",
      name: "Amit Kumar",
      dob: "1990-05-15",
      age: 34,
      gender: "male",
      phone: "9876543210",
      email: "amit.k@example.com",
      address: "10, MG Road, Mumbai",
      aadharNumber: "1234-5678-9012",
      familyContactName: "Sunita Devi (Wife)",
      familyContactPhone: "9876543211",
      addictionType: "Alcoholism",
      admissionDate: "2024-01-10",
      status: "under_treatment",
      medications: [
        {
          id: "MED1",
          name: "Multivitamin",
          dosage: "1 tab daily",
          frequency: "Once daily",
          prescribedBy: "Dr. Rao",
          startDate: "2024-01-10",
        },
      ],
    },
    {
      id: "P1002",
      centreId: "C001",
      name: "Priya Singh",
      dob: "1995-11-22",
      age: 29,
      gender: "female",
      phone: "8765432109",
      address: "25, Linking Road, Mumbai",
      aadharNumber: "9876-5432-1098",
      familyContactName: "Rajesh Singh (Father)",
      familyContactPhone: "8765432108",
      addictionType: "Opioid Addiction",
      admissionDate: "2024-01-12",
      status: "recovering",
      medications: [],
    },
    {
      id: "P1003",
      centreId: "C002",
      name: "Vikramjeet Singh",
      dob: "1985-07-01",
      age: 39,
      gender: "male",
      phone: "7654321098",
      address: "5, Connaught Place, Delhi",
      aadharNumber: "1122-3344-5566",
      familyContactName: "Harpreet Kaur (Sister)",
      familyContactPhone: "7654321097",
      addictionType: "Nicotine Addiction",
      admissionDate: "2024-01-15",
      status: "admitted",
      medications: [],
    },
  ],
  queries: [
    {
      id: "Q5001",
      centreId: "C001",
      centreName: "Hope Foundation Mumbai",
      subject: "Urgent Bed Shortage",
      description: "We are facing an urgent shortage of beds at the Mumbai centre. Need immediate allocation.",
      priority: "high",
      status: "open",
      createdBy: "Mr. Patil",
      createdAt: "2024-01-18",
      responses: [],
    },
    {
      id: "Q5002",
      centreId: "C002",
      centreName: "Serenity Centre Delhi",
      subject: "Medication Delivery Delay",
      description: "The scheduled medication delivery for this week has been delayed. Please expedite.",
      priority: "medium",
      status: "in_progress",
      createdBy: "Ms. Sharma",
      createdAt: "2024-01-17",
      responses: [
        {
          id: "RES1",
          message: "Acknowledged. Investigating the delay with the supplier.",
          respondedBy: "Super Admin",
          respondedAt: "2024-01-18",
          isAdmin: true,
        },
      ],
    },
  ],
  orders: [
    {
      id: "O7001",
      subject: "Stock Requisition",
      instruction: "Please submit your monthly stock requisition by end of day Friday.",
      targetCentreId: "C001",
      targetCentreName: "Hope Foundation Mumbai",
      priority: "medium",
      status: "issued",
      deadline: "2024-01-20",
      issuedBy: "Super Admin",
      issuedAt: "2024-01-18",
      acknowledgements: [],
    },
    {
      id: "O7002",
      subject: "New Protocol Update",
      instruction: "All centres must implement the new patient intake protocol starting next Monday.",
      targetCentreId: null,
      targetCentreName: "All Centres",
      priority: "high",
      status: "issued",
      deadline: "2024-01-25",
      issuedBy: "Super Admin",
      issuedAt: "2024-01-17",
      acknowledgements: [{ centreId: "C001", acknowledgedBy: "Mr. Patil", acknowledgedAt: "2024-01-18" }],
    },
  ],
  getCentres: function () {
    return this.centres
  },
  getCentreById: function (id) {
    return this.centres.find((c) => c.id === id)
  },
  addCentre: function (centre) {
    this.centres.push(centre)
  },
  updateCentre: function (id, data) {
    const index = this.centres.findIndex((c) => c.id === id)
    if (index !== -1) {
      this.centres[index] = { ...this.centres[index], ...data }
    }
  },
  deleteCentre: function (id) {
    this.centres = this.centres.filter((c) => c.id !== id)
  },
  generateCentreId: function (state) {
    const stateAbbr = state.substring(0, 3).toUpperCase()
    const maxNum = this.centres.reduce((max, c) => {
      if (c.id.startsWith("C" + stateAbbr)) {
        return Math.max(max, Number.parseInt(c.id.substring(4)) || 0)
      }
      return max
    }, 0)
    return `C${stateAbbr}${String(maxNum + 1).padStart(3, "0")}`
  },

  getPatients: function () {
    return this.patients
  },
  getPatientById: function (id) {
    return this.patients.find((p) => p.id === id)
  },
  getPatientsByCentre: function (centreId) {
    return this.patients.filter((p) => p.centreId === centreId)
  },
  addPatient: function (patient) {
    this.patients.push(patient)
  },
  updatePatient: function (id, data) {
    const index = this.patients.findIndex((p) => p.id === id)
    if (index !== -1) {
      this.patients[index] = { ...this.patients[index], ...data }
    }
  },
  deletePatient: function (id) {
    this.patients = this.patients.filter((p) => p.id !== id)
  },
  generatePatientId: function (centreId) {
    const centrePrefix = centreId.substring(1) // Remove 'C'
    const maxNum = this.patients.reduce((max, p) => {
      if (p.id.startsWith("P" + centrePrefix)) {
        return Math.max(max, Number.parseInt(p.id.substring(4)) || 0)
      }
      return max
    }, 0)
    return `P${centrePrefix}${String(maxNum + 1).padStart(4, "0")}`
  },

  getQueries: function () {
    return this.queries
  },
  getQueryById: function (id) {
    return this.queries.find((q) => q.id === id)
  },
  addQuery: function (query) {
    this.queries.push(query)
  },
  updateQuery: function (id, data) {
    const index = this.queries.findIndex((q) => q.id === id)
    if (index !== -1) {
      this.queries[index] = { ...this.queries[index], ...data }
    }
  },
  generateQueryId: function () {
    const maxNum = this.queries.reduce((max, q) => Math.max(max, Number.parseInt(q.id.substring(1)) || 0), 0)
    return `Q${String(maxNum + 1).padStart(4, "0")}`
  },

  getOrders: function () {
    return this.orders
  },
  getOrderById: function (id) {
    return this.orders.find((o) => o.id === id)
  },
  addOrder: function (order) {
    this.orders.push(order)
  },
  updateOrder: function (id, data) {
    const index = this.orders.findIndex((o) => o.id === id)
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...data }
    }
  },
  generateOrderId: function () {
    const maxNum = this.orders.reduce((max, o) => Math.max(max, Number.parseInt(o.id.substring(1)) || 0), 0)
    return `O${String(maxNum + 1).padStart(4, "0")}`
  },
}

// DOM Elements
const loginPage = document.getElementById("login-page")
const mainApp = document.getElementById("main-app")
const loginForm = document.getElementById("login-form")
const logoutBtn = document.getElementById("logout-btn")
const userInfo = document.getElementById("user-info")
const modalOverlay = document.getElementById("modal-overlay")
const modalTitle = document.getElementById("modal-title")
const modalContent = document.getElementById("modal-content")

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  setupEventListeners()
})

// Authentication
function checkAuth() {
  const savedUser = localStorage.getItem("nrcms_current_user")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    showMainApp()
  }
}

function login(email) {
  const user = ADMIN_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (user) {
    currentUser = user
    localStorage.setItem("nrcms_current_user", JSON.stringify(user))
    showMainApp()
    return true
  }
  return false
}

function logout() {
  currentUser = null
  localStorage.removeItem("nrcms_current_user")
  loginPage.classList.remove("hidden")
  mainApp.classList.add("hidden")
}

function showMainApp() {
  loginPage.classList.add("hidden")
  mainApp.classList.remove("hidden")
  userInfo.textContent = `${currentUser.name} (${currentUser.role === "super_admin" ? "Super Admin" : "Centre Admin"})`

  // Show/hide super admin elements
  document.querySelectorAll(".super-admin-only").forEach((el) => {
    el.style.display = currentUser.role === "super_admin" ? "" : "none"
  })

  navigateTo("dashboard")
}

// Event Listeners
function setupEventListeners() {
  // Login Form
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    if (!login(email)) {
      alert("Invalid credentials. Please use demo credentials.")
    }
  })

  // Logout
  logoutBtn.addEventListener("click", logout)

  // Navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const page = e.target.dataset.page
      navigateTo(page)
    })
  })

  // Add buttons
  document.getElementById("add-centre-btn")?.addEventListener("click", () => showCentreForm())
  document.getElementById("add-patient-btn")?.addEventListener("click", () => showPatientForm())
  document.getElementById("raise-query-btn")?.addEventListener("click", () => showQueryForm())
  document.getElementById("create-order-btn")?.addEventListener("click", () => showOrderForm())

  // Filters
  document.getElementById("centre-search")?.addEventListener("input", renderCentres)
  document.getElementById("state-filter")?.addEventListener("change", renderCentres)
  document.getElementById("patient-search")?.addEventListener("input", renderPatients)
  document.getElementById("centre-filter")?.addEventListener("change", renderPatients)
  document.getElementById("status-filter")?.addEventListener("change", renderPatients)
  document.getElementById("query-status-filter")?.addEventListener("change", renderQueries)
  document.getElementById("query-priority-filter")?.addEventListener("change", renderQueries)
  document.getElementById("order-status-filter")?.addEventListener("change", renderOrders)
  document.getElementById("order-priority-filter")?.addEventListener("change", renderOrders)
}

// Navigation
function navigateTo(page) {
  currentPage = page

  // Update nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === page)
  })

  // Hide all pages
  document.querySelectorAll(".page-content").forEach((p) => p.classList.add("hidden"))

  // Show selected page
  document.getElementById(`${page}-page`).classList.remove("hidden")

  // Load page data
  switch (page) {
    case "dashboard":
      loadDashboard()
      break
    case "centres":
      loadCentres()
      break
    case "patients":
      loadPatients()
      break
    case "support":
      loadSupport()
      break
    case "orders":
      loadOrders()
      break
  }
}

// Dashboard
function loadDashboard() {
  const centres = dataStore.getCentres()
  const patients = dataStore.getPatients()
  const queries = dataStore.getQueries()

  // Stats
  document.getElementById("total-centres").textContent = centres.length
  document.getElementById("total-patients").textContent = patients.length
  document.getElementById("total-states").textContent = [...new Set(centres.map((c) => c.state))].length
  document.getElementById("pending-queries").textContent = queries.filter((q) => q.status === "open").length

  // Centres by State
  const stateCount = {}
  centres.forEach((c) => {
    stateCount[c.state] = (stateCount[c.state] || 0) + 1
  })

  const maxStateCentres = Math.max(...Object.values(stateCount), 1)
  const colors = ["saffron", "green", "blue", "purple"]

  document.getElementById("centres-by-state").innerHTML =
    Object.entries(stateCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(
        ([state, count], i) => `
            <div class="chart-bar">
                <span class="chart-bar-label">${state}</span>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill ${colors[i % colors.length]}" style="width: ${(count / maxStateCentres) * 100}%"></div>
                </div>
                <span class="chart-bar-value">${count}</span>
            </div>
        `,
      )
      .join("") || '<p class="empty-state">No data available</p>'

  // Patient Status
  const statusCount = { admitted: 0, under_treatment: 0, recovering: 0, discharged: 0 }
  patients.forEach((p) => {
    if (statusCount.hasOwnProperty(p.status)) {
      statusCount[p.status]++
    }
  })

  const maxStatus = Math.max(...Object.values(statusCount), 1)
  const statusColors = { admitted: "blue", under_treatment: "yellow", recovering: "purple", discharged: "green" }
  const statusLabels = {
    admitted: "Admitted",
    under_treatment: "Treatment",
    recovering: "Recovering",
    discharged: "Discharged",
  }

  document.getElementById("patient-status").innerHTML = Object.entries(statusCount)
    .map(
      ([status, count]) => `
            <div class="chart-bar">
                <span class="chart-bar-label">${statusLabels[status]}</span>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill ${statusColors[status]}" style="width: ${(count / maxStatus) * 100}%"></div>
                </div>
                <span class="chart-bar-value">${count}</span>
            </div>
        `,
    )
    .join("")

  // Addiction Types
  const addictionCount = {}
  patients.forEach((p) => {
    if (p.addictionType) {
      addictionCount[p.addictionType] = (addictionCount[p.addictionType] || 0) + 1
    }
  })

  const maxAddiction = Math.max(...Object.values(addictionCount), 1)

  document.getElementById("addiction-types").innerHTML =
    Object.entries(addictionCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(
        ([type, count], i) => `
            <div class="chart-bar">
                <span class="chart-bar-label">${type.substring(0, 15)}${type.length > 15 ? "..." : ""}</span>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill ${colors[i % colors.length]}" style="width: ${(count / maxAddiction) * 100}%"></div>
                </div>
                <span class="chart-bar-value">${count}</span>
            </div>
        `,
      )
      .join("") || '<p class="empty-state">No data available</p>'

  // Recent Activities
  const activities = [
    { text: "New patient admitted at Mumbai Centre", time: "2 hours ago", color: "saffron" },
    { text: "Query resolved for Delhi Centre", time: "5 hours ago", color: "green" },
    { text: "New order issued to all centres", time: "1 day ago", color: "blue" },
    { text: "Patient discharged from Bengaluru Centre", time: "2 days ago", color: "green" },
  ]

  document.getElementById("recent-activities").innerHTML = activities
    .map(
      (a) => `
        <div class="activity-item">
            <div class="activity-dot ${a.color}"></div>
            <div class="activity-content">
                <p>${a.text}</p>
                <span>${a.time}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Centres
function loadCentres() {
  // Populate state filter
  const stateFilter = document.getElementById("state-filter")
  stateFilter.innerHTML =
    '<option value="">All States</option>' + INDIAN_STATES.map((s) => `<option value="${s}">${s}</option>`).join("")

  renderCentres()
}

function renderCentres() {
  const search = document.getElementById("centre-search").value.toLowerCase()
  const stateFilter = document.getElementById("state-filter").value

  let centres = dataStore.getCentres()

  // Filter for centre admin
  if (currentUser.role === "centre_admin") {
    centres = centres.filter((c) => c.id === currentUser.centreId)
  }

  // Apply filters
  if (search) {
    centres = centres.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.id.toLowerCase().includes(search) ||
        c.city.toLowerCase().includes(search),
    )
  }
  if (stateFilter) {
    centres = centres.filter((c) => c.state === stateFilter)
  }

  const tbody = document.getElementById("centres-table-body")

  if (centres.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No centres found</td></tr>'
    return
  }

  tbody.innerHTML = centres
    .map((c) => {
      const patientCount = dataStore.getPatientsByCentre(c.id).length
      return `
            <tr>
                <td><strong>${c.id}</strong></td>
                <td>${c.name}</td>
                <td>${c.state}</td>
                <td>${c.city}</td>
                <td>${patientCount} / ${c.capacity}</td>
                <td>${c.administrator}</td>
                <td><span class="badge badge-${c.status}">${c.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-small btn-icon" onclick="viewCentre('${c.id}')">👁️</button>
                        <button class="btn btn-outline btn-small btn-icon" onclick="showCentreForm('${c.id}')">✏️</button>
                        ${currentUser.role === "super_admin" ? `<button class="btn btn-danger btn-small btn-icon" onclick="deleteCentre('${c.id}')">🗑️</button>` : ""}
                    </div>
                </td>
            </tr>
        `
    })
    .join("")
}

function viewCentre(id) {
  const centre = dataStore.getCentreById(id)
  const patients = dataStore.getPatientsByCentre(id)

  modalTitle.textContent = centre.name
  modalContent.innerHTML = `
        <div class="detail-section">
            <h4>Centre Information</h4>
            <div class="detail-grid">
                <div class="detail-item"><label>Centre ID</label><span>${centre.id}</span></div>
                <div class="detail-item"><label>Status</label><span class="badge badge-${centre.status}">${centre.status}</span></div>
                <div class="detail-item"><label>State</label><span>${centre.state}</span></div>
                <div class="detail-item"><label>City</label><span>${centre.city}</span></div>
                <div class="detail-item"><label>Address</label><span>${centre.address}</span></div>
                <div class="detail-item"><label>Phone</label><span>${centre.phone}</span></div>
                <div class="detail-item"><label>Email</label><span>${centre.email}</span></div>
                <div class="detail-item"><label>Capacity</label><span>${centre.capacity}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <h4>Administrator</h4>
            <div class="detail-grid">
                <div class="detail-item"><label>Name</label><span>${centre.administrator}</span></div>
                <div class="detail-item"><label>Email</label><span>${centre.adminEmail}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <h4>Patient Statistics</h4>
            <div class="detail-grid">
                <div class="detail-item"><label>Total Patients</label><span>${patients.length}</span></div>
                <div class="detail-item"><label>Under Treatment</label><span>${patients.filter((p) => p.status === "under_treatment").length}</span></div>
                <div class="detail-item"><label>Recovering</label><span>${patients.filter((p) => p.status === "recovering").length}</span></div>
                <div class="detail-item"><label>Discharged</label><span>${patients.filter((p) => p.status === "discharged").length}</span></div>
            </div>
        </div>
    `
  openModal()
}

function showCentreForm(id = null) {
  const centre = id ? dataStore.getCentreById(id) : null

  modalTitle.textContent = centre ? "Edit Centre" : "Add New Centre"
  modalContent.innerHTML = `
        <form id="centre-form">
            <div class="form-row">
                <div class="form-group">
                    <label>Centre Name *</label>
                    <input type="text" id="centre-name" value="${centre?.name || ""}" required>
                </div>
                <div class="form-group">
                    <label>State *</label>
                    <select id="centre-state" required>
                        <option value="">Select State</option>
                        ${INDIAN_STATES.map((s) => `<option value="${s}" ${centre?.state === s ? "selected" : ""}>${s}</option>`).join("")}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>City *</label>
                    <input type="text" id="centre-city" value="${centre?.city || ""}" required>
                </div>
                <div class="form-group">
                    <label>Capacity *</label>
                    <input type="number" id="centre-capacity" value="${centre?.capacity || ""}" required min="1">
                </div>
            </div>
            <div class="form-group">
                <label>Address *</label>
                <textarea id="centre-address" rows="2" required>${centre?.address || ""}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Phone *</label>
                    <input type="tel" id="centre-phone" value="${centre?.phone || ""}" required>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" id="centre-email" value="${centre?.email || ""}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Administrator Name *</label>
                    <input type="text" id="centre-admin" value="${centre?.administrator || ""}" required>
                </div>
                <div class="form-group">
                    <label>Administrator Email *</label>
                    <input type="email" id="centre-admin-email" value="${centre?.adminEmail || ""}" required>
                </div>
            </div>
            <div class="form-group">
                <label>Status</label>
                <select id="centre-status">
                    <option value="active" ${centre?.status === "active" ? "selected" : ""}>Active</option>
                    <option value="inactive" ${centre?.status === "inactive" ? "selected" : ""}>Inactive</option>
                </select>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${centre ? "Update" : "Add"} Centre</button>
            </div>
        </form>
    `

  document.getElementById("centre-form").addEventListener("submit", (e) => {
    e.preventDefault()
    saveCentre(id)
  })

  openModal()
}

function saveCentre(id) {
  const state = document.getElementById("centre-state").value
  const data = {
    name: document.getElementById("centre-name").value,
    state: state,
    city: document.getElementById("centre-city").value,
    address: document.getElementById("centre-address").value,
    phone: document.getElementById("centre-phone").value,
    email: document.getElementById("centre-email").value,
    administrator: document.getElementById("centre-admin").value,
    adminEmail: document.getElementById("centre-admin-email").value,
    capacity: Number.parseInt(document.getElementById("centre-capacity").value),
    status: document.getElementById("centre-status").value,
  }

  if (id) {
    dataStore.updateCentre(id, data)
  } else {
    data.id = dataStore.generateCentreId(state)
    data.createdAt = new Date().toISOString().split("T")[0]
    dataStore.addCentre(data)
  }

  closeModal()
  renderCentres()
}

function deleteCentre(id) {
  if (confirm("Are you sure you want to delete this centre? This action cannot be undone.")) {
    dataStore.deleteCentre(id)
    renderCentres()
  }
}

// Patients
function loadPatients() {
  // Populate centre filter
  const centreFilter = document.getElementById("centre-filter")
  let centres = dataStore.getCentres()

  if (currentUser.role === "centre_admin") {
    centres = centres.filter((c) => c.id === currentUser.centreId)
  }

  centreFilter.innerHTML =
    '<option value="">All Centres</option>' + centres.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")

  renderPatients()
}

function renderPatients() {
  const search = document.getElementById("patient-search").value.toLowerCase()
  const centreFilter = document.getElementById("centre-filter").value
  const statusFilter = document.getElementById("status-filter").value

  let patients = dataStore.getPatients()

  // Filter for centre admin
  if (currentUser.role === "centre_admin") {
    patients = patients.filter((p) => p.centreId === currentUser.centreId)
  }

  // Apply filters
  if (search) {
    patients = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.id.toLowerCase().includes(search) ||
        p.aadharNumber?.includes(search),
    )
  }
  if (centreFilter) {
    patients = patients.filter((p) => p.centreId === centreFilter)
  }
  if (statusFilter) {
    patients = patients.filter((p) => p.status === statusFilter)
  }

  const tbody = document.getElementById("patients-table-body")

  if (patients.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No patients found</td></tr>'
    return
  }

  tbody.innerHTML = patients
    .map((p) => {
      const centre = dataStore.getCentreById(p.centreId)
      return `
            <tr>
                <td><strong>${p.id}</strong></td>
                <td>${p.name}</td>
                <td>${p.age || calculateAge(p.dob)}</td>
                <td>${centre?.name || "Unknown"}</td>
                <td>${p.addictionType || "N/A"}</td>
                <td><span class="badge badge-${p.status}">${formatStatus(p.status)}</span></td>
                <td>${formatDate(p.admissionDate)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-small btn-icon" onclick="viewPatient('${p.id}')">👁️</button>
                        <button class="btn btn-outline btn-small btn-icon" onclick="showPatientForm('${p.id}')">✏️</button>
                        <button class="btn btn-danger btn-small btn-icon" onclick="deletePatient('${p.id}')">🗑️</button>
                    </div>
                </td>
            </tr>
        `
    })
    .join("")
}

function viewPatient(id) {
  const patient = dataStore.getPatientById(id)
  const centre = dataStore.getCentreById(patient.centreId)

  modalTitle.textContent = patient.name
  modalContent.innerHTML = `
        <div class="detail-section">
            <h4>Personal Information</h4>
            <div class="detail-grid">
                <div class="detail-item"><label>Patient ID</label><span>${patient.id}</span></div>
                <div class="detail-item"><label>Status</label><span class="badge badge-${patient.status}">${formatStatus(patient.status)}</span></div>
                <div class="detail-item"><label>Date of Birth</label><span>${formatDate(patient.dob)}</span></div>
                <div class="detail-item"><label>Age</label><span>${patient.age || calculateAge(patient.dob)} years</span></div>
                <div class="detail-item"><label>Gender</label><span>${patient.gender || "N/A"}</span></div>
                <div class="detail-item"><label>Phone</label><span>${patient.phone}</span></div>
                <div class="detail-item"><label>Email</label><span>${patient.email || "N/A"}</span></div>
                <div class="detail-item"><label>Address</label><span>${patient.address}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <h4>Identity & Emergency Contact</h4>
            <div class="detail-grid">
                <div class="detail-item"><label>Aadhar Number</label><span>${patient.aadharNumber || "N/A"}</span></div>
                <div class="detail-item"><label>Family Contact</label><span>${patient.familyContactName || "N/A"}</span></div>
                <div class="detail-item"><label>Family Phone</label><span>${patient.familyContactPhone || "N/A"}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <h4>Treatment Information</h4>
            <div class="detail-grid">
                <div class="detail-item"><label>Centre</label><span>${centre?.name || "Unknown"}</span></div>
                <div class="detail-item"><label>Addiction Type</label><span>${patient.addictionType || "N/A"}</span></div>
                <div class="detail-item"><label>Admission Date</label><span>${formatDate(patient.admissionDate)}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <h4>Medications</h4>
            ${
              patient.medications && patient.medications.length > 0
                ? `
                <div class="medication-list">
                    ${patient.medications
                      .map(
                        (m) => `
                        <div class="medication-item">
                            <h5>${m.name}</h5>
                            <p><strong>Dosage:</strong> ${m.dosage}</p>
                            <p><strong>Frequency:</strong> ${m.frequency}</p>
                            <p><strong>Prescribed by:</strong> ${m.prescribedBy}</p>
                            <p><strong>Start Date:</strong> ${formatDate(m.startDate)}</p>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            `
                : '<p class="empty-state">No medications recorded</p>'
            }
            <button class="btn btn-secondary btn-small" style="margin-top: 15px;" onclick="showAddMedicationForm('${patient.id}')">+ Add Medication</button>
        </div>
    `
  openModal()
}

function showPatientForm(id = null) {
  const patient = id ? dataStore.getPatientById(id) : null
  let centres = dataStore.getCentres()

  if (currentUser.role === "centre_admin") {
    centres = centres.filter((c) => c.id === currentUser.centreId)
  }

  modalTitle.textContent = patient ? "Edit Patient" : "Add New Patient"
  modalContent.innerHTML = `
        <form id="patient-form">
            <div class="form-row">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" id="patient-name" value="${patient?.name || ""}" required>
                </div>
                <div class="form-group">
                    <label>Date of Birth *</label>
                    <input type="date" id="patient-dob" value="${patient?.dob || ""}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Gender *</label>
                    <select id="patient-gender" required>
                        <option value="">Select Gender</option>
                        <option value="male" ${patient?.gender === "male" ? "selected" : ""}>Male</option>
                        <option value="female" ${patient?.gender === "female" ? "selected" : ""}>Female</option>
                        <option value="other" ${patient?.gender === "other" ? "selected" : ""}>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" id="patient-phone" value="${patient?.phone || ""}" required>
                </div>
            </div>
            <div class="form-group">
                <label>Address *</label>
                <textarea id="patient-address" rows="2" required>${patient?.address || ""}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Aadhar Number *</label>
                    <input type="text" id="patient-aadhar" value="${patient?.aadharNumber || ""}" placeholder="XXXX-XXXX-XXXX" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="patient-email" value="${patient?.email || ""}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Family Contact Name *</label>
                    <input type="text" id="patient-family-name" value="${patient?.familyContactName || ""}" placeholder="Name (Relation)" required>
                </div>
                <div class="form-group">
                    <label>Family Contact Phone *</label>
                    <input type="tel" id="patient-family-phone" value="${patient?.familyContactPhone || ""}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Addiction Type *</label>
                    <select id="patient-addiction" required>
                        <option value="">Select Addiction Type</option>
                        ${ADDICTION_TYPES.map((a) => `<option value="${a}" ${patient?.addictionType === a ? "selected" : ""}>${a}</option>`).join("")}
                    </select>
                </div>
                <div class="form-group">
                    <label>Centre *</label>
                    <select id="patient-centre" required ${patient ? "disabled" : ""}>
                        <option value="">Select Centre</option>
                        ${centres.map((c) => `<option value="${c.id}" ${patient?.centreId === c.id ? "selected" : ""}>${c.name}</option>`).join("")}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Admission Date *</label>
                    <input type="date" id="patient-admission" value="${patient?.admissionDate || new Date().toISOString().split("T")[0]}" required>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="patient-status">
                        <option value="admitted" ${patient?.status === "admitted" ? "selected" : ""}>Admitted</option>
                        <option value="under_treatment" ${patient?.status === "under_treatment" ? "selected" : ""}>Under Treatment</option>
                        <option value="recovering" ${patient?.status === "recovering" ? "selected" : ""}>Recovering</option>
                        <option value="discharged" ${patient?.status === "discharged" ? "selected" : ""}>Discharged</option>
                    </select>
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${patient ? "Update" : "Add"} Patient</button>
            </div>
        </form>
    `

  document.getElementById("patient-form").addEventListener("submit", (e) => {
    e.preventDefault()
    savePatient(id)
  })

  openModal()
}

function savePatient(id) {
  const dob = document.getElementById("patient-dob").value
  const centreId = document.getElementById("patient-centre").value

  const data = {
    name: document.getElementById("patient-name").value,
    dob: dob,
    age: calculateAge(dob),
    gender: document.getElementById("patient-gender").value,
    phone: document.getElementById("patient-phone").value,
    email: document.getElementById("patient-email").value,
    address: document.getElementById("patient-address").value,
    aadharNumber: document.getElementById("patient-aadhar").value,
    familyContactName: document.getElementById("patient-family-name").value,
    familyContactPhone: document.getElementById("patient-family-phone").value,
    addictionType: document.getElementById("patient-addiction").value,
    admissionDate: document.getElementById("patient-admission").value,
    status: document.getElementById("patient-status").value,
  }

  if (id) {
    dataStore.updatePatient(id, data)
  } else {
    data.id = dataStore.generatePatientId(centreId)
    data.centreId = centreId
    data.medications = []
    dataStore.addPatient(data)
  }

  closeModal()
  renderPatients()
}

function showAddMedicationForm(patientId) {
  const patient = dataStore.getPatientById(patientId)

  modalTitle.textContent = `Add Medication - ${patient.name}`
  modalContent.innerHTML = `
        <form id="medication-form">
            <div class="form-group">
                <label>Medication Name *</label>
                <input type="text" id="med-name" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Dosage *</label>
                    <input type="text" id="med-dosage" placeholder="e.g., 50mg" required>
                </div>
                <div class="form-group">
                    <label>Frequency *</label>
                    <input type="text" id="med-frequency" placeholder="e.g., Twice daily" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Prescribed By *</label>
                    <input type="text" id="med-prescriber" required>
                </div>
                <div class="form-group">
                    <label>Start Date *</label>
                    <input type="date" id="med-start" value="${new Date().toISOString().split("T")[0]}" required>
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" onclick="viewPatient('${patientId}')">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Medication</button>
            </div>
        </form>
    `

  document.getElementById("medication-form").addEventListener("submit", (e) => {
    e.preventDefault()

    const medication = {
      id: "MED" + Date.now(),
      name: document.getElementById("med-name").value,
      dosage: document.getElementById("med-dosage").value,
      frequency: document.getElementById("med-frequency").value,
      prescribedBy: document.getElementById("med-prescriber").value,
      startDate: document.getElementById("med-start").value,
    }

    patient.medications = patient.medications || []
    patient.medications.push(medication)
    dataStore.updatePatient(patientId, { medications: patient.medications })

    viewPatient(patientId)
  })
}

function deletePatient(id) {
  if (confirm("Are you sure you want to delete this patient record? This action cannot be undone.")) {
    dataStore.deletePatient(id)
    renderPatients()
  }
}

// Support/Queries
function loadSupport() {
  renderQueries()
}

function renderQueries() {
  const statusFilter = document.getElementById("query-status-filter").value
  const priorityFilter = document.getElementById("query-priority-filter").value

  let queries = dataStore.getQueries()

  // Filter for centre admin
  if (currentUser.role === "centre_admin") {
    queries = queries.filter((q) => q.centreId === currentUser.centreId)
  }

  if (statusFilter) {
    queries = queries.filter((q) => q.status === statusFilter)
  }
  if (priorityFilter) {
    queries = queries.filter((q) => q.priority === priorityFilter)
  }

  const tbody = document.getElementById("queries-table-body")

  if (queries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No queries found</td></tr>'
    return
  }

  tbody.innerHTML = queries
    .map(
      (q) => `
        <tr>
            <td><strong>${q.id}</strong></td>
            <td>${q.subject}</td>
            <td>${q.centreName}</td>
            <td><span class="badge badge-${q.priority}">${q.priority}</span></td>
            <td><span class="badge badge-${q.status}">${formatStatus(q.status)}</span></td>
            <td>${formatDate(q.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-outline btn-small btn-icon" onclick="viewQuery('${q.id}')">👁️</button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

function showQueryForm() {
  const centre = currentUser.role === "centre_admin" ? dataStore.getCentreById(currentUser.centreId) : null

  modalTitle.textContent = "Raise New Query"
  modalContent.innerHTML = `
        <form id="query-form">
            <div class="form-group">
                <label>Subject *</label>
                <input type="text" id="query-subject" required>
            </div>
            <div class="form-group">
                <label>Description *</label>
                <textarea id="query-description" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label>Priority *</label>
                <select id="query-priority" required>
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Submit Query</button>
            </div>
        </form>
    `

  document.getElementById("query-form").addEventListener("submit", (e) => {
    e.preventDefault()

    const centre = dataStore.getCentreById(currentUser.centreId)
    const query = {
      id: dataStore.generateQueryId(),
      centreId: currentUser.centreId,
      centreName: centre?.name || "Unknown Centre",
      subject: document.getElementById("query-subject").value,
      description: document.getElementById("query-description").value,
      priority: document.getElementById("query-priority").value,
      status: "open",
      createdBy: currentUser.name,
      createdAt: new Date().toISOString().split("T")[0],
      responses: [],
    }

    dataStore.addQuery(query)
    closeModal()
    renderQueries()
  })

  openModal()
}

function viewQuery(id) {
  const query = dataStore.getQueryById(id)

  modalTitle.textContent = query.subject
  modalContent.innerHTML = `
        <div class="detail-section">
            <h4>Query Details</h4>
            <div class="detail-grid">
                <div class="detail-item"><label>Query ID</label><span>${query.id}</span></div>
                <div class="detail-item"><label>Status</label><span class="badge badge-${query.status}">${formatStatus(query.status)}</span></div>
                <div class="detail-item"><label>Centre</label><span>${query.centreName}</span></div>
                <div class="detail-item"><label>Priority</label><span class="badge badge-${query.priority}">${query.priority}</span></div>
                <div class="detail-item"><label>Created By</label><span>${query.createdBy}</span></div>
                <div class="detail-item"><label>Created At</label><span>${formatDate(query.createdAt)}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <h4>Description</h4>
            <p>${query.description}</p>
        </div>
        <div class="response-thread">
            <h4>Responses</h4>
            ${
              query.responses && query.responses.length > 0
                ? query.responses
                    .map(
                      (r) => `
                    <div class="response-item ${r.isAdmin ? "admin" : ""}">
                        <div class="response-header">
                            <strong>${r.respondedBy}</strong>
                            <span>${formatDate(r.respondedAt)}</span>
                        </div>
                        <p>${r.message}</p>
                    </div>
                `,
                    )
                    .join("")
                : '<p class="empty-state">No responses yet</p>'
            }
        </div>
        ${
          currentUser.role === "super_admin"
            ? `
            <div class="detail-section" style="margin-top: 20px;">
                <h4>Add Response</h4>
                <div class="form-group">
                    <textarea id="response-message" rows="3" placeholder="Type your response..."></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Update Status</label>
                        <select id="response-status">
                            <option value="open" ${query.status === "open" ? "selected" : ""}>Open</option>
                            <option value="in_progress" ${query.status === "in_progress" ? "selected" : ""}>In Progress</option>
                            <option value="resolved" ${query.status === "resolved" ? "selected" : ""}>Resolved</option>
                            <option value="closed" ${query.status === "closed" ? "selected" : ""}>Closed</option>
                        </select>
                    </div>
                    <div class="form-group" style="display: flex; align-items: flex-end;">
                        <button class="btn btn-primary" onclick="respondToQuery('${query.id}')">Send Response</button>
                    </div>
                </div>
            </div>
        `
            : ""
        }
    `
  openModal()
}

function respondToQuery(id) {
  const message = document.getElementById("response-message").value
  const status = document.getElementById("response-status").value

  if (!message.trim()) {
    alert("Please enter a response message.")
    return
  }

  const query = dataStore.getQueryById(id)
  query.responses = query.responses || []
  query.responses.push({
    id: "RES" + Date.now(),
    message: message,
    respondedBy: currentUser.name,
    respondedAt: new Date().toISOString().split("T")[0],
    isAdmin: true,
  })

  dataStore.updateQuery(id, { responses: query.responses, status: status })
  viewQuery(id)
}

// Orders
function loadOrders() {
  renderOrders()
}

function renderOrders() {
  const statusFilter = document.getElementById("order-status-filter").value
  const priorityFilter = document.getElementById("order-priority-filter").value

  let orders = dataStore.getOrders()

  // Filter for centre admin
  if (currentUser.role === "centre_admin") {
    orders = orders.filter((o) => o.targetCentreId === null || o.targetCentreId === currentUser.centreId)
  }

  if (statusFilter) {
    orders = orders.filter((o) => o.status === statusFilter)
  }
  if (priorityFilter) {
    orders = orders.filter((o) => o.priority === priorityFilter)
  }

  const tbody = document.getElementById("orders-table-body")

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No orders found</td></tr>'
    return
  }

  tbody.innerHTML = orders
    .map(
      (o) => `
        <tr>
            <td><strong>${o.id}</strong></td>
            <td>${o.subject}</td>
            <td>${o.targetCentreName}</td>
            <td><span class="badge badge-${o.priority}">${o.priority}</span></td>
            <td><span class="badge badge-${o.status}">${formatStatus(o.status)}</span></td>
            <td>${formatDate(o.deadline)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-outline btn-small btn-icon" onclick="viewOrder('${o.id}')">👁️</button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

function showOrderForm() {
  const centres = dataStore.getCentres()

  modalTitle.textContent = "Create New Order"
  modalContent.innerHTML = `
        <form id="order-form">
            <div class="form-group">
                <label>Subject *</label>
                <input type="text" id="order-subject" required>
            </div>
            <div class="form-group">
                <label>Instructions *</label>
                <textarea id="order-instruction" rows="4" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Target Centre</label>
                    <select id="order-target">
                        <option value="">All Centres</option>
                        ${centres.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
                    </select>
                </div>
                <div class="form-group">
                    <label>Priority *</label>
                    <select id="order-priority" required>
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Deadline *</label>
                <input type="date" id="order-deadline" required>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Issue Order</button>
            </div>
        </form>
    `

  document.getElementById("order-form").addEventListener("submit", (e) => {
    e.preventDefault()

    const targetId = document.getElementById("order-target").value
    const targetCentre = targetId ? dataStore.getCentreById(targetId) : null

    const order = {
      id: dataStore.generateOrderId(),
      subject: document.getElementById("order-subject").value,
      instruction: document.getElementById("order-instruction").value,
      targetCentreId: targetId || null,
      targetCentreName: targetCentre ? targetCentre.name : "All Centres",
      priority: document.getElementById("order-priority").value,
      status: "issued",
      deadline: document.getElementById("order-deadline").value,
      issuedBy: currentUser.name,
      issuedAt: new Date().toISOString().split("T")[0],
      acknowledgements: [],
    }

    dataStore.addOrder(order)
    closeModal()
    renderOrders()
  })

  openModal()
}

function viewOrder(id) {
  const order = dataStore.getOrderById(id)
  const hasAcknowledged = order.acknowledgements?.some((a) => a.centreId === currentUser.centreId)

  modalTitle.textContent = order.subject
  modalContent.innerHTML = `
        <div class="detail-section">
            <h4>Order Details</h4>
            <div class="detail-grid">
                <div class="detail-item"><label>Order ID</label><span>${order.id}</span></div>
                <div class="detail-item"><label>Status</label><span class="badge badge-${order.status}">${formatStatus(order.status)}</span></div>
                <div class="detail-item"><label>Target</label><span>${order.targetCentreName}</span></div>
                <div class="detail-item"><label>Priority</label><span class="badge badge-${order.priority}">${order.priority}</span></div>
                <div class="detail-item"><label>Issued By</label><span>${order.issuedBy}</span></div>
                <div class="detail-item"><label>Issued At</label><span>${formatDate(order.issuedAt)}</span></div>
                <div class="detail-item"><label>Deadline</label><span>${formatDate(order.deadline)}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <h4>Instructions</h4>
            <p>${order.instruction}</p>
        </div>
        ${
          currentUser.role === "super_admin"
            ? `
            <div class="detail-section">
                <h4>Acknowledgements</h4>
                ${
                  order.acknowledgements && order.acknowledgements.length > 0
                    ? order.acknowledgements
                        .map(
                          (a) => `
                        <div class="response-item">
                            <div class="response-header">
                                <strong>${a.acknowledgedBy}</strong>
                                <span>${formatDate(a.acknowledgedAt)}</span>
                            </div>
                            <p>Centre ID: ${a.centreId}</p>
                        </div>
                    `,
                        )
                        .join("")
                    : '<p class="empty-state">No acknowledgements yet</p>'
                }
            </div>
        `
            : ""
        }
        ${
          currentUser.role === "centre_admin" && !hasAcknowledged
            ? `
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="acknowledgeOrder('${order.id}')">Acknowledge Order</button>
                <button class="btn btn-secondary" onclick="completeOrder('${order.id}')">Mark as Completed</button>
            </div>
        `
            : ""
        }
        ${
          currentUser.role === "centre_admin" && hasAcknowledged && order.status !== "completed"
            ? `
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="completeOrder('${order.id}')">Mark as Completed</button>
            </div>
        `
            : ""
        }
    `
  openModal()
}

function acknowledgeOrder(id) {
  const order = dataStore.getOrderById(id)
  order.acknowledgements = order.acknowledgements || []
  order.acknowledgements.push({
    centreId: currentUser.centreId,
    acknowledgedBy: currentUser.name,
    acknowledgedAt: new Date().toISOString().split("T")[0],
  })

  dataStore.updateOrder(id, { acknowledgements: order.acknowledgements, status: "acknowledged" })
  viewOrder(id)
  renderOrders()
}

function completeOrder(id) {
  dataStore.updateOrder(id, { status: "completed" })
  viewOrder(id)
  renderOrders()
}

// Modal Functions
function openModal() {
  modalOverlay.classList.remove("hidden")
}

function closeModal() {
  modalOverlay.classList.add("hidden")
}

// Utility Functions
function formatDate(dateStr) {
  if (!dateStr) return "N/A"
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

function formatStatus(status) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

function calculateAge(dob) {
  if (!dob) return "N/A"
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Close modal on overlay click
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal()
  }
})

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal()
  }
})
