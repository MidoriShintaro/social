import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Express } from "express";
import dotenv from "dotenv";
import User from "../models/User";
import { signAccessToken, signRefreshToken } from "../controllers/auth";

dotenv.config();

export default function passportConfig(app: Express): void {
  // Configure Passport with Facebook strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_KEY!,
        clientSecret: process.env.FB_SECRET!,
        callbackURL: process.env.FB_CALLBACK!,
        profileFields: ["id", "displayName", "email", "name", "photos"],
      },
      async (accessToken, refreshToken, profile, done) => {
        // Handle the user profile data and authentication logic here
        const currentUser = await User.findOne({ facebookId: profile.id });
        if (currentUser) {
          return done(null, { currentUser, accessToken });
        }
        const newUser = new User({
          facebookId: profile.id,
          email: profile.emails?.[0].value,
          fullname: profile.displayName,
          username: profile.name?.givenName,
          picturePhoto: profile.photos?.[0].value,
        });
        const user = await newUser.save();
        return done(null, { user, accessToken });
      }
    )
  );

  passport.serializeUser(function (user: any, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => done(null, user));
  });

  // Initialize Passport and session support
  app.use(passport.initialize());
  app.use(passport.session());
}
