import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Patient } from '@/lib/models'

// GET - Fetch all patients (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const patientsCollection = db.collection<Patient>('patients')
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const centreId = searchParams.get('centreId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query: { centreId?: string; status?: "admitted" | "under_treatment" | "recovering" | "discharged"; $or?: Array<{ name?: { $regex: string; $options: string }; id?: { $regex: string; $options: string }; aadharNumber?: { $regex: string; $options: string } }> } = {}

    // Filter by centreId if centre_admin
    if (role === 'centre_admin' && centreId) {
      query.centreId = centreId
    }

    // Filter by centreId if provided
    if (centreId && role === 'super_admin') {
      query.centreId = centreId
    }

    // Filter by status
    if (status && (status === 'admitted' || status === 'under_treatment' || status === 'recovering' || status === 'discharged')) {
      query.status = status as "admitted" | "under_treatment" | "recovering" | "discharged"
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } },
        { aadharNumber: { $regex: search, $options: 'i' } }
      ]
    }

    const patients = await patientsCollection.find(query).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({ success: true, data: patients })
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

// POST - Create a new patient
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const patientsCollection = db.collection<Patient>('patients')
    
    const body = await request.json()
    const { role, centreId } = body

    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Patient name is required' },
        { status: 400 }
      )
    }

    if (!body.dob || !body.dob.trim()) {
      return NextResponse.json(
        { success: false, error: 'Date of birth is required' },
        { status: 400 }
      )
    }

    // Centre admin can only create patients for their centre
    if (role === 'centre_admin') {
      // Ensure centreId is set from the request body
      if (!centreId || centreId === 'undefined' || centreId === 'null' || centreId === '') {
        return NextResponse.json(
          { success: false, error: 'Centre ID is required for centre admin. Please ensure you are logged in correctly.' },
          { status: 400 }
        )
      }
      // Ensure the centreId from the request matches the user's centreId (security check)
      body.centreId = centreId
    } else if (role === 'super_admin') {
      // Super admin must provide centreId
      if (!body.centreId || body.centreId === 'undefined' || body.centreId === 'null' || body.centreId === '') {
        return NextResponse.json(
          { success: false, error: 'Centre ID is required. Please select a centre for the patient.' },
          { status: 400 }
        )
      }
      // Validate that the centre exists
      const centresCollection = db.collection('centres')
      const centre = await centresCollection.findOne({ id: body.centreId })
      if (!centre) {
        return NextResponse.json(
          { success: false, error: 'Invalid centre ID. Please select a valid centre.' },
          { status: 400 }
        )
      }
    }

    // Generate ID if not provided
    if (!body.id) {
      const count = await patientsCollection.countDocuments()
      body.id = `P${String(count + 1).padStart(3, '0')}`
    }

    // Calculate age if not provided (handles DD/MM/YYYY format)
    if (body.dob && !body.age) {
      let birthDate: Date
      const dobString = String(body.dob).trim()
      
      // Parse DD/MM/YYYY format
      const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
      const match = dobString.match(ddmmyyyyRegex)
      
      if (match) {
        const [, day, month, year] = match
        birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      } else {
        // Try YYYY-MM-DD format (backward compatibility)
        birthDate = new Date(dobString)
      }
      
      if (!isNaN(birthDate.getTime())) {
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
        body.age = age
      }
    }

    body.medications = body.medications || []
    body.createdAt = new Date()
    body.updatedAt = new Date()

    // Remove role from patientData (it's only for validation), but KEEP centreId
    const { role: _, ...patientData } = body
    const result = await patientsCollection.insertOne(patientData)
    
    return NextResponse.json(
      { success: true, data: { ...patientData, _id: result.insertedId } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create patient' },
      { status: 500 }
    )
  }
}

// PUT - Update a patient
export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase()
    const patientsCollection = db.collection<Patient>('patients')
    
    const body = await request.json()
    const { id, role, centreId } = body

    // Check if patient exists and belongs to centre admin's centre
    const existingPatient = await patientsCollection.findOne({ id })
    if (!existingPatient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Centre admin can only update patients from their centre
    if (role === 'centre_admin') {
      if (!centreId || centreId === 'undefined' || centreId === 'null' || centreId === '') {
        return NextResponse.json(
          { success: false, error: 'Centre ID is required for centre admin. Please ensure you are logged in correctly.' },
          { status: 400 }
        )
      }
      if (existingPatient.centreId !== centreId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: You can only update patients from your centre' },
          { status: 403 }
        )
      }
      // Ensure centre admin cannot change centreId
      body.centreId = centreId
    }

    // Calculate age if dob changed (handles DD/MM/YYYY format)
    if (body.dob) {
      let birthDate: Date
      const dobString = String(body.dob).trim()
      
      // Parse DD/MM/YYYY format
      const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
      const match = dobString.match(ddmmyyyyRegex)
      
      if (match) {
        const [, day, month, year] = match
        birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      } else {
        // Try YYYY-MM-DD format (backward compatibility)
        birthDate = new Date(dobString)
      }
      
      if (!isNaN(birthDate.getTime())) {
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
        body.age = age
      }
    }

    // Remove role from updateData (it's only for validation), but KEEP centreId
    const { id: patientId, role: _, ...updateData } = body
    updateData.updatedAt = new Date()

    const result = await patientsCollection.updateOne(
      { id: patientId },
      { $set: updateData }
    )

    const updatedPatient = await patientsCollection.findOne({ id: patientId })
    
    return NextResponse.json({ success: true, data: updatedPatient })
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update patient' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a patient
export async function DELETE(request: NextRequest) {
  try {
    const db = await getDatabase()
    const patientsCollection = db.collection<Patient>('patients')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const role = searchParams.get('role')
    const centreId = searchParams.get('centreId')

    // Validate id parameter
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    // Check if patient exists
    const patient = await patientsCollection.findOne({ id: id })
    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Centre admin can only delete patients from their centre
    if (role === 'centre_admin' && patient.centreId !== centreId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: You can only delete patients from your centre' },
        { status: 403 }
      )
    }

    const result = await patientsCollection.deleteOne({ id: id })

    return NextResponse.json({ success: true, message: 'Patient deleted successfully' })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete patient' },
      { status: 500 }
    )
  }
}

// PATCH - Add medication to patient
export async function PATCH(request: NextRequest) {
  try {
    const db = await getDatabase()
    const patientsCollection = db.collection<Patient>('patients')
    
    const body = await request.json()
    const { patientId, medication, role, centreId: userCentreId } = body

    // Check if patient exists
    const patient = await patientsCollection.findOne({ id: patientId })
    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Centre admin can only add medications to patients from their centre
    if (role === 'centre_admin' && patient.centreId !== userCentreId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: You can only add medications to patients from your centre' },
        { status: 403 }
      )
    }

    // Generate medication ID
    const medicationId = `MED${String(patient.medications.length + 1).padStart(3, '0')}`
    const newMedication = { ...medication, id: medicationId }

    const result = await patientsCollection.updateOne(
      { id: patientId },
      { 
        $push: { medications: newMedication },
        $set: { updatedAt: new Date() }
      }
    )

    const updatedPatient = await patientsCollection.findOne({ id: patientId })
    
    return NextResponse.json({ success: true, data: updatedPatient })
  } catch (error) {
    console.error('Error adding medication:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add medication' },
      { status: 500 }
    )
  }
}

