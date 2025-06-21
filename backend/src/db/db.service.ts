import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DbService {
  private pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'admin',
    password: 'M0a0uBfXf471',
  });

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
}
