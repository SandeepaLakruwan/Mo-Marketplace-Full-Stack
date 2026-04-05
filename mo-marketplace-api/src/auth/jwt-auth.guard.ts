import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Reusable guard — add to any controller method to require JWT
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
