"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPassport = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const passport_1 = __importDefault(require("passport"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const initPassport = () => {
    passport_1.default.serializeUser((user, done) => {
        done(undefined, user._id);
    });
    passport_1.default.deserializeUser((id, done) => {
        User_1.default.findById(id).then((user) => {
            done(undefined, user);
        });
    });
    passport_1.default.use(new passport_facebook_1.default.Strategy({
        clientID: process.env.FB_KEY,
        clientSecret: process.env.FB_SECRET,
        callbackURL: process.env.FB_CALLBACK,
    }, function (accessToken, refreshToken, profile, done) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(profile);
            const user = yield User_1.default.findById({ facebookId: profile.id });
            // if(!user) {
            //   const newUser = new User({
            //     username: profile.
            //   })
            // }
            return user;
        });
    }));
};
exports.initPassport = initPassport;
//# sourceMappingURL=passport.js.map