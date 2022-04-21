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
const contractAddress = "0x4AB72dA161d8b40f52E8f45cAEB13Cb46f890B35";

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
            You must connect your wallet first 
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
  <h2 id="title" className="font-bold text-2xl">🍔 Fast Food Moonbirds</h2>
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


        <div className="relative mt-16 sm:mt-24 lg:mt-28">
          <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="lg:col-start-2">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-4xl">Fast Food Moonbirds</h1>

              <p className="mt-4 mb-6 text-lg text-gray-200">
              A boutique collection of 4,000 PFPs that feature traits based on the beloved Fast Food Bear Market meme. 
              </p>
       <p className="font-bold mt-2 mb-5" id="status">
       🍟 0.01Ξ/mint 🥤 Max 5 mints/tx
      </p>


      <div className="text-center block mb-4 no_selection">
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
        className="inline-flex items-center px-8 py-6 border border-transparent text-xl font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"      >
        Mint Fast Food Moonbirds
      </button>   

      <p className="text-sm mt-5">Pssst...the first 1000 mints are <span className="font-black">free</span> if you know how to mint from <a className="text-purple-400" href="">contract</a></p>


      <p className="mt-3">
        {status}
      </p>    

      <div className="flex justify-center items-center mt-10">
<a href="https://etherscan.io" className="py-5 px-3">
<svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 293.775 293.667">
  <g id="etherscan-logo-light-circle" transform="translate(-219.378 -213.333)">
    <path id="Path_1" data-name="Path 1" d="M280.433,353.152A12.45,12.45,0,0,1,292.941,340.7l20.737.068a12.467,12.467,0,0,1,12.467,12.467v78.414c2.336-.692,5.332-1.43,8.614-2.2a10.389,10.389,0,0,0,8.009-10.11V322.073a12.469,12.469,0,0,1,12.467-12.47h20.779a12.47,12.47,0,0,1,12.467,12.47v90.276s5.2-2.106,10.269-4.245a10.408,10.408,0,0,0,6.353-9.577V290.9a12.466,12.466,0,0,1,12.465-12.467h20.779A12.468,12.468,0,0,1,450.815,290.9v88.625c18.014-13.055,36.271-28.758,50.759-47.639a20.926,20.926,0,0,0,3.185-19.537,146.6,146.6,0,0,0-136.644-99.006c-81.439-1.094-148.744,65.385-148.736,146.834a146.371,146.371,0,0,0,19.5,73.45,18.56,18.56,0,0,0,17.707,9.173c3.931-.346,8.825-.835,14.643-1.518a10.383,10.383,0,0,0,9.209-10.306V353.152" transform="translate(0 0)" fill="#fff"/>
    <path id="Path_2" data-name="Path 2" d="M244.417,398.641A146.808,146.808,0,0,0,477.589,279.9c0-3.381-.157-6.724-.383-10.049-53.642,80-152.686,117.405-232.79,128.793" transform="translate(35.564 80.269)" fill="#bfcfda"/>
  </g>
</svg>
</a>
              <a href="https://opensea.io" className="py-5 px-3">

              <svg className="w-8 h-8" viewBox="0 0 90 90" fill="#BFCFDA" xmlns="http://www.w3.org/2000/svg">
