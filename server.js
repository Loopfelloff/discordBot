require("dotenv").config()
const fs = require("fs")
const path = require("path")
const {Client , Events , GatewayIntentBits, Collection , MessageFlags} = require('discord.js')
const token = process.env.DiSCORD_BOT_TOKEN
const client = new Client({ intents: [GatewayIntentBits.Guilds]})
const foldersPath = path.join(__dirname , 'commands')
const commandFolders = fs.readdirSync(foldersPath) // this lists the array of string which contain the names of the sub-folder i guess dk about files
client.commands = new Collection()

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


client.once(Events.ClientReady, readyClient =>{
    console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.on(Events.InteractionCreate , async interaction=>{ // this is the command handler the async interaction

    if(!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName)

    if(!command){
	console.error(`No command matching${interaction.commandName} found }`)
	return;
    }

    try{
	await command.execute(interaction)
    }
    catch(err){
	console.error(err)		
	if(interaction.replied || interaction.deferred){
	    await interaction.followUp({content : 'There was an error while executing this command' , flags:MessageFlags.Ephemeral})
	}	
	else{
	    await interaction.reply({content : 'There was an error while executing this command' , flags :MessageFlags.Ephemeral })// to make a reply private what you are supposed to do is => interaction.reply({content: 'message you want to send' , flags : MessageFlags.Ephemeral})
	}
    }

    
})


client.login(token)
