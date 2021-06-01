// Models(Schema)
let kullanıcı = require('./Schema/Users');

class RegisterDB {
    
    static async kayıtBelirt(uye, isim, yas, yetkili, islemismi, cinsiyet) {
        await kullanıcı.updateOne({ id: yetkili.id } , { $inc: { "Toplamteyit": 1 } }, { upsert: true }).exec();
        await kullanıcı.updateOne({ id: yetkili.id }, { $push: {"Teyitler": { Uye: uye.id, Cinsiyet: cinsiyet, Zaman: Date.now() }}}, { upsert: true }).exec();
        await kullanıcı.updateOne({ id: uye.id }, { $push: { "Isimler": { Yetkili: yetkili.id, Zaman: Date.now(), Isim: isim, Yas: yas, islembilgi: islemismi } } }, { upsert: true }).exec();
        await kullanıcı.updateOne({ id: uye.id }, { $set: { "Cinsiyet": cinsiyet, "Isim": isim, "Yas": yas, "Yetkili": yetkili.id } }, { upsert: true }).exec();
    };

};

module.exports = { RegisterDB }