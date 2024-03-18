import { Participant } from "./WheelOfFortuneSupervisor";
import {
  Box,
  Button,
  Card,
  Divider,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type Props = {
  participants: Participant[];
  actions: {
    setItem: (item: Participant) => void;
    removeItem: (item: Participant) => void;
    appendItem: () => void;
  };
};

function WheelOfFortuneList({ participants, actions }: Props) {
  return (
    <Card sx={{ borderRadius: 5 }}>
      <List sx={{ py: 0 }}>
        {participants.map((item) => (
          <Box key={item.id}>
            <PartisipantItem
              item={item}
              onChange={actions.setItem}
              removeItem={actions.removeItem}
            />
            <Divider />
          </Box>
        ))}
        <ListItem sx={{ padding: 0 }}>
          <ListItemButton onClick={actions.appendItem}>
            <AddIcon sx={{ mr: 2 }} />
            <ListItemText>Add</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Card>
  );
}

function PartisipantItem({
  item,
  onChange,
  removeItem,
}: {
  item: Participant;
  onChange: (participant: Participant) => void;
  removeItem: (Participant: Participant) => void;
}) {
  function setText(text: string) {
    onChange({
      ...item,
      text: text,
    });
  }
  function toggleVisable() {
    onChange({
      ...item,
      disable: !item.disable,
    });
  }
  return (
    <ListItem sx={{ padding: 0 }} key={item.id}>
      <ListItemButton
        disabled={item.disable}
        sx={{ pointerEvents: "unset !important" }}
      >
        <Grid2 container alignItems={"center"} flexGrow={1}>
          <Grid2 xs>
            <InputBase
              size="small"
              placeholder="Name"
              value={item.text}
              onChange={(e) => setText(e.target.value)}
            />
          </Grid2>
          <Grid2 xs="auto">
            <Button onClick={toggleVisable}>
              {item.disable ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Button>
          </Grid2>
          <Grid2 xs="auto">
            <Button onClick={() => removeItem(item)}>
              <DeleteOutlineIcon />
            </Button>
          </Grid2>
        </Grid2>
      </ListItemButton>
    </ListItem>
  );
}

export default WheelOfFortuneList;
