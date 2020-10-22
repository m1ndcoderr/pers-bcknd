import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import { UserService } from './user.service'

@Module({
  imports: [OrmModule],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
