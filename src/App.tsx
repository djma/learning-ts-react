import React from 'react';
import './App.css';
import {useFetch} from "react-async"

interface TodoAppState {
  address: string,
  text: string
}

class TodoApp extends React.Component<{}, TodoAppState> {
  state: TodoAppState
  constructor(props: {}) { // why do I need ": {}" after props?
    super(props);
    this.state = { 
      address: '',
      text: ''
     };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <h3>Le App</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="new-todo">
            Input address:
          </label>
          <input
            id="new-todo"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button>
            Set
          </button>
          <br/>
        <UserInfo address={this.state.address} />
        </form>
      </div>
    );
  }

  handleChange(e: { target: { value: any; }; }) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    if (this.state.text.length === 0) {
      return;
    }
    this.setState(state => ({
      address: state.text,
      text: ''
    }));
  }
}

interface UserAddressProps {
  address: String
}

function UserInfo({address} : {address: string}) { // jfc wtf is this typing
  const { data, error, isLoading } = useFetch(`https://openapi.debank.com/v1/user/total_balance?id=${address}`, { headers: { accept: "application/json" } });

  if (data && typeof data === "object") {
    const dataObject = JSON.parse(JSON.stringify(data, null, 2)); // wtf parse + stringify
    return <div>Your Address: {address}<br/><pre>{dataObject.total_usd_value}</pre>USD </div>;
  }
  return null;
}


function App() {
  return (
    <div className="App">
      <TodoApp />
    </div>
  );
}

export default App;
