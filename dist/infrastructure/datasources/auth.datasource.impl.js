import { isValidObjectId } from 'mongoose';
import { CustomError } from '../../domain';
import { BcryptAdapter, DateAdapter, envs } from '../../config';
import { UserMapper, UserGithubMapper, UserGoogleMapper, ResetPasswordTokenMapper } from '../';
import { ResetPasswordTokenModel, UrlModel, UserModel } from '../../data/mongodb';
export class AuthDataSourceImpl {
    constructor(hashPassword = BcryptAdapter.hash, comparePassword = BcryptAdapter.compare) {
        this.hashPassword = hashPassword;
        this.comparePassword = comparePassword;
    }
    async register(registerUserDto) {
        const { name, lastName, email, password } = registerUserDto;
        try {
            const exists = await UserModel.findOne({ email, active: true });
            if (exists)
                throw CustomError.badRequest('user aleady exists');
            const user = await UserModel.create({
                name: name,
                lastName: lastName,
                email: email,
                password: this.hashPassword(password)
            });
            await user.save();
            return UserMapper.userEntityFromObject(user);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async login(loginUserDto) {
        const { email, password } = loginUserDto;
        try {
            const user = await UserModel.findOne({ email, active: true });
            if (!user)
                throw CustomError.badRequest('bad credentials');
            if (!user.password)
                throw CustomError.badRequest('bad credentials');
            const isValidPassword = this.comparePassword(password, user.password);
            if (!isValidPassword)
                throw CustomError.badRequest('bad credentials');
            return UserMapper.userEntityFromObject(user);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async getUsers() {
        try {
            const users = await UserModel.find();
            return users.map(user => UserMapper.userEntityFromObject(user));
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async getUser(userId) {
        try {
            if (!isValidObjectId(userId))
                throw CustomError.badRequest('user not found');
            const user = await UserModel.findById(userId);
            if (!user)
                throw CustomError.badRequest('user not found');
            return UserMapper.userEntityFromObject(user);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async updateUser(userId, updateUserDto) {
        try {
            if (updateUserDto.email) {
                const exists = await UserModel.findOne({ email: updateUserDto.email });
                if (exists)
                    throw CustomError.badRequest('Invalid email');
            }
            const user = await UserModel.findByIdAndUpdate(userId, updateUserDto, {
                new: true,
            });
            if (!user)
                throw CustomError.notFound('User not found');
            return UserMapper.userEntityFromObject(user);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async authGithub(code) {
        try {
            // Exchange the authorization code for an access token
            const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                body: JSON.stringify({
                    client_id: envs.GITHUB_CLIENT_ID,
                    client_secret: envs.GITHUB_CLIENT_SECRET,
                    code: code,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            if (!tokenResponse.ok) {
                throw CustomError.internalServer('Failed to fetch Github access token');
            }
            const { access_token: accessToken } = await tokenResponse.json();
            // Fetch the authenticated user's information
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!userResponse.ok) {
                throw CustomError.internalServer('Failed to fetch Github user data');
            }
            const githubUser = await userResponse.json();
            // check if user is already registered
            const user = await UserModel.findOne({ githubId: githubUser.id, active: true });
            if (user) {
                // login
                return UserGithubMapper.userEntityFromObject(user);
            }
            else {
                // register
                const exists = await UserModel.findOne({ email: githubUser.email, active: true });
                if (exists)
                    throw CustomError.badRequest('An account with this email is already registered');
                const userToSave = await UserModel.create({
                    name: githubUser.name,
                    email: githubUser.email,
                    githubId: githubUser.id
                });
                await userToSave.save();
                return UserGithubMapper.userEntityFromObject(userToSave);
            }
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async authGoogle(code) {
        try {
            // Exchange the authorization code for an access token and ID token
            const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                body: new URLSearchParams({
                    code: code,
                    client_id: envs.GOOGLE_CLIENT_ID,
                    client_secret: envs.GOOGLE_CLIENT_SECRET,
                    redirect_uri: envs.GOOGLE_CALLBACK_URL,
                    grant_type: 'authorization_code',
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            if (!tokenResponse.ok) {
                const errorDetails = await tokenResponse.text();
                console.error('Google Token Exchange Error:', errorDetails);
                throw CustomError.internalServer('Failed to fetch Google access token');
            }
            const { access_token: accessToken } = await tokenResponse.json();
            // Fetch the authenticated user's information
            const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!userResponse.ok) {
                throw CustomError.internalServer('Failed to fetch Google user data');
            }
            const googleUser = await userResponse.json();
            // Check if user is already registered
            const user = await UserModel.findOne({ googleId: googleUser.sub, active: true });
            if (user) {
                // Login
                return UserGoogleMapper.userEntityFromObject(user);
            }
            else {
                // Register
                const exists = await UserModel.findOne({ email: googleUser.email, active: true });
                if (exists)
                    throw CustomError.badRequest('An account with this email is already registered');
                const userToSave = await UserModel.create({
                    name: googleUser.given_name,
                    lastName: googleUser.family_name,
                    email: googleUser.email,
                    googleId: googleUser.sub,
                });
                await userToSave.save();
                return UserGoogleMapper.userEntityFromObject(userToSave);
            }
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async deleteAccount(userId) {
        try {
            const user = await UserModel.findById(userId);
            if (!user)
                throw CustomError.notFound('user not found');
            await UrlModel.updateMany({ user: user._id }, { $set: { active: false } });
            await UserModel.findByIdAndDelete(userId);
            return UserMapper.userEntityFromObject(user);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email, active: true });
            if (!user)
                throw CustomError.badRequest('bad credentials');
            if (user.googleId || user.githubId)
                throw CustomError.badRequest('bad credentials');
            return UserMapper.userEntityFromObject(user);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async saveResetPasswordToken(userId, token) {
        try {
            const user = await UserModel.findById(userId);
            if (!user)
                throw CustomError.notFound('user not found');
            const resetPasswordToken = await ResetPasswordTokenModel.create({
                user: user._id,
                token: token,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1) // 1 hour 
            });
            await resetPasswordToken.save();
            return ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(resetPasswordToken);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async isValidPasswordToken(token) {
        try {
            const resetPasswordToken = await ResetPasswordTokenModel.findOne({ token, active: true });
            if (!resetPasswordToken)
                throw CustomError.badRequest('invalid token');
            const now = DateAdapter.now();
            if (resetPasswordToken.expiresAt < now)
                throw CustomError.badRequest('expired token');
            return ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(resetPasswordToken);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async updatePassword(token, password) {
        try {
            const resetPasswordToken = await ResetPasswordTokenModel.findOne({ token, active: true });
            if (!resetPasswordToken)
                throw CustomError.badRequest('invalid token');
            const now = DateAdapter.now();
            if (resetPasswordToken.expiresAt < now)
                throw CustomError.badRequest('expired token');
            const user = await UserModel.findById(resetPasswordToken.user);
            if (!user)
                throw CustomError.notFound('user not found');
            user.password = this.hashPassword(password);
            await user.save();
            resetPasswordToken.active = false;
            await resetPasswordToken.save();
            return UserMapper.userEntityFromObject(user);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
}
//# sourceMappingURL=auth.datasource.impl.js.map