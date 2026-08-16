import {REST,Routes} from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
dotenv.config()
const commands = []
const foldersPath = path.join(__dirname,'commands')
const commandFolders = fs.readdirSync(foldersPath)
for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath,folder)
	const command = require(commandsPath)
	commands.push(command.data.toJSON())
}
const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID as string, process.env.GUILD_ID as string), { body: commands });
        const data2 = await rest.put(Routes.applicationCommands(process.env.CLIENTID as string), {body: commands})
		console.log(`Successfully reloaded application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();