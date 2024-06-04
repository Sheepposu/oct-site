import "src/assets/css/achievements/completion.css";

export default function AchievementCompletionPage() {
  return (
    <div className="page-container">
        <div className="achievements-container">
            <div className="achievement">
                <div className="achievement-info-container complete">
                    <div className="achievement-info">
                        <h1>[Category] Achievement name</h1>
                        <p>Achievement description</p>
                    </div>
                    <h1>Complete</h1>
                </div>
                <div className="achievement-details-container">
                    
                </div>
            </div>
        </div>

        <div className="progress-container">
            <div className="total-achievements-container">
                <div className="total-achievements-inner-container">
                    <h1>Total Achievements</h1>
                    <h1>15/24</h1>
                    <div className="progress-bar">
                        <div className="progress-bar-inner"></div>
                    </div>
                </div>
                <button id="submit-button">Submit</button>
            </div>
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
        </div>
    </div>
  );
}
