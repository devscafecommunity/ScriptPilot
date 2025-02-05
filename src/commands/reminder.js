module.exports = {
    name: 'reminder',
    description: 'Set a reminder',
    async execute(interaction) {
        // Obtem os valores dos argumentos, e o usuário que executou o comando
        const time = interaction.options.getString('time');
        const message = interaction.options.getString('message');
        const user = interaction.user;

        // Responde ao usuário
        await interaction.reply(`I will remind you in ${time} minutes: ${message}`);

        // Define um temporizador para enviar uma mensagem ao usuário após o tempo especificado
        setTimeout(() => {
            user.send(`Reminder: ${message}`);
        }, time * 60 * 1000);
    },
    options: [
        {
            name: 'time',
            description: 'Time to set the reminder',
            type: 3,
            required: true
        },
        {
            name: 'message',
            description: 'Message to remind',
            type: 3,
            required: true
        }
    ]
}