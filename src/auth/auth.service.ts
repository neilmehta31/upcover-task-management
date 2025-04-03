import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      private jwtService: JwtService,
    ) {}
  
    async signup(signupDto: SignupDto): Promise<{ token: string }> {
      const { name, email, password } = signupDto;
  
      // Check if user exists
      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = new this.userModel({
        name,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      // Generate JWT token
      const token = this.jwtService.sign({ id: newUser._id, email: newUser.email });
  
      return { token };
    }
  
    async login(loginDto: LoginDto): Promise<{ token: string }> {
      const { email, password } = loginDto;
  
      // Find the user
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Generate JWT token
      const token = this.jwtService.sign({ id: user._id, email: user.email });
  
      return { token };
    }

    async validateUser(userId: string): Promise<UserDocument> {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    }
  }
