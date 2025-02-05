function commandloader(path, requirePath){
    const fs = require('fs');
    let commands = [];
    const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${requirePath}${file}`); 
        // Validate command if the command matches the command structure (name, description, etc)
        if (!command.name || typeof command.name !== 'string') {
            throw new Error(`Command is missing required 'name' field command: ${
                JSON.stringify(command, null, 2)
            }`);
        }
        if (!command.description || typeof command.description !== 'string') {
            throw new Error(`Command is missing required 'description' field command: ${
                JSON.stringify(command, null, 2)
            }`);
        }
        commands.push(command);
    }
    return commands;
}

module.exports = commandloader;