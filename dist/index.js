"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./db/db"));
const error_1 = require("./controllers/error");
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const post_1 = __importDefault(require("./routes/post"));
const comment_1 = __importDefault(require("./routes/comment"));
const conversation_1 = __importDefault(require("./routes/conversation"));
const message_1 = __importDefault(require("./routes/message"));
const notification_1 = __importDefault(require("./routes/notification"));
const path_1 = __importDefault(require("path"));
const socket_1 = __importDefault(require("./socket/socket"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const urlClient = process.env.URL_CLIENT;
//config socket
(0, socket_1.default)();
//connect db
(0, db_1.default)();
//middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "/public")));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: urlClient,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
    next();
});
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(
//   session({
//     secret,
//     resave: true,
//     saveUninitialized: true,
//   })
// );
// app.use(initPassport);
//routes
app.use("/api/auth", auth_1.default);
app.use("/api/notification", notification_1.default);
app.use("/api/user", user_1.default);
app.use("/api/post", post_1.default);
app.use("/api/comment", comment_1.default);
app.use("/api/conversation", conversation_1.default);
app.use("/api/message", message_1.default);
//global error handling middleware
app.use(error_1.HandlingError);
app.use((err, req, res, next) => {
    // console.log(__dirname + "../public/images");
});
//server
app.listen(port, () => {
    console.log("Server listening on port " + port);
});
//# sourceMappingURL=index.js.map