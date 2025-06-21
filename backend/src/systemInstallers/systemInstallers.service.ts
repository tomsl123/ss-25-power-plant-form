import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class SystemInstallersService {
  constructor(private readonly db: DbService) {}

  map(row: any) {
    return {
      id: row.id,
      company: row.company,
      registrationNumber: row.registration_number,
    };
  }

  async findAll() {
    const result = await this.db.query('SELECT * FROM system_installers');
    return result.rows.map(this.map);
  }

  async findById(id: number) {
    const result = await this.db.query('SELECT * FROM system_installers WHERE id = $1', [id]);
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async create(data: any) {
    const { company, registrationNumber } = data;
    const result = await this.db.query(
      `INSERT INTO system_installers (company, registration_number)
       VALUES ($1, $2) RETURNING *`,
      [company, registrationNumber],
    );
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async update(id: number, data: any) {
    const { company, registrationNumber } = data;
    const result = await this.db.query(
      `UPDATE system_installers SET company=$1, registration_number=$2
       WHERE id=$3 RETURNING *`,
      [company, registrationNumber, id],
    );
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async delete(id: number) {
    await this.db.query('DELETE FROM system_installers WHERE id = $1', [id]);
    return { deleted: true };
  }
}
