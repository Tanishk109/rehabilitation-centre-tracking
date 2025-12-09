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

    let query: any = {}

    // Filter by centreId if centre_admin
    if (role === 'centre_admin' && centreId) {
      query.centreId = centreId
    }

    // Filter by centreId if provided
    if (centreId && role === 'super_admin') {
      query.centreId = centreId
    }

    // Filter by status
    if (status) {
      query.status = status
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
    const { role, centreId: userCentreId } = body

    // Centre admin can only create patients for their centre
    if (role === 'centre_admin') {
      body.centreId = userCentreId
    }

    // Generate ID if not provided
    if (!body.id) {
      const count = await patientsCollection.countDocuments()
      body.id = `P${String(count + 1).padStart(3, '0')}`
    }

    // Calculate age if not provided
    if (body.dob && !body.age) {
      const today = new Date()
      const birthDate = new Date(body.dob)
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      body.age = age
    }

    body.medications = body.medications || []
    body.createdAt = new Date()
    body.updatedAt = new Date()

    const { role: _, centreId: __, ...patientData } = body
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
    const { id, role, centreId: userCentreId } = body

    // Check if patient exists and belongs to centre admin's centre
    const existingPatient = await patientsCollection.findOne({ id })
    if (!existingPatient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Centre admin can only update patients from their centre
    if (role === 'centre_admin' && existingPatient.centreId !== userCentreId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: You can only update patients from your centre' },
        { status: 403 }
      )
    }

    // Ensure centre admin cannot change centreId
    if (role === 'centre_admin') {
      body.centreId = userCentreId
    }

    // Calculate age if dob changed
    if (body.dob) {
      const today = new Date()
      const birthDate = new Date(body.dob)
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      body.age = age
    }

    const { id: patientId, role: _, centreId: __, ...updateData } = body
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

    // Check if patient exists
    const patient = await patientsCollection.findOne({ id })
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

    const result = await patientsCollection.deleteOne({ id })

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

