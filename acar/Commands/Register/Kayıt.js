const { Client, Message, MessageEmbed} = require("discord.js");
const { RegisterDB } = require('../../../Database/acarDatabase');
const tepkiler = [
    emojiler.erkekTepkiID,
    emojiler.kadınTepkiID,
];
module.exports = {
    Isim: "kayıt",
    Komut: ["kay","k"],
    Kullanim: "kayıt @acar/ID <isim> <yaş>",
    Aciklama: "",
    Kategori: "Moderation",
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, message.guild.iconURL({dynamic: true})).setColor(ayarlar.embed.renk).setFooter(ayarlar.embed.altbaşlık)
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.prefix}${module.exports.Isim} <@acar/ID> <Isim> <Yaş>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => x.delete({timeout: 5000}));
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz).then(x => x.delete({timeout: 5000}));
    
    if(uye.roles.cache.has(roller.erkekRolü)) return message.channel.send(cevaplar.kayıtlı);
    if(uye.roles.cache.has(roller.kadınRolü)) return message.channel.send(cevaplar.kayıtlı);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust).then(x => x.delete({timeout: 5000}));
    if(ayarlar.taglıalım != false && !uye.user.username.includes(ayarlar.tag) && !uye.roles.cache.has(roller.boosterRolü) && !uye.roles.cache.has(roller.vipRolü) && !message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.taglıalım).then(x => x.delete({timeout: 5000}));
    if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7 && !message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.yenihesap).then(x => x.delete({timeout: 5000}));
    if(uye.roles.cache.has(roller.şüpheliRolü) && uye.roles.cache.has(roller.jailRolü) && uye.roles.cache.has(roller.yasaklıTagRolü) && !message.member.hasPermission('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.cezaliüye).then(x => x.delete({timeout: 5000}))    
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if (yaş < ayarlar.minYaş) return message.channel.send(cevaplar.yetersizyaş).then(x => x.delete({timeout: 5000}));
    if(!isim || !yaş) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.prefix}${module.exports.Isim} <@acar/ID> <Isim> <Yaş>\``);
    setName = `${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${isim} | ${yaş}`;
    uye.setNickname(`${setName}`).catch(err => message.channel.send(cevaplar.isimapi));
   let acarkayit = await message.channel.send(embed.setDescription(`${uye} isimli kişinin cinsiyetini aşağıdaki tepkilerle belirleyin!`)).then(async m => {
        await m.react(emojiler.erkekTepkiID)
        await m.react(emojiler.kadınTepkiID) 
        return m;
        }).catch(err => undefined);
    let tepki = await acarkayit.awaitReactions((reaction, user) => user.id == message.author.id && tepkiler.some(emoji => emoji == reaction.emoji.id), { errors: ["time"], max: 1, time: 15000 }).then(coll => coll.first()).catch(err => { message.channel.send(embed.setDescription(`${message.author}, 15 saniye boyunca cevap vermediği için kayıt işlemi iptal edildi.`)).then(sil => sil.delete({timeout: 7500})); acarkayit.delete().catch(); return; });
    if(!tepki) return;
    acarkayit.delete()
    if (tepki.emoji.id == emojiler.erkekTepkiID) {
        kayıtYap(uye, message.member, isim, yaş, "erkek")
        message.channel.send(embed.setDescription(`${uye}, adlı üye başarıyla ${message.author}, tarafından **Erkek** olarak kayıt edildi.`)).then(sil => sil.delete({timeout: 15000}));    } else {
    if (tepki.emoji.id == emojiler.kadınTepkiID) {
        kayıtYap(uye, message.member, isim, yaş, "kadın")
        message.channel.send(embed.setDescription(`${uye}, adlı üye başarıyla ${message.author}, tarafından **Kadın** olarak kayıt edildi.`)).then(sil => sil.delete({timeout: 15000}));
         } 
        }
    }
};

async function kayıtYap(uye, yetkili, isim, yaş, cinsiyet) {
    let rol;
    let rolver;
    if(cinsiyet === "erkek") {
        rol = roller.erkekRolü
        rolver = roller.erkekRolleri
    } else if(cinsiyet == "kadın") {
        rol = roller.kadınRolü
        rolver = roller.kadınRolleri
    }
    await uye.kayıtRolVer(rolver).then(acar => { if(uye.user.username.includes(ayarlar.tag)) uye.roles.add(roller.tagRolü) });
    await RegisterDB.kayıtBelirt(uye, isim, yaş, yetkili, `<@&${rol}>`, cinsiyet)
    yetkili.guild.kayıtLog(yetkili, uye, cinsiyet, "kayıt-log");
    client.channels.cache.get(kanallar.chatKanalı).send(`:tada: ${uye} Aramıza Katıldı! aramıza hoş geldin, İyi Eğlenceler.`).then(x => x.delete({timeout: 12500}))

}
