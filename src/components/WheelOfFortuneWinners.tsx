import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Participant } from "./WheelOfFortuneSupervisor";
import {
  Box,
  Button,
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

type Props = {
  winners: Participant[];
  actions: {
    clearWinners: () => void;
  };
};

export default function WheelOfFortuneWinners({ winners, actions }: Props) {
  return (
    <>
      <Grid2 container>
        <Grid2 xs>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Winners
          </Typography>
        </Grid2>
        <Grid2 xs="auto">
          <Button startIcon={<DeleteOutline />} onClick={actions.clearWinners}>
            Clear list
          </Button>
        </Grid2>
      </Grid2>
      <Card sx={{ borderRadius: 5 }}>
        <List sx={{ py: 0 }}>
          {winners.map((val, index) => (
            <Box key={index}>
              <WinnerItem item={val} />
              {index < winners.length - 1 ? <Divider></Divider> : null}
            </Box>
          ))}
        </List>
      </Card>
    </>
  );
}

function WinnerItem({ item }: { item: Participant }) {
  return (
    <ListItem>
      <ListItemText>{item.text}</ListItemText>
    </ListItem>
  );
}
