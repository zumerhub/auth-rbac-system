import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth-guards/jwt-auth.guard';
import { UserService } from './users.services';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/auth/enums/role.enum';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}


  @Get('all')
  @Roles(Role.Admin)
  async getAllUsers() {
    const users = await this.userService.findAll();
    console.log('getAllUsers:', users);
    return users;
  }


  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto, 
  ): Promise<User> {
    console.log('updateUserDto:', updateUserDto);  // Debugging purposes
    return this.userService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteById(id);
  }
}
