'use strict';

import { Inject } from '@nestjs/common';
import { Pool } from "pg";
import { UserCreateDTO } from './dto/userDTO';

export class UserService {
    @Inject('DATABASE_POOL')
    private readonly pool: Pool;

    public async getUsersList() {
        return this.pool.query('SELECT * FROM users').then(response => response.rows);
    }

    public async createUser(userDTO: UserCreateDTO) {
        return this.pool.query(
            "INSERT INTO users (login, password, email, name) VALUES($1, $2, $3, $4)",
            [ userDTO.login, userDTO.password, userDTO.email, userDTO.name ]
        ).then(({ rows }) => rows[0]);
    }
}
