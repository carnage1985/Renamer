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
//Nickname mapping
const channelMappings = {
  '1123167904947507210': { //Darker
    '219790807454973952': 'Halvar Saluk',
    '469913673142501376': 'Lyra',
    '603651594503979008': 'Moradrosch',
    '1118451880998228048': 'Oriphan',
	'324155395709075457': 'DM',	
  },
  '1123167792309477417': { //Strahd
    '219790807454973952': 'Alvin Stopperdukk',
    '249208306470486016': 'Arkino',
    '452762791326253056': 'Sir Samuel Ramkin',
    '219801430158999552': 'Theodora',
	'324155395709075457': 'DM',
  }
};

client.on('ready', () => {
  console.log('Client ist online!');
});

client.on('voiceStateUpdate', (oldState, newState) => {

	//Channel joinen
	if (channelMappings[newState?.channelId]) {
		const channelEntry = channelMappings[newState?.channelId];
		const nickname = channelEntry[newState?.id];
		
		//Nick ändern
		if (channelEntry[newState?.id]) {
				newState.member.setNickname(nickname)
				.catch(err => {console.log(`Fehler beim Ändern des Nicknamens auf ${nickname}: ${err}`);});
			console.log('Benutzer geändert auf '+nickname);
		}
	}
	
	//Channel leaven
	if (channelMappings[oldState?.channelId]) {
		const channelEntry = channelMappings[oldState?.channelId];
		const nickname = channelEntry[oldState?.id];
		
		//Nick ändern
		if (channelEntry[oldState?.id]) {
				oldState.member.setNickname(null)
				.catch(err => {console.log(`Fehler beim Reset des Nicknamens: ${err}`);});
			console.log('Benutzer auf Standard geändert');
		}
	}
	
	
});


client.login(token);


