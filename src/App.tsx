import React from "react";
import "./App.css";
import { useFetch } from "react-async";

interface MyAppState {
  address: string;
  text: string;
  liquidity: { [key: string]: string };
}

const tokens: { [key: string]: { [key: string]: string } } = {
  eth: {
    weth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  matic: {
    weth: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    usdc: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  },
  avax: {
    weth: "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
    usdc: "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
  },
};

const dexes: { [key: string]: string } = {
  eth: "1inch2",
  matic: "matic_1inch",
  avax: "avax_traderjoexyz",
};

class LiquidityRefreshoor extends React.Component<
  { chain: string },
  { liquidity: string }
> {
  constructor(props: { chain: string }) {
    super(props);
    this.state = {
      liquidity: "",
    };
  }

  render() {
    return (
      <>
        {this.props.chain}
        <button onClick={() => this.handleRefreshLiquidity(this.props.chain)}>
          refresh
        </button>
        {this.state && this.state.liquidity ? this.state.liquidity : ""}
        <br />
      </>
    );
  }

  handleRefreshLiquidity(chain: string) {
    const params = {
      chain: chain,
      max_slippage: String(0.001),
      user_addr: "0x0000000000000000000000000000000000000000",
      receive_token_id: tokens[chain]["usdc"],
      pay_token_id: tokens[chain]["weth"],
      pay_token_amount: String(10 * 10 ** 18),
      dex_id: dexes[chain],
    };
    fetch("https://api.debank.com/swap/check?" + new URLSearchParams(params), {
      headers: { accept: "application/json" },
    })
      .then((res) => res.json())
      .then((j) => {
        this.setState({ liquidity: j.data.receive_token_amount });
      });
  }
}

class MyApp extends React.Component<{}, MyAppState> {
  state: MyAppState;
  constructor(props: {}) {
    // why do I need ": {}" after props?
    super(props);
    this.state = {
      address: "",
      text: "",
      liquidity: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <h3>Le App</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="new-todo">Input address:</label>
          <input
            id="new-todo"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button>Set</button>
          <br />
          <UserInfo address={this.state.address} />
        </form>
        <LiquidityRefreshoor chain="eth" />
        <LiquidityRefreshoor chain="matic" />
        <LiquidityRefreshoor chain="avax" />
      </div>
    );
  }

  handleChange(e: { target: { value: any } }) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (this.state.text.length === 0) {
      return;
    }
    this.setState((state) => ({
      address: state.text,
      text: "",
    }));
  }
}

function UserInfo({ address }: { address: string }) {
  // jfc wtf is this typing
  const { data } = useFetch(
    `https://openapi.debank.com/v1/user/total_balance?id=${address}`,
    { headers: { accept: "application/json" } }
  );

  if (data && typeof data === "object") {
    const dataObject = JSON.parse(JSON.stringify(data, null, 2)); // wtf parse + stringify
    return (
      <div>
        Your Address: {address}
        <br />
        <pre>{dataObject.total_usd_value}</pre>USD{" "}
      </div>
    );
  }
  return null;
}

function App() {
  return (
    <div className="App">
      <MyApp />
    </div>
  );
}

export default App;
