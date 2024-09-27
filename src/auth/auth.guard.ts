import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Authorization token not provided');
    }

    // Get MS_IAM environment variable
    const msIamUrl = this.configService.get<string>('MS_IAM');

    if (!msIamUrl) {
      // Return a more descriptive error for undefined MS_IAM
      throw new Error('MS_IAM environment variable is not set. Please configure the service URL.');
    }

    const authUrl = `${msIamUrl}`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(authUrl, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      // If response doesn't contain a valid token flag
      if (!(response.data && response.data.isValid)) {
        throw new UnauthorizedException('Token is either invalid or has expired');
      }

      return true;
    } catch (error) {
      // Differentiate between internal errors and verification issues
      if (error instanceof HttpException) {
        throw new UnauthorizedException('Token verification failed with the remote service');
      } else {
        throw new UnauthorizedException('An unexpected error occurred during token verification');
      }
    }
  }
}
