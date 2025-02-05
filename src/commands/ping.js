module.exports = {
    name: 'ping',
    description: 'Ping...',
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
    options: [
        {
            name: 'item',
            description: 'Item to buy',
            type: 3,
            required: true
        }
    ]
}