import { MatchType } from "src/types/MatchType";

import osuLogo from "src/assets/images/osu.png";
import { useState } from "react";
import { Grow, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import MatchPage from "./MatchPage";
import { BsArrowUpRight, BsX } from "react-icons/bs";

const matchColors = {};

export default function MatchCard(props: { match: MatchType }) {
  const match = props.match;
  let time = null;
  let hasStarted = false;
  let progress = null;
  let color = null;

  if (match.starting_time == null) {
    time = null;
  } else {
    time = new Date(match.starting_time);
  }

  if (time !== null) {
    hasStarted = Date.now() > time.getMilliseconds();
  }

  if (!hasStarted && time !== null) {
    progress = "UPCOMING";
  } else if (match.finished) {
    progress = "FINISHED";
  } else {
    progress = "ONGOING";
  }

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div
      className={`w-[calc(100%-20px)] h-20 px-4 rounded-xl grid auto-cols-[1fr] grid-cols-[25%_auto_5%_50px] [box-shadow:1px_6px_11px_-3px_rgba(0,0,0,0.25)] justify-stretch items-center [background:linear-gradient(to_right,_#ffffff_0%,_#F6F6F6_30%,_#F6F6F6_100%)]`}
    >
      {match.tournament_round.name == "QUALIFIERS" ? (
        <>
          <p className="italic font-bold [font-size:clamp(30px,_2.5vw,_40px)]">
            Qualifiers
          </p>
          <p className="text-center">{time?.toLocaleDateString()}</p>
          <p className="text-right">{match.id}</p>
        </>
      ) : (
        <>
          <p className="italic font-bold [font-size:clamp(30px,_2.5vw,_40px)]">
            {progress}
          </p>
          <div className="grid auto-cols-[1fr] grid-cols-[50px_auto_10%_auto_50px]">
            <img
              src={match.teams[0].icon == null ? osuLogo : match.teams[0].icon}
              alt="Team 1 match icon"
              className="h-12 rounded-full"
            />
            <p className="[margin-block:auto] ml-1">{match.teams[0].name}</p>
            {progress == "UPCOMING" ? (
              <p className="text-center text-xl">{time?.getDate()}</p>
            ) : (
              <p className="[margin-block:auto] text-center">
                {(match.wins?.split("1").length as number) - 1} -{" "}
                {(match.wins?.split("2").length as number) - 1}
              </p>
            )}
            {!(match.teams[1] === undefined) ? (
              <>
                <p className="[margin-block:auto] mr-1 text-right">
                  {match.teams[1].name}
                </p>
                <img
                  src={
                    match.teams[1].icon == null ? osuLogo : match.teams[1].icon
                  }
                  alt="Team 2 match icon"
                  className="h-12 rounded-full"
                />
              </>
            ) : (
              <>
                <p className="[margin-block:auto] mr-1 text-right">TBD</p>
                <img className="h-12 rounded-full" />
              </>
            )}
          </div>
        </>
      )}
      <div>
        <div onClick={handleOpen} className="hover:cursor-pointer">
          <svg
            width="50px"
            height="50px"
            version="1.1"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 " />
          </svg>
        </div>
        <div className="relative">
          <Modal open={open} onClose={handleClose} closeAfterTransition>
            <Box className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100vw_-_100px)] h-[calc(100vh_-_156px)] rounded-xl">
              <Grow in={open}>
                <div className="h-full">
                  <div className="w-full h-14 flex rounded-xl bg-blue-300">
                    <div>
                      {match.tournament_round.name == "QUALIFIERS" ? (
                        <p className="mt-3 ml-3 font-bold text-xl h-full text-center">
                          Qualifiers {match.id}
                        </p>
                      ) : (
                        <p className="mt-3 ml-3 font-bold text-xl h-full text-center">
                          Match {match.id}: {match.teams[0].name} vs{" "}
                          {match.teams[1].name}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-row-reverse flex-grow h-full">
                      <div
                        className="h-full flex items-center justify-center w-12 hover:cursor-pointer"
                        onClick={handleClose}
                      >
                        <BsX className="w-6 h-6" />
                      </div>
                      <div className="h-full flex items-center justify-center w-12 hover:cursor-not-allowed">
                        <BsArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <MatchPage />
                </div>
              </Grow>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}
