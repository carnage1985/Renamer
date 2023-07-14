const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
});
const token = 'MTEyOTMxMTgwNjk4NTM1OTQ1MQ.GNBNuj.vgTaUkabn-78zzU3UO32e_zpEHkffPH3SZwU_o';
const targetUserId = '324155395709075457'; // ID des Benutzers, auf den du reagieren möchtest
const targetVoiceChannelId = '1123167904947507210'; // ID des Sprachkanals, auf den du reagieren möchtest

client.on('ready', () => {
  console.log('Client ist online!');
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.channelId
	let oldUserChannel = oldMember.channelId
	console.log('Neuer Channel:'+ newUserChannel);
	console.log('Alter Channel:'+ oldUserChannel);
});


client.login(token);