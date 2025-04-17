import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/user.service';
import { RegisterDto } from './dtos/register.dto';
import { User } from 'src/users/entities/user.entity';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private readonly cacheService: CacheService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    const isValid = user && (await bcrypt.compare(password, user.passwordHash));
    return isValid ? user : null;
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new HttpException(
        { message: ['Email already exists'] },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({
      ...dto,
      passwordHash: hashedPassword,
    });
  }

  async generateToken(user: User) {
    const accessToken = this.createAccessToken(user);

    const refreshTokenId = randomUUID();
    const refreshToken = this.createRefreshToken(user.id, refreshTokenId);
    await this.storeRefreshToken(user.id, refreshTokenId, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private createAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRATION'),
    });
  }

  private createRefreshToken(userId: string | number, tokenId: string): string {
    const payload = {
      sub: userId,
      tokenId,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRATION'),
    });
  }

  private async storeRefreshToken(
    userId: string | number,
    tokenId: string,
    token: string,
  ) {
    const key = this.getRefreshTokenKey(userId, tokenId);
    await this.cacheService.set(key, token);
  }

  private getRefreshTokenKey(userId: string | number, tokenId: string): string {
    return `refresh:${userId}:${tokenId}`;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const key = this.getRefreshTokenKey(payload.sub, payload.tokenId);
      const stored = await this.cacheService.get<string>(key);

      if (!stored || stored !== refreshToken) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      const newAccessToken = this.createAccessToken(user);

      return {
        access_token: newAccessToken,
      };
    } catch {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const key = this.getRefreshTokenKey(payload.sub, payload.tokenId);
      const stored = await this.cacheService.get<string>(key);

      if (!stored || stored !== refreshToken) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.cacheService.delete(key);
    } catch {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  async getUserById(userId: string): Promise<User> {
    return await this.usersService.findById(userId);
  }
}
