import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User' })
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'typeUser' })
  typeUser: number;

  @Column({ name: 'cpf_cnpj', nullable: false })
  cpf_cnpj: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'createdAt', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updatedAt', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
