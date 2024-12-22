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
exports.ForgotPassword = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const resend_1 = require("resend");
const config_1 = require("../../../config");
const __1 = require("../../");
class ForgotPassword {
    constructor(authRepository, idGenerator = config_1.IdAdapter.generateId) {
        this.authRepository = authRepository;
        this.idGenerator = idGenerator;
    }
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.getUserByEmail(email);
            const token = this.idGenerator();
            const resetPasswordToken = yield this.authRepository.saveResetPasswordToken(user.id, token);
            const url = config_1.envs.WEB_APP_URL + '/auth/reset-password/' + resetPasswordToken.token;
            // Load the email template
            const templatePath = path_1.default.resolve(__dirname, '../../../assets/templates/reset-password.template.html');
            let emailHtml = yield promises_1.default.readFile(templatePath, 'utf-8');
            emailHtml = emailHtml.replace('{{resetLink}}', url);
            const resend = new resend_1.Resend(config_1.envs.RESEND_API_KEY);
            const resp = yield resend.emails.send({
                from: 'send@cliplink.app',
                to: user.email,
                subject: 'Password Reset',
                html: emailHtml
            });
            if (resp.error)
                throw __1.CustomError.internalServer('Error sending email');
        });
    }
}
exports.ForgotPassword = ForgotPassword;
//# sourceMappingURL=forgot-password.use-case.js.map