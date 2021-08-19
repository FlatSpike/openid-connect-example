"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const oidc_1 = __importDefault(require("./oidc"));
const app = express_1.default();
app.use('/oidc', oidc_1.default.callback());
exports.default = app;
