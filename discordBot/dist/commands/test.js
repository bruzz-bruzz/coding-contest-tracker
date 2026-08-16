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
const infoEmbed = new discord_js_1.EmbedBuilder()
    .setTitle("ROLES")
    .setDescription("BRHUA")
    .setTimestamp();
const selectMenu = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId("ABC")
    .setPlaceholder("CONTEAST")
    .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("G")
    .setDescription("GAH")
    .setValue("GAMERRR"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("A")
    .setDescription("ASC")
    .setValue("ABASCUS"));
const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("c")
        .setDescription("V"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply({ embeds: [infoEmbed], components: [row], flags: discord_js_1.MessageFlags.Ephemeral });
        });
    }
};
