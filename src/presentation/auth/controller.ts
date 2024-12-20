import { Request, Response } from 'express';
import { AuthGithub, AuthGoogle, AuthRepository, CustomError, GetUser, GetUsers, LoginUser, LoginUserDto, RegisterUser, RegisterUserDto, UpdateUser, UpdateUserDto } from '../../domain';
import { envs } from '../../config';
export class AuthController {

  // dependency injection 💉
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.log(error); // winston logger
    return res.status(500).json({ error: 'internal server error' });
  }

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    // create use case instance
    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then( data => {
        res.cookie('access_token', data.token, {
          httpOnly: true, // cookie can be only accessed in the server
          secure: process.env.NODE_ENV === 'production', // only https access
          sameSite: 'lax', // only in the same domain
          maxAge: 1000 * 60 * 60 // valid 1 hour
        })
        .send(data.user);
      })
      .catch( error => this.handleError(error, res) );
  }

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    // create use case instance
    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then( data => {
        res.cookie('access_token', data.token, {
          httpOnly: true, // cookie can be only accessed in the server
          secure: process.env.NODE_ENV === 'production', // only https access
          sameSite: 'lax', // only in the same domain
          maxAge: 1000 * 60 * 60 // valid 1 hour
        })
        .send(data.user);
      })
      .catch( error => this.handleError(error, res) )
  }

  getUsers = (req: Request, res: Response) => {
    new GetUsers(this.authRepository)
      .execute()
      .then( data => res.json(data) )
      .catch( error => this.handleError(error, res) )
  }

  getUser = (req: Request, res: Response) => {
    const userId = req.params.id;
    new GetUser(this.authRepository)
      .execute(userId)
      .then( data => res.json(data) )
      .catch( error => this.handleError(error, res) )
  }

  logout = (req: Request, res: Response) => {
    res.clearCookie('access_token').json({ message: 'logout successful' })
  }

  checkToken = (req: Request, res: Response) => {
    const { id, name, lastName, email, githubId, googleId } = req.body.user;
    res.json({ id, name, lastName, email, githubId, googleId });
  }

  updateUser = (req: Request, res: Response) => {
    const userId = req.body.user.id;
    const [error, updateUserDto] = UpdateUserDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    new UpdateUser(this.authRepository)
      .execute(userId, updateUserDto!)
      .then(data => res.json(data))
      .catch( error => this.handleError(error, res) )
  }

  loginGithub = (req: Request, res: Response) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${envs.GITHUB_CLIENT_ID}&redirect_uri=${envs.GITHUB_CALLBACK_URL}`;
    res.redirect(githubAuthUrl);
  }

  loginGithubCallback = (req: Request, res: Response) => {
    const code = req.query.code as string;
    if ( !code ) CustomError.badRequest('Missing Github Auth code');
    new AuthGithub(this.authRepository)
      .execute(code)
      .then( data => {
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
  }

  loginGoogle = (req: Request, res: Response) => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${envs.GOOGLE_CLIENT_ID}&redirect_uri=${envs.GOOGLE_CALLBACK_URL}&scope=openid%20email%20profile`;
    res.redirect(googleAuthUrl);
  };

  loginGoogleCallback = (req: Request, res: Response) => {
    const code = req.query.code as string;
    if ( !code ) CustomError.badRequest('Missing Google Auth code');
    new AuthGoogle(this.authRepository)
      .execute(code)
      .then( data => {
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
  }

}