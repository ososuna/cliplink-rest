import { User } from './user.entity';

export class ResetPasswordToken {
  constructor(
    public id: string,
    public token: string,
    public expiresAt: Date,
    public user: User
  ) {}
}