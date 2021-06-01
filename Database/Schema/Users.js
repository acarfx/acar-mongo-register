const mongoose = require("mongoose");

const schema = mongoose.model('User', new mongoose.Schema({
    id: String,
    Isim: String,
    Yas: String,
    Cinsiyet: String,
    Yetkili: String,
    Toplamteyit: {type: Number, default: 0},
    Teyitler: {type: Array, default: []},
    Isimler: { type: Array, default: []},
    
}));

module.exports = schema;

 /**
 * @param {String} id
 * @returns {Document} 
 */

 module.exports.findOrCreate = async (no) => {
    let kull = await schema.findOneAndUpdate({id: no}, {}, {setDefaultsOnInsert: true, new: true, upsert: true});
    return kull;
  }