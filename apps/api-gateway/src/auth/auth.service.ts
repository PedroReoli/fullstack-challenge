import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';

// Service que faz proxy das requisições de auth para o auth-service
@Injectable()
export class AuthService {
  private readonly authServiceClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    // Configura cliente HTTP para o auth-service
    const authServiceUrl = this.configService.get('AUTH_SERVICE_URL') || 'http://localhost:3002';
    this.authServiceClient = axios.create({
      baseURL: authServiceUrl,
      timeout: 5000,
    });
  }

  // Faz proxy da requisição de registro para o auth-service
  async register(registerDto: RegisterDto) {
    try {
      const response = await this.authServiceClient.post('/auth/register', registerDto);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao registrar usuário',
        error.response?.status || 500
      );
    }
  }

  // Faz proxy da requisição de login para o auth-service
  async login(loginDto: LoginDto) {
    try {
      const response = await this.authServiceClient.post('/auth/login', loginDto);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao fazer login',
        error.response?.status || 500
      );
    }
  }

  // Faz proxy da requisição de refresh para o auth-service
  async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      const response = await this.authServiceClient.post('/auth/refresh', refreshTokenDto);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao renovar token',
        error.response?.status || 500
      );
    }
  }

  // Faz proxy da requisição de logout para o auth-service
  async logout(refreshTokenDto: RefreshTokenDto) {
    try {
      const response = await this.authServiceClient.post('/auth/logout', refreshTokenDto);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao fazer logout',
        error.response?.status || 500
      );
    }
  }
}


