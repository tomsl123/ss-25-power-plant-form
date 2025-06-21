import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class PersonsService {
  constructor(private readonly db: DbService) {}

  map(row: any) {
    return {
      id: row.id,
      organizationType: row.organization_type,
      legalName: row.legal_name,
      telephone: row.telephone,
      email: row.email,
      address: row.address,
    };
  }

  async findAll() {
    const result = await this.db.query('SELECT * FROM persons');
    return result.rows.map(this.map);
  }

  async findById(id: number) {
    const result = await this.db.query('SELECT * FROM persons WHERE id = $1', [id]);
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async create(data: any) {
    const { organizationType, legalName, telephone, email, address } = data;
    const result = await this.db.query(
      `INSERT INTO persons (organization_type, legal_name, telephone, email, address)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [organizationType, legalName, telephone, email, address],
    );
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async update(id: number, data: any) {
    const { organizationType, legalName, telephone, email, address } = data;
    const result = await this.db.query(
      `UPDATE persons SET organization_type=$1, legal_name=$2, telephone=$3, email=$4, address=$5
       WHERE id=$6 RETURNING *`,
      [organizationType, legalName, telephone, email, address, id],
    );
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async delete(id: number) {
    await this.db.query('DELETE FROM persons WHERE id = $1', [id]);
    return { deleted: true };
  }
}
