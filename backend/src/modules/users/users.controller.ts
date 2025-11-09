// filepath: /workspaces/WestWallet/west-wallet/backend/src/modules/users/users.controller.ts
import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req: any) {
    const payload = req.user;
    const id = payload.sub || payload.userId;
    const user = await this.usersService.findById(id);
    if (!user) return { error: 'Not found' };
    const { password, ...rest } = user as any;
    return rest;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.usersService.findById(Number(id));
    if (!user) return { error: 'Not found' };
    const { password, ...rest } = user as any;
    return rest;
  }
}
