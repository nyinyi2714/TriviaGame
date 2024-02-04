import React from 'react';
import './leaderboard.css'; // Assuming the CSS file is in the same directory

// Dummy data for now
const dummyData = [ 
    {
        username: "user1",
        score: 100,
        numofquestionsanswered: 10,
    },
    {
        username: "user2",
        score: 90,
        numofquestionsanswered: 9,
    },
    {
        username: "user3",
        score: 80,
        numofquestionsanswered: 8,
    },
];


const Leaderboard: React.FC = () => {

    // Function to display the leaderboard
const leaderboardTable =  dummyData.map((data, index) => { 

    <tr key={index}>
    <td>{data.username}</td>
    <td>{data.score}</td>
    <td>{data.numofquestionsanswered}</td>
    </tr>
});
console.log(leaderboardTable)

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <table id="leaderboardTable">
        <thead>
          <tr>
            <th>Username</th>
            <th>Score</th>
            <th>Questions Answered</th>

            
          </tr>
        </thead>
        <tbody>
            {/* Data will be inserted here by JavaScript/React */}
            {dummyData.map((data, index) => (
                <tr key={index}>
                    <td>{data.username}</td>
                    <td>{data.score}</td>
                    <td>{data.numofquestionsanswered}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
