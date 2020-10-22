import { UseGuards } from '@nestjs/common'
import { Args, Context, Field, ObjectType, Query, Resolver } from '@nestjs/graphql'
import { User } from 'src/entities/User'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { JwtGuard } from './jwt.guard'

@ObjectType()
class AccessToken {
  @Field(() => String)
  token: string
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Query(() => AccessToken)
  async login(@Args('email') email: string, @Args('pass') pass: string): Promise<{ token: string }> {
    return this.authService.login(email, pass)
  }

  @UseGuards(JwtGuard)
  @Query(() => User)
  async me(@Context('id') id: string): Promise<User> {
    return this.userService.getById(id)
  }
}
