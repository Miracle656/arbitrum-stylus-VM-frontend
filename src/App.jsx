import { useState } from 'react'
import './App.css'
import { ethers } from 'ethers'

function App() {
  const [userAddress, setUserAddress] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [coffeeBalance, setCoffeeBalance] = useState(0)
  const [transactionStatus, setTransactionStatus] = useState("")
  const [connectButtonText, setConnectButtonText] = useState("connect wallet")


  const abi = [
    "function giveCoffeeTo(address user_address) external returns (bool)",

    "function getCoffeeBalanceFor(address user_address) external view returns (uint256)"
  ]


  const contractAddress = "0x88a455f486628f1be661e3e140401ba94ff671bd"

  const connectWallet = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {
          setUserAddress(result[0])
          setConnectButtonText("wallet connected")
        })

    } else {
      console.log("metamask not installed")
    }
  }


  const getCoffeeBalance = async () => {
    try {
      let provider = new ethers.BrowserProvider(window.ethereum);
      let signer = await provider.getSigner();
      let contract = new ethers.Contract(contractAddress, abi, signer);
      contract.getCoffeeBalanceFor(customerAddress)
        .then(result => {
          setCoffeeBalance(Number(result))
        })
    } catch (error) {
      console.error("Error fetching balance")
      alert("inputbox must not be blank")
    }
  }

  const giveCoffee = async () => {
    try{
      let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(contractAddress, abi, signer)
    setTransactionStatus("Waiting for confirmation")
    contract.giveCoffeeTo(customerAddress)
      .then(result => {
        setTransactionStatus(`Transaction confirmed`)
      })
    }catch (error) {
      console.error("Unable to distribute coffe, try again later")
    }
  }

  return (
    <>
      <h1>Vending Machine</h1>
      <div>
        <button onClick={connectWallet}>{connectButtonText}</button>
        <p>Address: {userAddress}</p>
      </div>
      <div>
        <input style={{
          marginRight: '1rem',
          padding: '.5rem'
        }} type="text" placeholder="Enter user address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
        <button onClick={getCoffeeBalance}>Get Coffee Balance</button>
        <p>Coffee Balance: {coffeeBalance}</p>
      </div>
      <div>
        <button onClick={giveCoffee}>Give Coffee</button>
        <p>{transactionStatus}</p>
      </div>
    </>
  )
}

export default App
