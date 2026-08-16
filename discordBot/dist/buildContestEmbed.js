"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseData = parseData;
const discord_js_1 = require("discord.js");
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
function minutesToHours(time) {
    const m = time % 60;
    const h = Math.floor(time / 60);
    return `${h} hour(s) ${m} minute(s)`;
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
function normalizeContestData(payload) {
    var _a;
    if (!payload)
        return {};
    return (_a = payload.data) !== null && _a !== void 0 ? _a : payload;
}
function parseData(data, includes) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const contestData = normalizeContestData(data);
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('Upcoming Coding Contests')
        .setDescription(`Platform: ${includes}`)
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
    for (const contest of (_e = contestData.CodeChef) !== null && _e !== void 0 ? _e : []) {
        const logo = '👨‍🍳';
        codeChefArr.push(`${logo}Name: ${contest.contest_name}\nStart: ${new Date(Date.parse(contest.contest_start_date_iso)).toLocaleString()} <t:${Date.parse(contest.contest_start_date_iso) / 1000}:R>\nDuration: ${minutesToHours(contest.contest_duration)}\nLink: ${createLink('CodeChef', contest.contest_code)}`);
    }
    for (const contest of (_f = contestData.Codeforces) !== null && _f !== void 0 ? _f : []) {
        const logo = '📊';
        codeForcesArr.push(`${logo}Name: ${contest.name}\nStart: ${new Date(contest.startTimeSeconds * 1000).toLocaleString()} <t:${contest.startTimeSeconds}:R>\nDuration: ${minutesToHours(contest.durationSeconds / 60)}\nLink: ${createLink('Codeforces', contest.id)}`);
    }
    for (const contest of (_g = contestData.AtCoder) !== null && _g !== void 0 ? _g : []) {
        const logo = '🎯';
        atCoderArr.push(`${logo}Name: ${contest.title}\nStart: ${new Date(contest.start_epoch_second * 1000).toLocaleString()} <t:${contest.start_epoch_second}:R>\nDuration: ${minutesToHours(contest.duration_second / 60)}\nLink: ${createLink('AtCoder', contest.title)}`);
    }
    for (const contest of (_k = (_j = (_h = contestData.LeetCode) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.topTwoContests) !== null && _k !== void 0 ? _k : []) {
        const logo = '💻';
        leetCodeArr.push(`${logo}Name: ${contest.title}\nStart: ${new Date(contest.startTime * 1000).toLocaleString()} <t:${contest.startTime}:R>\nDuration: ${minutesToHours(contest.duration / 60)}\nLink: ${createLink('LeetCode', contest.titleSlug)}`);
    }
    let fields = [];
    if (includes === 'All' || includes === 'CodeChef') {
        fields.push(...buildPlatformFields('CodeChef', codeChefCount, codeChefArr));
    }
    if (includes === 'All' || includes === 'Codeforces') {
        fields.push(...buildPlatformFields('Codeforces', codeforcesCount, codeForcesArr));
    }
    if (includes === 'All' || includes === 'LeetCode') {
        fields.push(...buildPlatformFields('LeetCode', leetCodeCount, leetCodeArr));
    }
    if (includes === 'All' || includes === 'AtCoder') {
        fields.push(...buildPlatformFields('AtCoder', atCoderCount, atCoderArr));
    }
    embed.addFields(fields);
    return embed;
}
