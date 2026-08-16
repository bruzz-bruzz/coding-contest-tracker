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
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const buildContestEmbed_1 = require("./buildContestEmbed");
dotenv_1.default.config();
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(process.env.BACKEND_URL);
            return response.data;
        }
        catch (error) {
            console.log('Failed to fetch contests:', error);
            return [];
        }
    });
}
function loadCommands() {
    client.commands = new discord_js_1.Collection();
    const foldersPath = node_path_1.default.join(__dirname, 'commands');
    console.log(foldersPath);
    const commandFolders = node_fs_1.default.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = node_path_1.default.join(foldersPath, folder);
        const command = require(commandsPath);
        client.commands.set(command.data.name, command);
    }
}
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
client.once(discord_js_1.Events.ClientReady, (ready) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    loadCommands();
    client.contestData = yield getData();
    client.applicationEmojis = (yield ((_a = client.application) === null || _a === void 0 ? void 0 : _a.emojis.fetch()));
    node_cron_1.default.schedule('0 0,6,12,18 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        client.contestData = yield getData();
    }));
    console.log(`✅ Ready! Logged in as ${ready.user.tag}`);
}));
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.isAnySelectMenu()) {
        if (interaction.customId === 'platform') {
            const updatedEmbed = (0, buildContestEmbed_1.parseData)(client.contestData, interaction.values[0]);
            const updatedSelectMenu = new discord_js_1.StringSelectMenuBuilder()
                .setCustomId("platform")
                .setPlaceholder(interaction.values[0])
                .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("All")
                .setDescription("All coding contests")
                .setValue("All")
                .setEmoji('🌐')
                .setDefault(interaction.values[0] === 'All' ? true : false), new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("AtCoder")
                .setDescription("Only AtCoder contests")
                .setEmoji('🎯')
                .setValue("AtCoder")
                .setDefault(interaction.values[0] === 'AtCoder' ? true : false), new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("LeetCode")
                .setDescription("Only LeetCode contests")
                .setEmoji('💻')
                .setValue("LeetCode")
                .setDefault(interaction.values[0] === 'LeetCode' ? true : false), new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("CodeChef")
                .setDescription("Only CodeChef contests")
                .setEmoji('👨‍🍳')
                .setValue("CodeChef")
                .setDefault(interaction.values[0] === 'CodeChef' ? true : false), new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel("Codeforces")
                .setDescription("Only Codeforces contests")
                .setEmoji('📊')
                .setValue("Codeforces")
                .setDefault(interaction.values[0] === 'Codeforces' ? true : false));
            const updatedRow = new discord_js_1.ActionRowBuilder().addComponents(updatedSelectMenu);
            yield interaction.update({
                embeds: [updatedEmbed],
                components: [updatedRow],
            });
        }
    }
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            yield interaction.reply({ content: `No command name called ${interaction.commandName}`, flags: discord_js_1.MessageFlags.Ephemeral });
        }
        try {
            yield command.execute(interaction);
        }
        catch (e) {
            yield interaction.reply({ content: "An error occured.", flags: discord_js_1.MessageFlags.Ephemeral });
        }
    }
}));
client.login(process.env.DISCORD_TOKEN);
