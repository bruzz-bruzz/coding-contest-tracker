import { Client, GatewayIntentBits, Events, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios'
import cron from 'node-cron'
dotenv.config();
async function getData(){
    try{
        const response = await axios.get('https://coding-contest-tracker-aa3b.vercel.app/all')
        const data = response.data
        return [data, true]
    } catch (e) {
        return [[], false]
    }
}
function parseData(data:any){
    console.log(data)
    const embed = new EmbedBuilder()
    .setTitle("Upcoming Coding Contests")
    .setTimestamp()
    if(data.length === 0){
        embed.addFields({name:"No contests available.",value:"No contests are currently available. Please check back later."})
    } else {

        embed.addFields(
        {name:"CodeChef",value:`${data.data.CodeChef.length}`},
        {name:"Codeforces",value:`${data.data.Codeforces.length}`},
        {name:"LeetCode",value:`${data.data.LeetCode.data.topTwoContests.length}`},
        {name:"AtCoder",value:`${data.data.AtCoder.length}`}
    )
    }
    return embed
}
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
let data :null | any= null
// Event listener: When the client is ready
client.once(Events.ClientReady, (readyClient) => {
    cron.schedule("0 0,6,12,18 * * *",async()=>{
        data = await getData()
    })
    console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
});

// Event listener: Listening for generic messages
client.on(Events.MessageCreate, async (message) => {
    console.log(message.content)
    // Ignore messages sent by bots to prevent infinite loops
    if (message.author.bot) return;

    if (message.content.toLowerCase() === '!ping') {
        await message.reply('🏓 Pong!');
    }
    if(message.content.toLocaleLowerCase() === '!contests'){
        if(data === null){
            data = await getData()
        }
        await message.reply({embeds: [parseData(data[0])]})
    }
});

// Log into Discord using the token from environment variables
client.login(process.env.DISCORD_TOKEN);
