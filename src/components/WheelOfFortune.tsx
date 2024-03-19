import { Participant } from "./WheelOfFortuneSupervisor";
import { Box, Button, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useState } from "react";

type Props = {
  participants: Participant[];
  options: {
    animationSpeed: number;
    disableAfterPick: boolean;
  };
  actions: {
    disableParticipant: (participant: Participant) => void;
    appendWinner: (participant: Participant) => void;
  };
};

const MIN_STEPS = 20;
const MAX_STEPS = 200;

const FULL_ANIMATION_DURATION_MS = 5000;

export default function WheelOfFortune({
  participants,
  options,
  actions,
}: Props) {
  const [state, setState] = useState({
    isWinner: false,
    isPicking: false,
  });

  const enabledParticipants = participants.filter((val) => !val.disable);

  const animationDurationMS =
    (100 - options.animationSpeed) * 0.01 * FULL_ANIMATION_DURATION_MS;

  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);

  async function getRandomParticipants() {
    let winnerIndex = 0;
    setState({
      isWinner: false,
      isPicking: true,
    });
    if (enabledParticipants.length === 1) {
      winnerIndex = findNextEnabledParticipant(0);
      setCurrentWinnerIndex(findNextEnabledParticipant(0));
    } else {
      const stepCount =
        Math.floor(Math.random() * (MAX_STEPS - MIN_STEPS)) + MIN_STEPS;
      const stepDuration = Math.floor(animationDurationMS / stepCount);

      for (let i = 0; i < stepCount; i++) {
        setCurrentWinnerIndex((x) => {
          winnerIndex = findNextEnabledParticipant(x);
          return winnerIndex;
        });
        if (stepDuration) {
          await new Promise((r) => setTimeout(r, stepDuration));
        }
      }
    }
    setState({
      isWinner: true,
      isPicking: false,
    });
    appendWinner(winnerIndex);
    if (options.disableAfterPick) {
      disableParticipant(winnerIndex);
    }
  }

  function findNextEnabledParticipant(index: number) {
    let nextIndex = index;
    do {
      nextIndex = (nextIndex + 1) % participants.length;
    } while (participants[nextIndex].disable);
    return nextIndex;
  }

  function disableParticipant(index: number) {
    console.log(`disable: ${participants[index].text}`);
    actions.disableParticipant(participants[index]);
  }
  function appendWinner(index: number) {
    actions.appendWinner(participants[index]);
  }

  return (
    <Box>
      <Grid2 container justifyContent="center" sx={{ mb: 2 }}>
        <Grid2 xs="auto" sx={{ minHeight: "115px" }}>
          <Typography
            variant="h1"
            component="span"
            color={state.isWinner ? "green" : ""}
          >
            {participants.length ? participants[currentWinnerIndex].text : ""}
          </Typography>
        </Grid2>
      </Grid2>
      <Grid2 container justifyContent="center">
        <Grid2 xs={12} sm={6}>
          <Button
            disabled={!enabledParticipants.length || state.isPicking}
            fullWidth
            variant="contained"
            sx={{ borderRadius: 5, mb: 5 }}
            startIcon={<AutorenewIcon />}
            onClick={getRandomParticipants}
          >
            Take a spin
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
}
