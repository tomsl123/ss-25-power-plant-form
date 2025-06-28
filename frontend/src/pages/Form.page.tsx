import React, { useRef } from 'react';
import {
  TextInput,
  Select,
  Checkbox,
  Button,
  Group,
  Box,
  Grid,
  Stack,
  Text,
  NumberInput,
  Modal,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import SignatureCanvas from 'react-signature-canvas';

const systemTypeOptions = [
  { value: 'New construction', label: 'New construction' },
  { value: 'extension', label: 'Extension' },
  { value: 'dismantling', label: 'Dismantling' },
];

const organizationTypeOptions = [
  { value: 'company', label: 'Company' },
  { value: 'private person', label: 'Private Person' },
];

export default function FormPage() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [modalContent, setModalContent] = React.useState<{
    title: string;
    message: string;
    error?: boolean;
  } | null>(null);

  const form = useForm({
    initialValues: {
      // Plant address
      street: '',
      houseNumber: '',
      postCode: '',
      city: '',

      // Subscriber
      subOrganizationType: 'company',
      subLegalName: '',
      subTelephone: '',
      subEmail: '',
      subAddressSameAsPlant: false,
      subStreet: '',
      subHouseNumber: '',
      subPostCode: '',
      subCity: '',

      // Operator
      sameAsSubscriber: false,
      opOrganizationType: 'company',
      opLegalName: '',
      opTelephone: '',
      opEmail: '',
      opAddressSameAsPlant: false,
      opStreet: '',
      opHouseNumber: '',
      opPostCode: '',
      opCity: '',

      // System installer
      installerCompany: '',
      installerRegNumber: '',

      // Application details
      systemType: 'New construction',
      commissioningDate: null,

      // Attachments
      applicationGridConnectionAttached: false,
      sitePlanAttached: false,
      generatingDataSheetAttached: false,
      unitCertificatesAvailable: false,
      naCertificateAttached: false,
      powerFlowMonitoringCertificateAttached: false,
      overviewSystemDiagramAttached: false,

      // Signature
      signaturePlace: '',
      signature: '',
    },

    validate: {
      // Plant
      street: (v) => (v.trim() ? null : 'Required'),
      houseNumber: (v) => (v ? null : 'Required'),
      postCode: (v) => (v.length >= 4 ? null : 'Too short'),
      city: (v) => (v.trim() ? null : 'Required'),

      // Subscriber person
      subOrganizationType: (v) => (v ? null : 'Required'),
      subLegalName: (v) => (v.trim() ? null : 'Required'),
      subEmail: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),

      // Subscriber address
      subStreet: (v, values) =>
        values.subAddressSameAsPlant ? null : v.trim() ? null : 'Required',
      subHouseNumber: (v, values) =>
        values.subAddressSameAsPlant ? null : v ? null : 'Required',
      subPostCode: (v, values) =>
        values.subAddressSameAsPlant ? null : v.length >= 4 ? null : 'Too short',
      subCity: (v, values) =>
        values.subAddressSameAsPlant ? null : v.trim() ? null : 'Required',

      // Operator person
      opOrganizationType: (v, values) =>
        values.sameAsSubscriber ? null : v ? null : 'Required',
      opLegalName: (v, values) =>
        values.sameAsSubscriber ? null : v.trim() ? null : 'Required',
      opEmail: (v, values) =>
        values.sameAsSubscriber
          ? null
          : /^\S+@\S+$/.test(v)
            ? null
            : 'Invalid email',

      // Operator address
      opStreet: (v, values) =>
        values.sameAsSubscriber || values.opAddressSameAsPlant ? null : v.trim() ? null : 'Required',
      opHouseNumber: (v, values) =>
        values.sameAsSubscriber || values.opAddressSameAsPlant ? null : v ? null : 'Required',
      opPostCode: (v, values) =>
        values.sameAsSubscriber || values.opAddressSameAsPlant
          ? null
          : v.length >= 4
            ? null
            : 'Too short',
      opCity: (v, values) =>
        values.sameAsSubscriber || values.opAddressSameAsPlant ? null : v.trim() ? null : 'Required',

      // Installer
      installerCompany: (v) => (v.trim() ? null : 'Required'),
      installerRegNumber: (v) => (v.trim() ? null : 'Required'),

      // Application
      systemType: (v) => (v ? null : 'Required'),
      commissioningDate: (v) => (v ? null : 'Required'),

      // Signature
      signaturePlace: (v) => (v.trim() ? null : 'Required'),
      signature: (v) => (v ? null : 'Signature required'),
    },
  });

  const signatureError = form.errors.signature;

  const handleSigEnd = () => {
    const dataUrl = sigCanvasRef.current?.toDataURL();
    if (dataUrl) form.setFieldValue('signature', dataUrl);
  };

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
    form.setFieldValue('signature', '');
  };

  const createAddress = async (addr: {
    street: string;
    houseNumber: string;
    postCode: string;
    city: string;
  }) => {
    const res = await fetch(backendUrl + '/power-plant-applications/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addr),
    });
    return res.json();
  };

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const plantAddr = await createAddress({
        street: values.street,
        houseNumber: values.houseNumber,
        postCode: values.postCode,
        city: values.city,
      });

      let subscriberAddressId = plantAddr.id;
      if (!values.subAddressSameAsPlant) {
        const subAddr = await createAddress({
          street: values.subStreet,
          houseNumber: values.subHouseNumber,
          postCode: values.subPostCode,
          city: values.subCity,
        });
        subscriberAddressId = subAddr.id;
      }

      let operatorAddressId = subscriberAddressId;
      if (!values.sameAsSubscriber) {
        if (values.opAddressSameAsPlant) {
          operatorAddressId = plantAddr.id;
        } else {
          const opAddr = await createAddress({
            street: values.opStreet,
            houseNumber: values.opHouseNumber,
            postCode: values.opPostCode,
            city: values.opCity,
          });
          operatorAddressId = opAddr.id;
        }
      }

      const subRes = await fetch(backendUrl + '/power-plant-applications/persons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationType: values.subOrganizationType,
          legalName: values.subLegalName,
          telephone: values.subTelephone,
          email: values.subEmail,
          address: subscriberAddressId,
        }),
      });
      const subscriber = await subRes.json();

      let operatorId = subscriber.id;
      if (!values.sameAsSubscriber) {
        const opRes = await fetch(backendUrl + '/power-plant-applications/persons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationType: values.opOrganizationType,
            legalName: values.opLegalName,
            telephone: values.opTelephone,
            email: values.opEmail,
            address: operatorAddressId,
          }),
        });
        const operator = await opRes.json();
        operatorId = operator.id;
      }

      let installerId: number;
      const installers = await fetch(
        backendUrl + '/power-plant-applications/system-installers'
      ).then((r) => r.json());

      const existing = installers.find(
        (inst: any) => inst.registrationNumber === values.installerRegNumber
      );

      if (existing) {
        installerId = existing.id;
      } else {
        const instRes = await fetch(
          backendUrl + '/power-plant-applications/system-installers',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              company: values.installerCompany,
              registrationNumber: values.installerRegNumber,
            }),
          }
        );
        const installer = await instRes.json();
        installerId = installer.id;
      }

      await fetch(backendUrl + '/power-plant-applications/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantAddress: plantAddr.id,
          systemType: values.systemType,
          commisioningDate: values.commissioningDate,
          subscriber: subscriber.id,
          operator: operatorId,
          systemInstaller: installerId,
          applicationGridConnectionAttached: values.applicationGridConnectionAttached,
          sitePlanAttached: values.sitePlanAttached,
          generatingDataSheetAttached: values.generatingDataSheetAttached,
          unitCertificatesAvailable: values.unitCertificatesAvailable,
          naCertificateAttached: values.naCertificateAttached,
          powerFlowMonitoringCertificateAttached: values.powerFlowMonitoringCertificateAttached,
          overviewSystemDiagramAttached: values.overviewSystemDiagramAttached,
          signature: values.signature,
          signaturePlace: values.signaturePlace,
        }),
      });

      setModalContent({
        title: 'Form Submitted',
        message: 'Your application was submitted successfully!',
      });
      openModal();

    } catch (err) {
      setModalContent({
        title: 'Submission Failed',
        message: 'There was an error submitting the form. Please try again.',
        error: true,
      });
      openModal();
    }
  });

  return (
    <Box mx="auto" maw={800} p="md">
      <form onSubmit={handleSubmit}>
        {/* PLANT ADDRESS */}
        <h2>Plant Address</h2>
        <Grid>
          <Grid.Col span={6}>
            <TextInput label="Street" {...form.getInputProps('street')} required />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="House Number"
              {...form.getInputProps('houseNumber')}
              min={1}
              required
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="Post Code" {...form.getInputProps('postCode')} required />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput label="City" {...form.getInputProps('city')} required />
          </Grid.Col>
        </Grid>

        {/* SUBSCRIBER */}
        <h2>Subscriber (Owner)</h2>
        <Grid>
          <Grid.Col span={6}>
            <Select
              label="Organization Type"
              data={organizationTypeOptions}
              {...form.getInputProps('subOrganizationType')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="Legal Name" {...form.getInputProps('subLegalName')} required />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="Telephone" {...form.getInputProps('subTelephone')} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="Email" {...form.getInputProps('subEmail')} required />
          </Grid.Col>
        </Grid>

        <Checkbox
          mt="sm"
          label="Subscriber address same as Plant address"
          {...form.getInputProps('subAddressSameAsPlant', { type: 'checkbox' })}
        />

        {!form.values.subAddressSameAsPlant && (
          <Grid mt="xs">
            <Grid.Col span={6}>
              <TextInput label="Street" {...form.getInputProps('subStreet')} required />
            </Grid.Col>
            <Grid.Col span={3}>
              <NumberInput
                label="House Number"
                {...form.getInputProps('subHouseNumber')}
                min={1}
                required
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput label="Post Code" {...form.getInputProps('subPostCode')} required />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput label="City" {...form.getInputProps('subCity')} required />
            </Grid.Col>
          </Grid>
        )}

        {/* OPERATOR */}
        <Checkbox
          mt="md"
          label="Operator same as Subscriber"
          {...form.getInputProps('sameAsSubscriber', { type: 'checkbox' })}
        />

        <h2>Plant Operator</h2>
        <Grid>
          <Grid.Col span={6}>
            <Select
              label="Organization Type"
              data={organizationTypeOptions}
              {...form.getInputProps('opOrganizationType')}
              disabled={form.values.sameAsSubscriber}
              required={!form.values.sameAsSubscriber}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Legal Name"
              {...form.getInputProps('opLegalName')}
              required={!form.values.sameAsSubscriber}
              disabled={form.values.sameAsSubscriber}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Telephone"
              {...form.getInputProps('opTelephone')}
              disabled={form.values.sameAsSubscriber}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Email"
              {...form.getInputProps('opEmail')}
              required={!form.values.sameAsSubscriber}
              disabled={form.values.sameAsSubscriber}
            />
          </Grid.Col>
        </Grid>

        {!form.values.sameAsSubscriber && (
          <>
            <Checkbox
              mt="sm"
              label="Operator address same as Plant address"
              {...form.getInputProps('opAddressSameAsPlant', { type: 'checkbox' })}
            />

            {!form.values.opAddressSameAsPlant && (
              <Grid mt="xs">
                <Grid.Col span={6}>
                  <TextInput label="Street" {...form.getInputProps('opStreet')} required />
                </Grid.Col>
                <Grid.Col span={3}>
                  <NumberInput
                    label="House Number"
                    {...form.getInputProps('opHouseNumber')}
                    min={1}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput label="Post Code" {...form.getInputProps('opPostCode')} required />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput label="City" {...form.getInputProps('opCity')} required />
                </Grid.Col>
              </Grid>
            )}
          </>
        )}

        {/* INSTALLER */}
        <h2>System Installer</h2>
        <Grid>
          <Grid.Col span={6}>
            <TextInput label="Company" {...form.getInputProps('installerCompany')} required />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="Registration Number" {...form.getInputProps('installerRegNumber')} required />
          </Grid.Col>
        </Grid>

        {/* APPLICATION DETAILS */}
        <h2>Application Details</h2>
        <Grid>
          <Grid.Col span={6}>
            <Select
              label="System Type"
              data={systemTypeOptions}
              {...form.getInputProps('systemType')}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePickerInput label="Commissioning Date" {...form.getInputProps('commissioningDate')} />
          </Grid.Col>
        </Grid>

        {/* ATTACHMENTS */}
        <h3>Attachments</h3>
        <Stack gap="sm">
          <Checkbox
            label="Application for grid connection attached"
            {...form.getInputProps('applicationGridConnectionAttached', { type: 'checkbox' })}
          />
          <Checkbox label="Site plan attached" {...form.getInputProps('sitePlanAttached', { type: 'checkbox' })} />
          <Checkbox
            label="Generating data sheet attached"
            {...form.getInputProps('generatingDataSheetAttached', { type: 'checkbox' })}
          />
          <Checkbox
            label="Unit certificates available"
            {...form.getInputProps('unitCertificatesAvailable', { type: 'checkbox' })}
          />
          <Checkbox label="NA certificate attached" {...form.getInputProps('naCertificateAttached', { type: 'checkbox' })} />
          <Checkbox
            label="Power flow monitoring certificate attached"
            {...form.getInputProps('powerFlowMonitoringCertificateAttached', { type: 'checkbox' })}
          />
          <Checkbox
            label="Overview system diagram attached"
            {...form.getInputProps('overviewSystemDiagramAttached', { type: 'checkbox' })}
          />
        </Stack>

        {/* SIGNATURE */}
        <h3>Signature</h3>
        <TextInput label="Place" {...form.getInputProps('signaturePlace')} required />
        <Box mt="sm">
          <Text size="sm" fw={500} mb="xs">
            Draw your signature below<span style={{ color: 'red', marginLeft: 4 }}>*</span>
          </Text>
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              style: {
                border: `1px solid ${signatureError ? '#fa5252' : '#ccc'}`,
                borderRadius: '4px',
              },
            }}
            onEnd={handleSigEnd}
          />
          {signatureError && (
            <Text c="red" size="xs" mt={4}>
              {signatureError}
            </Text>
          )}
        </Box>
        <Group align="left" mt="sm">
          <Button variant="outline" size="xs" onClick={handleClearSignature}>
            Clear Signature
          </Button>
        </Group>

        {/* SUBMIT */}
        <Group align="right" mt="xl">
          <Button type="submit">Submit</Button>
        </Group>
      </form>

      {/* MODAL */}
      <Modal opened={modalOpened} onClose={closeModal} title={modalContent?.title} centered>
        <Text c={modalContent?.error ? 'red' : 'green'} size="md">
          {modalContent?.message}
        </Text>
      </Modal>
    </Box>
  );
}
