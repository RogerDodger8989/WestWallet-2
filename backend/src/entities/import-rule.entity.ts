import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('import_rules')
export class ImportRuleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  pattern!: string; // Text som ska matchas i beskrivning (case-insensitive)

  @Column({ nullable: true })
  categoryId?: number;

  @Column({ nullable: true })
  supplierId?: number;

  @Column({ default: true })
  active!: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
