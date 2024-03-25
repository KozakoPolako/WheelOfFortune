import { Button, Typography, useTheme } from "@mui/material";
import { Participant } from "./WheelOfFortuneSupervisor";
import { useEffect, useRef, useState } from "react";
import "./WheelOfFortuneSimulator.css";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const SIZE = 500;

type Props = {
  participants: Participant[];
  onWheelSpin: (
    spinWheel: () => Promise<Participant | undefined>
  ) => Promise<void>;
};

const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
};

function WheelOfFortuneSimulator({ participants, onWheelSpin }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const theme = useTheme();
  const elWheel = useRef<HTMLCanvasElement>(null);

  const wheel = useRef<Wheel>();

  // const sectors: Sector[] = participants
  //   .filter((val) => !val.disable && val.text)
  //   .map((val) => ({
  //     id: val.id,
  //     color: stringToColour(val.id),
  //     label: val.text,
  //   }));
  useEffect(() => {
    if (elWheel.current && elWheel.current.getContext("2d")) {
      const context = elWheel.current.getContext("2d");
      if (context) {
        wheel.current = new Wheel(context);
      }
    }
  }, []);

  useEffect(() => {
    if (!wheel.current) return;
    console.log("RedrawWheel");
    wheel.current.drawSectors(
      participants
        .filter((val) => !val.disable && val.text)
        .map((val) => ({
          id: val.id,
          color: stringToColour(val.id),
          label: val.text,
        }))
    );
  }, [participants]);

  async function spinWheel() {
    setIsSpinning(true);
    await onWheelSpin(async () => {
      if (!wheel.current) return;
      const winner = await wheel.current.spinWheel();
      if (winner) {
        return participants.find((val) => val.id === winner.id);
      }
    });
    setIsSpinning(false);
  }
  return (
    <Grid2 container justifyContent="center">
      <Grid2>
        <div className="wheel-container">
          {!participants.filter((val) => !val.disable && val.text).length ? (
            <div className="wheel-center">
              <Typography variant="h4" noWrap>
                Add participants to begin
              </Typography>
            </div>
          ) : null}
          <div
            className={
              theme.palette.mode === "dark"
                ? "wheel-pointer theme--dark"
                : " wheel-pointer theme--light"
            }
            style={{
              visibility: participants.filter((val) => !val.disable && val.text)
                .length
                ? "visible"
                : "hidden",
            }}
          />

          <canvas
            style={{
              visibility: participants.filter((val) => !val.disable && val.text)
                .length
                ? "visible"
                : "hidden",
            }}
            className="wheel"
            ref={elWheel}
            width={SIZE}
            height={SIZE}
          ></canvas>
          {!isSpinning &&
          participants.filter((val) => !val.disable && val.text).length > 1 ? (
            <Button
              onClick={spinWheel}
              sx={{
                position: "absolute",
                borderRadius: 5,
                boxShadow: 4,
              }}
              size="large"
              className="wheel-center"
              variant="contained"
            >
              Spin
            </Button>
          ) : null}
        </div>
      </Grid2>
    </Grid2>
  );
}

export default WheelOfFortuneSimulator;

type Sector = {
  id: string;
  color: string;
  label: string;
};

class Wheel {
  audio = new Audio("WheepOfFortune/WheelOfFortuneSound.mp3");

  tot = 0;
  ctx: CanvasRenderingContext2D;
  dia: number;
  rad: number;
  TAU = 2 * Math.PI;
  arc = 0;

  friction: number; // 0.995=soft, 0.99=mid, 0.98=hard
  angVelMin: number; // Below that number will be treated as a stop

  angVelMax = 0; // Random ang.vel. to accelerate to
  angVel = 0; // Current angular velocity
  ang = 0; // Angle rotation in radians
  isSpinning = false;
  isAccelerating = false;
  animFrame = 0; // Engine's requestAnimationFrame

  sectors: Sector[] = [];

  resolve: (
    value: Sector | PromiseLike<Sector | undefined> | undefined
  ) => void = () => undefined;

  constructor(
    ctx2d: CanvasRenderingContext2D,
    friction = 0.994,
    angVelMin = 0.001
  ) {
    this.ctx = ctx2d;
    this.dia = this.ctx.canvas.width;
    this.rad = this.dia / 2;

    this.friction = friction;
    this.angVelMin = angVelMin;
  }
  private rand(m: number, M: number) {
    return Math.random() * (M - m) + m;
  }

  private getIndex(ang: number) {
    return Math.floor(this.tot - (ang / this.TAU) * this.tot) % this.tot;
  }

  private drawSector(sector: Sector, i: number) {
    const ang = this.arc * i;
    this.ctx.save();
    // COLOR
    this.ctx.beginPath();
    this.ctx.fillStyle = sector.color;
    this.ctx.moveTo(this.rad, this.rad);
    this.ctx.arc(this.rad, this.rad, this.rad, ang, ang + this.arc);
    this.ctx.lineTo(this.rad, this.rad);
    this.ctx.fill();
    // TEXT
    this.ctx.translate(this.rad, this.rad);
    this.ctx.rotate(ang + this.arc / 2);
    this.ctx.textAlign = "right";
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 30px sans-serif";
    this.ctx.fillText(sector.label, this.rad - 10, 10);
    //
    this.ctx.restore();
  }
  private drawWheel() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "#000";
    this.ctx.moveTo(this.rad, this.rad);
    this.ctx.arc(this.rad, this.rad, this.rad * 0.04, 0, 360);
    this.ctx.fill();
    this.ctx.restore();
  }
  private rotate() {
    this.ctx.canvas.style.transform = `rotate(${this.ang - Math.PI / 2}rad)`;
  }
  private frame() {
    if (!this.isSpinning) return;
    if (this.angVel >= this.angVelMax) this.isAccelerating = false;

    // Accelerate
    if (this.isAccelerating) {
      this.angVel ||= this.angVelMin; // Initial velocity kick
      this.angVel *= 1.06; // Accelerate
    }
    // Decelerate
    else {
      this.isAccelerating = false;
      this.angVel *= this.friction; // Decelerate by friction

      // SPIN END:
      if (this.angVel < this.angVelMin) {
        this.isSpinning = false;
        this.angVel = 0;
        cancelAnimationFrame(this.animFrame);
        const sector = this.sectors[this.getIndex(this.ang)];
        this.resolve(sector);
      }
    }
    const oldAng = this.ang;
    this.ang += this.angVel; // Update angle
    this.ang %= this.TAU; // Normalize angle
    this.playSound(oldAng);
    this.rotate(); // CSS rotate!
  }
  private engine() {
    this.frame();
    this.animFrame = requestAnimationFrame(() => {
      this.engine();
    });
  }
  private playSound(oldAng: number) {
    if (this.getIndex(oldAng) !== this.getIndex(this.ang)) {
      this.audio.play();
    }
  }

  public drawSectors(sectors: Sector[]) {
    if (!sectors.length) {
      console.log("Drawing: ", sectors);
      this.drawSector(
        {
          id: "",
          color: "#42a5f5",
          label: "",
        },
        0
      );
      return;
    }
    this.sectors = sectors;
    this.tot = this.sectors.length;
    this.arc = this.TAU / this.tot;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.sectors.forEach((val, i) => {
      this.drawSector(val, i);
    });
    this.drawWheel();
    this.rotate();
  }
  public async spinWheel(): Promise<Sector | undefined> {
    if (this.isSpinning) return;
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.isSpinning = true;
      this.isAccelerating = true;
      this.angVelMax = this.rand(0.25, 1.5);
      this.engine();
    });
  }
}
