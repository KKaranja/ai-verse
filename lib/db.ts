import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in your .env.local file'
  );
}

let clientPromise: Promise<MongoClient>;

// Declare a global variable to store the MongoClient promise in development
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to prevent creating multiple connections
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new MongoClient
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
