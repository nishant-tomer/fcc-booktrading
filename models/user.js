var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    city: { type:String, required:true },
    state: { type:String, required:true }
});


UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {  return next() }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) { return next(err) }

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) { return next(err) }
            user.password = hash;
            return next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
