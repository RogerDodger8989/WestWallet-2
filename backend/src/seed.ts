import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { SupplierEntity } from './entities/supplier.entity';
import { UserEntity } from './entities/user.entity';
import { hash } from 'bcryptjs';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const userRepo = dataSource.getRepository(UserEntity);
  const categoryRepo = dataSource.getRepository(CategoryEntity);
  const supplierRepo = dataSource.getRepository(SupplierEntity);

  // Create demo user if missing
  const demoUsername = 'demo';
  let user = await userRepo.findOne({ where: { username: demoUsername } });
  if (!user) {
    user = userRepo.create({ username: demoUsername, password: await hash('demo123', 10) });
    await userRepo.save(user);
    console.log('Created demo user (demo/demo123)');
  } else {
    console.log('Demo user already exists');
  }

  // Ensure a broader baseline of categories (common examples from UI screenshots)
  const categoryNames = [
    'Mat',
    'Livsmedel',
    'Transport',
    'Underhållning',
    'Bensin',
    'Lön',
    'Swish'
  ];
  const categories: CategoryEntity[] = [];
  for (const name of categoryNames) {
    let c = await categoryRepo.findOne({ where: { name } });
    if (!c) {
      c = categoryRepo.create({ name });
      await categoryRepo.save(c);
      console.log('Created category', name);
    }
    categories.push(c);
  }

  // Ensure suppliers bound to categories
  const supplierDefs = [
    { name: 'ICA Supermarket', category: 'Livsmedel' },
    { name: 'Klarna', category: 'Underhållning' },
    { name: 'SL', category: 'Transport' },
    { name: 'OKQ8', category: 'Bensin' },
    { name: 'Swish Diverse', category: 'Swish' },
    { name: 'Arbetsgivare AB', category: 'Lön' }
  ];
  for (const def of supplierDefs) {
    const cat = categories.find(c => c.name === def.category);
    if (!cat) continue;
    let sup = await supplierRepo.findOne({ where: { name: def.name } });
    if (!sup) {
      sup = supplierRepo.create({ name: def.name, categoryId: cat.id });
      await supplierRepo.save(sup);
      console.log('Created supplier', def.name);
    }
  }

  console.log('Seeding complete.');
  await app.close();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
