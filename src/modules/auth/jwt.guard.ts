import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthService } from './auth.service'

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name)

  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context).getContext()

      const { id } = await this.authService.verifyToken(ctx.req.headers.authorization.replace('Bearer ', ''))
      ctx.id = id

      return true
    } catch (e) {
      this.logger.error(e)
    }

    return false
  }
}
