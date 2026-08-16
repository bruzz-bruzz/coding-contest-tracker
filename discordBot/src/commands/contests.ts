import {SlashCommandBuilder, MessageFlags, ChatInputCommandInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder} from 'discord.js'
import {parseData} from '../buildContestEmbed'
module.exports = {
    data: new SlashCommandBuilder()
    .setName("contests")
    .setDescription("View upcoming coding contests"),
    async execute(interaction:ChatInputCommandInteraction){
        const infoEmbed = parseData(interaction.client.contestData,'All')
        const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("platform")
        .setPlaceholder("All")
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel("All")
            .setDescription("All coding contests")
            .setValue("All")
            .setEmoji('🌐')
            .setDefault(true),
            new StringSelectMenuOptionBuilder()
            .setLabel("AtCoder")
            .setDescription("Only AtCoder contests")
            .setEmoji('🎯')
            .setValue("AtCoder"),
            new StringSelectMenuOptionBuilder()
            .setLabel("LeetCode")
            .setDescription("Only LeetCode contests")
            .setEmoji('💻')
            .setValue("LeetCode"),
            new StringSelectMenuOptionBuilder()
            .setLabel("CodeChef")
            .setDescription("Only CodeChef contests")
            .setEmoji('👨‍🍳')
            .setValue("CodeChef"),
            new StringSelectMenuOptionBuilder()
            .setLabel("Codeforces")
            .setDescription("Only Codeforces contests")
            .setEmoji('📊')
            .setValue("Codeforces"),
        );
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)
        await interaction.reply({embeds:[infoEmbed],components:[row],flags:MessageFlags.Ephemeral})
    }
}