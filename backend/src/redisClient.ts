import { createClient } from "redis";

const redisClient=createClient({url:'redis://default:dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB@redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com:12675'})

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

export default redisClient;