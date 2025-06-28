import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class ApplicationsService {
  constructor(private readonly db: DbService) {}

  map(row: any) {
    let signature = '';
    if (row.signature) {
      // If the row.signature is a Buffer, convert to base64
      // (row.signature might also be null, or already a string)
      if (Buffer.isBuffer(row.signature)) {
        const b64 = row.signature.toString('base64');
        signature = `data:image/png;base64,${b64}`;
      } else if (typeof row.signature === 'object' && Array.isArray(row.signature.data)) {
        // Defensive: handle returned object from some drivers
        const b64 = Buffer.from(row.signature.data).toString('base64');
        signature = `data:image/png;base64,${b64}`;
      } else if (typeof row.signature === 'string' && row.signature.startsWith('data:image/')) {
        signature = row.signature;
      } else {
        signature = '';
      }
    }
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
      signature,
      signaturePlace: row.signature_place,
      createdAt: row.created_at,
    };
  }

  async findAll() {
    const result = await this.db.query('SELECT * FROM applications');
    return result.rows.map(this.map);
  }

  async findById(id: number) {
    const result = await this.db.query('SELECT * FROM applications WHERE id = $1', [id]);
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async create(data: any) {
    const {
      plantAddress, systemType, commisioningDate,
      subscriber, operator, systemInstaller,
      applicationGridConnectionAttached, sitePlanAttached, generatingDataSheetAttached,
      unitCertificatesAvailable, naCertificateAttached,
      powerFlowMonitoringCertificateAttached, overviewSystemDiagramAttached,
      signature, signaturePlace,
    } = data;

    const signatureBase64Data = signature.replace(/^data:image\/\w+;base64,/, '');
    const signatureBinaryData = Buffer.from(signatureBase64Data, 'base64');

    const result = await this.db.query(
      `INSERT INTO applications
       (plant_address, system_type, commisioning_date, subscriber, operator, system_installer,
        application_grid_connection_attached, site_plan_attached, generating_data_sheet_attached,
        unit_certificates_available, na_certificate_attached,
        power_flow_monitoring_certificate_attached, overview_system_diagram_attached,
        signature, signature_place)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        plantAddress, systemType, commisioningDate,
        subscriber, operator, systemInstaller,
        applicationGridConnectionAttached, sitePlanAttached, generatingDataSheetAttached,
        unitCertificatesAvailable, naCertificateAttached,
        powerFlowMonitoringCertificateAttached, overviewSystemDiagramAttached,
        signatureBinaryData, signaturePlace,
      ],
    );
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async update(id: number, data: any) {
    const {
      plantAddress, systemType, commisioningDate,
      subscriber, operator, systemInstaller,
      applicationGridConnectionAttached, sitePlanAttached, generatingDataSheetAttached,
      unitCertificatesAvailable, naCertificateAttached,
      powerFlowMonitoringCertificateAttached, overviewSystemDiagramAttached,
      signature, signaturePlace,
    } = data;
    const result = await this.db.query(
      `UPDATE applications SET
         plant_address=$1, system_type=$2, commisioning_date=$3,
         subscriber=$4, operator=$5, system_installer=$6,
         application_grid_connection_attached=$7, site_plan_attached=$8, generating_data_sheet_attached=$9,
         unit_certificates_available=$10, na_certificate_attached=$11,
         power_flow_monitoring_certificate_attached=$12, overview_system_diagram_attached=$13,
         signature=$14, signature_place=$15
       WHERE id=$16 RETURNING *`,
      [
        plantAddress, systemType, commisioningDate,
        subscriber, operator, systemInstaller,
        applicationGridConnectionAttached, sitePlanAttached, generatingDataSheetAttached,
        unitCertificatesAvailable, naCertificateAttached,
        powerFlowMonitoringCertificateAttached, overviewSystemDiagramAttached,
        signature, signaturePlace,
        id,
      ],
    );
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async delete(id: number) {
    await this.db.query('DELETE FROM applications WHERE id = $1', [id]);
    return { deleted: true };
  }
}
