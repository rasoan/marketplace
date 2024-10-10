'use strict';

export interface IUserCreate {
    /** */
    name?: string;
    /** */
    email?: string;
    // todo: так required или нет?
    /** */
    login?: string;
    /** */
    password?: string;
}

export interface IUserDTO {
    /** */
    /** */
    createdat: string;
    /** */
    name?: string;
    /** */
    email?: string;
    // todo: так required или нет?
    /** */
    login?: string;
    /** */
    password?: string;
}
