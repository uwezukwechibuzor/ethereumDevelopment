import React, { Component } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const tokenAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";


class App extends Component {
  constructor(props){  
    super(props);  
     this.state =  {
        greeting: '',
        userAccount: '',
        amount: 0
      }
}



 requestAccount = async () => {
   await window.ethereum.request({ method: 'eth_requestAccounts'});
 }


getBalance = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts'})
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
    const balance = await contract.balanceOf(account);
    console.log("balance: ", balance.toString());
  }
}

 sendCoins = async() => {
  if (typeof window.ethereum !== 'undefined') {
    await this.requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
    const transaction = await contract.transfer(this.state.userAccount, this.state.amount);
    await transaction.wait()
    console.log(this.state.amount  + 'Coins successfully sent to' + this.state.userAccount);
  }
}



  fetchGreeting = async() => {
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);

      try{

        const data = await contract.greet();
        console.log('data: ', data);

      } catch (err) {
        console.log("Error: ", err)
      }
    }
 }

 setGreeting = async () =>  {
    if (!this.state.greeting) return
    if (typeof window.ethereum !== 'undefined'){
      await this.requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(this.state.greeting)
      this.setState({greeting: ''})
      await transaction.wait()
      this.fetchGreeting()
      console.log(this.state.greeting)
    }
 }



  
  render() {
    return (
      <div className="App">
         <header className="App-header">
       <button onClick={() => this.fetchGreeting()}>Fetch Greeting</button>
       <br />
       <button onClick={() => this.setGreeting()}>Set Greeting</button>
       <br />
       <input
        onChange={(e) => this.setState({greeting: e.target.value})}
        placeholder="Set greeting"
        value={this.state.greeting}
       />
       </header>  
       <hr />
       <header className="App-header">
       <button onClick={() => this.getBalance()}>Get Balance</button>
       <br />
       <button onClick={() => this.sendCoins()}>Send Coins</button>
       <br />
       <input
        onChange={(e) => this.setState({userAccount: e.target.value})}
        placeholder="Account ID"
        value={this.state.userAccount}
       />  <input
        onChange={(e) => this.setState({amount: e.target.value})}
        placeholder="Amount"
      
       />
       </header>
      </div>
    );
  }
}

export default App;

 