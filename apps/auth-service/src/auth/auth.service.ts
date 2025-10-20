import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ConfigService } from '@nestjs/config';

// Service de autenticação - aqui fica toda a lógica de negócio:
// Cadastro, login, geração de tokens, validação, etc.
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // Criptografa a senha com bcrypt
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // Compara senha normal com a criptografada
  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Gera access token (válido por 15 minutos)
  generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION') || '15m',
    });
  }

  // Gera refresh token (válido por 7 dias)
  generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
    });
  }

  // Salva refresh token no banco de dados
  async saveRefreshToken(userId: number, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // expira em 7 dias

    await this.refreshTokensRepository.save({
      userId,
      token,
      expiresAt,
      revoked: false,
    });
  }

  // Registra um novo usuário no sistema
  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    // Verifica se já existe usuário com esse email ou username
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('Email ou username já cadastrado');
    }

    // Criptografa a senha
    const hashedPassword = await this.hashPassword(password);

    // Cria o usuário
    const user = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    // Gera os tokens de acesso
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Salva o refresh token no banco
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  // Faz login do usuário
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Busca usuário pelo email
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica se a senha está correta
    const isPasswordValid = await this.comparePasswords(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera os tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Salva o refresh token
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  // Renova o access token usando o refresh token
  async refreshAccessToken(refreshToken: string) {
    try {
      // Verifica se o refresh token é válido
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Busca o token no banco e verifica se não foi revogado
      const storedToken = await this.refreshTokensRepository.findOne({
        where: { token: refreshToken, revoked: false },
        relations: ['user'],
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Verifica se o token expirou
      if (new Date() > storedToken.expiresAt) {
        throw new UnauthorizedException('Refresh token expirado');
      }

      // Gera um novo access token
      const accessToken = this.generateAccessToken(storedToken.user);

      return {
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  // Valida se o usuário existe (usado pela estratégia JWT)
  async validateUser(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }

  // Revoga o refresh token (faz logout)
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const token = await this.refreshTokensRepository.findOne({
      where: { token: refreshToken },
    });

    if (token) {
      token.revoked = true;
      await this.refreshTokensRepository.save(token);
    }
  }
}

