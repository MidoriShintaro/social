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
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = require("passport-facebook");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
function passportConfig(app) {
    // Configure Passport with Facebook strategy
    passport_1.default.use(new passport_facebook_1.Strategy({
        clientID: process.env.FB_KEY,
        clientSecret: process.env.FB_SECRET,
        callbackURL: process.env.FB_CALLBACK,
        profileFields: ["id", "displayName", "email", "name", "photos"],
    }, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        // Handle the user profile data and authentication logic here
        const currentUser = yield User_1.default.findOne({ facebookId: profile.id });
        if (currentUser) {
            return done(null, currentUser);
        }
        const newUser = new User_1.default({
            facebookId: profile.id,
            email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
            fullname: profile.displayName,
            username: (_b = profile.name) === null || _b === void 0 ? void 0 : _b.givenName,
            picturePhoto: (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0].value,
        });
        const user = yield newUser.save();
        return done(null, user);
    })));
    passport_1.default.serializeUser(function (user, done) {
        done(null, user._id);
    });
    passport_1.default.deserializeUser(function (id, done) {
        User_1.default.findById(id).then((user) => done(null, user));
    });
    // Initialize Passport and session support
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
}
exports.default = passportConfig;
//# sourceMappingURL=passport.js.map