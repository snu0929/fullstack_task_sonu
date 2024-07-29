import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import redisClient from './redisClient';
import connectToMongoDB from './mongoClient';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(cors()); // Add this line to enable CORS for all routes

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/fetchAllTasks', async (req, res) => {
    try {
      const collection = await connectToMongoDB();
      const items = await collection.find().toArray();
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).send('Error fetching items');
    }
  });

  
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('add', async (item: string) => {
    try {
      await redisClient.rPush('FULLSTACK_SONU', item);
      const items = await redisClient.lRange('FULLSTACK_SONU', 0, -1);
      console.log('Current items in Redis:', items);
      io.emit('taskListUpdated', items);
      // Check if there are more than 50 items in the cache
      if (items.length > 50) {
        const collection = await connectToMongoDB();
        await collection.insertMany(items.map((item) => ({ item })));

        // Flush Redis cache
        await redisClient.del('FULLSTACK_SONU');
        console.log('Moved items to MongoDB and flushed Redis cache');
      }
    } catch (error) {
      console.error('Error handling add event:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
