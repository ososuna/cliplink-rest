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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDataSourceImpl = void 0;
const mongoose_1 = require("mongoose");
const domain_1 = require("../../domain");
const config_1 = require("../../config");
const __1 = require("../");
const mongodb_1 = require("../../data/mongodb");
class AuthDataSourceImpl {
    constructor(hashPassword = config_1.BcryptAdapter.hash, comparePassword = config_1.BcryptAdapter.compare) {
        this.hashPassword = hashPassword;
        this.comparePassword = comparePassword;
    }
    register(registerUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, lastName, email, password } = registerUserDto;
            try {
                const exists = yield mongodb_1.UserModel.findOne({ email, active: true });
                if (exists)
                    throw domain_1.CustomError.badRequest('user aleady exists');
                const user = yield mongodb_1.UserModel.create({
                    name: name,
                    lastName: lastName,
                    email: email,
                    password: this.hashPassword(password)
                });
                yield user.save();
                return __1.UserMapper.userEntityFromObject(user);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    login(loginUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = loginUserDto;
            try {
                const user = yield mongodb_1.UserModel.findOne({ email, active: true });
                if (!user)
                    throw domain_1.CustomError.badRequest('bad credentials');
                if (!user.password)
                    throw domain_1.CustomError.badRequest('bad credentials');
                const isValidPassword = this.comparePassword(password, user.password);
                if (!isValidPassword)
                    throw domain_1.CustomError.badRequest('bad credentials');
                return __1.UserMapper.userEntityFromObject(user);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield mongodb_1.UserModel.find();
                return users.map(user => __1.UserMapper.userEntityFromObject(user));
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(0, mongoose_1.isValidObjectId)(userId))
                    throw domain_1.CustomError.badRequest('user not found');
                const user = yield mongodb_1.UserModel.findById(userId);
                if (!user)
                    throw domain_1.CustomError.badRequest('user not found');
                return __1.UserMapper.userEntityFromObject(user);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    updateUser(userId, updateUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (updateUserDto.email) {
                    const exists = yield mongodb_1.UserModel.findOne({ email: updateUserDto.email });
                    if (exists)
                        throw domain_1.CustomError.badRequest('Invalid email');
                }
                const user = yield mongodb_1.UserModel.findByIdAndUpdate(userId, updateUserDto, {
                    new: true,
                });
                if (!user)
                    throw domain_1.CustomError.notFound('User not found');
                return __1.UserMapper.userEntityFromObject(user);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    authGithub(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Exchange the authorization code for an access token
                const tokenResponse = yield fetch('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    body: JSON.stringify({
                        client_id: config_1.envs.GITHUB_CLIENT_ID,
                        client_secret: config_1.envs.GITHUB_CLIENT_SECRET,
                        code: code,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                });
                if (!tokenResponse.ok) {
                    throw domain_1.CustomError.internalServer('Failed to fetch Github access token');
                }
                const { access_token: accessToken } = yield tokenResponse.json();
                // Fetch the authenticated user's information
                const userResponse = yield fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!userResponse.ok) {
                    throw domain_1.CustomError.internalServer('Failed to fetch Github user data');
                }
                const githubUser = yield userResponse.json();
                // check if user is already registered
                const user = yield mongodb_1.UserModel.findOne({ githubId: githubUser.id, active: true });
                if (user) {
                    // login
                    return __1.UserGithubMapper.userEntityFromObject(user);
                }
                else {
                    // register
                    const exists = yield mongodb_1.UserModel.findOne({ email: githubUser.email, active: true });
                    if (exists)
                        throw domain_1.CustomError.badRequest('An account with this email is already registered');
                    const userToSave = yield mongodb_1.UserModel.create({
                        name: githubUser.name,
                        email: githubUser.email,
                        githubId: githubUser.id
                    });
                    yield userToSave.save();
                    return __1.UserGithubMapper.userEntityFromObject(userToSave);
                }
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    authGoogle(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Exchange the authorization code for an access token and ID token
                const tokenResponse = yield fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    body: new URLSearchParams({
                        code: code,
                        client_id: config_1.envs.GOOGLE_CLIENT_ID,
                        client_secret: config_1.envs.GOOGLE_CLIENT_SECRET,
                        redirect_uri: config_1.envs.GOOGLE_CALLBACK_URL,
                        grant_type: 'authorization_code',
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
                if (!tokenResponse.ok) {
                    const errorDetails = yield tokenResponse.text();
                    console.error('Google Token Exchange Error:', errorDetails);
                    throw domain_1.CustomError.internalServer('Failed to fetch Google access token');
                }
                const { access_token: accessToken } = yield tokenResponse.json();
                // Fetch the authenticated user's information
                const userResponse = yield fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!userResponse.ok) {
                    throw domain_1.CustomError.internalServer('Failed to fetch Google user data');
                }
                const googleUser = yield userResponse.json();
                // Check if user is already registered
                const user = yield mongodb_1.UserModel.findOne({ googleId: googleUser.sub, active: true });
                if (user) {
                    // Login
                    return __1.UserGoogleMapper.userEntityFromObject(user);
                }
                else {
                    // Register
                    const exists = yield mongodb_1.UserModel.findOne({ email: googleUser.email, active: true });
                    if (exists)
                        throw domain_1.CustomError.badRequest('An account with this email is already registered');
                    const userToSave = yield mongodb_1.UserModel.create({
                        name: googleUser.given_name,
                        lastName: googleUser.family_name,
                        email: googleUser.email,
                        googleId: googleUser.sub,
                    });
                    yield userToSave.save();
                    return __1.UserGoogleMapper.userEntityFromObject(userToSave);
                }
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    deleteAccount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield mongodb_1.UserModel.findById(userId);
                if (!user)
                    throw domain_1.CustomError.notFound('user not found');
                yield mongodb_1.UrlModel.updateMany({ user: user._id }, { $set: { active: false } });
                yield mongodb_1.UserModel.findByIdAndDelete(userId);
                return __1.UserMapper.userEntityFromObject(user);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield mongodb_1.UserModel.findOne({ email, active: true });
                if (!user)
                    throw domain_1.CustomError.badRequest('bad credentials');
                if (user.googleId || user.githubId)
                    throw domain_1.CustomError.badRequest('bad credentials');
                return __1.UserMapper.userEntityFromObject(user);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    saveResetPasswordToken(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield mongodb_1.UserModel.findById(userId);
                if (!user)
                    throw domain_1.CustomError.notFound('user not found');
                const resetPasswordToken = yield mongodb_1.ResetPasswordTokenModel.create({
                    user: user._id,
                    token: token,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1) // 1 hour 
                });
                yield resetPasswordToken.save();
                return __1.ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(resetPasswordToken);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    isValidPasswordToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resetPasswordToken = yield mongodb_1.ResetPasswordTokenModel.findOne({ token, active: true });
                if (!resetPasswordToken)
                    throw domain_1.CustomError.badRequest('invalid token');
                const now = config_1.DateAdapter.now();
                if (resetPasswordToken.expiresAt < now)
                    throw domain_1.CustomError.badRequest('expired token');
                return __1.ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(resetPasswordToken);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    updatePassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resetPasswordToken = yield mongodb_1.ResetPasswordTokenModel.findOne({ token, active: true });
                if (!resetPasswordToken)
                    throw domain_1.CustomError.badRequest('invalid token');
                const now = config_1.DateAdapter.now();
                if (resetPasswordToken.expiresAt < now)
                    throw domain_1.CustomError.badRequest('expired token');
                const user = yield mongodb_1.UserModel.findById(resetPasswordToken.user);
                if (!user)
                    throw domain_1.CustomError.notFound('user not found');
                user.password = this.hashPassword(password);
                yield user.save();
                resetPasswordToken.active = false;
                yield resetPasswordToken.save();
                return __1.UserMapper.userEntityFromObject(user);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
}
exports.AuthDataSourceImpl = AuthDataSourceImpl;
//# sourceMappingURL=auth.datasource.impl.js.map