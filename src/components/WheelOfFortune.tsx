import { Options, Participant } from "./WheelOfFortuneSupervisor";
import { Box } from "@mui/material";
import WheelOfFortuneSimulator from "./WheelOfFortuneSimulator";

type Props = {
  participants: Participant[];
  options: Options;
  actions: {
    disableParticipant: (participant: Participant) => void;
    appendWinner: (participant: Participant) => void;
  };
};

export default function WheelOfFortune({
  participants,
  options,
  actions,
}: Props) {
  // const enabledParticipants = participants.filter(
  //   (val) => !val.disable && val.text
  // );

  async function onWheelSpin(
    spinWheel: () => Promise<Participant | undefined>
  ) {
    for (let i = 0; i < options.spinCount; i++) {
      console.log("spin no. :", i + 1);
      const winner = await spinWheel();
      if (!winner) return;
      await new Promise((r) => setTimeout(r, 500));
      actions.appendWinner(winner);
      if (options.disableAfterPick) {
        actions.disableParticipant(winner);
      }
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <WheelOfFortuneSimulator
          participants={participants}
          options={options}
          onWheelSpin={onWheelSpin}
        />
      </Box>
    </Box>
  );
}
