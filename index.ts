import { mqttClient, mqttConnect } from './src/mqtt';
import { config } from './src/config';
import fastify from 'fastify';
import { fastifyCors } from '@fastify/cors';
import axios from 'axios';

export const run = async () => {
    //connect to the mqtt broker
    mqttConnect();

    mqttClient.on('connect', () => {
        console.log('connected to mqtt broker');
        for (const sub of config.subscriptions) {
            mqttClient.subscribe(sub);
        }
    });

    //handle message reception
    mqttClient.on('message', (topic: string, message: Buffer) => {
        const url = `${process.env.HTTP_FORWARD_URL}/${topic}`;
        axios
            .post(url, JSON.parse(message.toString()), {
                headers: { 'Content-Type': 'application/json' },
            })
            .catch((err) => console.log(err));
    });

    const server = fastify({ logger: false });
    server.register(fastifyCors, { origin: '*' });

    //send all messages to the mqtt broker
    server.post('/*', async (request, reply) => {
        const topic = request.url.substring(1);
        const message = request.body;

        mqttClient.publish(topic, JSON.stringify(message), {
            qos: 2,
            retain: false,
        });
    });

    //start fastify server
    await server.listen({ port: parseInt(process.env.PORT) || 5001 });
};

run().catch((err) => console.error(err));
