const { Message, MessageEmbed } = require("discord.js");

 /**
 * @param {Message} message 
 */

module.exports = (message) => {
    
    //Gereksinimler Başlangıç
        let emojiler = global.emojiler
        let kanallar = global.kanallar
        let roller = global.roller
        let ayarlar = global.ayarlar
        let sistem = global.sistem
    //Gereksinimler Bitiş
     
    if (message.author.bot ||!message.content.startsWith(global.sistem.prefix) || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(global.sistem.prefix.length).split(" ");
    let komutcuklar = args[0];
    let bot = message.client;
    args = args.splice(1);
    let calistirici;
    if (bot.komut.has(komutcuklar)) {
      calistirici = bot.komut.get(komutcuklar);
      calistirici.onRequest(bot, message, args);
    } else if (bot.komutlar.has(komutcuklar)) {
      calistirici = bot.komutlar.get(komutcuklar);
      calistirici.onRequest(bot, message, args);
    }
}

module.exports.config = {
    Event: "message"
}