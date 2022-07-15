import type { NextPage } from "next";
import * as ethers from "ethers";
// import * as web3 from "web3";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getBalance,
  getChainId,
  getEthereum,
  getProvider,
  getWalletAddress,
} from "../services/wallet-service";
import { formatEther, formatUnits, Logger } from "ethers/lib/utils";

import axios from "axios";
import abi_contract from "../ABI_CONTRACT/abi.json";

const Home: NextPage = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);


  const [nameToken, setNameToken] = useState<string | null>(null);
  const [maxSupply, setMaxSupply] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [currentSupply, setCurrentSupply] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const addr_contract = "0x866C800F1B873e56356C4AC14Fe576F26a77d1B8";
  const linkOpenSea = "https://testnets.opensea.io/collection/finevent";

  const getTokenBalance = async (
    tokenAddress: string,
    ownerAddress: string
  ) => {
    const contract = new ethers.Contract(
      tokenAddress,
      abi_contract,
      getProvider()!
    );
    return contract.balanceOf(ownerAddress);
  };
  const getNameToken = async () => {
    const contract = new ethers.Contract(
      addr_contract,
      abi_contract,
      getProvider()!
    );
    return contract.name();
  };
  const getMaxSupply = async () => {
    const contract = new ethers.Contract(
      addr_contract,
      abi_contract,
      getProvider()!
    );
    return contract.MAX_SUPPLY();
  };
  const getCurrentSupply = async () => {
    const contract = new ethers.Contract(
      addr_contract,
      abi_contract,
      getProvider()!
    );
    return contract.supply();
  };

  const handlerPublicMint = async () => {
    const addr = getWalletAddress();
    setAddress(addr);
    const chainId = await getChainId();
    setNetwork(chainId);

    const tokenBalance = await getTokenBalance(addr_contract, addr).then(
      (res) => formatUnits(res, 0)
    );
    // console.log(tokenBalance);

    const provider = getProvider()!;
    const signer = provider.getSigner();

    if (Number(tokenBalance) + 1 > 2) {
      setStatus("you already have 2 Tickets. ");
    } else {

      const contract = new ethers.Contract(addr_contract, abi_contract, signer);
      const txResponse = await contract
        .publicMint(1, {
          value: ethers.utils.parseEther("0.01"),
          // gasPrice: 300000,
          // gasLimit: 9000000,
        })
        .then((res: any) => {
          console.log(`Transaction hash1: ${res.hash}`);
          setTxHash(`https://rinkeby.etherscan.io/tx/${res.hash}`);
          (document as any).getElementById(
            "myAnchor"
          ).href = `https://rinkeby.etherscan.io/tx/${res.hash}`;
        });

    }
  };
  const loadAccountData = async () => {


    const addr = getWalletAddress();
    setAddress(addr);
    const chainId = await getChainId();
    setNetwork(chainId);

    const name = await getNameToken();
    setNameToken(name);
    // console.log(name);

    const maxSupply = await getMaxSupply().then((res) => formatUnits(res, 0));
    setMaxSupply(maxSupply);
    // console.log(maxSupply);

    const currentSup = await getCurrentSupply().then((res) =>
      formatUnits(res, 0)
    );
    setCurrentSupply(currentSup);
    // console.log(currentSup);

    if (addr) {
      const tokenBalances = await getTokenBalance(addr_contract, addr).then(
        (res) => formatUnits(res, 0)
      );
      console.log(tokenBalances);
    }


  };
  useEffect(() => {
    const interval = setInterval(async () => {
      const numberCounter = await getCurrentSupply().then((res) =>
        formatUnits(res, 0)
      );
      console.log(txHash);
      setCurrentSupply(numberCounter);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentSupply]);

  useEffect(() => {
    loadAccountData();
    setStatus(null);
    const handleAccountChange = (addresses: string[]) => {
      setAddress(addresses[0]);
      setTxHash(null);
      setStatus(null);
      loadAccountData();
    };
    
    const handleNetworkChange = (networkId: string) => {
      setNetwork(networkId);
      setTxHash(null);
      setStatus(null);
      loadAccountData();
    };

    getEthereum()?.on("accountsChanged", handleAccountChange);

    getEthereum()?.on("chainChanged", handleNetworkChange);
  }, []);

  return (
    <div className="bg-[#002368]">
      <div>
        <div className="bg-[#000937] p-3 rounded-t-lg  rounded-[30px]">
          {/* <img className="font-serif text-4xl italic font-normal text-back-700 " src="../public/fin-logo.png"/> */}
          <div className="p-2 flex pl-6 ">
            <img src="/fin-logo.png" className="mr-3 h-6 sm:h-7 lg:h-12" />
            <div>
              <p className="self-center lg:text-4xl  font-serif whitespace-nowrap dark:text-white sm: text-sm">
                FinEvent
              </p>
            </div>
          </div>

          {address ? (
            <div className="p-4 font-serif text-back text-white outline outline-offset-1 text-back-700 sm: text-sm  outline-[#00A8E8] rounded-lg  drop-shadow-xl absolute top-3 right-6 transition ease-in-out delay-150 bg-[#00A8E8 hover:-translate-y-1 hover:scale-110 hover:bg-[#4E9CE3] duration-300">
              {address}
            </div>
          ) : (
            <button
              className="p-4  font-serif text-back text-white outline outline-offset-1 text-back-700 sm: text-sm outline-[#00A8E8] rounded-lg  drop-shadow-xl absolute top-3 right-6 transition ease-in-out delay-150 bg-[#00A8E8 hover:-translate-y-1 hover:scale-110 hover:bg-[#4E9CE3] duration-300"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
        {address ? (
          <div className="  ">
            <div className="flex justify-center py-4">

            <div className=" py-8 text-center font-serif text-white text-2xl  text-back-700">
              {nameToken}
            </div>
              <a href={linkOpenSea} target="_blank" className="px-4 py-4"><img src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-White.svg" width="55" height="5" /></a>
            </div>
            <div className=" py-2 flex justify-center  ">
              <div className=" py-8 box-content border-solid h-80 w-96 p-4  border-2 bg-origin-padding rounded-lg  bg-gradient-to-r from-cyan-500 to-blue-500">
                <img
                  className=" bg-origin-padding rounded-full h-80 w-96 "
                  src="ticket2.png"
                  onClick={handlerPublicMint}
                ></img>
                </div>
            </div>
            <div className="flex justify-center">

            </div>
            
            <div className=" text-center font-serif text-white text-2xl  text-back-700">
                <div className=" py-10  "></div>
              <div>contract address: {addr_contract}</div>
              <div className=" py-8 text-center font-serif text-white text-2xl  text-back-700">
                {currentSupply}/{maxSupply}
              </div>
              <div className="flex justify-center my-12'">
                <button
                  className="p-2 font-serif text-back  outline outline-offset-1 text-back-700  outline-[#32363D]    drop-shadow-x transition ease-in-out delay-150 bg-[#2759ff] hover:-translate-y-1 hover:scale-110 hover:bg-[#7972cb]"
                  onClick={handlerPublicMint}
                >
                  MINT
                </button>
              </div>
              <div className="text-center text-red-700">{status}</div>
              <div className=" py-10  "></div>
              <a id="myAnchor" href="" className="text-center text-red-700">
                {txHash}
              </a>
            </div>
            <div className=" py-20  "></div>
            <div className=" py-10  "></div>
            <div className=" py-20  "></div>
            <div className=" py-10  "></div>
          </div>
        ) : (
          <div className=" py-8 box-content content-none ">
            <div className=" py-8  self-center lg:text-4xl flex justify-center font-serif whitespace-nowrap dark:text-white sm: text-sm">
              Please connect wallet...
            </div>

            <div className=" py-8 flex justify-center  ">
              <div className=" py-8 box-content border-solid h-80 w-96 p-4  border-2 bg-origin-padding rounded-lg  bg-gradient-to-r from-cyan-500 to-blue-500">
                <img
                  className=" bg-origin-padding rounded-full h-80 w-96 "
                  src="ticket2.png"
                  onClick={connectWallet}
                ></img>
              </div>
            </div>
            <div className=" py-20  "></div>
            <div className=" py-10  "></div>
            <div className=" py-20  "></div>
            <div className=" py-10  "></div>
          </div>
        )}
      </div>
    </div>

  );
};
export default Home;
