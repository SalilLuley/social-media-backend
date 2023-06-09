import { Injectable } from '@nestjs/common';
import { UserLoginInfoEntity } from 'src/core';
import { IDataServices } from 'src/core/abstracts';
import { MESSAGES } from 'src/core/common/messages';
import { UserFriendsConvertor } from 'src/core/convertors/user-friends/user-friends.convertor';
import { UpdateUserFriendsReqDto } from 'src/core/dto/user-friends/user-friends-update-req-dto';
import { UserFindMyFriendsReqDto } from 'src/core/dto/user-friends/user-friends-find-req-dto';
import { UserFriendsReqDto } from 'src/core/dto/user-friends/user-friends-req-dto';
import { UserFriendsResDto } from 'src/core/dto/user-friends/user-friends-res-dto';
import { UserLoginInfoResDTO } from 'src/core/dto/user/user-res.dto';
import { UserFriendsEntity } from 'src/core/entities/user-friends/user-friends.entity';
import { IResponse } from 'src/core/interfaces/response.interface';
import { UpdateUserFriendsDeleteReqDto } from 'src/core/dto/user-friends/user-friends-delete-req-dto';

@Injectable()
export class UserFriendsUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: UserFriendsConvertor,
  ) {}

  async create(
    userId: number,
    dto: UserFriendsReqDto,
  ): Promise<IResponse<UserFriendsResDto>> {
    try {
      const userFriendsEntity: UserFriendsEntity =
        this.convertor.toModelFromDto(userId, dto);
      const entity: UserFriendsEntity =
        await this.databaseService.userFriends.create(userFriendsEntity);
      const data: UserFriendsResDto = this.convertor.toResDtoFromEntity(entity);
      return {
        data,
        message: MESSAGES.USER_FRIENDS.CREATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<IResponse<UserFriendsResDto[]>> {
    try {
      const entities: UserFriendsEntity[] =
        await this.databaseService.userFriends.getAll();

      const data: UserFriendsResDto[] =
        this.convertor.toResDtoFromEntities(entities);

      return {
        data,
        message: MESSAGES.USER_FRIENDS.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    dto: UpdateUserFriendsReqDto,
  ): Promise<IResponse<UserFriendsResDto>> {
    try {
      const { id } = dto;
      const entity: UserFriendsEntity =
        this.convertor.toUpdateModelFromDto(dto);
      await this.databaseService.userFriends.update(id, entity);
      return {
        data: null,
        message: MESSAGES.USER_FRIENDS.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(
    userId: number,
    dto: UpdateUserFriendsDeleteReqDto,
  ): Promise<IResponse<null>> {
    try {
      const { friendId } = dto;
      await this.databaseService.userFriends.deleteByProperties({
        sourceId: userId,
        targetId: friendId,
      });
      await this.databaseService.userFriends.deleteByProperties({
        sourceId: friendId,
        targetId: userId,
      });
      return {
        data: null,
        message: MESSAGES.USER_FRIENDS.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number): Promise<IResponse<UserFriendsResDto>> {
    try {
      const data: UserFriendsEntity =
        await this.databaseService.userFriends.get(id);
      return {
        data,
        message: MESSAGES.USER_FRIENDS.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findMyFriends(
    id: number,
    dto: UserFindMyFriendsReqDto,
  ): Promise<IResponse<UserLoginInfoResDTO[]>> {
    try {
      const { status } = dto;
      const entity: UserLoginInfoEntity[] =
        await this.databaseService.userFriends.caseQuery(id, status);
      const data: UserLoginInfoResDTO[] =
        this.convertor.toUserFriendsList(entity);
      return {
        data,
        message: MESSAGES.USER_FRIENDS.FIND_MY_FRIENDS.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
