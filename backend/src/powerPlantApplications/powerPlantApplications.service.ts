import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class PowerPlantApplicationsService {
  constructor(private readonly db: DbService) {}

  // --- ADDRESSES ---
  private mapAddress(row: any) {
    return {
      id: row.id,
      street: row.street,
      houseNumber: row.house_number,
      postCode: row.post_code,
      city: row.city,
    };
  }

  async findAllAddresses() {
    const result = await this.db.query('SELECT * FROM addresses');
    return result.rows.map(this.mapAddress);
  }

  async findAddressById(id: number) {
    const result = await this.db.query('SELECT * FROM addresses WHERE id = $1', [id]);
    return result.rows[0] ? this.mapAddress(result.rows[0]) : null;
  }

  async createAddress(data: any) {
    const { street, houseNumber, postCode, city } = data;
    const result = await this.db.query(
      `INSERT INTO addresses (street, house_number, post_code, city)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [street, houseNumber, postCode, city],
    );
    return result.rows[0] ? this.mapAddress(result.rows[0]) : null;
  }

  async updateAddress(id: number, data: any) {
    const { street, houseNumber, postCode, city } = data;
    const result = await this.db.query(
      `UPDATE addresses SET street=$1, house_number=$2, post_code=$3, city=$4
       WHERE id=$5 RETURNING *`,
      [street, houseNumber, postCode, city, id],
    );
    return result.rows[0] ? this.mapAddress(result.rows[0]) : null;
  }

  async deleteAddress(id: number) {
    await this.db.query('DELETE FROM addresses WHERE id = $1', [id]);
    return { deleted: true };
  }

  // --- PERSONS ---
  private mapPerson(row: any) {
    return {
      id: row.id,
      organizationType: row.organization_type,
      legalName: row.legal_name,
      telephone: row.telephone,
      email: row.email,
      address: row.address,
    };
  }

  async findAllPersons() {
    const result = await this.db.query('SELECT * FROM persons');
    return result.rows.map(this.mapPerson);
  }

  async findPersonById(id: number) {
    const result = await this.db.query('SELECT * FROM persons WHERE id = $1', [id]);
    return result.rows[0] ? this.mapPerson(result.rows[0]) : null;
  }

  async createPerson(data: any) {
    const { organizationType, legalName, telephone, email, address } = data;
    const result = await this.db.query(
      `INSERT INTO persons (organization_type, legal_name, telephone, email, address)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [organizationType, legalName, telephone, email, address],
    );
    return result.rows[0] ? this.mapPerson(result.rows[0]) : null;
  }

  async updatePerson(id: number, data: any) {
    const { organizationType, legalName, telephone, email, address } = data;
    const result = await this.db.query(
      `UPDATE persons SET organization_type=$1, legal_name=$2, telephone=$3, email=$4, address=$5
       WHERE id=$6 RETURNING *`,
      [organizationType, legalName, telephone, email, address, id],
    );
    return result.rows[0] ? this.mapPerson(result.rows[0]) : null;
  }

  async deletePerson(id: number) {
    await this.db.query('DELETE FROM persons WHERE id = $1', [id]);
    return { deleted: true };
  }

  // --- SYSTEM INSTALLERS ---
  private mapSystemInstaller(row: any) {
    return {
      id: row.id,
      company: row.company,
      registrationNumber: row.registration_number,
    };
  }

  async findAllSystemInstallers() {
    const result = await this.db.query('SELECT * FROM system_installers');
    return result.rows.map(this.mapSystemInstaller);
  }

  async findSystemInstallerById(id: number) {
    const result = await this.db.query('SELECT * FROM system_installers WHERE id = $1', [id]);
    return result.rows[0] ? this.mapSystemInstaller(result.rows[0]) : null;
  }

  async createSystemInstaller(data: any) {
    const { company, registrationNumber } = data;
    const result = await this.db.query(
      `INSERT INTO system_installers (company, registration_number)
       VALUES ($1, $2) RETURNING *`,
      [company, registrationNumber],
    );
    return result.rows[0] ? this.mapSystemInstaller(result.rows[0]) : null;
  }

  async updateSystemInstaller(id: number, data: any) {
    const { company, registrationNumber } = data;
    const result = await this.db.query(
      `UPDATE system_installers SET company=$1, registration_number=$2
       WHERE id=$3 RETURNING *`,
      [company, registrationNumber, id],
    );
    return result.rows[0] ? this.mapSystemInstaller(result.rows[0]) : null;
  }

  async deleteSystemInstaller(id: number) {
    await this.db.query('DELETE FROM system_installers WHERE id = $1', [id]);
    return { deleted: true };
  }

  // --- APPLICATIONS ---
  private mapApplication(row: any) {
    return {
      id: row.id,
      plantAddress: row.plant_address,
      systemType: row.system_type,
      commisioningDate: row.commisioning_date,
      subscriber: row.subscriber,
      operator: row.operator,
      systemInstaller: row.system_installer,
      applicationGridConnectionAttached: row.application_grid_connection_attached,
      sitePlanAttached: row.site_plan_attached,
      generatingDataSheetAttached: row.generating_data_sheet_attached,
      unitCertificatesAvailable: row.unit_certificates_available,
      naCertificateAttached: row.na_certificate_attached,
      powerFlowMonitoringCertificateAttached: row.power_flow_monitoring_certificate_attached,
      overviewSystemDiagramAttached: row.overview_system_diagram_attached,
    };
  }

  async findAllApplications() {
    const result = await this.db.query('SELECT * FROM applications');
    return result.rows.map(this.mapApplication);
  }

  async findApplicationById(id: number) {
    const result = await this.db.query('SELECT * FROM applications WHERE id = $1', [id]);
    return result.rows[0] ? this.mapApplication(result.rows[0]) : null;
  }

  async createApplication(data: any) {
    const {
      plantAddress, systemType, commisioningDate,
      subscriber, operator, systemInstaller,
      applicationGridConnectionAttached, sitePlanAttached, generatingDataSheetAttached,
      unitCertificatesAvailable, naCertificateAttached,
      powerFlowMonitoringCertificateAttached, overviewSystemDiagramAttached,
    } = data;
    const result = await this.db.query(
      `INSERT INTO applications
       (plant_address, system_type, commisioning_date, subscriber, operator, system_installer,
        application_grid_connection_attached, site_plan_attached, generating_data_sheet_attached,
        unit_certificates_available, na_certificate_attached,
        power_flow_monitoring_certificate_attached, overview_system_diagram_attached)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        plantAddress, systemType, commisioningDate,
        subscriber, operator, systemInstaller,
        applicationGridConnectionAttached, sitePlanAttached, generatingDataSheetAttached,
        unitCertificatesAvailable, naCertificateAttached,
        powerFlowMonitoringCertificateAttached, overviewSystemDiagramAttached,
      ],
    );
    return result.rows[0] ? this.mapApplication(result.rows[0]) : null;
  }

  async updateApplication(id: number, data: any) {
    const {
      plantAddress, systemType, commisioningDate,
      subscriber, operator, systemInstaller,
      applicationGridConnectionAttached, sitePlanAttached, generatingDataSheetAttached,
      unitCertificatesAvailable, naCertificateAttached,
      powerFlowMonitoringCertificateAttached, overviewSystemDiagramAttached,
    } = data;
    const result = await this.db.query(
      `UPDATE applications SET
                             plant_address=$1, system_type=$2, commisioning_date=$3,
                             subscriber=$4, operator=$5, system_installer=$6,
                             application_grid_connection_attached=$7, site_plan_attached=$8, generating_data_sheet_attached=$9,
                             unit_certificates_available=$10, na_certificate_attached=$11,
                             power_flow_monitoring_certificate_attached=$12, overview_system_diagram_attached=$13
       WHERE id=$14 RETURNING *`,
      [
        plantAddress, systemType, commisioningDate,
        subscriber, operator, systemInstaller,
        applicationGridConnectionAttached, sitePlanAttached, generatingDataSheetAttached,
        unitCertificatesAvailable, naCertificateAttached,
        powerFlowMonitoringCertificateAttached, overviewSystemDiagramAttached,
        id,
      ],
    );
    return result.rows[0] ? this.mapApplication(result.rows[0]) : null;
  }

  async deleteApplication(id: number) {
    await this.db.query('DELETE FROM applications WHERE id = $1', [id]);
    return { deleted: true };
  }
}
