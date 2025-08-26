import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(username: string, password: string) {
    const existing = await this.userRepository.findOneBy({ username });
    if (existing) throw new ConflictException('Usuario ya existe');
    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hash });
    await this.userRepository.save(user);
    return { message: 'Usuario registrado' };
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');
    // Aquí podrías generar un JWT, pero para simplicidad solo retornamos ok
    return { message: 'Login correcto', user: { id: user.id, username: user.username } };
  }
}
