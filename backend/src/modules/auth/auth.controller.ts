// filepath: /workspaces/WestWallet/west-wallet/backend/src/modules/auth/auth.controller.ts
import { Controller, Post, Body, BadRequestException, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';


class RegisterDto {
  username!: string;
  password!: string;
}

class LoginDto {
  username!: string;
  password!: string;
}

class ResetPasswordDto {
  username!: string;
  newPassword!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const user = await this.authService.register(dto.username, dto.password);
      return user;
    } catch (e: any) {
      throw new BadRequestException(e.message || 'Registration failed');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      const result = await this.authService.resetPassword(dto.username, dto.newPassword);
      return { success: true, user: result };
    } catch (e: any) {
      throw new BadRequestException(e.message || 'Password reset failed');
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const validated = await this.authService.validateUser(dto.username, dto.password);
    if (!validated) throw new BadRequestException('Invalid credentials');
    return this.authService.login({ id: (validated as any).id, username: (validated as any).username });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('refresh')
  async refresh(@Req() req: any) {
    // req.user contains payload from JWT strategy
    const { sub, username } = req.user;
    return this.authService.refresh({ id: sub, username });
  }
}
