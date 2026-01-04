# MongoDB Integration Guide

This application is now integrated with MongoDB Atlas. Follow these steps to set up and use the database.

## Setup Instructions

### 1. Environment Variables

The `.env.local` file has been created with your MongoDB connection string. Make sure it contains:

```
MONGODB_URI=mongodb+srv://necks:fdLaWizvRAmTYvdG@cluster0.ebmc6q3.mongodb.net/rehabilitation-centre-tracking?retryWrites=true&w=majority&appName=Cluster0
NEXT_PUBLIC_API_URL=/api
```

### 2. Install Dependencies

Dependencies are already installed. If needed, run:
```bash
npm install
```

### 3. Seed the Database

Run the seed script to populate the database with initial data:

```bash
npm run seed
```

This will create:
- 3 users (1 super admin, 2 centre admins)
- 4 rehabilitation centres
- 4 sample patients
- 2 sample queries
- 2 sample orders

### 4. Start the Development Server

```bash
npm run dev
```

## API Routes

The application now uses API routes for all database operations:

### Centres API
- `GET /api/centres` - Get all centres (with filters)
- `POST /api/centres` - Create a new centre (super admin only)
- `PUT /api/centres` - Update a centre (super admin only)
- `DELETE /api/centres` - Delete a centre (super admin only)

### Patients API
- `GET /api/patients` - Get all patients (with filters)
- `POST /api/patients` - Create a new patient
- `PUT /api/patients` - Update a patient
- `DELETE /api/patients` - Delete a patient
- `PATCH /api/patients` - Add medication to a patient

### Queries API
- `GET /api/queries` - Get all queries (with filters)
- `POST /api/queries` - Create a new query
- `PUT /api/queries` - Update query status (super admin only)
- `PATCH /api/queries` - Add response to a query

### Orders API
- `GET /api/orders` - Get all orders (with filters)
- `POST /api/orders` - Create a new order (super admin only)
- `PUT /api/orders` - Update order status
- `PATCH /api/orders` - Acknowledge an order

### Users API
- `GET /api/users` - Get user by email (for login)
- `POST /api/users` - Create a new user

## Frontend Integration

The frontend (`app/page.tsx`) currently uses local state. To fully integrate with MongoDB:

1. Replace all local state management with API calls using the `lib/api.ts` utility functions
2. Use `useEffect` hooks to fetch data on component mount
3. Update CRUD operations to call the API routes
4. Handle loading and error states

### Example Usage:

```typescript
import { centresAPI, patientsAPI } from '@/lib/api'

// Fetch centres
const fetchCentres = async () => {
  try {
    const response = await centresAPI.getAll(
      currentUser?.role,
      currentUser?.centreId,
      stateFilter,
      centreSearch
    )
    setCentres(response.data)
  } catch (error) {
    console.error('Error fetching centres:', error)
  }
}

// Create a centre
const createCentre = async (centreData: any) => {
  try {
    const response = await centresAPI.create({
      ...centreData,
      role: currentUser?.role
    })
    // Refresh the list
    await fetchCentres()
  } catch (error) {
    console.error('Error creating centre:', error)
  }
}
```

## Database Collections

The MongoDB database uses the following collections:
- `users` - User accounts and authentication
- `centres` - Rehabilitation centres
- `patients` - Patient records
- `queries` - Support queries and responses
- `orders` - Orders and instructions

## Access Control

The API routes enforce access control:
- **Super Admin**: Full access to all data
- **Centre Admin**: Can only access/modify data for their assigned centre

## Notes

- All timestamps are stored as ISO strings or Date objects
- IDs are auto-generated if not provided
- The database connection is cached for performance
- All API routes include proper error handling

## Troubleshooting

1. **Connection Issues**: Check your MongoDB Atlas IP whitelist and connection string
2. **Seed Script Fails**: Ensure MongoDB connection is working and database exists
3. **API Errors**: Check browser console and server logs for detailed error messages

