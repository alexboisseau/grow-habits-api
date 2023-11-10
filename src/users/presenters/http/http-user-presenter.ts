import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UserAPI } from '../../contract';
import { Register } from '../../usecases/register';
import { HttpUserExceptionsMapper } from './http-exceptions-mapper';

@Controller()
export class HttpUserPresenter {
  constructor(
    private readonly register: Register,
    private readonly exceptionsMapper: HttpUserExceptionsMapper,
  ) {}

  @Post('/users/register')
  async handleRegister(@Body() body: UserAPI.Register.Request) {
    try {
      return await this.register.execute({ ...body });
    } catch (error) {
      const { message, statusCode } = this.exceptionsMapper.map(error);
      throw new HttpException(message, statusCode);
    }
  }
}