<path d="M45 0C20.151 0 0 20.151 0 45C0 69.849 20.151 90 45 90C69.849 90 90 69.849 90 45C90 20.151 69.858 0 45 0ZM22.203 46.512L22.392 46.206L34.101 27.891C34.272 27.63 34.677 27.657 34.803 27.945C36.756 32.328 38.448 37.782 37.656 41.175C37.323 42.57 36.396 44.46 35.352 46.206C35.217 46.458 35.073 46.71 34.911 46.953C34.839 47.061 34.713 47.124 34.578 47.124H22.545C22.221 47.124 22.032 46.773 22.203 46.512ZM74.376 52.812C74.376 52.983 74.277 53.127 74.133 53.19C73.224 53.577 70.119 55.008 68.832 56.799C65.538 61.38 63.027 67.932 57.402 67.932H33.948C25.632 67.932 18.9 61.173 18.9 52.83V52.56C18.9 52.344 19.08 52.164 19.305 52.164H32.373C32.634 52.164 32.823 52.398 32.805 52.659C32.706 53.505 32.868 54.378 33.273 55.17C34.047 56.745 35.658 57.726 37.395 57.726H43.866V52.677H37.467C37.143 52.677 36.945 52.299 37.134 52.029C37.206 51.921 37.278 51.813 37.368 51.687C37.971 50.823 38.835 49.491 39.699 47.97C40.284 46.944 40.851 45.846 41.31 44.748C41.4 44.55 41.472 44.343 41.553 44.145C41.679 43.794 41.805 43.461 41.895 43.137C41.985 42.858 42.066 42.57 42.138 42.3C42.354 41.364 42.444 40.374 42.444 39.348C42.444 38.943 42.426 38.52 42.39 38.124C42.372 37.683 42.318 37.242 42.264 36.801C42.228 36.414 42.156 36.027 42.084 35.631C41.985 35.046 41.859 34.461 41.715 33.876L41.661 33.651C41.553 33.246 41.454 32.868 41.328 32.463C40.959 31.203 40.545 29.97 40.095 28.818C39.933 28.359 39.753 27.918 39.564 27.486C39.294 26.82 39.015 26.217 38.763 25.65C38.628 25.389 38.52 25.155 38.412 24.912C38.286 24.642 38.16 24.372 38.025 24.111C37.935 23.913 37.827 23.724 37.755 23.544L36.963 22.086C36.855 21.888 37.035 21.645 37.251 21.708L42.201 23.049H42.219C42.228 23.049 42.228 23.049 42.237 23.049L42.885 23.238L43.605 23.436L43.866 23.508V20.574C43.866 19.152 45 18 46.413 18C47.115 18 47.754 18.288 48.204 18.756C48.663 19.224 48.951 19.863 48.951 20.574V24.939L49.482 25.083C49.518 25.101 49.563 25.119 49.599 25.146C49.725 25.236 49.914 25.38 50.148 25.56C50.337 25.704 50.535 25.884 50.769 26.073C51.246 26.46 51.822 26.955 52.443 27.522C52.605 27.666 52.767 27.81 52.92 27.963C53.721 28.71 54.621 29.583 55.485 30.555C55.728 30.834 55.962 31.104 56.205 31.401C56.439 31.698 56.7 31.986 56.916 32.274C57.213 32.661 57.519 33.066 57.798 33.489C57.924 33.687 58.077 33.894 58.194 34.092C58.554 34.623 58.86 35.172 59.157 35.721C59.283 35.973 59.409 36.252 59.517 36.522C59.85 37.26 60.111 38.007 60.273 38.763C60.327 38.925 60.363 39.096 60.381 39.258V39.294C60.435 39.51 60.453 39.744 60.471 39.987C60.543 40.752 60.507 41.526 60.345 42.3C60.273 42.624 60.183 42.93 60.075 43.263C59.958 43.578 59.85 43.902 59.706 44.217C59.427 44.856 59.103 45.504 58.716 46.098C58.59 46.323 58.437 46.557 58.293 46.782C58.131 47.016 57.96 47.241 57.816 47.457C57.609 47.736 57.393 48.024 57.168 48.285C56.97 48.555 56.772 48.825 56.547 49.068C56.241 49.437 55.944 49.779 55.629 50.112C55.449 50.328 55.251 50.553 55.044 50.751C54.846 50.976 54.639 51.174 54.459 51.354C54.144 51.669 53.892 51.903 53.676 52.11L53.163 52.569C53.091 52.641 52.992 52.677 52.893 52.677H48.951V57.726H53.91C55.017 57.726 56.07 57.339 56.925 56.61C57.213 56.358 58.482 55.26 59.985 53.604C60.039 53.541 60.102 53.505 60.174 53.487L73.863 49.527C74.124 49.455 74.376 49.644 74.376 49.914V52.812V52.812Z" />
</svg>
</a>
</div>       



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
