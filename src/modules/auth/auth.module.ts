import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config/dist/config.module'
import { OrmModule } from '../orm/orm.module'
import { UserModule } from '../user/user.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

@Module({
  imports: [ConfigModule.forRoot(), OrmModule, UserModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService]
})
export class AuthModule {}
