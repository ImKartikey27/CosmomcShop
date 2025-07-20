const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // Optional, for .env

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildInvites
  ]
});

client.once('ready', async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.get('1387103940801204234'); // Replace with your server ID

  if (!guild) return console.log('❌ Guild not found');

  try {
    const invites = await guild.invites.fetch();

    if (!invites.size) {
      return console.log('📭 No invites found in this server.');
    }

    console.log('📨 Invite codes and usage:');
    invites.forEach(invite => {
      console.log(`🔗 Code: ${invite.code}, Uses: ${invite.uses}, Inviter: ${invite.inviter?.tag || 'Unknown'}`);
    });
  } catch (err) {
    console.error('❌ Error fetching invites:', err);
  }
});

// Replace with your bot token or use dotenv
client.login('MTM5NjA1ODM3NjE3NzMyNDEyMw.GHxLpx._udCn_iZ7QX0qfDCJgIgfgKNNNA4olWYWfyR_8');
