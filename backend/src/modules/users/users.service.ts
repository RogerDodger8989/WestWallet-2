// filepath: /workspaces/WestWallet/west-wallet/backend/src/modules/users/users.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {}

  async create(username: string, password: string) {
    const existing = await this.repo.findOne({ where: { username } });
    if (existing) throw new BadRequestException('User exists');
    const hashed = bcrypt.hashSync(password, 8);
    const user = this.repo.create({ username, password: hashed });
    await this.repo.save(user);
    const { password: _p, ...rest } = user as any;
    return rest;
  }

  async findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }


  async validatePassword(user: UserEntity, password: string) {
    return bcrypt.compareSync(password, user.password);
  }

  async resetPassword(username: string, newPassword: string) {
    const user = await this.findByUsername(username);
    if (!user) throw new BadRequestException('User not found');
    user.password = bcrypt.hashSync(newPassword, 8);
    await this.repo.save(user);
    const { password: _p, ...rest } = user as any;
    return rest;
  }
}
