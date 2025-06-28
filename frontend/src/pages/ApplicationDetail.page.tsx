import React, { useEffect, useState } from 'react';
import { Box, Text, Divider, Loader, Paper, Stack, Title } from '@mantine/core';
import { useParams } from 'react-router-dom';

const API = import.meta.env.VITE_BACKEND_URL; // e.g. "http://127.0.0.1:3000"

function bufferToBase64(buffer: { type: string; data: number[] }) {
  if (!buffer || !Array.isArray(buffer.data)) return '';
  const binary = Uint8Array.from(buffer.data).reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ''
  );
  return window.btoa(binary);
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [app, setApp] = useState<any | null>(null);
  const [plantAddr, setPlantAddr] = useState<any | null>(null);

  const [subscriber, setSubscriber] = useState<any | null>(null);
  const [subscriberAddr, setSubscriberAddr] = useState<any | null>(null);

  const [operator, setOperator] = useState<any | null>(null);
  const [operatorAddr, setOperatorAddr] = useState<any | null>(null);

  const [installer, setInstaller] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        /* 1. application */
        const appRes = await fetch(`${API}/power-plant-applications/applications/${id}`);
        const appData = await appRes.json();
        setApp(appData);

        /* 2. plant address */
        if (appData.plantAddress) {
          const a = await fetch(
            `${API}/power-plant-applications/addresses/${appData.plantAddress}`
          ).then((r) => r.json());
          setPlantAddr(a);
        }

        /* 3. subscriber + installer + operator in parallel */
        const [sub, inst, op] = await Promise.all([
          appData.subscriber
            ? fetch(`${API}/power-plant-applications/persons/${appData.subscriber}`).then((r) =>
              r.json()
            )
            : null,
          appData.systemInstaller
            ? fetch(`${API}/power-plant-applications/system-installers/${appData.systemInstaller}`).then(
              (r) => r.json()
            )
            : null,
          appData.operator
            ? fetch(`${API}/power-plant-applications/persons/${appData.operator}`).then((r) =>
              r.json()
            )
            : null,
        ]);
        setSubscriber(sub);
        setInstaller(inst);
        setOperator(op);

        /* 4. subscriber & operator addresses (if present) */
        if (sub?.address) {
          const sAddr = await fetch(
            `${API}/power-plant-applications/addresses/${sub.address}`
          ).then((r) => r.json());
          setSubscriberAddr(sAddr);
        }
        if (op?.address) {
          const oAddr = await fetch(
            `${API}/power-plant-applications/addresses/${op.address}`
          ).then((r) => r.json());
          setOperatorAddr(oAddr);
        }
      } catch (e) {
        setApp(null);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!app) return <Text c="red">Application not found</Text>;

  /* signature handling */
  let signatureSrc = '';
  if (typeof app.signature === 'string' && app.signature.startsWith('data:image/')) {
    signatureSrc = app.signature;
  } else if (app.signature?.data) {
    signatureSrc = `data:image/png;base64,${bufferToBase64(app.signature)}`;
  }

  const renderAddress = (addr: any) =>
    addr ? (
      <Text>
        {addr.street} {addr.houseNumber}, {addr.postCode} {addr.city}
      </Text>
    ) : (
      <Text c="dimmed">N/A</Text>
    );

  return (
    <Paper shadow="xs" p="lg" radius="md">
      <Title order={2} mb="xs">
        Application Details
      </Title>
      <Divider mb="md" />

      <Stack gap="xs">
        <Text>
          <b>ID:</b> {app.id}
        </Text>
        <Text>
          <b>System Type:</b> {app.systemType}
        </Text>
        <Text>
          <b>Commissioning Date:</b>{' '}
          {app.commisioningDate ? new Date(app.commisioningDate).toLocaleDateString() : '-'}
        </Text>
        <Text>
          <b>Created At:</b> {app.createdAt ? new Date(app.createdAt).toLocaleString() : '-'}
        </Text>

        <Divider />

        <Text fw={700}>Plant Address</Text>
        {renderAddress(plantAddr)}

        <Divider />

        <Text fw={700}>Subscriber (Owner)</Text>
        {subscriber ? (
          <>
            <Text>
              {subscriber.legalName} ({subscriber.organizationType})
            </Text>
            <Text>
              {subscriber.email}
              {subscriber.telephone && ` / ${subscriber.telephone}`}
            </Text>
            <Text size="sm" c="dimmed" mt={4}>
              Address:
            </Text>
            {renderAddress(subscriberAddr)}
          </>
        ) : (
          <Text c="dimmed">N/A</Text>
        )}

        <Divider />

        <Text fw={700}>Operator</Text>
        {operator ? (
          <>
            <Text>
              {operator.legalName} ({operator.organizationType})
            </Text>
            <Text>
              {operator.email}
              {operator.telephone && ` / ${operator.telephone}`}
            </Text>
            <Text size="sm" c="dimmed" mt={4}>
              Address:
            </Text>
            {renderAddress(operatorAddr)}
          </>
        ) : (
          <Text c="dimmed">N/A</Text>
        )}

        <Divider />

        <Text fw={700}>System Installer</Text>
        {installer ? (
          <>
            <Text>{installer.company}</Text>
            <Text>Registration No: {installer.registrationNumber}</Text>
          </>
        ) : (
          <Text c="dimmed">N/A</Text>
        )}

        <Divider />

        <Text fw={700}>Attachments</Text>
        <Text>
          Application for grid connection attached: {app.applicationGridConnectionAttached ? 'Yes' : 'No'}
        </Text>
        <Text>Site plan attached: {app.sitePlanAttached ? 'Yes' : 'No'}</Text>
        <Text>
          Generating data sheet attached: {app.generatingDataSheetAttached ? 'Yes' : 'No'}
        </Text>
        <Text>
          Unit certificates available: {app.unitCertificatesAvailable ? 'Yes' : 'No'}
        </Text>
        <Text>NA certificate attached: {app.naCertificateAttached ? 'Yes' : 'No'}</Text>
        <Text>
          Power flow monitoring certificate attached:{' '}
          {app.powerFlowMonitoringCertificateAttached ? 'Yes' : 'No'}
        </Text>
        <Text>
          Overview system diagram attached: {app.overviewSystemDiagramAttached ? 'Yes' : 'No'}
        </Text>

        <Divider />

        <Text fw={700}>Signature</Text>
        <Text>Place: {app.signaturePlace || '-'}</Text>
        {signatureSrc ? (
          <Box mt={8}>
            <img
              src={signatureSrc}
              alt="Signature"
              style={{ border: '1px solid #ccc', maxWidth: 400 }}
            />
          </Box>
        ) : (
          <Text c="dimmed">No signature</Text>
        )}
      </Stack>
    </Paper>
  );
}