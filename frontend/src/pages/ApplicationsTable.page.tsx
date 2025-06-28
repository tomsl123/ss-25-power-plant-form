import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Text, Group, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

type Application = {
  id: number;
  systemType: string;
  createdAt: string;
  subscriber: number;
};

export default function ApplicationsTablePage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState<{ message: string; error?: boolean } | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  useEffect(() => {
    fetch(backendUrl + '/power-plant-applications/applications')
      .then(res => res.json())
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      console.log(backendUrl);
      const res = await fetch(
        `${backendUrl}/power-plant-applications/applications/${id}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
        setModalContent({ message: 'Application deleted successfully!' });
      } else {
        setModalContent({ message: 'Failed to delete application.', error: true });
      }
    } catch {
      setModalContent({ message: 'Network error.', error: true });
    }
    openModal();
  };

  if (loading) return <Loader />;

  return (
    <>
      <Text size="xl" mb="md" fw={700}>Applications</Text>
      <Table>
        <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>System Type</Table.Th>
          <Table.Th>Created At</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
        {applications.map(app => (
          <Table.Tr key={app.id}>
            <Table.Td>{app.id}</Table.Td>
            <Table.Td>{app.systemType}</Table.Td>
            <Table.Td>{app.createdAt ? new Date(app.createdAt).toLocaleString() : ''}</Table.Td>
            <Table.Td>
              <Group>
                <Button size="xs" color="blue" onClick={() => navigate(`/applications/${app.id}`)}>
                  View
                </Button>
                <Button size="xs" color="red" onClick={() => handleDelete(app.id)}>
                  Delete
                </Button>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
        </Table.Tbody>
      </Table>
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={modalContent?.error ? 'Error' : 'Success'}
        centered
      >
        <Text c={modalContent?.error ? 'red' : 'green'}>{modalContent?.message}</Text>
      </Modal>
    </>
  );
}
