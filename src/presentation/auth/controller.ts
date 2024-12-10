import { Request, Response } from 'express';
import { AuthRepository, CustomError, GetUser, GetUsers, LoginUser, LoginUserDto, RegisterUser, RegisterUserDto } from '../../domain';

interface LoggedUser {
  id: string;
  name: string;
  email: string;
}

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
    const { id, name, lastName, email } = req.body.user;
    res.json({ id, name, lastName, email });
  }

}