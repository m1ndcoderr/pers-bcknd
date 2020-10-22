import { EntityRepository } from '@mikro-orm/mongodb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { BadRequestException, NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Context, Field, Int, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Post } from 'src/entities/Post'
import { User } from 'src/entities/User'
import { JwtGuard } from '../auth/jwt.guard'

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[]
  @Field(() => Int)
  offset: number
  @Field(() => Int)
  limit: number
  @Field(() => Int)
  count: number
}

@Resolver(() => Post)
export class PostResolver {
  constructor(
    @InjectRepository(Post) private readonly postRepo: EntityRepository<Post>,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>
  ) {}

  @Query(() => Post)
  async post(@Args('id', { type: () => String }) id: string): Promise<Post> {
    return this.postRepo.findOne({ id })
  }

  @Query(() => PaginatedPosts)
  async posts(@Args('offset') offset: number, @Args('limit') limit: number): Promise<PaginatedPosts> {
    const [posts, count] = await this.postRepo.findAndCount({}, { limit, offset })
    if (!count) throw new NotFoundException()
    return { posts, limit, offset, count }
  }

  @ResolveField('author', () => User)
  async author(@Parent() post: Post): Promise<User> {
    const { author } = post
    return this.userRepo.findOne({ id: author.id })
  }

  @UseGuards(JwtGuard)
  @Mutation(() => Post)
  async create(@Context('id') id: string, @Args('title') title: string, @Args('text') text: string): Promise<Post> {
    let post = await this.postRepo.findOne({ title })
    if (post) {
      throw new BadRequestException('Post already exists')
    }

    const author = await this.userRepo.findOne(id)
    await this.postRepo.persistAndFlush(new Post(title, text, author))
    post = await this.postRepo.findOne({ title })

    return post
  }
}
