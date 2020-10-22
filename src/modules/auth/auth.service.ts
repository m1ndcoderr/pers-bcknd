import { EntityRepository } from '@mikro-orm/mongodb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { sign, verify } from 'jsonwebtoken'
import { User } from 'src/entities/User'
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepo: EntityRepository<User>) {}

  public async login(email: string, pass: string): Promise<{ token: string }> {
    const user = await this.userRepo.findOne({ email })
    if (user) {
      const isVerified = await argon2.verify(user.pass, pass)
      if (isVerified) {
        return { token: await this.signToken(user.id) }
      }
    }
    throw new NotFoundException('Invalid credentials.')
  }

  public async signToken(id: string): Promise<string> {
    return sign({ id }, process.env.JWT_SECRET, { expiresIn: '10m' })
  }

  public async verifyToken(token: string): Promise<{ id: string }> {
    return new Promise<{ id: string }>(resolve => {
      try {
        const { id } = verify(token, process.env.JWT_SECRET) as { id: string }
        resolve({ id })
      } catch (e) {
        throw new UnauthorizedException()
      }
    })
  }
}
