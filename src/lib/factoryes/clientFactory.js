/*
FACTORY FOR CLIENT OBJECT

// Setup client and slash commands
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    },
    restTimeOffset: 0,
    restWsBridgeTimeout: 100,
    retryLimit: 3,
    presence: {
        activities: [{
            name: 'with Discord.js!',
            type: 'PLAYING'
        }],
        status: 'online'
    }
});
*/


function clientFactory(){
    const { Client, Intents, GatewayIntentBits } = require('discord.js');
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ],
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        allowedMentions: {
            parse: ['users', 'roles'],
            repliedUser: true
        },
        restTimeOffset: 0,
        restWsBridgeTimeout: 100,
        retryLimit: 3,
        presence: {
            activities: [{
                name: 'with Discord.js!',
                type: 'PLAYING'
            }],
            status: 'online'
        }
    });
    return client;
}

module.exports = clientFactory;