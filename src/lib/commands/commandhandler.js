function commandHandler(clientObject, commands){
    clientObject.on('interactionCreate', async Interaction => {
        if (!Interaction.isCommand()) return;
        const { commandName } = Interaction;
        
        for (const command of commands) {
            if (command.name === commandName) {
                try {
                    await command.execute(Interaction);
                } catch (error) {
                    console.error(error);
                    await Interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
    });
}

module.exports = commandHandler;