import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletEntity } from '../../entities/wallet.entity';
import { TransactionEntity } from '../../entities/transaction.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity) private walletsRepo: Repository<WalletEntity>,
    @InjectRepository(TransactionEntity) private txRepo: Repository<TransactionEntity>,
  ) {}

  async createWallet(owner: UserEntity, name: string, currency = 'USD') {
    const w = this.walletsRepo.create({ name, currency, owner });
    return this.walletsRepo.save(w);
  }

  async listWallets(ownerId: number) {
    return this.walletsRepo.find({ where: { owner: { id: ownerId } } });
  }

  async getWallet(walletId: number) {
    const w = await this.walletsRepo.findOne({ where: { id: walletId }, relations: ['owner'] });
    if (!w) throw new NotFoundException('Wallet not found');
    return w;
  }

  async createTransaction(walletId: number, amount: number, type: 'credit' | 'debit', description?: string) {
    const wallet = await this.walletsRepo.findOne({ where: { id: walletId }});
    if (!wallet) throw new NotFoundException('Wallet not found');
    const tx = this.txRepo.create({ wallet, amount, type, currency: wallet.currency, description });
    return this.txRepo.save(tx);
  }

  async listTransactions(walletId: number) {
    const wallet = await this.getWallet(walletId);
    return this.txRepo.find({ where: { wallet: { id: wallet.id } }, order: { createdAt: 'DESC' } });
  }

  async ensureOwner(walletId: number, userId: number) {
    const w = await this.getWallet(walletId);
    if ((w.owner as any).id !== userId) throw new ForbiddenException('Not wallet owner');
    return w;
  }

  async getBalance(walletId: number) {
    const rows = await this.txRepo.find({ where: { wallet: { id: walletId } }});
    return rows.reduce((sum, tx) => sum + (tx.type === 'credit' ? tx.amount : -tx.amount), 0);
  }
}