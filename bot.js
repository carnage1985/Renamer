const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
const token = 'MTEyOTMxMTgwNjk4NTM1OTQ1MQ.GNBNuj.vgTaUkabn-78zzU3UO32e_zpEHkffPH3SZwU_o';

// Mapping-Tabelle für Voice Channel zu Benutzer-IDs und Nicknamen
const channelMappings = {
  '1123167904947507210': {
    '219790807454973952': 'Halvar Saluk',
    '469913673142501376': 'Lyra',
    '603651594503979008': 'Moradrosch',
    '1118451880998228048': 'Oriphan',
	'324155395709075457': 'DM',
	
  },
  '1123167792309477417': {
    '219790807454973952': 'Alvin Stopperdukk',
    '249208306470486016': 'Arkino',
    '452762791326253056': 'Sir Samuel Ramkin',
    '219801430158999552': 'Theodora'
  }
};

client.on('voiceStateUpdate', (oldState, newState) => {
  const channelId = newState.channelID;

  if (channelMappings[channelId]) {
    const guild = newState.guild;

    for (const [userId, nickname] of Object.entries(channelMappings[channelId])) {
      const member = guild.member(userId);
      member.setNickname(nickname)
        .catch(console.error);
    }
  }
});

client.on('ready', () => {
  console.log('client ist online!');
});

client.login(token);