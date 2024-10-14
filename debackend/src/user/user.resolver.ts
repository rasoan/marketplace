'use strict';

import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { UserCreateDTO, UserDTO } from "./dto/userDTO";
import { UserService } from "./user.service";

@Resolver(() => UserCreateDTO)
export class UserResolver {
    @Inject(UserService)
    private readonly userService: UserService;

    @Mutation(() => Boolean)
    async createUser(@Args('input') userDTO: UserCreateDTO) {
        await this.userService.createUser(userDTO);

        return true;
    }

    @Query(() => [UserDTO])
    getUsersList() {
        return this.userService.getUsersList();
    }
}

