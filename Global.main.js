const { Client, Collection, GuildMember, Guild, TextChannel, Message, MessageEmbed } = require('discord.js');
const fs = require('fs')
const moment = require('moment');
require("moment-duration-format");
require("moment-timezone");

class acar extends Client {
    constructor(options) {
        super(options);

            // Sistem Gereksinimi
                this.roller = global.roller = require('./acar/Settings/roles');
                this.sistem = global.sistem = require('./acar/Settings/system');
                this.ayarlar = global.ayarlar = require('./acar/Settings/settings');
                this.kanalar = global.kanallar = require('./acar/Settings/channels');
                this.emojiler = global.emojiler = require('./acar/Settings/emojis');
                this.cevaplar = global.cevaplar = require('./acar/Settings/reply');
            // Sistem Gereksinimi

            // Handler
                this.komutlar = new Collection();
                this.komut = new Collection();
            // Handler

    }

    komutYükle(botisim) {
        fs.readdir(`./acar/Commands/${botisim}`, (err, files) => {
            if(err) return console.error(err);
            files = files.filter(file => file.endsWith(".js"));
            console.log('\x1b[34m%s\x1b[0m', `[ ACAR ${botisim} (${files.length}) adet Komut Yüklendi! ]`);
            files.forEach(file => {
            let referans = require(`./acar/Commands/${botisim}/${file}`);
            if(typeof referans.onLoad === "function") referans.onLoad(this);
            this.komutlar.set(referans.Isim, referans);
                    if (referans.Komut) {
                        referans.Komut.forEach(alias => this.komut.set(alias, referans));
                    }
            });
        });
    }

    eventYükle(fileName) {
        let referans = require(`./acar/Events/${fileName}`);
        this.on(referans.config.Event, referans);
        console.log('\x1b[32m%s\x1b[0m', `[ ACAR Default Etkinlik ] ${fileName} yüklendi.`);
    }
}

class Mongo {
    static Connect() {
        require('mongoose').connect(require('./acar/Settings/system').MongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            console.log("[Mongoosee] Bağlantı Başarıyla Kuruldu!")
        }).catch((err) => {
            console.log("MongoDB veritabanına bağlantı sağlanamadı!\n" + err, "error");
        });
    }

}

const sayilariCevir = global.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

    let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
    global.aylar = aylartoplam;
const tarihsel = global.tarihsel = function(tarih) {
    let tarihci = moment(tarih).tz("Europe/Istanbul").format("DD") + " " + global.aylar[moment(tarih).tz("Europe/Istanbul").format("MM")] + " " + moment(tarih).tz("Europe/Istanbul").format("YYYY HH:mm")   
    return tarihci;
};

Guild.prototype.kanalBul = function(kanalisim) {
    let kanal = this.channels.cache.find(k => k.name === kanalisim)
    return kanal;
}

GuildMember.prototype.rolTanımla = function (rolidler = []) {
    let rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler);
    return this.roles.set(rol);
}

GuildMember.prototype.kayıtRolVer = function (rolidler = []) {
    let rol;
    if(this.roles.cache.has(roller.vipRolü)) { 
    rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler).concat(roller.vipRolü) 
    } else {
    rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler)
    };
    return this.roles.set(rol);
}

Guild.prototype.kayıtLog = async function kayıtLog(yetkili, üye, cins, channelName) {
    let kanal = this.channels.cache.find(k => k.name === channelName);
    let cinsiyet;
    if(cins === "erkek") { cinsiyet = "Erkek" } else if(cins === "kadın") { cinsiyet = "Kadın" }
    if(kanal) {
        let embed = new MessageEmbed().setAuthor(ayarlar.embed.başlık, client.guilds.cache.get(ayarlar.sunucuID).iconURL({dynamic: true, size: 2048})).setColor(ayarlar.embed.renk).setDescription(`${üye} isimli üye **${tarihsel(Date.now())}** tarihinde ${yetkili} tarafından **${cinsiyet}** olarak kayıt edildi.`).setFooter(ayarlar.embed.altbaşlık)
        kanal.send(embed)
    };
}

module.exports = { acar, Mongo };