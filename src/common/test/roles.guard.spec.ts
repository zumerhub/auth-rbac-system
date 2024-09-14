import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from '../guards/role.guard';
import { Role } from '../../auth/enums/role.enum';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  it('should return true if no roles are required', () => {
    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: [Role.User] } }),
      }),
      getHandler: () => {}, // Mocked handler
      getClass: () => {}, // Mocked class
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should return false if the user does not have the required role', () => {
    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: [Role.User] } }),
      }),
      getHandler: () => {}, // Mocked handler
      getClass: () => {}, // Mocked class
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin]);

    expect(rolesGuard.canActivate(context)).toBe(false);
  });

  it('should return true if the user has one of the required roles', () => {
    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: [Role.Admin] } }),
      }),
      getHandler: () => {}, // Mocked handler
      getClass: () => {}, // Mocked class
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin, Role.User]);

    expect(rolesGuard.canActivate(context)).toBe(true);
  });
});
