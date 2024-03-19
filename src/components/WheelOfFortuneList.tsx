import { Participant } from "./WheelOfFortuneSupervisor";
import {
  Box,
  ButtonBase,
  Card,
  Checkbox,
  Collapse,
  Divider,
  IconButton,
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
import { useEffect, useRef, useState } from "react";

type Props = {
  participants: Participant[];
  actions: {
    setItem: (item: Participant) => void;
    removeItem: (item: Participant) => void;
    appendItem: () => void;
  };
};

function WheelOfFortuneList({ participants, actions }: Props) {
  const [checked, setChecked] = useState<Participant[]>([]);

  const isInited = useRef(false);

  const isCheckedAll = participants.length === checked.length;
  const isDisabledAll = !checked.find((val) => val.disable);

  useEffect(() => {
    isInited.current = true;
  }, []);

  function handleToggle(value: Participant) {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    return undefined;
  }

  function isChecked(participant: Participant) {
    return checked.findIndex((val) => val.id === participant.id) !== -1;
  }
  function checkAll() {
    setChecked([...participants]);
  }
  function uncheckAll() {
    setChecked([]);
  }
  function setSelectedVisibility(disable: boolean) {
    checked.forEach((val) => actions.setItem({ ...val, disable }));
    uncheckAll();
  }
  function removeSelected() {
    checked.forEach((val) => actions.removeItem(val));
    uncheckAll();
  }
  function removeItem(participant: Participant) {
    actions.removeItem(participant);
    const checkIndex = checked.indexOf(participant);
    if (checkIndex !== -1) {
      setChecked([...checked].splice(checkIndex, 1));
    }
  }
  return (
    <>
      <Collapse in={participants.length > 1}>
        <Grid2
          container
          alignContent="center"
          sx={{
            pl: 0.5,
            pr: 2,
            pb: 1,
            minHeight: "46px",
          }}
        >
          <Grid2 xs="auto">
            <Checkbox
              disableRipple
              size="small"
              checked={isCheckedAll}
              indeterminate={!!checked.length && !isCheckedAll}
              onChange={() => (isCheckedAll ? uncheckAll() : checkAll())}
            />
          </Grid2>
          <Grid2 xs />
          <Grid2 xs="auto">
            <IconButton
              size="small"
              color="primary"
              onClick={() => setSelectedVisibility(isDisabledAll)}
            >
              {isDisabledAll && checked.length ? (
                <VisibilityOffIcon />
              ) : (
                <VisibilityIcon />
              )}
            </IconButton>
          </Grid2>
          <Grid2 xs="auto">
            <IconButton
              size="small"
              color="primary"
              onClick={() => removeSelected()}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Grid2>
        </Grid2>
      </Collapse>
      <Card
        sx={{
          borderRadius: 5,
        }}
      >
        <List
          sx={{
            py: 0,
          }}
        >
          {participants.map((item) => (
            <Box key={item.id}>
              <PartisipantItem
                item={item}
                onChange={actions.setItem}
                removeItem={removeItem}
                appendItem={actions.appendItem}
                isInited={isInited.current}
                handleToggle={handleToggle}
                isChecked={isChecked}
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
    </>
  );
}

function PartisipantItem({
  item,
  isInited,
  onChange,
  removeItem,
  appendItem,
  handleToggle,
  isChecked,
}: {
  item: Participant;
  isInited: boolean;
  onChange: (participant: Participant) => void;
  removeItem: (Participant: Participant) => void;
  handleToggle: (Participant: Participant) => void;
  isChecked: (Participant: Participant) => boolean;
  appendItem: () => void;
}) {
  const [isIn, setIsIn] = useState(false);
  useEffect(() => {
    console.log("TSET");
    setIsIn(true);
  }, []);
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

  function onKeydownEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Enter") {
      appendItem();
    }
  }
  async function remove(participant: Participant) {
    setIsIn(false);
    await new Promise((r) => setTimeout(r, 300));
    removeItem(participant);
  }

  return (
    <Collapse in={isIn}>
      <ListItem sx={{ padding: 0 }} key={item.id}>
        <ListItemButton
          disabled={item.disable}
          sx={{ pointerEvents: "unset !important" }}
        >
          <Grid2 container alignItems={"center"} flexGrow={1}>
            <Grid2 xs="auto" sx={{ pr: 1 }}>
              <ButtonBase onClick={() => handleToggle(item)} disableRipple>
                <Checkbox
                  size="small"
                  edge="start"
                  checked={isChecked(item)}
                  disableRipple
                />
              </ButtonBase>
            </Grid2>
            <Grid2 xs>
              <InputBase
                autoFocus={isInited}
                fullWidth
                size="small"
                placeholder="Name"
                value={item.text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeydownEnter}
                sx={{ paddingBottom: "-4px" }}
              />
            </Grid2>
            <Grid2 xs="auto">
              <IconButton onClick={toggleVisable} size="small" color="primary">
                {item.disable ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Grid2>
            <Grid2 xs="auto">
              <IconButton
                onClick={() => {
                  remove(item);
                }}
                size="small"
                color="primary"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Grid2>
          </Grid2>
        </ListItemButton>
      </ListItem>
    </Collapse>
  );
}

export default WheelOfFortuneList;
