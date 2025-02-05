function gitMessageReply(data){
    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
        .setTitle('GitHub Repository Search')
        .setDescription(`Total results: ${data.total_count}`)
        .setColor('#0099ff')
        .setTimestamp()
        // Dinamically add fields in 
        // (method) EmbedBuilder.setFields(...fields: RestOrArray<APIEmbedField>): EmbedBuilder
        embed.setFields(data.items.map((item, index) => {
            return {
                // [discordjs](https://github.com/discordjs/discord.js)
                name: `#${index + 1} ${item.name}`,
                value: `${item.description}\n 🌟 ${item.stargazers_count} | 🔗 ${item.forks_count} | 📝 ${item.open_issues_count} | 👁 ${item.watchers_count} | 🌎 ${item.language}\n
                [View Repo](${item.html_url})`,
                inline: false
            }
        }));
    return embed;
}

module.exports = {
    name: 'reposearch',
    description: 'Search for a repository on GitHub by name or github deep search query.',
    async execute(interaction) {
        const reposearch = require('../lib/github/reposearch.js');
        const query = interaction.options.getString('query');
        const result = await reposearch(query);
        const embed = gitMessageReply(result);
        await interaction.reply({ embeds: [embed] });
    },
    options: [
        {
            name: 'query',
            description: 'Query to search for repositories.',
            type: 3,
            required: true
        }
    ]
}