import discordLogo from "src/assets/images/discord-logo.png";
import ytLogo from "src/assets/images/youtube-logo.png";
import twitchLogo from "src/assets/images/twitch-logo.png";

export default function Footer() {
    return (
        <footer>
            <div className="footer">
                {/* <div className="footer-block"> */}
                    <a className="footer-link" href="https://discord.gg/tuE84PX9mx" target="_blank">
                        <img className="footer-image prevent-select" src={discordLogo}></img>
                    </a>
                {/* </div> */}
                {/* <div className="footer-block"> */}
                    <a className="footer-link" href="https://twitch.tv/offlinechattournament" target="_blank">
                        <img className="footer-image prevent-select" src={twitchLogo}></img>
                    </a>
                {/* </div> */}
                {/* <div className="footer-block"> */}
                    <a className="footer-link" href="https://www.youtube.com/@offlinechattournament" target="_blank">
                        <img className="footer-image prevent-select" src={ytLogo}></img>
                    </a>
                {/* </div> */}
                {/* <div className="footer-block"> */}
                    <p className="footer-text prevent-select">developed by sheppsu and aychar</p>
                {/* </div> */}
            </div>
        </footer>
    );
}