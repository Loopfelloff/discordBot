const {SlashCommandBuilder} = require('discord.js')
const {format} = require('date-fns')
module.exports = {
    cooldown : 5,    
    data : new SlashCommandBuilder().setName('ping').setDescription('Provides information about the user itself'),
    execute : async function(interaction){
	const timestamp = interaction.member.guild.joinedTimestamp
	const date = new Date(timestamp)
	const formattedDate = format(date, "yyyy-MMMM-dd HH:mm:ss")
	console.log(formattedDate)
	await interaction.reply(`This command was run by ${interaction.user.username} and you joined the server at ${formattedDate}`)
	
    }

}


// to make a reply private what you are supposed to do is => interaction.reply({content: 'message you want to send' , flags : MessageFlags.Ephemeral})


