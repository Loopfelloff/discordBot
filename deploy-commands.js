require('dotenv').config()
const {REST , Routes} = require('discord.js')
const token = process.env.DISCORD_BOT_TOKEN
const clientId= process.env.DISCORD_BOT_CLIENT_ID
const guildId = process.env.DISCORD_BOT_GUILD_ID 
const fs = require('fs')
const path = require('path')

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(token)	


async function deployCommand(){
    try{
	console.log(`Started sending ${commands.length} commands to the guild`)
	const data = await rest.put(
	    Routes.applicationGuildCommands(clientId, guildId),
	    {body : commands}
	)
	console.log(`Successfully reloaded ${data.length} and  application (/) commands.`);
    }
    catch(err)
    {
	console.error(err)
    }
}

deployCommand()
