const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { HOST, PORT } = process.env;

passport.serializeUser((user, done) => {
  console.log("Serialize user...");
  // console.log(user);
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  console.log("Deserialize user。。。");
  let foundUser = await User.findOne({ _id });
  done(null, foundUser); //將req.user這個屬性設定為foundUser
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://127.0.0.1/auth/google/redirect`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入Google Stratagy的區域");
      console.log("========================");
      let foundUser = await User.findOne({ ID: profile.id }).exec();
      if (foundUser) {
        console.log("使用者已經註冊過了，無須存入資料庫內。");
        done(null, foundUser);
      } else {
        console.log("偵測到新用戶，須將存入資料庫內");
        let newUser = new User({
          name: profile.displayName,
          ID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        let savedUser = await newUser.save();
        console.log("成功創建新用戶");
        done(null, savedUser);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    let foundUser = await User.findOne({ email: username });
    if (foundUser) {
      let result = await bcrypt.compare(password, foundUser.password);
      if (result) {
        done(null, foundUser);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }
  })
);
