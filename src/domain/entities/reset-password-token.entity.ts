import { User } from '@/domain';

export class ResetPasswordToken {
  constructor(
    public id: string,
    public token: string,
    public expiresAt: Date,
    public user: User
  ) {}
}