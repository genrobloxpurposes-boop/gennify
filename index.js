const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Role to give/remove
const targetRoleId = "1325183363421831222";

// Allowed roles for using commands
const allowedRoles = [
  "1325183363434283013",
  "1384184400677441650",
  "1325183363434283012",
  "1325183363434283011",
  "1325183363434283009",
  "1325183363421831227",
  "1325183363421831224",
  "1408544076025827348"

];

// =====================
// Helper function for flashy replies that auto-delete
// =====================
async function flashyReply(channel, embed) {
  const sent = await channel.send({ embeds: [embed] });
  setTimeout(() => {
    sent.delete().catch(() => {});
  }, 5000); // delete after 5 seconds
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  // Only continue if the message starts with ?niggafy or ?whittify
  if (!message.content.startsWith("?niggafy") && !message.content.startsWith("?whittify")) return;

  const args = message.content.trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Only allow users with certain roles
  const hasPermission = message.member.roles.cache.some((r) =>
    allowedRoles.includes(r.id)
  );

  if (!hasPermission) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🚫 Permission Denied 🚫")
      .setDescription(
        `Sorry <@${message.author.id}>, you don’t have the required role to use this command.`
      )
      .setFooter({ text: "Ask an admin if you think this is a mistake." })
      .setTimestamp();
    return flashyReply(message.channel, embed);
  }

  const member = message.mentions.members.first();
  if (!member) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("⚠️ Missing User Mention ⚠️")
      .setDescription("Please **mention a user** to use this command!")
      .setTimestamp();
    return flashyReply(message.channel, embed);
  }

  const role = message.guild.roles.cache.get(targetRoleId);
  if (!role) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("❌ Role Not Found ❌")
      .setDescription("The target role could not be found in this server!")
      .setTimestamp();
    return flashyReply(message.channel, embed);
  }

  // =====================
  // ?niggafy → give role
  // =====================
  if (command === "?niggafy") {
    if (member.roles.cache.has(role.id)) {
      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("⚠️ Already Nigga-fied ⚠️")
        .setDescription(
          `<@${member.id}> already has the **${role.name}** role!`
        )
        .setTimestamp();
      return flashyReply(message.channel, embed);
    }

    await member.roles.add(role);

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("✨ Role Granted! ✨")
      .setDescription(
        `🎉 <@${member.id}> has been successfully **niggafied** and now holds the **${role.name}** role!`
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: "Powered by Gennify Bot" })
      .setTimestamp();

    return flashyReply(message.channel, embed);
  }

  // =====================
  // ?whittify → remove role
  // =====================
  if (command === "?whittify") {
    if (!member.roles.cache.has(role.id)) {
      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("⚠️ Already White ⚠️")
        .setDescription(`<@${member.id}> is already **whittified**!`)
        .setTimestamp();
      return flashyReply(message.channel, embed);
    }

    await member.roles.remove(role);

    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle("🤍 Certificate of Whiteness 🤍")
      .setDescription(
        `Congratulations <@${member.id}>, you have been **whittified**!\n\nYou are now officially **white**.`
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: "Certified by Gennify Bot™" })
      .setTimestamp();

    return flashyReply(message.channel, embed);
  }
});

client.login("MTQwODUyOTgzOTEyMzg1NzQ4OQ.GiXUmO.95J-OLOlVozdMdT2nV0mILtfx1q1-7k3hCb3MU"); // Replace with your token
