import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Slider,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";
import WheelOfFortuneList from "./WheelOfFortuneList";
import WheelOfFortune from "./WheelOfFortune";
import { v4 as uuidv4 } from "uuid";
import WheelOfFortuneWinners from "./WheelOfFortuneWinners";

export type Participant = {
  id: string;
  text: string;
  disable: boolean;
};

export type Options = {
  animationSpeed: number;
  disableAfterPick: boolean;
};

function WheelOfFortuneSupervisor() {
  const participantsState = useState<Participant[]>([]);
  const [participants, setParticipants] = participantsState;
  const [winners, setWinners] = useState<Participant[]>([]);

  const [options, setOptions] = useState<Options>({
    animationSpeed: 50,
    disableAfterPick: true,
  });

  function setDisableAtfterPick(val: boolean) {
    setOptions({
      ...options,
      disableAfterPick: val,
    });
  }
  function setAnimationSpeed(val: number) {
    setOptions({
      ...options,
      animationSpeed: val,
    });
  }
  function disableParticipant(participant: Participant) {
    const index = participants.findIndex((val) => val.id === participant.id);
    if (index === -1) {
      throw new Error("");
    }
    const newItems = [...participants];
    newItems[index] = { ...participant, disable: true };
    setParticipants(newItems);
  }
  function setParticipant(participant: Participant) {
    const index = participants.findIndex((val) => val.id === participant.id);
    if (index == -1) {
      throw new Error(`cannot find element with id: ${participant.id}`);
    }
    const newItems = [...participants];
    newItems[index] = participant;
    setParticipants(newItems);
  }
  function removeParticipant(participant: Participant) {
    const index = participants.findIndex((val) => val.id === participant.id);
    if (index == -1) {
      throw new Error(`cannot find element with id: ${participant.id}`);
    }
    const newItems = [...participants];
    newItems.splice(index, 1);
    setParticipants(newItems);
  }
  function appendParticipant() {
    const newItems = [...participants];
    newItems.push({
      id: uuidv4(),
      text: "",
      disable: false,
    });
    setParticipants(newItems);
  }
  function appendWinner(participant: Participant) {
    setWinners((oldVal) => [...oldVal, participant]);
  }
  function clearWinners() {
    setParticipants((val) =>
      val.map((item) => {
        if (winners.find((i) => i.id === item.id)) {
          return {
            ...item,
            disable: false,
          };
        }
        return item;
      })
    );
    setWinners([]);
  }
  return (
    <Container>
      <Grid2 container spacing={2} sx={{ mb: 10 }}>
        <Grid2 xs={12} sm={8}>
          <WheelOfFortune
            participants={participants}
            options={options}
            actions={{ disableParticipant, appendWinner }}
          />
          <WheelOfFortuneWinners winners={winners} actions={{ clearWinners }} />
        </Grid2>
        <Grid2 xs={12} sm={4}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Options
          </Typography>
          <Box>
            <FormGroup>
              <FormControlLabel
                sx={{ mb: 1 }}
                control={
                  <Checkbox
                    defaultChecked={options.disableAfterPick}
                    value={options.disableAfterPick}
                    onChange={(e, val) => setDisableAtfterPick(val)}
                  />
                }
                label="Remove participal after pick"
              />
              <Typography>Animation speed</Typography>
            </FormGroup>
            <Box sx={{ px: 1.2 }}>
              <Slider
                value={options.animationSpeed}
                onChange={(e, val) => setAnimationSpeed(val as number)}
                min={1}
                sx={{ px: 0 }}
                defaultValue={50}
                aria-label="Small"
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>
          <Typography variant="h5" component="h2" sx={{ my: 2 }}>
            Participals
          </Typography>
          <WheelOfFortuneList
            participants={participants}
            actions={{
              appendItem: appendParticipant,
              removeItem: removeParticipant,
              setItem: setParticipant,
            }}
          />
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default WheelOfFortuneSupervisor;
