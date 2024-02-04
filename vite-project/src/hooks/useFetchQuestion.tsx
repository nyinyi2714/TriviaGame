import { useState } from 'react'
import { BACKEND_API } from '../config'

const useFetchQuestions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const fetchQuestions = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`${BACKEND_API}/questions`, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()

        return data
      } else {
        console.error('Failed to fetch questions')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }


  return {
    fetchQuestions, 
    isLoading,
  }
}

export default useFetchQuestions
