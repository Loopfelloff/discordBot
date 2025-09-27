require("dotenv").config()
const express = require('express')
const app = express()
const cors = require('cors')
const pushHandler = require('./router/pushRouter')
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

app.use(cors())
app.use(express.json({
    verify : (req , res , buf)=>{
	req.rawBody = buf // buf stands for buffer which stores the hexadecimal equivalent of your application/json in text format in a buffer
    }
}))

app.use('/push' , pushHandler)

// adding commands 
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
// adding events
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
app.listen(5000 , async ()=>{
    await client.login(token)
    console.log(`server is listening at port 5000`) 
})

