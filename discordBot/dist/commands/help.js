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
const data = new discord_js_1.EmbedBuilder()
    .setTitle("Coding Contest Tracker Help Page")
    .setDescription("List of commands this bot has and their usages")
    .addFields([
    { name: "`/contests`", value: "Get info on upcoming contests" },
    { name: "`/about`", value: "Get info on this discord bot" },
    { name: "`/help`", value: "Get info on the bot's commands" }
])
    .setFooter({ text: `Made by bruzz-bruzz \n https://github.com/bruzz-bruzz`, iconURL: "https://avatars.githubusercontent.com/u/216314263?v=4" })
    .setTimestamp();
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("View upcoming coding contests"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply({ embeds: [data], flags: discord_js_1.MessageFlags.Ephemeral });
        });
    }
};
