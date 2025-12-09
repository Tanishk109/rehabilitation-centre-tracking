import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Centre } from '@/lib/models'

// GET - Fetch all centres (with optional filtering for centre_admin)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const centresCollection = db.collection<Centre>('centres')
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const centreId = searchParams.get('centreId')
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    let query: { id?: string; state?: string; $or?: Array<{ name?: { $regex: string; $options: string } }> } = {}

    // Filter by centreId if centre_admin
    if (role === 'centre_admin' && centreId) {
      query.id = centreId
    }

    // Filter by state
    if (state) {
      query.state = state
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } }
      ]
    }

    const centres = await centresCollection.find(query).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({ success: true, data: centres })
  } catch (error) {
    console.error('Error fetching centres:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch centres' },
      { status: 500 }
    )
  }
}

// POST - Create a new centre
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const centresCollection = db.collection<Centre>('centres')
    
    const body = await request.json()
    const { role } = body

    // Only super_admin can create centres
    if (role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only super admin can create centres' },
        { status: 403 }
      )
    }

    // Generate ID if not provided
    if (!body.id) {
      const stateCode = body.state.substring(0, 2).toUpperCase()
      const count = await centresCollection.countDocuments()
      body.id = `C${stateCode}${String(count + 1).padStart(3, '0')}`
    }

    body.createdAt = new Date().toISOString().split('T')[0]
    body.updatedAt = new Date()

    const result = await centresCollection.insertOne(body)
    
    return NextResponse.json(
      { success: true, data: { ...body, _id: result.insertedId } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating centre:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create centre' },
      { status: 500 }
    )
  }
}

// PUT - Update a centre
export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase()
    const centresCollection = db.collection<Centre>('centres')
    
    const body = await request.json()
    const { id, role, centreId: userCentreId } = body

    // Check if centre exists
    const existingCentre = await centresCollection.findOne({ id })
    if (!existingCentre) {
      return NextResponse.json(
        { success: false, error: 'Centre not found' },
        { status: 404 }
      )
    }

    // Centre admin can only update their own centre
    if (role === 'centre_admin') {
      if (id !== userCentreId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: You can only update your own centre' },
          { status: 403 }
        )
      }
    } else if (role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only super admin or centre admin can update centres' },
        { status: 403 }
      )
    }

    // Centre admin cannot change certain fields (id, state - which affects id generation)
    const { id: centreId, role: _, centreId: __, ...updateData } = body
    
    // Remove fields that centre admin shouldn't be able to change
    if (role === 'centre_admin') {
      delete updateData.id
      delete updateData.state // State affects centre ID, so prevent changes
    }
    
    updateData.updatedAt = new Date()

    const result = await centresCollection.updateOne(
      { id: centreId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Centre not found' },
        { status: 404 }
      )
    }

    const updatedCentre = await centresCollection.findOne({ id: centreId })
    
    return NextResponse.json({ success: true, data: updatedCentre })
  } catch (error) {
    console.error('Error updating centre:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update centre' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a centre
export async function DELETE(request: NextRequest) {
  try {
    const db = await getDatabase()
    const centresCollection = db.collection<Centre>('centres')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const role = searchParams.get('role')

    // Only super_admin can delete centres
    if (role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only super admin can delete centres' },
        { status: 403 }
      )
    }

    const result = await centresCollection.deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Centre not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Centre deleted successfully' })
  } catch (error) {
    console.error('Error deleting centre:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete centre' },
      { status: 500 }
    )
  }
}

