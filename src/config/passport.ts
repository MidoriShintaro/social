import dotenv from "dotenv";
import FacebookStrategy from "passport-facebook";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import User from "../models/User";
dotenv.config();

export const initPassport = () => {
  passport.serializeUser((user: any, done: any) => {
    done(undefined, user._id);
  });

  passport.deserializeUser((id: any, done: any) => {
    User.findById(id).then((user) => {
      done(undefined, user);
    });
  });

  passport.use(
    new FacebookStrategy.Strategy(
      {
        clientID: process.env.FB_KEY as string,
        clientSecret: process.env.FB_SECRET as string,
        callbackURL: process.env.FB_CALLBACK as string,
      },
      async function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        const user = await User.findById({ facebookId: profile.id });
        // if(!user) {
        //   const newUser = new User({
        //     username: profile.
        //   })
        // }
        return user;
      }
    )
  );
};
