import { useState, useEffect } from 'react'
import { useFetchLeaderboard } from '../../hooks'
import { Header } from '../../components'
import './LeaderboardPage.css'

type UserScore = {
  username: string
  score: number
}

function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<UserScore[]>([])
  const { fetchLeaderboard } = useFetchLeaderboard()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await fetchLeaderboard()
        setLeaderboardData(responseData)
      } catch (error) {
        console.error('Error fetching leaderboard data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Header header='Leaderboard' />
      <div className='leaderboard'>
        <h1>Leaderboard</h1>
        <table id="leaderboardTable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Reached 1 Million</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((data, index) => (
              <tr key={index}>
                <td>{data.username}</td>
                <td>{data.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default LeaderboardPage
