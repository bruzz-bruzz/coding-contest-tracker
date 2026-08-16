import {SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder,MessageFlags} from 'discord.js'
const data = new EmbedBuilder()
        .setTitle("Coding Contest Tracker Help Page")
        .setDescription("List of commands this bot has and their usages")
        .addFields([
            {name:"`/contests`",value:"Get info on upcoming contests"},
            {name:"`/about`",value:"Get info on this discord bot"},
            {name:"`/help`",value:"Get info on the bot's commands"}
        ])
        .setFooter({text:`Made by bruzz-bruzz \n https://github.com/bruzz-bruzz`,iconURL:"https://avatars.githubusercontent.com/u/216314263?v=4"})
        .setTimestamp()
module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View upcoming coding contests"),
    async execute(interaction:ChatInputCommandInteraction){
        await interaction.reply({embeds:[data],flags:MessageFlags.Ephemeral})
    }
}