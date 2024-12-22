"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const domain_1 = require("../../domain");
const config_1 = require("../../config");
class AuthController {
    // dependency injection 💉
    constructor(authRepository) {
        this.authRepository = authRepository;
        this.handleError = (error, res) => {
            if (error instanceof domain_1.CustomError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            console.log(error); // winston logger
            return res.status(500).json({ error: 'internal server error' });
        };
        this.registerUser = (req, res) => {
            const [error, registerUserDto] = domain_1.RegisterUserDto.create(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            // create use case instance
            new domain_1.RegisterUser(this.authRepository)
                .execute(registerUserDto)
                .then(data => {
                res.cookie('access_token', data.token, {
                    httpOnly: true, // cookie can be only accessed in the server
                    secure: process.env.NODE_ENV === 'production', // only https access
                    sameSite: 'lax', // only in the same domain
                    maxAge: 1000 * 60 * 60 // valid 1 hour
                })
                    .send(data.user);
            })
                .catch(error => this.handleError(error, res));
        };
        this.loginUser = (req, res) => {
            const [error, loginUserDto] = domain_1.LoginUserDto.create(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            // create use case instance
            new domain_1.LoginUser(this.authRepository)
                .execute(loginUserDto)
                .then(data => {
                res.cookie('access_token', data.token, {
                    httpOnly: true, // cookie can be only accessed in the server
                    secure: process.env.NODE_ENV === 'production', // only https access
                    sameSite: 'lax', // only in the same domain
                    maxAge: 1000 * 60 * 60 // valid 1 hour
                })
                    .send(data.user);
            })
                .catch(error => this.handleError(error, res));
        };
        this.getUsers = (req, res) => {
            new domain_1.GetUsers(this.authRepository)
                .execute()
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
        this.getUser = (req, res) => {
            const userId = req.params.id;
            new domain_1.GetUser(this.authRepository)
                .execute(userId)
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
        this.logout = (req, res) => {
            res.clearCookie('access_token').json({ message: 'logout successful' });
        };
        this.checkToken = (req, res) => {
            const { id, name, lastName, email, githubId, googleId } = req.body.user;
            res.json({ id, name, lastName, email, githubId, googleId });
        };
        this.updateUser = (req, res) => {
            const userId = req.body.user.id;
            const [error, updateUserDto] = domain_1.UpdateUserDto.create(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            new domain_1.UpdateUser(this.authRepository)
                .execute(userId, updateUserDto)
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
        this.loginGithub = (req, res) => {
            const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config_1.envs.GITHUB_CLIENT_ID}&redirect_uri=${config_1.envs.GITHUB_CALLBACK_URL}`;
            res.redirect(githubAuthUrl);
        };
        this.loginGithubCallback = (req, res) => {
            const code = req.query.code;
            if (!code)
                domain_1.CustomError.badRequest('Missing Github Auth code');
            new domain_1.AuthGithub(this.authRepository)
                .execute(code)
                .then(data => {
                res.cookie('access_token', data.token, {
                    httpOnly: true, // cookie can be only accessed in the server
                    secure: process.env.NODE_ENV === 'production', // only https access
                    sameSite: 'lax', // only in the same domain
                    maxAge: 1000 * 60 * 60 // valid 1 hour
                });
                res.redirect('http://localhost:4321/dashboard');
            })
                .catch(error => {
                const url = new URL('http://localhost:4321/auth/login');
                let errorMsg = 'internal server error';
                if (error instanceof domain_1.CustomError) {
                    errorMsg = error.message;
                }
                url.searchParams.set('error', errorMsg);
                res.redirect(url.toString());
            });
        };
        this.loginGoogle = (req, res) => {
            const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${config_1.envs.GOOGLE_CLIENT_ID}&redirect_uri=${config_1.envs.GOOGLE_CALLBACK_URL}&scope=openid%20email%20profile`;
            res.redirect(googleAuthUrl);
        };
        this.loginGoogleCallback = (req, res) => {
            const code = req.query.code;
            if (!code)
                domain_1.CustomError.badRequest('Missing Google Auth code');
            new domain_1.AuthGoogle(this.authRepository)
                .execute(code)
                .then(data => {
                res.cookie('access_token', data.token, {
                    httpOnly: true, // cookie can be only accessed in the server
                    secure: process.env.NODE_ENV === 'production', // only https access
                    sameSite: 'lax', // only in the same domain
                    maxAge: 1000 * 60 * 60 // valid 1 hour
                });
                res.redirect('http://localhost:4321/dashboard');
            })
                .catch(error => {
                const url = new URL('http://localhost:4321/auth/login');
                let errorMsg = 'internal server error';
                if (error instanceof domain_1.CustomError) {
                    errorMsg = error.message;
                }
                url.searchParams.set('error', errorMsg);
                res.redirect(url.toString());
            });
        };
        this.deleteAccount = (req, res) => {
            const userId = req.body.user.id;
            new domain_1.DeleteAccount(this.authRepository)
                .execute(userId)
                .then(data => {
                res.clearCookie('access_token').json(data);
            })
                .catch(error => this.handleError(error, res));
        };
    }
}
exports.AuthController = AuthController;
