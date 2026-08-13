import { Client, GatewayIntentBits, Events, EmbedBuilder, REST,Routes,SlashCommandBuilder, MessageFlags } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';
import cron from 'node-cron';
dotenv.config();
async function getData() {
    try {
        const response = await axios.get(process.env.BACKEND_URL as string);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch contests:', error);
        return []
    }
}
function normalizeContestData(payload: any) {
    if (!payload) return {};
    return payload.data ?? payload;
}
function timeUntilStart(contestStart:number,contestEnd:number){
    const currTime = Date.now();
    if(currTime > (contestStart + contestEnd)){
      return "Ended."
    }
    const s = Math.floor((contestStart - currTime) / 1000)
    if(s < 0){
      return "Started."
    }
    const second = s % 60
    const m = Math.floor(s / 60) % 60
    const h = Math.floor(s / 3600) % 24
    const d = Math.floor(s / (3600 * 24))
    return `${d}d ${h}h ${m}m ${second}s`
  }
function createLink(type:'LeetCode'|"AtCoder"|"CodeChef"|"Codeforces",contestID:string,contestStart?:number,contestEnd?:number){
    const urlMap = {
        'LeetCode': 'https://leetcode.com/contest',
        'AtCoder': 'https://atcoder.jp/contests',
        'CodeChef': 'https://www.codechef.com/contests',
        'Codeforces': 'https://codeforces.com/contest'
    };
    const baseURL = urlMap[type]
    if(type === 'LeetCode'){
      return `${baseURL}/${contestID}`
    }else if(type === 'AtCoder'){
      let numberID = contestID.split(' ')
      if(numberID[numberID.length - 1].length !== 3){
        numberID[numberID.length - 1] = numberID[numberID.length - 1].slice(0,3)
      }
      const matchType = contestID.match("Heuristic") || contestID.match("Beginner") || contestID.match("Regular") || contestID.match("Grand")
      if(matchType === null){
        return baseURL
      } else if(matchType[0] === 'Heuristic'){
        return `${baseURL}/ahc${numberID[numberID.length - 1]}`
      } else if(matchType[0] === 'Beginner'){
        return `${baseURL}/abc${numberID[numberID.length - 1]}`
      } else if(matchType[0] === 'Regular'){
        return `${baseURL}/arc${numberID[numberID.length - 1]}`
      } else if(matchType[0] === "Grand"){
        return `${baseURL}/agc${numberID[numberID.length - 1]}`
      }
    }
    else if(type === 'CodeChef'){
      return `${baseURL}/${contestID}`
    } else if(type === 'Codeforces'){
      const hasStartedOrEnded = timeUntilStart(contestStart as number,contestEnd as number)
      if(hasStartedOrEnded !== 'Started.' && hasStartedOrEnded !== 'Ended.'){
        return `${baseURL}s`
      }
      return `${baseURL}/${contestID}`
    }
  }
  function minutesToHours(time:number){
    const m = time % 60
    const h = Math.floor(time / 60)
    return `${h} hour(s) ${m} minute(s)`
  }

