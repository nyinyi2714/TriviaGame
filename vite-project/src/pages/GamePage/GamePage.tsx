import './GamePage.css'

function GamePage() {
  return (
    <div className='gamepage'>

      <div className="question">
        <button className='gamepage-button'>
          <h2>QUESTION</h2>
          <div>What is your name</div>
        </button>
      </div>

      <div className="opt1">
        <button className='gamepage-button gamepage-A'>A. Cat </button>
      </div>
      <div className="opt2">
        <button className='gamepage-button gamepage-B'>B. Dog </button>
      </div>

      <div className="opt3">
        <button className='gamepage-button gamepage-C'>C. Mango</button>
      </div>
      <div className="opt4">
        <button className='gamepage-button gamepage-D'>D. Pineapple</button>
      </div>

    </div>
  )
}

export default GamePage