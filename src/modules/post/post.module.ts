import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { OrmModule } from '../orm/orm.module'
import { PostResolver } from './post.resolver'

@Module({
  imports: [OrmModule, AuthModule],
  providers: [PostResolver]
})
export class PostModule {}
