const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, select:false},
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function(password){
  try{
    return await bcrypt.compare(password, this.password)
  }catch(error){
    console.log(error);
    throw error;
  }
}

const User = mongoose.model("User", UserSchema)
module.exports = User;