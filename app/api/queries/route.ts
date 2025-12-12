import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Query } from '@/lib/models'

// GET - Fetch all queries (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const queriesCollection = db.collection<Query>('queries')
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const centreId = searchParams.get('centreId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    let query: { centreId?: string; status?: Query['status']; priority?: Query['priority'] } = {}

    // Filter by centreId if centre_admin
    if (role === 'centre_admin' && centreId) {
      query.centreId = centreId
    }

    // Filter by status (validate it's a valid status)
    if (status && ['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      query.status = status as Query['status']
    }

    // Filter by priority (validate it's a valid priority)
    if (priority && ['low', 'medium', 'high', 'urgent'].includes(priority)) {
      query.priority = priority as Query['priority']
    }

    const queries = await queriesCollection.find(query).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({ success: true, data: queries })
  } catch (error) {
    console.error('Error fetching queries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch queries' },
      { status: 500 }
    )
  }
}

// POST - Create a new query
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const queriesCollection = db.collection<Query>('queries')
    const centresCollection = db.collection('centres')
    
    const body = await request.json()
    const { role, centreId: userCentreId, createdBy } = body

    // Centre admin can only create queries for their centre
    if (role === 'centre_admin') {
      if (!userCentreId || userCentreId === 'undefined' || userCentreId === 'null') {
        return NextResponse.json(
          { success: false, error: 'Centre ID is required for centre admin. Please ensure you are logged in correctly.' },
          { status: 400 }
        )
      }
      body.centreId = userCentreId
    } else if (role === 'super_admin' && !body.centreId) {
      return NextResponse.json(
        { success: false, error: 'Centre ID is required' },
        { status: 400 }
      )
    }

    // Get centre name
    const centre = await centresCollection.findOne({ id: body.centreId })
    body.centreName = centre?.name || ''

    // Generate unique ID if not provided
    if (!body.id) {
      // Find the highest existing query number to ensure uniqueness
      const existingQueries = await queriesCollection
        .find({ id: { $regex: /^QRY-?\d+$/ } })
        .sort({ id: -1 })
        .limit(1)
        .toArray()
      
      let nextNumber = 1
      if (existingQueries.length > 0 && existingQueries[0].id) {
        // Extract number from existing ID (e.g., QRY-00123 -> 123 or QRY123 -> 123)
        const match = existingQueries[0].id.match(/\d+/)
        if (match) {
          nextNumber = parseInt(match[0], 10) + 1
        }
      }
      
      // Format as QRY-XXXXX (5 digits for better scalability)
      body.id = `QRY-${String(nextNumber).padStart(5, '0')}`
      
      // Double-check uniqueness (in case of race conditions)
      const existing = await queriesCollection.findOne({ id: body.id })
      if (existing) {
        // If exists, increment and try again
        body.id = `QRY-${String(nextNumber + 1).padStart(5, '0')}`
      }
    }

    body.createdBy = createdBy || 'Unknown'
    body.createdAt = new Date().toISOString().split('T')[0]
    body.responses = []
    body.updatedAt = new Date()

    // Remove role and createdBy from queryData (they're only for validation), but KEEP centreId
    const { role: _, createdBy: ___, ...queryData } = body
    const result = await queriesCollection.insertOne(queryData)
    
    return NextResponse.json(
      { success: true, data: { ...queryData, _id: result.insertedId } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating query:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create query' },
      { status: 500 }
    )
  }
}

// PUT - Update query status (only super admin)
export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase()
    const queriesCollection = db.collection<Query>('queries')
    
    const body = await request.json()
    const { id, status, role } = body

    // Only super_admin can update query status
    if (role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only super admin can update query status' },
        { status: 403 }
      )
    }

    const result = await queriesCollection.updateOne(
      { id },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Query not found' },
        { status: 404 }
      )
    }

    const updatedQuery = await queriesCollection.findOne({ id })
    
    return NextResponse.json({ success: true, data: updatedQuery })
  } catch (error) {
    console.error('Error updating query:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update query' },
      { status: 500 }
    )
  }
}

// PATCH - Add response to query
export async function PATCH(request: NextRequest) {
  try {
    const db = await getDatabase()
    const queriesCollection = db.collection<Query>('queries')
    
    const body = await request.json()
    const { queryId, message, respondedBy, role, centreId: userCentreId } = body

    // Check if query exists
    const query = await queriesCollection.findOne({ id: queryId })
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query not found' },
        { status: 404 }
      )
    }

    // Centre admin can only respond to queries from their centre
    if (role === 'centre_admin') {
      if (!userCentreId || userCentreId === 'undefined' || userCentreId === 'null') {
        return NextResponse.json(
          { success: false, error: 'Centre ID is required for centre admin. Please ensure you are logged in correctly.' },
          { status: 400 }
        )
      }
      if (query.centreId !== userCentreId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: You can only respond to queries from your centre' },
        { status: 403 }
      )
      }
    }

    // Generate response ID
    const responseId = `RES${String(query.responses.length + 1).padStart(3, '0')}`
    const newResponse = {
      id: responseId,
      message,
      respondedBy,
      respondedAt: new Date().toISOString().split('T')[0],
      isAdmin: role === 'super_admin'
    }

    // Update status if super admin responds
    const updateData: {
      $push: { responses: typeof newResponse }
      $set: { updatedAt: Date; status?: Query['status'] }
    } = {
      $push: { responses: newResponse },
      $set: { updatedAt: new Date() }
    }

    if (role === 'super_admin') {
      updateData.$set.status = 'in_progress' as Query['status']
    }

    const result = await queriesCollection.updateOne(
      { id: queryId },
      updateData
    )

    const updatedQuery = await queriesCollection.findOne({ id: queryId })
    
    return NextResponse.json({ success: true, data: updatedQuery })
  } catch (error) {
    console.error('Error adding response:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add response' },
      { status: 500 }
    )
  }
}

