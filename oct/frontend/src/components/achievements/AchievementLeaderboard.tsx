export default function AchievementLeaderboard() {
    return (
        <div className="leaderboard">
            <h1>Leaderboard</h1>
            <div className="leaderboard-entry">
                <div className="leaderboard-foreground-container">
                    <div className="placement-container first">
                        <p className="placement-text">#1</p>
                    </div>
                    <img className="placement-img" src="https://a.ppy.sh/14895608?1686006091.jpeg"></img>
                    <p className="placement-text">This Is A Super Long Team Name</p>
                </div>
                <h1 className="placement-text points">8</h1>
            </div>
        </div>
    );
}