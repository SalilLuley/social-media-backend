import { Observable } from 'rxjs';
import {
  Injectable,
  ExecutionContext,
  NestInterceptor,
  BadRequestException,
  CallHandler,
} from '@nestjs/common';
import { MESSAGES } from 'src/core/common/messages';
import { IDataServices } from 'src/core/abstracts';
import { UserCommunityEntity } from 'src/core/entities/user-community/user-community.entity';

@Injectable()
export class CommunityAddUserInterceptor implements NestInterceptor {
  constructor(private databaseService: IDataServices) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userLoginInfoId = request.body.userLoginInfoId;
    const communityId = request.body.communityId;

    const entities: UserCommunityEntity =
      await this.databaseService.userCommunity.get({
        userLoginInfoId,
        communityId,
      });
    if (entities !== null) {
      throw new BadRequestException(MESSAGES.COMMUNITY.USER_ALREADY_EXISTS);
    }
    return next.handle();
  }
}
