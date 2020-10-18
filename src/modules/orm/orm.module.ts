import { EntityRepository, wrap } from '@mikro-orm/core'
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter/MongoHighlighter'
import { InjectRepository } from '@mikro-orm/nestjs'
import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module'
import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config/dist/config.module'
import { hash } from 'argon2'
import { Post } from 'src/entities/Post'
import { User } from 'src/entities/User'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      clientUrl: process.env.MONGO_URL,
      highlighter: new MongoHighlighter(),
      debug: true,
      type: 'mongo'
    }),
    MikroOrmModule.forFeature({ entities: [User, Post] })
  ],
  exports: [MikroOrmModule]
})
export class OrmModule implements OnModuleInit {
  constructor(
    @InjectRepository(Post) private readonly postRepo: EntityRepository<Post>,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>
  ) {}

  async onModuleInit(): Promise<void> {
    const admin_1 = await this.userRepo.count({ email: process.env.ADMIN_1_EMAIL })
    if (!admin_1) {
      const author = await this.userRepo.persistAndFlush(
        wrap(new User()).assign({ email: process.env.ADMIN_1_EMAIL, pass: await hash(process.env.ADMIN_1_PASS) })
      )

      await this.postRepo.persistAndFlush(
        wrap(new Post()).assign({
          title: 'First test post',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at.',
          author
        })
      )
    }
  }
}
