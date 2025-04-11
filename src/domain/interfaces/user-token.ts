export interface UserToken {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    lastName: string;
    email: string;
  };
}