function buildPlatformFields(platformName: string, count: number, entries: string[]) {
    const safeEntries = entries.filter((entry) => entry && entry.trim().length > 0);
    if (safeEntries.length === 0) {
        return [{ name: `${platformName}: 0`, value: 'No upcoming contests.' }];
    }

    const fields: { name: string; value: string }[] = [];
    let currentValue = '';

    const flushField = (value: string, index: number) => {
        if (!value.trim()) return;
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

function parseData(data: any) {
    const contestData = normalizeContestData(data);
    const embed = new EmbedBuilder()
        .setTitle('Upcoming Coding Contests')
        .setTimestamp()
        .setFooter({text:`Made by bruzz-bruzz \n https://github.com/bruzz-bruzz`,iconURL:"https://avatars.githubusercontent.com/u/216314263?v=4"})
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
    const leetCodeCount = contestData.LeetCode?.data?.topTwoContests?.length ?? 0;
    const codeChefArr = [] as string[]
    const codeForcesArr = [] as string[]
    const atCoderArr = [] as string[]
    const leetCodeArr = [] as string[]
    let targetLogo = appEmojis?.find((e:any) => e.name === 'CodeChef')
    for(const contest of contestData.CodeChef ?? []){
        const logo = targetLogo?.toString() ?? '🏆';
        codeChefArr.push(`${logo}Name: ${contest.contest_name}\nStart: ${new Date(Date.parse(contest.contest_start_date_iso)).toLocaleString()} <t:${Date.parse(contest.contest_start_date_iso) / 1000}:R>\nDuration: ${minutesToHours(contest.contest_duration)}\nLink: ${createLink('CodeChef',contest.contest_code)}`)
    }
    targetLogo = appEmojis?.find((e:any) => e.name === 'Codeforces')
    for(const contest of contestData.Codeforces ?? []){
        const logo = targetLogo?.toString() ?? '🏆';
        codeForcesArr.push(`${logo}Name: ${contest.name}\nStart: ${new Date(contest.startTimeSeconds * 1000).toLocaleString()} <t:${contest.startTimeSeconds}:R>\nDuration: ${minutesToHours(contest.durationSeconds / 60)}\nLink: ${createLink('Codeforces',contest.id)}`)
    }
    targetLogo = appEmojis?.find((e:any) => e.name === 'AtCoder')
    for(const contest of contestData.AtCoder ?? []){
        const logo = targetLogo?.toString() ?? '🏆';
        atCoderArr.push(`${logo}Name: ${contest.title}\nStart: ${new Date(contest.start_epoch_second * 1000).toLocaleString()} <t:${contest.start_epoch_second}:R>\nDuration: ${minutesToHours(contest.duration_second / 60)}\nLink: ${createLink('AtCoder',contest.title)}`)
    }
    targetLogo = appEmojis?.find((e:any) => e.name === 'LeetCode')
    for(const contest of contestData.LeetCode?.data?.topTwoContests ?? []){
        const logo = targetLogo?.toString() ?? '🏆';
        leetCodeArr.push(`${logo}Name: ${contest.title}\nStart: ${new Date(contest.startTime * 1000).toLocaleString()} <t:${contest.startTime}:R>\nDuration: ${minutesToHours(contest.duration / 60)}\nLink: ${createLink('LeetCode',contest.titleSlug)}`)
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
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})
const contestsCommand = new SlashCommandBuilder().setName('contests').setDescription('View upcoming coding contests');
const aboutCommand = new SlashCommandBuilder().setName('about').setDescription('View information about the bot');
let data: any = null;
let appEmojis :any = null;
client.once(Events.ClientReady, async (readyClient) => {
    cron.schedule('0 0,6,12,18 * * *', async () => {
        data = await getData();
    });
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string);
    try{
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID as string, process.env.GUILD_ID as string), {
        body: [
          contestsCommand.toJSON(),
          aboutCommand.toJSON()
        ]
      })
    }catch(e){}
    try{
        appEmojis = await client.application?.emojis.fetch()
        data = await getData()
    }catch(e){

    }
    console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
});
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if(interaction.commandName === 'contests'){
        if(data === null){
            data = await getData()
        }
        await interaction.reply({ embeds: [parseData(data)],flags:MessageFlags.Ephemeral });
    }
    if(interaction.commandName === 'about'){
        const embed = new EmbedBuilder()
        .setTitle("About Coding Contest Tracker")
        .setDescription("This bot provides information about upcoming coding contests from various platforms.")
        .addFields([
          {name:"Platforms",value:"AtCoder, LeetCode, CodeChef, Codeforces"},
          {name:"Refresh times",value:"Four times a day at 00:00, 06:00, 12:00 and 18:00. UTC +8 timezone"},
          {name:"Github Repository",value:"https://github.com/bruzz-bruzz/coding-contest-tracker"}
        ])
        .setFooter({text:`Made by bruzz-bruzz \n https://github.com/bruzz-bruzz`,iconURL:"https://avatars.githubusercontent.com/u/216314263?v=4"})
        .setTimestamp()
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
});

client.login(process.env.DISCORD_TOKEN);
