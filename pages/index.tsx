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
  getNetworkTokens,
} from "../constants/network-id";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { Token } from "../types/token.type";
import Metamask from './Metamask';
import axios from "axios";


const Home: NextPage = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>(
    {}
  );

  const getTokenBalance = async (
    tokenAddress: string,
    ownerAddress: string
  ) => {
    const abi = ["function balanceOf(address owner) view returns (uint256)"];
    const contract = new ethers.Contract(tokenAddress, abi, getProvider()!);
    return contract.balanceOf(ownerAddress);
  };

  const addTokenToWallet = async (token: Token) => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: token.address, // The address that the token is at.
            symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: token.decimals, // The number of decimals in the token
            image: token.imageUrl, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadAccountData = async () => {
    const addr = getWalletAddress();
    setAddress(addr);

    const chainId = await getChainId();
    setNetwork(chainId);

    const bal = await getBalance(addr);
    if (bal) setBalance(formatEther(bal));

    const tokenList = getNetworkTokens(chainId);

    const tokenBalList = await Promise.all(
      tokenList.map((token) =>
        getTokenBalance(token.address, addr).then((res) =>
          formatUnits(res, token.decimals)
        )
      )
    );

    tokenList.forEach((token, i) => {
      tokenBalances[token.symbol] = tokenBalList[i];
    });
    setTokenBalances({ ...tokenBalances });
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
///////////////////////////////////////////////////////
  const apinf = 'https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=0x5e223419084f5F89d14e61e6E7022f605dcA57a0';

  axios.get(apinf).then(response =>{
   const Data2 = response.data;
   console.log(Data2);
  })
///////////////////////////////////
 let api = '0x5e223419084f5F89d14e61e6E7022f605dcA57a0';
 const usdApu = [ 
//   function publicMint(uint8 numberOfTokens) external payable {
//     uint256 ts = supply.current();
//     require(balanceOf(msg.sender) + numberOfTokens <= 2, "balance with amount not corect");
//     require(isAllowMintActive, "Allow list is not active");
//     require(numberOfTokens > 0, "purchase not corect");
//     require(ts + numberOfTokens <= MAX_SUPPLY, "Purchase would exceed max tokens");
//     require(PRICE_PER_TOKEN * numberOfTokens <= msg.value, "Ether value sent is not correct");
    
//     for (uint256 i = 1; i <= numberOfTokens; i++) {
//         uint256 tokenID = ts + i;
//         _safeMint(msg.sender, tokenID);
//         _setTokenURI( tokenID, string(abi.encodePacked(uriPrefix, Strings.toString(tokenID), uriSuffix)));
//         supply.increment();
//     }
// }
  ]


  ///////////////////////////////
  return (
    <div className='bg-[#32363D]'>

      <div >
        {address ? (
          // <div >
          //   <div>
          //     <div className='bg-[#00A3AC]  p-3 '>
          //       <div className="font-serif text-4xl italic font-normal text-back-700 ">NFT EVENT</div>
          //       {/* <button className="p-2 font-serif text-back  outline outline-offset-1 text-back-700  outline-[#32363D]   drop-shadow-xl absolute top-3 right-6 transition ease-in-out delay-150 bg-[#A0D2CD] hover:-translate-y-1 hover:scale-110 hover:bg-[#00A3AC] duration-300" onClick={connectWallet}>Connect Wallet</button> */}
          //     </div>

          //     <div className='  '>
          //       <div className=' py-8 '>
          //         <div className=' py-8 text-center font-serif text-white text-2xl  text-back-700'>
          //           1 / 50
          //         </div>
          //         <div className="flex justify-center my-12'">
          //           <img className="rounded-lg border-4 box-content box-center  h-96 object-scale-down bg-white bg-center  " src="/ioi.png">
          //           </img>
          //         </div>
          //         <div className='flex justify-center my-12'>
          //           <button className=" w-32 h-20 rounded-lg font-serif text-back-700  outline outline-offset-1 text-xl outline-[#32363D] border-4 text-center transition ease-in-out delay-150 bg-[#A0D2CD] hover:-translate-y-1 hover:scale-110 hover:bg-[#00A3AC] duration-300 ">
          //             buy
          //           </button>
          //         </div>
          //       </div>
          //     </div>
          //   </div>

          // </div>
          <div >
          <div className="bg-cyan-800 h-20 ">
            <button className="font-serif text-4xl italic font-normal text-back-700 inline-block m-4">NFT EVENT</button>
            
          </div>
          <p>Your wallet address is {address}</p>
          <p>
            Current network is {getNetworkName(network)} ({network})
          </p>
          <p>
            Your balance is {balance} {getNetworkCurrency(network)}
          </p>
    
        </div>
        ) :
          (
            <div>
              <div className='bg-[#00A3AC]  p-3 '>
                <div className="font-serif text-4xl italic font-normal text-back-700 ">NFT EVENT</div>
                <button className="p-2 font-serif text-back  outline outline-offset-1 text-back-700  outline-[#32363D]   drop-shadow-xl absolute top-3 right-6 transition ease-in-out delay-150 bg-[#A0D2CD] hover:-translate-y-1 hover:scale-110 hover:bg-[#00A3AC] duration-300" onClick={connectWallet}>Connect Wallet</button>
              </div>

              <div className='  '>
                <div className=' py-8 '>
                  <div className=' py-8 text-center font-serif text-white text-2xl  text-back-700'>
                    1 / 50
                  </div>
                  <div className="flex justify-center my-12'">
                    <img className="rounded-lg border-4 box-content box-center  h-96 object-scale-down bg-white bg-center  " src="/ioi.png">
                    </img>
                  </div>
                  <div className='flex justify-center my-12'>
                    <div className=" w-32 h-20 rounded-lg font-serif text-back-700  outline outline-offset-1  text-xl outline-[#32363D] ">

                    </div>
                  </div>
                </div>
              </div>
              {/* <Metamask /> */}
            </div>


          )

        }

      </div>

    


    </div>


  )
}

export default Home

