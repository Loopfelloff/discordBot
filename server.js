require("dotenv").config()
const fs = require("fs")
const path = require("path")
const {Client ,GatewayIntentBits, Collection} = require('discord.js')
const token = process.env.DiSCORD_BOT_TOKEN
const client = new Client({ intents: [GatewayIntentBits.Guilds]})
const foldersPath = path.join(__dirname , 'commands')
const eventsPath = path.join(__dirname , 'events')
const eventFiles  = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))
const commandFolders = fs.readdirSync(foldersPath) // this lists the array of string which contain the names of the sub-folder i guess dk about files
client.commands = new Collection()
client.cooldowns = new Collection()

for(const folder of commandFolders){

    const commandPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(commandPath).filter(files => files.endsWith('.js'))
    for(const file of commandFiles){
	const filePath = path.join(commandPath, file)
	const command = require(filePath)

	if('data' in command && 'execute' in command){
	    client.commands.set(command.data.name , command )	    
	}
	else{
	    console.log(`ERROR : the command file ${filePath} is missing either data or execute field`)
	}

    }
}

for(const file of eventFiles){

    const filePath = path.join(eventsPath , file)
    const eventObj = require(filePath)

    if(eventObj.once){
	client.once(eventObj.name,eventObj.execute)
    }
    else{
	client.on(eventObj.name, eventObj.execute)
    }

}

client.login(token)
