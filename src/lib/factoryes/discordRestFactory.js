function discordRestFactory(TOKEN){
    const { REST } = require('@discordjs/rest');
    const rest = new REST({ version: '9' }).setToken(TOKEN);
    return rest;
}

module.exports = discordRestFactory;