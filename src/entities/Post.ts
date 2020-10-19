import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { Field, ObjectType } from '@nestjs/graphql'
import { BaseEntity } from './BaseEntity'
import { User } from './User'

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @Property({ unique: true })
  title: string

  @Field()
  @Property()
  text: string

  @Field(() => User)
  @ManyToOne()
  author!: User

  constructor(title: string, text: string) {
    super()
    this.title = title
    this.text = text
  }
}
