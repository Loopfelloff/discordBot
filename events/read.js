const {Events} = require('discord.js')
const EventEmitter = require('events') 
const eventEmitter = new EventEmitter() 

module.exports = {
    name : Events.ClientReady,
    once : true,
    execute(client){
	console.log(`Ready! Logged in as ${client.user.tag}`)
	eventEmitter.on('pushCommit', async(value)=>{
//	    console.log(`Event:${value.committer.username} , has added ${value.added.length}, removed ${value.removed.length} , modified ${value.modified.length} files`)
	    const channel = client.channels.cache.get(process.env.DISCORD_GENERAL_CHANNEL_ID);

	    let fileNames =''

	    value.added.forEach((file, count) => {
		fileNames = fileNames + ' ' + count + ')' + ' ' + file  	
	    });

	    await channel.send(`Commit_Made : ${value.committer.username} , has added ${fileNames}, removed ${value.removed.length} , modified ${value.modified.length} files`) 
	})

	
    },
    eventEmitter
}
