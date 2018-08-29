const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let schema = new Schema({
    id: {type: Number, required: true},
    title: {type: String, required: true},
    body: {type: String, required: false},
    fos: {type: String, required: true}
});

module.exports = mongoose.model('Questions', schema);