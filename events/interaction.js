const {Events,Collection, MessageFlags} = require('discord.js');

module.exports ={
    name : Events.InteractionCreate,
    async execute(interaction){
    if(!interaction.isChatInputCommand()) return;
    const {cooldowns} = interaction.client

    const command = interaction.client.commands.get(interaction.commandName)

    if(!command){
	console.error(`No command matching${interaction.commandName} found }`)
	return;
    }

    if(!cooldowns.has(command.data.name)){
	    cooldowns.set(command.data.name, new Collection())
	}

    const now = Date.now()
    const timestamps = cooldowns.get(command.data.name)
    const defaultCooldownDuration = 3
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000

    if(timestamps.has(interaction.user.id)){
	    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount

	    if(now < expirationTime){
		const expiredTimestamp = Math.round((expirationTime - now)/ 1_000)
		return interaction.reply({content : `Please wait, ${interaction.user.username} for running '${interaction.commandName}' for ${expiredTimestamp} seconds to run the command again ` , flags : MessageFlags.Ephemeral})
	    
	    }
	}
	timestamps.set(interaction.user.id , now)
	setTimeout(()=>{timestamps.delete(interaction.user.id)}, cooldownAmount)

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
    }
} 



