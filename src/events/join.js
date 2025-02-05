/*
prisma model :

model User {
  id        String   @id @default(cuid())
  userId    String   @unique
  guildId   String

  // User settings
  timezone  String?
  birthday  DateTime?

  // User stats
  messages  Int
  xp        Int

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Usado para guardar a data de entrada e saída de um usuário
model Movement {
  id        String   @id @default(cuid())
  userId    String
  guildId   String
  type      String  // join | leave
  createdAt DateTime @default(now())
}

Base exemplo:

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

*/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addMovement(member, type) {
    try {
        await prisma.movement.create({
            data: {
                userId: member.id,
                guildId: member.guild.id,
                type: type,
            },
        });
    } catch (error) {
        console.error('Error adding movement:', error);
    }
}

async function addUser(member) {
    try {
        await prisma.user.upsert({
            where: {
                userId: member.id,
            },
            update: {},
            create: {
                userId: member.id,
                guildId: member.guild.id,
                messages: 0,
                xp: 0,
            },
        });
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

module.exports = {
    name: 'guildMemberAdd',
    once: true,
    execute(client) {

        client.on('guildMemberAdd', async (member) => {
            console.log('guildMemberAdd event loaded!');
            await addMovement(member, 'join');
            await addUser(member);
        });
    },
};