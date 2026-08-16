"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const buildContestEmbed_1 = require("../buildContestEmbed");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("contests")
        .setDescription("View upcoming coding contests"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoEmbed = (0, buildContestEmbed_1.parseData)(interaction.client.contestData, 'All');
            const selectMenu = new discord_js_1.StringSelectMenuBuilder()
                .setCustomId("platform")
                .setPlaceholder("All")
                .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("All")
                .setDescription("All coding contests")
                .setValue("All")
                .setEmoji('🌐')
                .setDefault(true), new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("AtCoder")
                .setDescription("Only AtCoder contests")
                .setEmoji('🎯')
                .setValue("AtCoder"), new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("LeetCode")
                .setDescription("Only LeetCode contests")
                .setEmoji('💻')
                .setValue("LeetCode"), new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("CodeChef")
                .setDescription("Only CodeChef contests")
                .setEmoji('👨‍🍳')
                .setValue("CodeChef"), new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("Codeforces")
                .setDescription("Only Codeforces contests")
                .setEmoji('📊')
                .setValue("Codeforces"));
            const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
            yield interaction.reply({ embeds: [infoEmbed], components: [row], flags: discord_js_1.MessageFlags.Ephemeral });
        });
    }
};
