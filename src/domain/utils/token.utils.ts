import { Messages } from '@/config';
import { CustomError, type UserToken } from '@/domain';

type SignToken = (payload: Object, type: 'access' | 'refresh') => Promise<string | null>;

export const generateAuthTokens = async (
  user: {
    id: string;
    name: string;
    lastName: string;
    email: string;
  },
  signToken: SignToken
): Promise<UserToken> => {
  const payload = {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email
  };

  const [accessToken, refreshToken] = await Promise.all([
    signToken(payload, 'access'),
    signToken(payload, 'refresh')
  ]);

  if (!accessToken || !refreshToken) {
    throw CustomError.internalServer(Messages.TOKEN_GENERATION_ERROR);
  }

  return {
    accessToken,
    refreshToken,
    user: payload
  };
}; 