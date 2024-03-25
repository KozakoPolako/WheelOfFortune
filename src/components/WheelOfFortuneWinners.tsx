import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Participant } from "./WheelOfFortuneSupervisor";
import {
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

type Props = {
  winners: Participant[];
  actions: {
    clearWinners: () => void;
  };
};

export default function WheelOfFortuneWinners({ winners, actions }: Props) {
  function exportCsv() {
    const data = winners.map((val) => val.text);
    const fileContent = data.join("\n");

    const blob = new Blob([fileContent], {
      type: "data:text/csv;charset=utf-8,",
    });

    const uri = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", "export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <>
      <Grid2 container>
        <Grid2 xs>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Winners
          </Typography>
        </Grid2>
        <Grid2 xs="auto">
          <Button
            startIcon={<FileDownloadIcon />}
            onClick={() => exportCsv()}
            sx={{ borderRadius: 5, px: 2 }}
          >
            Export .csv
          </Button>
        </Grid2>
        <Grid2 xs="auto">
          <Button
            startIcon={<DeleteOutline />}
            onClick={actions.clearWinners}
            sx={{ borderRadius: 5, px: 2 }}
          >
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
  const [isIn, setIsIn] = useState(false);
  useEffect(() => {
    setIsIn(true);
  }, []);
  return (
    <Collapse in={isIn}>
      <ListItem>
        <ListItemText>{item.text}</ListItemText>
      </ListItem>
    </Collapse>
  );
}
