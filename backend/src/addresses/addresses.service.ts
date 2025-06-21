import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class AddressesService {
  constructor(private readonly db: DbService) {}

  map(row: any) {
    return {
      id: row.id,
      street: row.street,
      houseNumber: row.house_number,
      postCode: row.post_code,
      city: row.city,
    };
  }

  async findAll() {
    const result = await this.db.query('SELECT * FROM addresses');
    return result.rows.map(this.map);
  }

  async findById(id: number) {
    const result = await this.db.query('SELECT * FROM addresses WHERE id = $1', [id]);
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async create(data: any) {
    const { street, houseNumber, postCode, city } = data;
    const result = await this.db.query(
      `INSERT INTO addresses (street, house_number, post_code, city)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [street, houseNumber, postCode, city],
    );
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async update(id: number, data: any) {
    const { street, houseNumber, postCode, city } = data;
    const result = await this.db.query(
      `UPDATE addresses SET street=$1, house_number=$2, post_code=$3, city=$4
       WHERE id=$5 RETURNING *`,
      [street, houseNumber, postCode, city, id],
    );
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async delete(id: number) {
    await this.db.query('DELETE FROM addresses WHERE id = $1', [id]);
    return { deleted: true };
  }
}
