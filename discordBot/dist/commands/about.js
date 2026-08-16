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
    .setTitle("About Coding Contest Tracker")
    .setDescription("This bot provides information about upcoming coding contests from various platforms.")
    .addFields([
    { name: "Platforms", value: "AtCoder, LeetCode, CodeChef, Codeforces" },
    { name: "Refresh times", value: "Four times a day at 00:00, 06:00, 12:00 and 18:00. UTC +8 timezone" },
    { name: "Website", value: "https://coding-contest-tracker-one.vercel.app/" },
    { name: "Terms of Service", value: "https://github.com/bruzz-bruzz/coding-contest-tracker/blob/main/TOS.md" },
    { name: "Privacy Policy", value: "https://github.com/bruzz-bruzz/coding-contest-tracker/blob/main/PRIVACY.md" },
    { name: "Github Repository", value: "https://github.com/bruzz-bruzz/coding-contest-tracker" }
])
    .setFooter({ text: `Made by bruzz-bruzz \n https://github.com/bruzz-bruzz`, iconURL: "https://avatars.githubusercontent.com/u/216314263?v=4" })
    .setTimestamp();
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("about")
        .setDescription('View information about the bot'),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply({ embeds: [data], flags: discord_js_1.MessageFlags.Ephemeral });
        });
    }
};
