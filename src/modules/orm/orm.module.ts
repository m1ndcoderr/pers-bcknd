import { EntityRepository } from '@mikro-orm/core'
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
      const user = new User(process.env.ADMIN_1_EMAIL, await hash(process.env.ADMIN_1_PASS))
      const post = new Post('First test post', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at.', user)

      user.posts.add(post)

      this.userRepo.persist(user)
      this.postRepo.persist(post)

      await this.userRepo.flush()
      await this.postRepo.flush()
    }
  }
}
