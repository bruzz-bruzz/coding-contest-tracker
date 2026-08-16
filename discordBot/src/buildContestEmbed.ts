import { EmbedBuilder } from "discord.js";
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
function minutesToHours(time:number){
    const m = time % 60
    const h = Math.floor(time / 60)
    return `${h} hour(s) ${m} minute(s)`
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
function normalizeContestData(payload: any) {
    if (!payload) return {};
    return payload.data ?? payload;
}
export function parseData(data: any,includes:string) {
    const contestData = normalizeContestData(data);
    const embed = new EmbedBuilder()
        .setTitle('Upcoming Coding Contests')
        .setDescription(`Platform: ${includes}`)
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
    for(const contest of contestData.CodeChef ?? []){
        const logo = '👨‍🍳'
        codeChefArr.push(`${logo}Name: ${contest.contest_name}\nStart: ${new Date(Date.parse(contest.contest_start_date_iso)).toLocaleString()} <t:${Date.parse(contest.contest_start_date_iso) / 1000}:R>\nDuration: ${minutesToHours(contest.contest_duration)}\nLink: ${createLink('CodeChef',contest.contest_code)}`)
    }
    for(const contest of contestData.Codeforces ?? []){
        const logo = '📊'
        codeForcesArr.push(`${logo}Name: ${contest.name}\nStart: ${new Date(contest.startTimeSeconds * 1000).toLocaleString()} <t:${contest.startTimeSeconds}:R>\nDuration: ${minutesToHours(contest.durationSeconds / 60)}\nLink: ${createLink('Codeforces',contest.id)}`)
    }
    for(const contest of contestData.AtCoder ?? []){
        const logo = '🎯'
        atCoderArr.push(`${logo}Name: ${contest.title}\nStart: ${new Date(contest.start_epoch_second * 1000).toLocaleString()} <t:${contest.start_epoch_second}:R>\nDuration: ${minutesToHours(contest.duration_second / 60)}\nLink: ${createLink('AtCoder',contest.title)}`)
    }
    for(const contest of contestData.LeetCode?.data?.topTwoContests ?? []){
        const logo = '💻'
        leetCodeArr.push(`${logo}Name: ${contest.title}\nStart: ${new Date(contest.startTime * 1000).toLocaleString()} <t:${contest.startTime}:R>\nDuration: ${minutesToHours(contest.duration / 60)}\nLink: ${createLink('LeetCode',contest.titleSlug)}`)
    }
    let fields = [];
    if(includes === 'All' || includes === 'CodeChef'){
        fields.push(...buildPlatformFields('CodeChef', codeChefCount, codeChefArr))
    }
    if(includes === 'All' || includes === 'Codeforces'){
        fields.push(...buildPlatformFields('Codeforces', codeforcesCount, codeForcesArr),)
    }
    if(includes === 'All' || includes === 'LeetCode'){
        fields.push(...buildPlatformFields('LeetCode', leetCodeCount, leetCodeArr),)
    }
    if(includes === 'All' || includes === 'AtCoder'){
        fields.push(...buildPlatformFields('AtCoder', atCoderCount, atCoderArr),)
    }
    embed.addFields(fields);

    return embed;
}
