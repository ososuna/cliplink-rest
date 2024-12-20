export class User {
  constructor(
    public id: string,
    public name: string,
    public lastName: string,
    public email: string,
    public role: string[],
    public password?: string,
    public img?: string,
    public githubId?: string,
    public googleId?: string,
  ) {}

}