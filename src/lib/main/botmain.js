async function main(restInstance, routesInstance, clientId, token, clientInstance, commands) {
    try {
        console.log('Started refreshing application (/) commands.');

        // Validate commands before sending
        commands.forEach((cmd, index) => {
            if (!cmd.name || typeof cmd.name !== 'string') {

                throw new Error(`Command at index ${index} is missing required 'name' field command: ${
                    JSON.stringify(cmd, null, 2)
                }`);
            }
            if (!cmd.description || typeof cmd.description !== 'string') {
                throw new Error(`Command at index ${index} is missing required 'description' field command: ${
                    JSON.stringify(cmd, null, 2)
                }`);
            }
        });

        // Delete existing commands
        await restInstance.put(
            routesInstance.applicationCommands(clientId),
            { body: [] }
        );
        console.log('Successfully deleted all application commands.');

        // Register new commands
        await restInstance.put(
            routesInstance.applicationCommands(clientId),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');

        clientInstance.login(token);
    } catch (error) {
        console.error('Error during command registration:', error);
        process.exit(1);
    }
}

module.exports = main; // Export the main function