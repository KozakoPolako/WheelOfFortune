import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  // Slider,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
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
  spinCount: number;
  animationSpeed: number;
  disableAfterPick: boolean;
};

function WheelOfFortuneSupervisor() {
  const [options, setOptions] = useState<Options>(initStateData().options);
  const [participants, setParticipants] = useState<Participant[]>(
    initStateData().participants
  );

  const [winners, setWinners] = useState<Participant[]>([]);

  useEffect(() => {
    const state = {
      options,
      participants,
    };
    localStorage.setItem("wheelOfFortuneData", JSON.stringify(state));
  }, [participants, options]);

  const enabledParticipants = participants.filter(
    (val) => !val.disable && val.text
  );

  function initStateData() {
    const data = localStorage.getItem("wheelOfFortuneData");
    const { options, participants } = data
      ? JSON.parse(data)
      : { options: undefined, participants: undefined };
    return {
      options: options ?? {
        spinCount: 1,
        animationSpeed: 50,
        disableAfterPick: true,
      },
      participants: participants ?? [],
    };
  }

  function setDisableAtfterPick(val: boolean) {
    setOptions({
      ...options,
      disableAfterPick: val,
    });
  }
  // function setAnimationSpeed(val: number) {
  //   setOptions({
  //     ...options,
  //     animationSpeed: val,
  //   });
  // }
  function setSpinCount(val: string) {
    setOptions({
      ...options,
      spinCount: parseInt(val),
    });
  }
  function validateSpinCount(val: string) {
    if (!val) setSpinCount("1");
    if (
      options.disableAfterPick &&
      parseInt(val) > enabledParticipants.length - 1
    ) {
      setSpinCount(enabledParticipants.length - 1 + "");
    }
  }
  function disableParticipant(participant: Participant) {
    setParticipants((oldVal) => {
      const index = oldVal.findIndex((val) => val.id === participant.id);
      if (index === -1) {
        throw new Error("");
      }
      const newItems = [...oldVal];
      newItems[index] = { ...participant, disable: true };
      return newItems;
    });
  }
  function setParticipant(participant: Participant) {
    setParticipants((oldVal) => {
      const index = oldVal.findIndex((val) => val.id === participant.id);
      if (index == -1) {
        throw new Error(`cannot find element with id: ${participant.id}`);
      }
      const newItems = [...oldVal];
      newItems[index] = participant;
      return newItems;
    });
  }
  function removeParticipant(participant: Participant) {
    setParticipants((oldVal) => {
      const index = oldVal.findIndex((val) => val.id === participant.id);
      if (index == -1) {
        throw new Error(`cannot find element with id: ${participant.id}`);
      }
      const newItems = [...oldVal];
      newItems.splice(index, 1);
      return newItems;
    });
  }
  function appendParticipant() {
    setParticipants((oldVal) => {
      const newItems = [...oldVal];
      newItems.push({
        id: uuidv4(),
        text: "",
        disable: false,
      });
      return newItems;
    });
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
      <Grid2 container spacing={2} sx={{ mb: 10 }} wrap="wrap-reverse">
        <Grid2 xs={12} md={8}>
          <WheelOfFortune
            participants={participants}
            options={options}
            actions={{ disableParticipant, appendWinner }}
          />
          <WheelOfFortuneWinners winners={winners} actions={{ clearWinners }} />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Options
          </Typography>
          <Box>
            <FormGroup>
              <TextField
                value={options.spinCount}
                onChange={(e) => setSpinCount(e.target.value)}
                onBlur={(e) => validateSpinCount(e.target.value)}
                type="number"
                inputProps={{
                  min: 1,
                  max: options.disableAfterPick
                    ? enabledParticipants.length - 1
                    : undefined,
                }}
                size="small"
                label="Spin count"
                variant="filled"
              ></TextField>
              <FormControlLabel
                sx={{ mb: 1 }}
                control={
                  <Checkbox
                    defaultChecked={options.disableAfterPick}
                    value={options.disableAfterPick}
                    onChange={(_, val) => setDisableAtfterPick(val)}
                  />
                }
                label="Remove participal after pick"
              />
              {/* <Typography>Animation speed</Typography> */}
            </FormGroup>
            {/* <Box sx={{ px: 1.2 }}>
              <Slider
                value={options.animationSpeed}
                onChange={(_, val) => setAnimationSpeed(val as number)}
                min={1}
                sx={{ px: 0 }}
                defaultValue={50}
                aria-label="Small"
                valueLabelDisplay="auto"
              />
            </Box> */}
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
