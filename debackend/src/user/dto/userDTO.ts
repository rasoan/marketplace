'use strict';

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IUserCreate, IUserDTO } from "../types/user.service";

@InputType()
export class UserCreateDTO implements IUserCreate {
    /** */
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;
    /** */
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    email?: string;
    // todo: так required или нет?
    /** */
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    login?: string;
    /** */
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    password?: string;
}

@ObjectType()
export class UserDTO implements IUserDTO {
    /** */
    @Field()
    @IsNumber()
    id: number;
    /** */
    @Field()
    @IsString()
    createdat: string;
    /** */
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;
    /** */
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    email?: string;
    // todo: так required или нет?
    /** */
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    login?: string;
    /** */
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    password?: string;
}
