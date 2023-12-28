const {
    Client,
    GatewayIntentBits
} = require('discord.js');
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

// Definiere eine Funktion, die den Nickname eines Users ändert
function changeNickname(member, channel) {
    // Überprüfe, ob der Channel in der JSON Datei vorhanden ist
    if (channelMappings.hasOwnProperty(channel.id)) {
        // Überprüfe, ob der User in der JSON Datei vorhanden ist
        if (channelMappings[channel.id].hasOwnProperty(member.id)) {
            // Finde den gewünschten Nickname aus der JSON Datei
            let newNickname = channelMappings[channel.id][member.id];
            // Ändere den Nickname des Users
            member.setNickname(newNickname);
        }
    }
}
// Definiere eine Funktion, die den Nickname eines Users zurücksetzt
function resetNickname(member) {
    // Überprüfe, ob die UserId im JSON vorhanden ist
    if (channelMappings.hasOwnProperty(member.guild.id) &&
        channelMappings[member.guild.id].hasOwnProperty(member.id)) {
        // Setze den Nickname des Users auf seinen ursprünglichen Namen
        member.setNickname(channelMappings[member.guild.id][member.id]);
    } else {
        console.warn(`UserId ${member.id} nicht im JSON gefunden. Nickname nicht zurückgesetzt.`);
    }
}

client.on('ready', () => {
    console.log('Client ist online!');
});
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