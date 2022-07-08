import type { NextPage } from "next";
import * as ethers from "ethers";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getBalance,
  getChainId,
  getEthereum,
  getProvider,
  getWalletAddress,
} from "../services/wallet-service";
import {
  getNetworkCurrency,
  getNetworkName,
} from "../constants/network-id";
import { formatEther, formatUnits } from "ethers/lib/utils";
import abi_contract from "../ABI_CONTRACT/abi.json";


const mint = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [nameToken, setNameToken] = useState<string | null>(null);
  const [maxSupply, setMaxSupply] = useState<string | null>(null);
  const [currentSupply, setCurrentSupply] = useState<string | null>(null);

  const addr_contract = "0x5e223419084f5F89d14e61e6E7022f605dcA57a0";
  const getTokenBalance = async (
    tokenAddress: string,
    ownerAddress: string
  ) => {
    const contract = new ethers.Contract(tokenAddress, abi_contract, getProvider()!);
    return contract.balanceOf(ownerAddress);
  };

  let testaddress = "";
  if (address != null) {
    testaddress = address.substring(0, 5) + "..." + address.substring(38, 42);

  }

  const getNameToken = async () => {
    const contract = new ethers.Contract(addr_contract, abi_contract, getProvider()!);
    return contract.name();
  }
  const getMaxSupply = async () => {
    const contract = new ethers.Contract(addr_contract, abi_contract, getProvider()!);
    return contract.MAX_SUPPLY();
  }
  const getCurrentSupply = async () => {

    const contract = new ethers.Contract(addr_contract, abi_contract, getProvider()!);
    return contract.supply();
  }
  const sentpublicMint = async (
    payableAmount: string, //(ether)
    numberOfTokens: string //(uint8)
  ) => {
    const contract = new ethers.Contract(addr_contract, abi_contract, getProvider()!);

    const provider = getProvider()!;
    const signer = await provider.getSigner();
    const options = { value: ethers.utils.parseEther("0.01") }
    const txResponse = await contract.connect(signer).publicMint(1);
    await txResponse.wait()
  }
  const handlerPublicMint = async () => {
    const provider = getProvider()!;
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(addr_contract, abi_contract, signer);


    const txResponse = await contract.publicMint(1, { value: ethers.utils.parseEther("0.01") })
    await txResponse.wait()


  }
  const loadAccountData = async () => {
    const addr = getWalletAddress();
    setAddress(addr);
    const chainId = await getChainId();
    setNetwork(chainId);

    const tokenBalance = await getTokenBalance(addr_contract, addr).then((res) =>
      formatUnits(res, 0)
    )
    console.log(tokenBalance)

    const name = await getNameToken()
    setNameToken(name)
    console.log(name)


    const maxSupply = await getMaxSupply().then((res) =>
      formatUnits(res, 0)
    )
    setMaxSupply(maxSupply)
    console.log(maxSupply)

    const currentSup = await getCurrentSupply().then((res) =>
      formatUnits(res, 0)
    )
    setCurrentSupply(currentSup)
    console.log(currentSup)

  };

  useEffect(() => {
    loadAccountData();

    const handleAccountChange = (addresses: string[]) => {
      setAddress(addresses[0]);
      loadAccountData();
    };

    const handleNetworkChange = (networkId: string) => {
      setNetwork(networkId);
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
          <div className="font-serif text-white text-4xl italic font-normal text-back-700 ">
            FinEvent
          </div>

          {address ? (
            <div className="p-2 font-serif text-back text-white outline outline-offset-1 text-back-700  outline-[#002368] rounded-lg  drop-shadow-xl absolute top-3 right-6 transition ease-in-out delay-150 bg-[#00A8E8 hover:-translate-y-1 hover:scale-110 hover:bg-[#4E9CE3] duration-300">
              {testaddress}

            </div>
          ) : (
            <button
              className="p-2 font-serif text-back text-white outline outline-offset-1 text-back-700  outline-[#002368] rounded-lg  drop-shadow-xl absolute top-3 right-6 transition ease-in-out delay-150 bg-[#00A8E8 hover:-translate-y-1 hover:scale-110 hover:bg-[#4E9CE3] duration-300"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>

          )
          }

        </div>

        {address ? (
          <div className="  ">
            <div className=" py-8 ">
              <div className=" py-5 text-center font-serif text-white text-2xl  text-back-700">
                {nameToken}
              </div>
              <div className=" py-5 text-center font-serif text-white text-2xl  text-back-700">
                {currentSupply}/{maxSupply}
              </div>
              {/* <div className="flex justify-center my-12'">
                    <img className="rounded-lg border-4 box-content box-center  h-96 object-scale-down bg-white bg-center  " src="/ticket2.png">
                    </img>
                  </div> */}
              <div className="flex justify-center my-12'">

                <button
                  className="p-5 font-serif text-back  outline outline-offset-1 text-back-700  outline-[#32363D]    drop-shadow-x transition ease-in-out delay-150 bg-[#2759ff] hover:-translate-y-1 hover:scale-110 hover:bg-[#7972cb]"
                  onClick={handlerPublicMint}
                >
                  MINT
                </button>

              </div>
            </div>
          </div>
        ) : (
          <div className=' py-8 '>


          </div>


        )
        }



      </div>


    </div>



  );
};

export default mint;
