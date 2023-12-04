import * as mqtt from 'mqtt';

export let mqttClient: mqtt.MqttClient;

export enum Cmd {
    CmdChat = 'chat',
    CmdChatAck = 'chat-ack',
    CmdQa = 'qa',
}

export const mqttConnect = (clientId?: string) => {
    mqttClient = mqtt.connect(process.env.BROKER, {
        clean: true,
        connectTimeout: 4000,
        clientId: clientId || process.env.CLIENT_ID,
        username: 'ieo-mqtt-db-agent',
        password: process.env.JWT,
        resubscribe: true,
        reconnectPeriod: 0,
    });
};
