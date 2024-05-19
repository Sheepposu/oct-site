import { MatchType } from "src/types/MatchType";

import osuLogo from "src/assets/images/osu.png";
import { useState } from "react";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import MatchPage from "./MatchPage";
import { BsArrowUpRight, BsX } from "react-icons/bs";

type MatchCardProps = {
  match: MatchType;
};

export default function MatchCard(props: MatchCardProps) {
  const match = props.match;

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div
      className={`w-[calc(100%-20px)] h-20 px-4 rounded-xl grid auto-cols-[1fr] grid-cols-[25%_auto_5%_50px] [box-shadow:1px_6px_11px_-3px_rgba(0,0,0,0.25)] justify-stretch items-center [background:linear-gradient(to_right,_${match.color}_0%,_#F6F6F6_30%,_#F6F6F6_100%)]`}
    >
      {match.result == "QUALIFIERS" ? (
        <>
          <p className="italic font-bold [font-size:clamp(30px,_2.5vw,_40px)]">
            Qualifiers
          </p>
          <p className="text-center">{match.time_str}</p>
          <p className="text-right">{match.id}</p>
        </>
      ) : (
        <>
          <p className="italic font-bold [font-size:clamp(30px,_2.5vw,_40px)]">
            {match.result}
          </p>
          <div className="grid auto-cols-[1fr] grid-cols-[50px_auto_10%_auto_50px]">
            <img
              src={match.team1?.icon == null ? osuLogo : match.team1.icon}
              alt="Team 1 match icon"
              className="h-12 rounded-full"
            />
            <p className="[margin-block:auto] ml-1">{match.team1?.name}</p>
            {match.result == "UPCOMING" ? (
              <p className="text-center text-xl">{match.time_str}</p>
            ) : (
              <p className="[margin-block:auto] text-center">{match.score}</p>
            )}
            {!(match.team2 === undefined) ? (
              <>
                <p className="[margin-block:auto] mr-1 text-right">
                  {match.team2?.name}
                </p>
                <img
                  src={match.team2?.icon == null ? osuLogo : match.team2.icon}
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
              <div className="w-full h-14 flex rounded-xl bg-blue-300">
                <div>
                  {match.result == "QUALIFIERS" ? (
                    <p className="mt-3 ml-3 font-bold text-xl h-full text-center">
                      Qualifiers {match.id}
                    </p>
                  ) : (
                    <p className="mt-3 ml-3 font-bold text-xl h-full text-center">
                      Match {match.id}: {match.team1?.name} vs{" "}
                      {match.team2?.name}
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
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}
