import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { Register } from '../../../application/usecases/register/register.usecase';
import { UserAPI } from './user.contract';
import { ZodValidationPipe } from '../../middlewares/pipes/zod-validation.pipe';
import { RegisterExceptionsMapper } from './exceptions-mapper/register-exceptions-mapper';

@Controller()
export class UserController {
  constructor(
    private readonly register: Register,
    private readonly exceptionsMapper: RegisterExceptionsMapper,
  ) {}

  @UsePipes(new ZodValidationPipe(UserAPI.Register.schema))
  @Post('/users/register')
  async handleRegister(@Body() body: UserAPI.Register.Request) {
    try {
      return await this.register.execute({ ...body });
    } catch (error) {
      throw this.exceptionsMapper.map(error);
    }
  }
}
