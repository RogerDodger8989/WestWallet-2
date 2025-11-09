// filepath: /workspaces/WestWallet/west-wallet/backend/src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && (await this.usersService.validatePassword(user, password))) {
      const { password: _p, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: { id: number; username: string }) {
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload), user };
  }


  async register(username: string, password: string) {
    return this.usersService.create(username, password);
  }

  async resetPassword(username: string, newPassword: string) {
    return this.usersService.resetPassword(username, newPassword);
  }

  async refresh(user: { id: number; username: string }) {
    // Issue a new access token (stateless simple refresh)
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
