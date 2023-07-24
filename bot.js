const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
});
const token = process.env.TOKEN;

// Pfad zur JSON-Datei
const filePath = path.join(__dirname, 'channelMappings.json');

// Laden der Channel-Mappings aus der JSON-Datei
function loadChannelMappings() {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Fehler beim Laden der Channel-Mappings:', error);
		return {};
	}
}

// Lade die Channel-Mappings beim Start des Clients
const channelMappings = loadChannelMappings();

client.on('ready', () => {
  console.log('Client ist online!');
});

client.on('voiceStateUpdate', (oldState, newState) => {

	//Channel joinen
	if (channelMappings[newState?.channelId]) {
		const channelEntry = channelMappings[newState?.channelId];
		const nickname = channelEntry[newState?.id];
		const oldId = oldState?.id;
		const oldNick = oldState.member.displayName;
		
		//JSON speichern
		const jsonString = JSON.stringify({
		  [oldId]: oldNick,
		});
		fs.writeFileSync("originalNickname.json", jsonString);
		console.log('JSON geschrieben: ' + jsonString)
		
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
		
		//JSON laden
		const jsonString = fs.readFileSync("originalNickname.json");
		const jsonObject = JSON.parse(jsonString);
		const nickname = jsonObject[oldState?.id];
		
		//Eintrag löschen
		
		delete jsonObject[oldState?.id];
		
		//Nick ändern
		if (channelEntry[oldState?.id]) {
				oldState.member.setNickname(nickname)
				.catch(err => {console.log(`Fehler beim Reset des Nicknamens: ${err}`);});
			console.log('Reset auf ' + nickname);
		}
	}
	
	
});


client.login(token);


