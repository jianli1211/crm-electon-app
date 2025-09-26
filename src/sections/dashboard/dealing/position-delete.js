import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import toast from "react-hot-toast"
import { paths } from "src/paths";

import { useRouter } from "src/hooks/use-router";
import { DeleteModal } from 'src/components/customize/delete-modal';
import { riskApi } from 'src/api/risk';

export const PositionDelete = ({ dealing }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const onDelete = async () => {
    try {
      await riskApi.deletePosition(dealing?.id);
      toast("Position successfully deleted!");
      setTimeout(() => {
        router.push(paths.dashboard.risk.positions);
      }, 1500);
    } catch (error) {
      console.error('error: ', error);
    }
  }

  return (
    <>
      <Card>
        <CardHeader title="Position Management" />
        <CardContent sx={{ pt: 0 }}>
          <Stack
            direction='row'
            justifyContent='end'>
            <Button
              color="error"
              variant="outlined"
              onClick={() => setModalOpen(true)}
            >
              Delete Position
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <DeleteModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onDelete={onDelete}
        title={'Delete position'}
        description={'Are you sure you want to delete this position?'}
      />
    </>
  );
};
