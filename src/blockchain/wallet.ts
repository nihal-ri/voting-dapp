import { toast } from "react-toastify";
import Web3 from "web3";
import { getErrorMessage } from "../service/globals";
import { electionContractAddress } from "./constants";
import { electionAbi } from "./contracts/electionAbi";

const web3 = new Web3(Web3.givenProvider);

export const getAllAccounts = async () => {
  try {
    if ((window as any).ethereum) {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      return accounts;
    } else {
      console.error("Please install metamask extension");
      // toast.error("Please install MetaMask extension");
    }
  } catch (error) {
    console.log("metamask error", error);
    toast.error(getErrorMessage(error));
  }
};

export const getWalletAddress = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    return accounts[0];
  } catch (error) {
    console.log("getWalletAddress Error", error);
  }
};
//
// ─── CONTRACTS INSTANCES ────────────────────────────────────────────────────────
//

const electionInstance = new web3.eth.Contract(
  // @ts-ignore
  electionAbi,
  electionContractAddress
);

//
// ──────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C O N T R A C T   M E T H O D S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────
//

export const voteForCandidate = async (walletAddr: string, voterId: number) => {
  const voteSuccess = await electionInstance.methods
    .vote(voterId)
    .send({ from: walletAddr });

  console.log("voteSuccess=====>", voteSuccess);

  return voteSuccess;
};
export const getCandidateDetails = async (voterId: number) => {
  return await electionInstance.methods.candidatesList(voterId).call();
};
export const isVoted = async (address: string) => {
  return await electionInstance.methods.alreadyvotedList(address).call();
};
