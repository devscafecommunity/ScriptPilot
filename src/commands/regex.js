module.exports = {
    name: 'regex',
    description: 'Testa expressões regulares',
    async execute(interaction) {
        const pattern = interaction.options.getString('padrao');
        const text = interaction.options.getString('texto');
        
        try {
            const regex = new RegExp(pattern);
            const result = regex.test(text);
            await interaction.reply(`Resultado: ${result ? '✅ Match' : '❌ No match'}`);
        } catch (error) {
            await interaction.reply('❌ Expressão regular inválida!');
        }
    },
    options: [
        {
            name: 'padrao',
            description: 'Padrão regex',
            type: 3,
            required: true
        },
        {
            name: 'texto',
            description: 'Texto para testar',
            type: 3,
            required: true
        }
    ],
};