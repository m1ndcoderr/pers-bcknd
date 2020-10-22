import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthModule } from './modules/auth/auth.module'
import { OrmModule } from './modules/orm/orm.module'
import { PostModule } from './modules/post/post.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ req })
    }),
    OrmModule,
    AuthModule,
    PostModule,
    UserModule
  ]
})
export class AppModule {}
