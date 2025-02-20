import { injected, useAccount, useConnect } from "wagmi";
import { Legend } from "./components/Legend";
import { Game } from "./Game";

function App() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();

  return (
    <>
      <div className="app">
        {isConnected ? (
          <>
            <div className="container">
              <header className="header">
                <h1 className="title">Bots Attack</h1>
              </header>

              <div className="boards-container">
                <div className="board-section">
                  <Game />
                </div>
              </div>
              <Legend />
            </div>
          </>
        ) : (
          <div className="connect-container">
            <button className="button" onClick={() => connect({ connector: injected() })}>
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
