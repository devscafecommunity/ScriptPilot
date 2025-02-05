const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupGuild(guild) {
    try {
        console.log(`Setting up guild ${guild.name}`);
        await prisma.guild.upsert({
            where: {
                guildId: guild.id,
            },
            update: {}, // Atualiza se existir
            create: {
                guildId: guild.id, // Cria se não existir
            },
        });
        console.log("Guild configurada com sucesso!");
    } catch (error) {
        console.error('Erro durante a configuração da guild:', error);
    } finally {
        await prisma.$disconnect(); // Encerra a conexão
    }
}

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);

        const targetGuild = client.guilds.cache.first();
        if (!targetGuild) {
            console.log("Nenhuma guild encontrada!");
            return;
        }

        await setupGuild(targetGuild); // Passa a guild como parâmetro

        client.user.setActivity('/help', { type: 'LISTENING' });
    },
};