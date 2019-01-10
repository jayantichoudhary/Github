var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var weburlSchema = new Schema({
    href: {type: String, unique: true},
    depth: {type: Number},
    url: Schema.Types.Mixed,
    domain: {type: String},
    tld: {type: String},
    phone: [{type: String}],
    mobile: [{type:String}],
    email: [{type:String}],
    _error: {type:Boolean},
    isCrawled: {type: Boolean , default: false},
    _created: { type: Date, default: Date.now },
    _crawledAt: { type: Date },
    
    externalURLs: [Schema.Types.Mixed],
    
    _reference: {type: Schema.ObjectId, ref: 'weburl'},
    coaching: {type: Schema.ObjectId, ref: 'coaching'},
    college: {type: Schema.ObjectId, ref: 'college'},
    school: {type: Schema.ObjectId, ref: 'school'},
});

weburlSchema.plugin(deepPopulate);

var weburls = mongoose.model('weburls', weburlSchema);
module.exports = weburls