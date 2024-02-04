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
    {
        username: "user4",
        score: 70,
        numofquestionsanswered: 7,
    },
    {
        username: "user5",
        score: 60,
        numofquestionsanswered: 6,
    },
    {
        username: "user6",
        score: 50,
        numofquestionsanswered: 5,
    },
    {
        username: "user7",
        score: 40,
        numofquestionsanswered: 4,
    },
    {
        username: "user8",
        score: 30,
        numofquestionsanswered: 3,
    },
    {
        username: "user9",
        score: 20,
        numofquestionsanswered: 2,
    },
    {
        username: "user10",
        score: 10,
        numofquestionsanswered: 1,
    },
];


const Leaderboard: React.FC = () => {

    // Function to display the leaderboard
    const leaderboardTable =  dummyData.map((data, index) => { 
        return (
            <tr key={index}>
                <td>{data.username}</td>
                <td>{data.score}</td>
                <td>{data.numofquestionsanswered}</td>
            </tr>
        );
    });
    console.log(leaderboardTable)

    return (
        <div className='leaderboard'>
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
                    {leaderboardTable}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
