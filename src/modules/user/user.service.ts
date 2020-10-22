import { EntityRepository } from '@mikro-orm/mongodb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from 'src/entities/User'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: EntityRepository<User>) {}

  public async getById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ id })
    if (user) {
      return user
    }
    throw new NotFoundException()
  }
}
