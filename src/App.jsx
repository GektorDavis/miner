import './App.css';
import Board from './Components/Board/board';

function App() {
  const setupData = {
    width: 16,
    height: 16,
    mines: 40,
  };
  return (
    <>
      <div className="App">
        <Board setupData={setupData} />
      </div>
    </>
  );
}

export default App;
