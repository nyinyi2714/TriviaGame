import React from 'react';
import './leaderboard.css'; // Assuming the CSS file is in the same directory

const Leaderboard: React.FC = () => {
  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <table id="leaderboardTable">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th>TimeStamp</th>
          </tr>
        </thead>
        <tbody>
          {/* Data will be inserted here by JavaScript/React */}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
