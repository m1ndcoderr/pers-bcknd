import { Entity, Property } from '@mikro-orm/core'
import { Field, ObjectType } from '@nestjs/graphql'
import { BaseEntity } from './BaseEntity'

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @Property({ unique: true })
  title: string

  @Field()
  @Property()
  subtitle: string

  @Field()
  @Property()
  text: string

  // @Field(() => User)
  // @ManyToOne()
  // author!: User

  constructor(
    title: string,
    text: string,
    subtitle: string
    // author: User
  ) {
    super()
    this.title = title
    this.subtitle = subtitle
    this.text = text
    // this.author = author
  }
}
