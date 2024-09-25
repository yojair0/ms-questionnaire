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
      throw new UnauthorizedException('Token no proporcionado');
    }

    // Obtiene el valor de MS_IAM de las variables de entorno
    const msIamUrl = this.configService.get<string>('MS_IAM');

    // Si msIamUrl es undefined, lanza un error
    if (!msIamUrl) {
      console.error('La variable de entorno MS_IAM no está definida.');
      throw new Error('MS_IAM no está definida.');
    }

    const authUrl = `${msIamUrl}`;

    // Imprimimos la URL y el token para depuración
    console.log('Verificando token con URL:', authUrl);
    console.log('Token:', token);

    try {
      const response = await lastValueFrom(
        this.httpService.get(authUrl, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      console.log('Respuesta de verificación:', response.data); // Loguear la respuesta para depuración

      // Verificamos si la respuesta indica que el token es válido
      if (response.data && response.data.isValid) {
        return true;
      } else {
        throw new UnauthorizedException('Token inválido o inactivo');
      }
    } catch (error) {
      console.error('Error verificando el token:', error instanceof HttpException ? error.getResponse() : error);
      throw new UnauthorizedException('Fallo en la verificación del token');
    }
  }
}
