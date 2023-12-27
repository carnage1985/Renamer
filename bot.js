const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_CONTENT,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
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

// Definiere eine Funktion, die den Nickname eines Users ändert
function changeNickname(member, channel) {
  // Überprüfe, ob der Channel in der JSON Datei vorhanden ist
  if (channelMapping.hasOwnProperty(channel.id)) {
    // Überprüfe, ob der User in der JSON Datei vorhanden ist
    if (channelMapping[channel.id].hasOwnProperty(member.id)) {
      // Finde den gewünschten Nickname aus der JSON Datei
      let newNickname = channelMapping[channel.id][member.id];
      // Ändere den Nickname des Users
      member.setNickname(newNickname);
    }
  }
}

// Definiere eine Funktion, die den Nickname eines Users zurücksetzt
function resetNickname(member) {
  // Setze den Nickname des Users auf seinen ursprünglichen Namen
  member.setNickname(member.user.username);
}

client.on('ready', () => {
  console.log('Client ist online!');
});

client.on('voiceStateUpdate', (oldState, newState) => {

// Reagiere auf das Ereignis, wenn ein User einem Channel beitritt
client.on("voiceStateUpdate", (oldState, newState) => {
  // Finde den User, der den Channel gewechselt hat
  let member = newState.member;
  // Finde den Channel, dem der User beigetreten ist
  let newChannel = newState.channel;
  // Finde den Channel, den der User verlassen hat
  let oldChannel = oldState.channel;

  // Überprüfe, ob der User einem Channel beigetreten ist
  if (newChannel) {
    // Ändere den Nickname des Users entsprechend dem Channel
    changeNickname(member, newChannel);
  }

  // Überprüfe, ob der User einen Channel verlassen hat
  if (oldChannel) {
    // Setze den Nickname des Users zurück
    resetNickname(member);
  }
});

// Reagiere auf das Ereignis, wenn ein User den Server verlässt
client.on("guildMemberRemove", (member) => {
  // Setze den Nickname des Users zurück
  resetNickname(member);
});

client.login(token);


