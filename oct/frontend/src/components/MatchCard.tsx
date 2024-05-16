import { MatchType } from "src/types/MatchType";

import osuLogo from "src/assets/images/osu.png";
import { Link } from "react-router-dom";

type MatchCardProps = {
  match: MatchType;
};

export default function MatchCard(props: MatchCardProps) {
  const match = props.match;

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
            {!match.team2 == undefined ? (
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
      <Link to="/" className="w-12 h-12">
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
      </Link>
    </div>
  );
}
