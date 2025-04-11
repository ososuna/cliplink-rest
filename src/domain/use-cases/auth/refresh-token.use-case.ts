import { User, type UserToken } from '@/domain';
import { generateAuthTokens } from '@/domain/utils/token.utils';
import { JwtAdapter } from '@/config';

interface RefreshTokenUseCase {
  execute(user: User): Promise<UserToken>;
}

type SignToken = (payload: object, type: 'access' | 'refresh') => Promise<string | null>;

export class RefreshToken implements RefreshTokenUseCase {
  constructor(
    private readonly signToken: SignToken = JwtAdapter.generateToken,
  ) {}

  async execute(user: User): Promise<UserToken> {
    return generateAuthTokens(user, this.signToken);
  }
}
