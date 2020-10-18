import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import { PostResolver } from './post.resolver'

@Module({
  imports: [OrmModule],
  providers: [PostResolver]
})
export class PostModule {}
