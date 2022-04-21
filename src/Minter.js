import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { connectWallet,
         getCurrentWalletConnected
        } from "./utils/interact.js"
import contract from './contracts/FastFoodMoonbirds.json';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import moonbirds from './moonbirds.png';

const abi = contract.abi;
const contractAddress = "0x4058D91bbB7AD014Ba656d66e8586B5BeD20d025";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [mintAmount, setMintAmount] = useState(1);
 
  useEffect(async () => { 
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);
    addWalletListener();
  }, []);

  const connectWalletPressed = async () => { 
   const walletResponse = await connectWallet();
   setStatus(walletResponse.status);
   setWallet(walletResponse.address);
  };

  const onMintPressed = async () => { //TODO: implement
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Intialize payment");
        let nftTxn = await nftContract.mint(mintAmount, {value: ethers.utils.parseEther(String(0.01*mintAmount))});
        console.log("Minting...please wait");
        setStatus("Minting...please wait");
        await nftTxn.wait();
        console.log(`minted, see transaction at: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setStatus(`Minted!`);
      }
      else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must connect your wallet!
          </a>
        </p>
      );
    }
  }

  return (
    <div className="Minter">
    


<div className="py-16 overflow-hidden">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
      <Navbar>
  <h1 id="title" className="font-bold text-2xl">🍔 Fast Food Moonbirds</h1>
  <button id="walletButton" onClick={connectWalletPressed}
  type="button"
  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
>
    {walletAddress.length > 0 ? (
      "Connected: " +
      String(walletAddress).substring(0, 6) +
      "..." +
      String(walletAddress).substring(38)
    ) : (
      <span>Connect Wallet</span>
    )}
  </button>
</Navbar>

        {/* <div className="relative">
          <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to send money
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in,
            accusamus quisquam.
          </p>
        </div> */}

        <div className="relative mt-16 sm:mt-24 lg:mt-28">
          <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="lg:col-start-2">
              <h3 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Fast Food Moonbirds</h3>
              <p className="mt-3 mb-6 text-lg text-gray-200">
              A boutique collection of 4,000 PFPs that feature traits based on the beloved Fast Food Bear Market meme. 
              </p>
       <p className="font-bold mt-2 mb-5" id="status">
        0.01ETH/mint. First 1000 mints free when you mint from the <a className="text-purple-400" href="">contract</a>
      </p>


      <div className="text-center block">
              <div className="align-content" style={{ display: "inline-block", margin: "0 20px 0 0" }}>
                <div className="inline-block text-2xl font-bold px-1 py-1 bg-tan-200 rounded-full" style={{ cursor: "pointer", display: "inline-block", margin: "0 15px" }} onClick={() => {if (mintAmount>1) {setMintAmount(mintAmount - 1)}}}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <div className="inline-block bg-tan-100 px-1 pb-2 mb-4 text-4xl font-bold" style={{ display: "inline-block" }}><p className="h-6 pb-4">{mintAmount}</p></div>
                <div className="red inline-block bg-tan-200 px-1 py-1 text-2xl font-bold rounded-full" style={{ cursor: "pointer", display: "inline-block", margin: "0 15px" }} onClick={() => {if (mintAmount<5) {setMintAmount(mintAmount + 1)}}}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
      </div>

      <button onClick={onMintPressed}
        type="button"
        className="inline-flex items-center px-7 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"      >
        Mint Fast Food Moonbirds
      </button>   

      <p className="mt-3">
        {status}
      </p>           



            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">

              <img
                className="relative mx-auto"
                width={500}
                src={moonbirds}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>

      <br></br>
      

</div>

  );
};

export default Minter;
