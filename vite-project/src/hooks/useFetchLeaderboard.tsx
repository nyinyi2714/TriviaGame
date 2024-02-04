import { BACKEND_API } from '../config'

function useFetchLeaderboard() {
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${BACKEND_API}/leaderboard`)
      
      if (!response.ok) {
        console.error(`Error fetching leaderboard: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching leaderboard:', error)

    }
  }

  return {
    fetchLeaderboard,
  }
}

export default useFetchLeaderboard
