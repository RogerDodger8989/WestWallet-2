import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletsService } from './wallets.service';

class CreateWalletDto {
  name!: string;
  currency?: string;
}

class CreateTxDto {
  amount!: number;
  type!: 'credit' | 'debit';
  description?: string;
}

@UseGuards(AuthGuard('jwt'))
@Controller('wallets')
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateWalletDto) {
    const user = req.user;
    // payload.sub is user id
    const owner = { id: user.sub } as any;
    const wallet = await this.walletsService.createWallet(owner, dto.name, dto.currency);
    return wallet;
  }

  @Get()
  async list(@Request() req: any) {
    const user = req.user;
    return this.walletsService.listWallets(user.sub);
  }

  @Get(':id')
  async get(@Request() req: any, @Param('id') id: string) {
    const user = req.user;
    const walletId = Number(id);
    await this.walletsService.ensureOwner(walletId, user.sub);
    const w = await this.walletsService.getWallet(walletId);
    const balance = await this.walletsService.getBalance(walletId);
    return { ...w, balance };
  }

  @Post(':id/transactions')
  async createTx(@Request() req: any, @Param('id') id: string, @Body() dto: CreateTxDto) {
    const user = req.user;
    const walletId = Number(id);
    await this.walletsService.ensureOwner(walletId, user.sub);
    return this.walletsService.createTransaction(walletId, dto.amount, dto.type, dto.description);
  }

  @Get(':id/transactions')
  async listTx(@Request() req: any, @Param('id') id: string) {
    const user = req.user;
    const walletId = Number(id);
    await this.walletsService.ensureOwner(walletId, user.sub);
    return this.walletsService.listTransactions(walletId);
  }
}