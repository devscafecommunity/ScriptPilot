// Load dotenv
require('dotenv').config();
const { Discord, GatewayIntentBits, Client } = require('discord.js');
const { Routes } = require('discord-api-types/v9');

const clientFactory = require('./lib/factoryes/clientFactory');
const client = clientFactory();

// Commands
const commandloader = require('./lib/commands/commandloader');
const commandHandler = require('./lib/commands/commandhandler');


const commands = commandloader('./commands', '../../commands/');
console.log("cmd: " + commands);
commandHandler(client, commands);

// Events
const eventloader = require('./lib/events/eventloader');
const eventHandler = require('./lib/events/eventhandler');

const events = eventloader('./events', '../../events/');
eventHandler(client, events);

// Load main
const discordRestFactory = require('./lib/factoryes/discordRestFactory');

// Main server
const main = require('./lib/main/botmain');

const CLIENT_ID = process.env.CLIENT_ID;
const TOKEN = process.env.TOKEN;

const rest = discordRestFactory(TOKEN);
const routes = Routes;

const { osinfoMsg } = require('./lib/main/osinfo');

// Main
console.log(osinfoMsg());

// const timedCmd = require('./lib/main/timedcmd');

main(rest, routes, CLIENT_ID, TOKEN, client, commands); // Corrected parameter order

// timedCmd(); // Executa um comando a cada x tempo (usado para backup)