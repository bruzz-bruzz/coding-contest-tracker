import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
const data =  new EmbedBuilder()
        .setTitle("About Coding Contest Tracker")
        .setDescription("This bot provides information about upcoming coding contests from various platforms.")
        .addFields([
          {name:"Platforms",value:"AtCoder, LeetCode, CodeChef, Codeforces"},
          {name:"Refresh times",value:"Four times a day at 00:00, 06:00, 12:00 and 18:00. UTC +8 timezone"},
          {name:"Terms of Service",value:"https://github.com/bruzz-bruzz/coding-contest-tracker/blob/main/TOS.md"},
          {name:"Privacy Policy",value:"https://github.com/bruzz-bruzz/coding-contest-tracker/blob/main/PRIVACY.md"},
          {name:"Github Repository",value:"https://github.com/bruzz-bruzz/coding-contest-tracker"}
        ])
        .setFooter({text:`Made by bruzz-bruzz \n https://github.com/bruzz-bruzz`,iconURL:"https://avatars.githubusercontent.com/u/216314263?v=4"})
        .setTimestamp()
module.exports = {
    data: new SlashCommandBuilder()
    .setName("about")
    .setDescription('View information about the bot'),
    async execute(interaction:ChatInputCommandInteraction){
        await interaction.reply({embeds:[data],flags:MessageFlags.Ephemeral})
    }
}