import { MongoClient, Db } from 'mongodb'

// Default connection string if not in env (for scripts and fallback)
const defaultUri = 'mongodb+srv://necks:fdLaWizvRAmTYvdG@cluster0.ebmc6q3.mongodb.net/rehabilitation-centre-tracking?retryWrites=true&w=majority&appName=Cluster0'

// Get MongoDB URI from environment or use default
let uri: string

if (process.env.MONGODB_URI) {
  uri = process.env.MONGODB_URI
} else if (typeof window === 'undefined') {
  // Server-side: use default if not set (for scripts and development)
  uri = defaultUri
  console.warn('⚠️  MONGODB_URI not set, using default connection string')
} else {
  // Client-side: should never happen, but handle gracefully
  throw new Error('MongoDB connection is not available on the client side')
}

const options = {
  // Add connection options for better reliability
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise
    // Test the connection
    await client.db('admin').command({ ping: 1 })
    return client.db('rehabilitation-centre-tracking')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
