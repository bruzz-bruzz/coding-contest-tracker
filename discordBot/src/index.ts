import {StringSelectMenuOptionBuilder,Interaction,Client,GatewayIntentBits,Events,Collection, Snowflake,ApplicationEmoji, MessageFlags, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder} from 'discord.js'
import dotenv from 'dotenv'
import axios from 'axios'
import cron from 'node-cron'
import path from 'node:path'
import fs from 'node:fs'
import {parseData} from './buildContestEmbed'
declare module 'discord.js' {
  export interface Client {
    contestData: {};
    commands: Collection<string,any>;
  }
}
dotenv.config()
async function getData() {
    try {
        const response = await axios.get(process.env.BACKEND_URL as string);
        return response.data;
    } catch (error) {
        console.log('Failed to fetch contests:', error);
        return []
    }
}
function loadCommands(){
    client.commands = new Collection();
    const foldersPath = path.join(__dirname, 'commands');
    console.log(foldersPath)
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const command = require(commandsPath)
        client.commands.set(command.data.name,command)
    }
}
const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
client.once(Events.ClientReady,async(ready)=>{
    loadCommands()
    client.contestData = await getData()
    cron.schedule('0 0,6,12,18 * * *', async () => {
        client.contestData = await getData()
    });
    console.log(`✅ Ready! Logged in as ${ready.user.tag}`)
})
client.on(Events.InteractionCreate,async(interaction:Interaction)=>{
    if(interaction.isAnySelectMenu()){
        if(interaction.customId === 'platform'){
            const updatedEmbed = parseData(client.contestData,interaction.values[0])
            const updatedSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("platform")
            .setPlaceholder(interaction.values[0])
            .addOptions(
                new StringSelectMenuOptionBuilder()
                .setLabel("All")
                .setDescription("All coding contests")
                .setValue("All")
                .setEmoji('🌐')
                .setDefault(interaction.values[0] === 'All' ? true : false),
                new StringSelectMenuOptionBuilder()
                .setLabel("AtCoder")
                .setDescription("Only AtCoder contests")
                .setEmoji('🎯')
                .setValue("AtCoder")
                .setDefault(interaction.values[0] === 'AtCoder' ? true : false),
                new StringSelectMenuOptionBuilder()
                .setLabel("LeetCode")
                .setDescription("Only LeetCode contests")
                .setEmoji('💻')
                .setValue("LeetCode")
                .setDefault(interaction.values[0] === 'LeetCode' ? true : false),
                new StringSelectMenuOptionBuilder()
                .setLabel("CodeChef")
                .setDescription("Only CodeChef contests")
                .setEmoji('👨‍🍳')
                .setValue("CodeChef")
                .setDefault(interaction.values[0] === 'CodeChef' ? true : false),
                new StringSelectMenuOptionBuilder()
                .setLabel("Codeforces")
                .setDescription("Only Codeforces contests")
                .setEmoji('📊')
                .setValue("Codeforces")
                .setDefault(interaction.values[0] === 'Codeforces' ? true : false),
            )
            const updatedRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(updatedSelectMenu)
            await interaction.update({
                embeds:[updatedEmbed],
                components:[updatedRow],
            })
        }
    }
    if(interaction.isChatInputCommand()){
        const command = interaction.client.commands.get(interaction.commandName)
        if(!command){
            await interaction.reply({content:`No command name called ${interaction.commandName}`,flags:MessageFlags.Ephemeral})
        }
        try {
            await command.execute(interaction)
        } catch(e){
            await interaction.reply({content:"An error occured.",flags:MessageFlags.Ephemeral})
        }
    }
})
client.login(process.env.DISCORD_TOKEN)