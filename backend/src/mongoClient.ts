import { MongoClient,Collection } from 'mongodb';
const url = 'mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@test-cluster.6f94f5o.mongodb.net/';
const client = new MongoClient(url);

const dbName = 'assignment';
const collectionName = 'assignment_SONU';

async function connectToMongoDB(): Promise<Collection>{
    await client.connect()
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return collection
}
export default connectToMongoDB