const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  aadharCardNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function(next){
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparepassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};
// userSchema.methods.comparepassword = async function (candidatePassword) {
//   try {
//     console.log("Type of candidatePassword:", typeof candidatePassword);
//     console.log("Type of stored password:", typeof this.password);
    
//     // Ensure both are strings
//     if (typeof candidatePassword !== 'string' || typeof this.password !== 'string') {
//       throw new Error("Password values must be strings.");
//     }

//     const isMatch = await bcrypt.compare(candidatePassword, this.password);
//     console.log("Password match result:", isMatch);
//     return isMatch;
//   } catch (err) { 
//     console.error("Error comparing passwords:", err);
//     throw err;
//   }
// };



const User = mongoose.model("user", userSchema);
module.exports = User;
