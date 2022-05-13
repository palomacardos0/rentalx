/* eslint-disable prettier/prettier */
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../erros/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepositories';

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

interface IRequest {
  email: string;
  password: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    // verifica se o usuário existe
    if (!user) {
      throw new AppError('Email or password incorrect');
    }

    const passwordMatch = await compare(password, user.password);

    // verifica se a senha está correta
    if (!passwordMatch) {
      throw new AppError('Email or password incorrect');
    }

    // gera o webtoken
    const token = sign({}, '41b17b06bb85945702c7c1f96611f424', {
      subject: user.id,
      expiresIn: '1d',
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      }
    }

    return tokenReturn
  }
}

export { AuthenticateUserUseCase };
