import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';

interface User {
  username: string;
  password: string;
}

const users: User[] = [];

@Injectable()
export class AuthService {
  async register(username: string, password: string) {
    const exists = users.find(u => u.username === username);
    if (exists) throw new ConflictException('Usuario ya existe');
    users.push({ username, password });
    return { message: 'Usuario registrado' };
  }

  async login(username: string, password: string) {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    return { message: 'Login correcto', user: { username: user.username } };
  }
}
