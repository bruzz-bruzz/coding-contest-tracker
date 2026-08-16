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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
dotenv_1.default.config();
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(process.env.BACKEND_URL);
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch contests:', error);
            return [];
        }
    });
}
function normalizeContestData(payload) {
    var _a;
    if (!payload)
        return {};
    return (_a = payload.data) !== null && _a !== void 0 ? _a : payload;
}
function timeUntilStart(contestStart, contestEnd) {
    const currTime = Date.now();
    if (currTime > (contestStart + contestEnd)) {
        return "Ended.";
    }
    const s = Math.floor((contestStart - currTime) / 1000);
    if (s < 0) {
        return "Started.";
    }
    const second = s % 60;
    const m = Math.floor(s / 60) % 60;
    const h = Math.floor(s / 3600) % 24;
    const d = Math.floor(s / (3600 * 24));
    return `${d}d ${h}h ${m}m ${second}s`;
}
function createLink(type, contestID, contestStart, contestEnd) {
    const urlMap = {
        'LeetCode': 'https://leetcode.com/contest',
        'AtCoder': 'https://atcoder.jp/contests',
        'CodeChef': 'https://www.codechef.com/contests',
        'Codeforces': 'https://codeforces.com/contest'
    };
    const baseURL = urlMap[type];
    if (type === 'LeetCode') {
        return `${baseURL}/${contestID}`;
    }
    else if (type === 'AtCoder') {
        let numberID = contestID.split(' ');
        if (numberID[numberID.length - 1].length !== 3) {
            numberID[numberID.length - 1] = numberID[numberID.length - 1].slice(0, 3);
        }
        const matchType = contestID.match("Heuristic") || contestID.match("Beginner") || contestID.match("Regular") || contestID.match("Grand");
        if (matchType === null) {
            return baseURL;
        }
        else if (matchType[0] === 'Heuristic') {
            return `${baseURL}/ahc${numberID[numberID.length - 1]}`;
        }
        else if (matchType[0] === 'Beginner') {
            return `${baseURL}/abc${numberID[numberID.length - 1]}`;
        }
        else if (matchType[0] === 'Regular') {
            return `${baseURL}/arc${numberID[numberID.length - 1]}`;
        }
        else if (matchType[0] === "Grand") {
            return `${baseURL}/agc${numberID[numberID.length - 1]}`;
        }
    }
    else if (type === 'CodeChef') {
        return `${baseURL}/${contestID}`;
    }
    else if (type === 'Codeforces') {
        const hasStartedOrEnded = timeUntilStart(contestStart, contestEnd);
        if (hasStartedOrEnded !== 'Started.' && hasStartedOrEnded !== 'Ended.') {
            return `${baseURL}s`;
        }
        return `${baseURL}/${contestID}`;
    }
}
function minutesToHours(time) {
    const m = time % 60;
    const h = Math.floor(time / 60);
    return `${h} hour(s) ${m} minute(s)`;
}
function buildPlatformFields(platformName, count, entries) {
    const safeEntries = entries.filter((entry) => entry && entry.trim().length > 0);
    if (safeEntries.length === 0) {
        return [{ name: `${platformName}: 0`, value: 'No upcoming contests.' }];
    }
    const fields = [];
    let currentValue = '';
    const flushField = (value, index) => {
        if (!value.trim())
            return;
        fields.push({
            name: `${fields.length > 0 ? `` : `${platformName}: ${count} contests \n`}`,
            value,
        });
    };
    safeEntries.forEach((entry, index) => {
        const candidate = currentValue ? `${currentValue}\n\n${entry}` : entry;
        if (candidate.length <= 1000) {
            currentValue = candidate;
            return;
        }
        if (currentValue) {
            flushField(currentValue, index);
            currentValue = entry;
            return;
        }
        const truncated = `${entry.slice(0, 980).trim()}...`;
        flushField(truncated, index);
    });
    if (currentValue) {
        flushField(currentValue, safeEntries.length - 1);
    }
    return fields;
}
function parseData(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const contestData = normalizeContestData(data);
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('Upcoming Coding Contests')
        .setTimestamp()
        .setFooter({ text: `Made by bruzz-bruzz \n https://github.com/bruzz-bruzz`, iconURL: "https://avatars.githubusercontent.com/u/216314263?v=4" });
    if (!contestData || Object.keys(contestData).length === 0) {
        embed.addFields({
            name: 'No contests available.',
            value: 'No contests are currently available. Please check back later.',
        });
        return embed;
    }
    const codeChefCount = Array.isArray(contestData.CodeChef) ? contestData.CodeChef.length : 0;
    const codeforcesCount = Array.isArray(contestData.Codeforces) ? contestData.Codeforces.length : 0;
    const atCoderCount = Array.isArray(contestData.AtCoder) ? contestData.AtCoder.length : 0;
    const leetCodeCount = (_d = (_c = (_b = (_a = contestData.LeetCode) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.topTwoContests) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
    const codeChefArr = [];
    const codeForcesArr = [];
    const atCoderArr = [];
    const leetCodeArr = [];
    let targetLogo = appEmojis === null || appEmojis === void 0 ? void 0 : appEmojis.find((e) => e.name === 'CodeChef');
    for (const contest of (_e = contestData.CodeChef) !== null && _e !== void 0 ? _e : []) {
        const logo = (_f = targetLogo === null || targetLogo === void 0 ? void 0 : targetLogo.toString()) !== null && _f !== void 0 ? _f : '🏆';
        codeChefArr.push(`${logo}Name: ${contest.contest_name}\nStart: ${new Date(Date.parse(contest.contest_start_date_iso)).toLocaleString()} <t:${Date.parse(contest.contest_start_date_iso) / 1000}:R>\nDuration: ${minutesToHours(contest.contest_duration)}\nLink: ${createLink('CodeChef', contest.contest_code)}`);
    }
    targetLogo = appEmojis === null || appEmojis === void 0 ? void 0 : appEmojis.find((e) => e.name === 'Codeforces');
    for (const contest of (_g = contestData.Codeforces) !== null && _g !== void 0 ? _g : []) {
        const logo = (_h = targetLogo === null || targetLogo === void 0 ? void 0 : targetLogo.toString()) !== null && _h !== void 0 ? _h : '🏆';
        codeForcesArr.push(`${logo}Name: ${contest.name}\nStart: ${new Date(contest.startTimeSeconds * 1000).toLocaleString()} <t:${contest.startTimeSeconds}:R>\nDuration: ${minutesToHours(contest.durationSeconds / 60)}\nLink: ${createLink('Codeforces', contest.id)}`);
    }
    targetLogo = appEmojis === null || appEmojis === void 0 ? void 0 : appEmojis.find((e) => e.name === 'AtCoder');
    for (const contest of (_j = contestData.AtCoder) !== null && _j !== void 0 ? _j : []) {
        const logo = (_k = targetLogo === null || targetLogo === void 0 ? void 0 : targetLogo.toString()) !== null && _k !== void 0 ? _k : '🏆';
        atCoderArr.push(`${logo}Name: ${contest.title}\nStart: ${new Date(contest.start_epoch_second * 1000).toLocaleString()} <t:${contest.start_epoch_second}:R>\nDuration: ${minutesToHours(contest.duration_second / 60)}\nLink: ${createLink('AtCoder', contest.title)}`);
    }
    targetLogo = appEmojis === null || appEmojis === void 0 ? void 0 : appEmojis.find((e) => e.name === 'LeetCode');
    for (const contest of (_o = (_m = (_l = contestData.LeetCode) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.topTwoContests) !== null && _o !== void 0 ? _o : []) {
        const logo = (_p = targetLogo === null || targetLogo === void 0 ? void 0 : targetLogo.toString()) !== null && _p !== void 0 ? _p : '🏆';
        leetCodeArr.push(`${logo}Name: ${contest.title}\nStart: ${new Date(contest.startTime * 1000).toLocaleString()} <t:${contest.startTime}:R>\nDuration: ${minutesToHours(contest.duration / 60)}\nLink: ${createLink('LeetCode', contest.titleSlug)}`);
    }
    const fields = [
        ...buildPlatformFields('CodeChef', codeChefCount, codeChefArr),
        ...buildPlatformFields('Codeforces', codeforcesCount, codeForcesArr),
        ...buildPlatformFields('LeetCode', leetCodeCount, leetCodeArr),
        ...buildPlatformFields('AtCoder', atCoderCount, atCoderArr),
    ];
    embed.addFields(fields);
    return embed;
}
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
const contestsCommand = new discord_js_1.SlashCommandBuilder().setName('contests').setDescription('View upcoming coding contests');
const aboutCommand = new discord_js_1.SlashCommandBuilder().setName('about').setDescription('View information about the bot');
const helpCommand = new discord_js_1.SlashCommandBuilder().setName("help").setDescription("View the bot's commands and how to use them");
let data = null;
let appEmojis = null;
client.once(discord_js_1.Events.ClientReady, (readyClient) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    node_cron_1.default.schedule('0 0,6,12,18 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        data = yield getData();
    }));
    const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        yield rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILD_ID), {
            body: [
                contestsCommand.toJSON(),
                aboutCommand.toJSON(),
                helpCommand.toJSON()
            ]
        });
    }
    catch (e) { }
    try {
        appEmojis = yield ((_a = client.application) === null || _a === void 0 ? void 0 : _a.emojis.fetch());
        data = yield getData();
    }
    catch (e) {
    }
    console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
}));
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === 'contests') {
        if (data === null) {
            data = yield getData();
        }
        yield interaction.reply({ embeds: [parseData(data)], flags: discord_js_1.MessageFlags.Ephemeral });
    }
    if (interaction.commandName === 'about') {
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("About Coding Contest Tracker")
            .setDescription("This bot provides information about upcoming coding contests from various platforms.")
            .addFields([
            { name: "Platforms", value: "AtCoder, LeetCode, CodeChef, Codeforces" },
            { name: "Refresh times", value: "Four times a day at 00:00, 06:00, 12:00 and 18:00. UTC +8 timezone" },
            { name: "Terms of Service", value: "https://github.com/bruzz-bruzz/coding-contest-tracker/blob/main/TOS.md" },
            { name: "Privacy Policy", value: "https://github.com/bruzz-bruzz/coding-contest-tracker/blob/main/PRIVACY.md" },
            { name: "Github Repository", value: "https://github.com/bruzz-bruzz/coding-contest-tracker" }
        ])
            .setFooter({ text: `Made by bruzz-bruzz \n https://github.com/bruzz-bruzz`, iconURL: "https://avatars.githubusercontent.com/u/216314263?v=4" })
            .setTimestamp();
        yield interaction.reply({ embeds: [embed], flags: discord_js_1.MessageFlags.Ephemeral });
    }
    if (interaction.commandName === 'help') {
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Coding Contest Tracker Help Page")
            .setDescription("List of commands this bot has and their usages")
            .addFields([
            { name: "`/contests`", value: "Get info on upcoming contests" },
            { name: "`/about`", value: "Get info on this discord bot" },
            { name: "`/help`", value: "Get info on the bot's commands" }
        ])
            .setFooter({ text: `Made by bruzz-bruzz \n https://github.com/bruzz-bruzz`, iconURL: "https://avatars.githubusercontent.com/u/216314263?v=4" })
            .setTimestamp();
        yield interaction.reply({ embeds: [embed], flags: discord_js_1.MessageFlags.Ephemeral });
    }
}));
client.login(process.env.DISCORD_TOKEN);
