import { Request, Response } from 'express';
import {
  AuthGithub,
  AuthGoogle,
  AuthRepository,
  CheckPasswordToken,
  RefreshToken,
  CustomError,
  DeleteAccount,
  ForgotPassword,
  GetUser,
  GetUsers,
  LoginUser,
  LoginUserDto,
  RegisterUser,
  RegisterUserDto,
  UpdatePassword,
  UpdateUser,
  UpdateUserDto,
  type UserToken,
} from '@/domain';
import { CookieConfig, Messages, envs } from '@/config';
export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error); // winston logger
    return res.status(500).json({ message: Messages.INTERNAL_SERVER_ERROR });
  };

  private setAuthCookies = (res: Response, userToken: UserToken): void => {
    res.cookie('access_token', userToken.accessToken, CookieConfig.authCookieOptions());
    res.cookie('refresh_token', userToken.refreshToken, CookieConfig.authCookieOptions(60 * 60 * 24 * 7 * 1000)); // 7 days in milliseconds
  };

  private clearAuthCookies = (res: Response): void => {
    res.clearCookie('access_token', CookieConfig.authClearCookieOptions());
    res.clearCookie('refresh_token', CookieConfig.authClearCookieOptions());
  };

  registerUser = (req: Request, res: Response): void => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((data) => {
        this.setAuthCookies(res, data);
        res.send(data.user);
      })
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response): void => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then((data) => {
        this.setAuthCookies(res, data);
        res.send(data.user);
      })
      .catch((error) => this.handleError(error, res));
  };

  getUsers = (req: Request, res: Response): void => {
    new GetUsers(this.authRepository)
      .execute()
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  getUser = (req: Request, res: Response): void => {
    const userId = req.params.id;
    new GetUser(this.authRepository)
      .execute(userId)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  logout = (req: Request, res: Response): void => {
    this.clearAuthCookies(res);
    res.json({ message: Messages.LOGOUT_SUCCESSFUL });
  };

  checkToken = (req: Request, res: Response): void => {
    const { id, name, lastName, email, githubId, googleId } = req.body.user;
    res.json({ id, name, lastName, email, githubId, googleId });
  };

  refreshToken = (req: Request, res: Response): void => {
    const user = req.body.user;
    new RefreshToken()
      .execute(user)
      .then((data) => {
        this.setAuthCookies(res, data);
        res.send(user);
      })
      .catch((error) => this.handleError(error, res));
  };

  updateUser = (req: Request, res: Response): void => {
    const userId = req.body.user.id;
    const [error, updateUserDto] = UpdateUserDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    new UpdateUser(this.authRepository)
      .execute(userId, updateUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  loginGithub = (req: Request, res: Response): void => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${envs.GITHUB_CLIENT_ID}&redirect_uri=${envs.GITHUB_CALLBACK_URL}`;
    res.redirect(githubAuthUrl);
  };

  loginGithubCallback = (req: Request, res: Response): void => {
    const code = req.query.code as string;
    if (!code) throw CustomError.badRequest(Messages.REQUIRED_FIELD('Github auth code'));
    new AuthGithub(this.authRepository)
      .execute(code)
      .then((data) => {
        this.setAuthCookies(res, data);
        res.redirect(`${envs.WEB_APP_URL}/dashboard`);
      })
      .catch((error) => {
        const url = new URL(`${envs.WEB_APP_URL}/auth/login`);
        let errorMsg = Messages.INTERNAL_SERVER_ERROR;
        if (error instanceof CustomError) {
          errorMsg = error.message;
        }
        url.searchParams.set('error', errorMsg);
        res.redirect(url.toString());
      });
  };

  loginGoogle = (req: Request, res: Response): void => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${envs.GOOGLE_CLIENT_ID}&redirect_uri=${envs.GOOGLE_CALLBACK_URL}&scope=openid%20email%20profile`;
    res.redirect(googleAuthUrl);
  };

  loginGoogleCallback = (req: Request, res: Response): void => {
    const code = req.query.code as string;
    if (!code) throw CustomError.badRequest(Messages.REQUIRED_FIELD('Google auth code'));
    new AuthGoogle(this.authRepository)
      .execute(code)
      .then((data) => {
        this.setAuthCookies(res, data);
        res.redirect(`${envs.WEB_APP_URL}/dashboard`);
      })
      .catch((error) => {
        const url = new URL(`${envs.WEB_APP_URL}/auth/login`);
        let errorMsg = Messages.INTERNAL_SERVER_ERROR;
        if (error instanceof CustomError) {
          errorMsg = error.message;
        }
        url.searchParams.set('error', errorMsg);
        res.redirect(url.toString());
      });
  };

  deleteAccount = (req: Request, res: Response): void => {
    const userId = req.body.user.id;
    new DeleteAccount(this.authRepository)
      .execute(userId)
      .then((data) => {
        this.clearAuthCookies(res);
        res.json(data);
      })
      .catch((error) => this.handleError(error, res));
  };

  forgotPassword = (req: Request, res: Response): void => {
    const email = req.body.email;
    if (!email) {
      res.status(400).json({ error: Messages.REQUIRED_FIELD('email') });
      return;
    }
    new ForgotPassword(this.authRepository)
      .execute(email)
      .then(() => res.json({ message: Messages.EMAIL_SUCCESSFUL }))
      .catch((error) => this.handleError(error, res));
  };

  checkResetPasswordToken = (req: Request, res: Response): void => {
    const token = req.params.token;
    if (!token) {
      res.status(400).json({ error: 'missing token' });
      return;
    }
    new CheckPasswordToken(this.authRepository)
      .execute(token)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  updatePassword = (req: Request, res: Response): void => {
    const token = req.body.token;
    const password = req.body.password;
    if (!token) {
      res.status(400).json({ error: 'missing token' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'missing password' });
      return;
    }
    new UpdatePassword(this.authRepository)
      .execute(token, password)
      .then((data) => {
        this.setAuthCookies(res, data);
        res.send(data.user);
      })
      .catch((error) => this.handleError(error, res));
  };
}
