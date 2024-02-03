import { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'

type ErrorType = {
  message: String
}

function useTextToSpeech() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = (word: String) => {

    const textToSpeechEndpoint = import.meta.env.VITE_REACT_APP_TEXT_TO_SPEECH_ENDPOINT
    const textToSpeechKey = import.meta.env.VITE_REACT_APP_TEXT_TO_SPEECH_KEY

    if (!textToSpeechEndpoint || !textToSpeechKey) {
      // Handle the case when environment variables are not defined
      console.error("Environment variables are not defined.")
      return
    }

    setIsSpeaking(true)

    const body = {
      audioConfig: {
        audioEncoding: 'MP3'
      },
      input: {
        text: word
      },
      voice: {
        ssmlGender: 'MALE',
        languageCode: 'en-US'
      }
    }

    axios.post(textToSpeechEndpoint, body, {
      headers: {
        'X-Goog-Api-Key': textToSpeechKey,
      }
    })
    .then((response: AxiosResponse) => {
      const audioContent = response.data.audioContent
      const audioBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(audioBlob)

      const audioElement = new Audio(audioUrl)

      // Attach an event listener for when the audio playback ends
      audioElement.addEventListener('ended', () => {
        setIsSpeaking(false)
      })

      audioElement.play().catch(e => console.error('Error playing audio: ', e))
      setAudio(audioElement)
    })
    .catch((error: ErrorType) => {
      console.error('Error with the Text-to-Speech API', error.message)
    })
  }

  const stop = () => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setIsSpeaking(false)
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup function to remove event listener when the component unmounts
      if (audio) {
        audio.removeEventListener('ended', () => setIsSpeaking(false))
      }
    }
  }, [audio])

  return {
    speak,
    stop,
    isSpeaking
  }
}

export default useTextToSpeech
