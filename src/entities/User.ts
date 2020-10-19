import { Cascade, Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { Field, ObjectType } from '@nestjs/graphql'
import { BaseEntity } from './BaseEntity'
import { Post } from './Post'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Property({ unique: true })
  email: string

  @Property()
  pass: string

  @Field(() => [Post])
  @OneToMany(() => Post, p => p.author, { cascade: [Cascade.ALL] })
  posts = new Collection<Post>(this)

  constructor(email: string, pass: string) {
    super()
    this.email = email
    this.pass = pass
  }
}
