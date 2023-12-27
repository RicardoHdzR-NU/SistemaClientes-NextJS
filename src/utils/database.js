import {Pool} from 'pg'

let pgPool

if(!pgPool){
    pgPool = new Pool({
        user: 'me',
        host: 'localhost',
        database: 'nuapi',
        password: 'password',
        port: 5432,
    });
}

export {pgPool};
