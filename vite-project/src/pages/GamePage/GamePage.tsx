import './GamePage.css'
import { Header } from "../../components";



const questionsData = [ 
  {
    question: 'What is your name',
    options: ['Cat', 'Dog', 'Mango', 'Pineapple'],
    answer: 'Cat'
  },
  {
    question: 'What is your age',
    options: ['12', '13', '14', '15'],
    answer: '12'
  },
  {
    question: 'What is your favorite color',
    options: ['Red', 'Blue', 'Green', 'Yellow'],
    answer: 'Red'
  },
  {
    question: 'What is your favorite food',
    options: ['Pizza', 'Burger', 'Pasta', 'Noodles'],
    answer: 'Pizza'
  }
]


function GamePage() {
  return (

    <><Header header="Play" />

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
    </>
  )
}

export default GamePage