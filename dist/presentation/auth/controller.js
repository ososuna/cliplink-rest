import { AuthGithub, AuthGoogle, CheckPasswordToken, CustomError, DeleteAccount, ForgotPassword, GetUser, GetUsers, LoginUser, LoginUserDto, RegisterUser, RegisterUserDto, UpdatePassword, UpdateUser, UpdateUserDto } from '../../domain';
import { envs } from '../../config';
export class AuthController {
    // dependency injection 💉
    constructor(authRepository) {
        this.authRepository = authRepository;
        this.handleError = (error, res) => {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            console.log(error); // winston logger
            return res.status(500).json({ error: 'internal server error' });
        };
        this.registerUser = (req, res) => {
            const [error, registerUserDto] = RegisterUserDto.create(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            // create use case instance
            new RegisterUser(this.authRepository)
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
            const [error, loginUserDto] = LoginUserDto.create(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            // create use case instance
            new LoginUser(this.authRepository)
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
            new GetUsers(this.authRepository)
                .execute()
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
        this.getUser = (req, res) => {
            const userId = req.params.id;
            new GetUser(this.authRepository)
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
            const [error, updateUserDto] = UpdateUserDto.create(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            new UpdateUser(this.authRepository)
                .execute(userId, updateUserDto)
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
        this.loginGithub = (req, res) => {
            const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${envs.GITHUB_CLIENT_ID}&redirect_uri=${envs.GITHUB_CALLBACK_URL}`;
            res.redirect(githubAuthUrl);
        };
        this.loginGithubCallback = (req, res) => {
            const code = req.query.code;
            if (!code)
                CustomError.badRequest('Missing Github Auth code');
            new AuthGithub(this.authRepository)
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
                if (error instanceof CustomError) {
                    errorMsg = error.message;
                }
                url.searchParams.set('error', errorMsg);
                res.redirect(url.toString());
            });
        };
        this.loginGoogle = (req, res) => {
            const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${envs.GOOGLE_CLIENT_ID}&redirect_uri=${envs.GOOGLE_CALLBACK_URL}&scope=openid%20email%20profile`;
            res.redirect(googleAuthUrl);
        };
        this.loginGoogleCallback = (req, res) => {
            const code = req.query.code;
            if (!code)
                CustomError.badRequest('Missing Google Auth code');
            new AuthGoogle(this.authRepository)
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
                if (error instanceof CustomError) {
                    errorMsg = error.message;
                }
                url.searchParams.set('error', errorMsg);
                res.redirect(url.toString());
            });
        };
        this.deleteAccount = (req, res) => {
            const userId = req.body.user.id;
            new DeleteAccount(this.authRepository)
                .execute(userId)
                .then(data => {
                res.clearCookie('access_token').json(data);
            })
                .catch(error => this.handleError(error, res));
        };
        this.forgotPassword = (req, res) => {
            const email = req.body.email;
            if (!email) {
                res.status(400).json({ error: 'Missing email' });
                return;
            }
            new ForgotPassword(this.authRepository)
                .execute(email)
                .then(() => res.json({ message: 'Email sent successfully' }))
                .catch(error => this.handleError(error, res));
        };
        this.checkResetPasswordToken = (req, res) => {
            const token = req.params.token;
            if (!token) {
                res.status(400).json({ error: 'missing token' });
                return;
            }
            new CheckPasswordToken(this.authRepository)
                .execute(token)
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
        this.updatePassword = (req, res) => {
            const token = req.body.token;
            const password = req.body.password;
            if (!token) {
                res.status(400).json({ error: 'missing token' });
                return;
            }
            ;
            if (!password) {
                res.status(400).json({ error: 'missing password' });
                return;
            }
            new UpdatePassword(this.authRepository)
                .execute(token, password)
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
    }
}
//# sourceMappingURL=controller.js.map