import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { User } from '../common/models/user.model';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto: UserDto = {
      pseudo: 'Asma',
      role: 'productOwner',
    };

    const mockUser: User = {
      id: 1,
      pseudo: 'Asma',
      role: 'productOwner', // Type correct maintenant
    };
    jest.spyOn(service, 'createUser').mockReturnValue(mockUser);

    const result = controller.createUser(dto);

    expect(result).toEqual(mockUser);
    expect(service.createUser).toHaveBeenCalledWith(dto);
  });

  it('should return all users', () => {
    const mockUsers: User[] = [
      { id: 1, pseudo: 'Test1', role: 'employee' },
      { id: 2, pseudo: 'Test2', role: 'productOwner' },
    ];
    jest.spyOn(service, 'findAll').mockReturnValue(mockUsers);

    const result = controller.findAll();

    expect(result).toEqual(mockUsers);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a user by id', () => {
    const mockUser: User = {
      id: 1,
      pseudo: 'Test',
      role: 'employee',
    };
    jest.spyOn(service, 'findById').mockReturnValue(mockUser);

    const result = controller.findById(1);

    expect(result).toEqual(mockUser);
    expect(service.findById).toHaveBeenCalledWith(1);
  });
});
