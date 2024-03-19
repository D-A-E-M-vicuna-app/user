import { Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { DeleteUserResponse } from './responses/delete-user.response';
import { LoginUserInput } from './dto/login-user.input';
import { LoginUserResponse } from './responses/login-user.response';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { CreateUserResponse } from './responses/create-user.response';
import { recoveryPasswordResponse } from './responses/recovery-password.response';
import { ChangePasswordInput } from './dto/change-password.input';
import { ChangePasswordResponse } from './responses/change-password.response';
import { UpdateUserResponse } from './responses/update-user.response';
dotenv.config();

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async login(loginUserInput: LoginUserInput): Promise<LoginUserResponse> {
    const user = await this.usersRepository.findOne({ where: { email: loginUserInput.email } });
    if (!user) {
      throw new Error('User not found');
    }

    //coomparar la contraseña
    const isPasswordValid = await bcrypt.compare(loginUserInput.password, user.password);
    if (!isPasswordValid) {
      //solo para crear al super@admin luego eliminar este bloque
      const newPasswordHashed = await bcrypt.hash(loginUserInput.password, 10);
      user.password = newPasswordHashed;
      await this.usersRepository.save(user);

      //fin
      throw new Error('Invalid credentials');
    }
    //generar el token
    const newAccessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.accessToken = newAccessToken;
    await this.usersRepository.save(user);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken: user.accessToken,
      role: user.role,
      institutionId: user.institutionId,
    };
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    //verificar que no exista el usuario en la base de datos
    const passwordHashed = await bcrypt.hash(createUserInput.password, 10);
    const existingUser = await this.usersRepository.findOne({ where: { email: createUserInput.email } });

    if (existingUser) {
      throw new Error('User already exists');
    }
    //se crea el nuevo usuario
    const newUser = this.usersRepository.create({
      ...createUserInput,
      password: passwordHashed,
    });

    // Genera un nuevo accessToken
    const accessToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Asigna el accessToken al usuario
    newUser.accessToken = accessToken;
    //enviar correo con nodemailer
    
    const firstName = createUserInput.firstName;
    const lastName = createUserInput.lastName;
    const email = createUserInput.email;
    const nodemailer = require('nodemailer');
    const client = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
    try{
      await client.sendMail({
        from: 'Area informatica D.A.E.M. <noreply@example.com>',
        to: email,
        subject: 'Bienvenido a la plataforma',
        html: `
        <h1>Bienvenido a la plataforma</h1>
        <p>Hola ${firstName} ${lastName},</p>
        <p>Te informamos que has sido registrado exitosamente en
        la plataforma del D.A.E.M.</p>
        <p>Tus credenciales de acceso son:</p>
        <p>Correo: ${createUserInput.email}</p>
        <p>Contraseña: ${createUserInput.password}</p>
        <p>Rol: ${createUserInput.role}</p>
        <p>Atte: Area informatica D.A.E.M.</p>
      `,

      })

    }catch(error){
      console.error('Error sending email', error);
      throw new Error('Error sending email');
    }
    return await this.usersRepository.save(newUser);


    

    
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number):Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async deleteUser(email: string): Promise<DeleteUserResponse> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return { success: false, message: 'User not found' };
      //throw new Error('User not found');
    }
    this.usersRepository.remove(user);
    return { success: true, message: 'User deleted successfully' }
  }

  async recoveryPassword(email: string): Promise<recoveryPasswordResponse> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    //generar un token de recuperacion de contraseña
    const recoveryToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.recoveryPasswordToken = recoveryToken;
    await this.usersRepository.save(user);
    this.sendEmail(email, recoveryToken);
    return { success: true, message: 'mail sent successfully' }
    //enviar el token por correo

  }

  async sendEmail(email: string, recoveryPasswordToken: string) {
    const nodemailer = require('nodemailer');
    const client = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    client.sendMail(
      {
        from: 'Area informatica D.A.E.M. <noreply@ejemplo.com>',
        to: email,
        subject: 'Recuperacion de contraseña',
        html: `
        <h1>Recuperacion de contraseña</h1>
        <p>Para recuperar su contraseña ingrese el siguiente codigo: ${recoveryPasswordToken}</p>
        <p>Atte: Area informatica D.A.E.M.</p>
      
      `

      },
      (error) => {
        if (error) {
          throw new Error('Error sending email');
        }
      }


    );

  }

  async changePassword(changePasswordInput: ChangePasswordInput): Promise<ChangePasswordResponse> {

    const user = await this.usersRepository.findOne({ where: { recoveryPasswordToken: changePasswordInput.recoveryPasswordCode } });
    if (!user) {
      throw new Error('User not found');
    }
    //comparar las contraseñas
    if (changePasswordInput.newPassword !== changePasswordInput.confirmNewPassword) {
      throw new Error('Passwords do not match');
    }
    //encriptar la nueva contraseña
    const newPasswordHashed = await bcrypt.hash(changePasswordInput.newPassword, 10);
    user.password = newPasswordHashed;
    user.recoveryPasswordToken = null;
    await this.usersRepository.save(user);
    return { success: true, message: 'Password changed successfully' }
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<UpdateUserResponse> {
    const user = await this.usersRepository.findOne({ where: { email: updateUserInput.oldEmail } });

    if (!user) {
      throw new Error('User not exists');
    }

    if (updateUserInput.newEmail !== updateUserInput.oldEmail) {
      const userExists = await this.usersRepository.findOne({ where: { email: updateUserInput.newEmail } });

      if (userExists) {
        throw new Error('User already exists');
      }

      user.email = updateUserInput.newEmail;
    }

    if (updateUserInput.firstName) { // Verifica si firstName existe antes de asignarlo
      user.firstName = updateUserInput.firstName;
    }
  
    if (updateUserInput.lastName) { // Verifica si lastName existe antes de asignarlo
      user.lastName = updateUserInput.lastName;
    }

    await this.usersRepository.save(user);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken: user.accessToken,
    };
  }


  /*
  async logout(userId: number): Promise<void> {
  const user = await this.usersRepository.findOne(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Invalida el token de acceso del usuario
  user.accessToken = null;
  await this.usersRepository.save(user);
  }
  */
}
