import { io as Client } from 'socket.io-client';
import mongoose from 'mongoose';
import supertest from 'supertest';
// import request from 'supertest';

// import Chat from '../../backend/models/ChatModel';
// import connectDB from '../../backend/config/connectDB';
import { server } from '../../backend/app';
const socketUrl = 'http://localhost:4000';

require('dotenv').config();

beforeAll((done) => {
    if (!server.listening) {
        server.listen(4000, () => {
            console.log('Test server running on port 4000');
            done();
        });
    } else {
        done();
    }
});
afterAll((done) => {
    server.close(done);
});

describe('Test root app', () => {
    test('It should root test GET method', async () => {
        const response = await supertest(server).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Socket.IO server running');
    });
});
