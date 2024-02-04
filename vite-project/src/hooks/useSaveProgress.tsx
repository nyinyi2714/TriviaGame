import { useState } from 'react';
import { BACKEND_API } from '../config';


const useSaveProgress = () => {
  const [loading, setLoading] = useState(false);

  const saveProgress = async (questionId: string, userChoice: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_API}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question_id: questionId, userChoice: userChoice }),
      });

      if (response.ok) {
        const result = await response.json();
        setLoading(false);
        return result;
      } else {
        const errorData = await response.json();
        console.log(errorData)
        setLoading(false);
        return { isUserCorrect: false };
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      setLoading(false);
      return { isUserCorrect: false };
    }
  };

  return { saveProgress, loading };
};

export default useSaveProgress;
