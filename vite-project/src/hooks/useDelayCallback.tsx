function useDelayCallback() {
  const delayedCallback = (callback: any, sec = 2000): void => {
    setTimeout(() => {
      if (callback) {
        callback()
      }
    }, sec)
  }

  return { delayedCallback }
}

export default useDelayCallback
