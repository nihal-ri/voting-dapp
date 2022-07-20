import Confetti from "react-confetti";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import * as electionService from "./blockchain/wallet";
import WalletButton from "./components/wallet";

import { SharedBox, ErrorText } from "./shared/components/styled";
import { AppWrapper } from "./theme";

import {
  CardCont,
  CenterText,
  ElectionCont,
  Heading,
  LoaderCont,
  LoaderImg,
  SubHeading,
} from "./styled";
import MyModal from "shared/components/modal";
import Loader from "assets/icons/loader.svg";

const App = () => {
  const [myAccount, setMyAccount] = useState<any>("");

  const [candidateOneVotes, setCandidateOneVotes] = useState(0);
  const [candidateTwoVotes, setCandidateTwoVotes] = useState(0);
  const [isVoted, setVoted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // ─── STATE FOR HANDLING UI ────────────────────────────────────────────────

  const [showConfetti, setShowConfetti] = useState(false);

  // ─── EVENT HANDLERS ───────────────────────────────────────────────────────────────────

  const getWalletAddress = async () => {
    const account = await electionService.getWalletAddress();
    setMyAccount(account);
  };

  // ─── FORM LOGIC (start) ─────────────────────────────────────────────────────────────────

  // ────────────────────────────────────────────────────────────── I ──────────
  //   :::::: U S E - E F F E C T S console.log("details=====>", details); : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────

  const getVotesOfCandidate = async (voterId: number) => {
    const details = await electionService.getCandidateDetails(voterId);
    return details.voteCount;
  };

  const checkIfVoted = async (addr: string) => {
    const voteBool = await electionService.isVoted(addr);

    console.log("voteBool=====>", voteBool);
    if (voteBool) {
      setVoted(true);
    }
  };

  useEffect(() => {
    getWalletAddress();

    // if ((window as any).ethereum) {
    //   (window as any).ethereum.on("accountsChanged", (newAccounts: any) => {
    //     if (newAccounts.length > 0) {
    //       setMyAccount(newAccounts);
    //     }
    //   });
    // }

    (async () => {
      const votes1 = await getVotesOfCandidate(1);
      setCandidateOneVotes(votes1);
      const votes2 = await getVotesOfCandidate(2);
      setCandidateTwoVotes(votes2);
    })();
  }, [candidateOneVotes, candidateTwoVotes]);

  useEffect(() => {
    console.log("myAccount=====>", myAccount);
    checkIfVoted(myAccount);
  }, [myAccount]);

  useEffect(() => {
    checkIfVoted(myAccount);
  }, [candidateOneVotes, candidateTwoVotes]);

  // ──────────────────────────────────────────────────────────────────────────────────────────────────  ──────────
  //   :::::: I M P L E M E N T I N G   C O N T R A C T   M E T H O D S : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────────────────────────────────────────
  //

  const voteForCandidateOne = async () => {
    if (myAccount) {
      try {
        setShowModal(true);
        const voteSuccess = await electionService.voteForCandidate(
          myAccount,
          1
        );
        setShowConfetti(true);

        const votes1 = await getVotesOfCandidate(1);
        setCandidateOneVotes(votes1);

        setTimeout(() => {
          setShowConfetti(false);
        }, 10000);
        console.log("voteSuccess1=====>", voteSuccess);
      } catch (error) {
        console.log("error=====>", error);
      } finally {
        setShowModal(false);
      }
    }
  };
  const voteForCandidateTwo = async () => {
    if (myAccount) {
      try {
        setShowModal(true);
        const voteSuccess = await electionService.voteForCandidate(
          myAccount,
          2
        );
        setShowConfetti(true);
        const votes2 = await getVotesOfCandidate(2);
        setCandidateTwoVotes(votes2);

        setTimeout(() => {
          setShowConfetti(false);
        }, 10000);
        console.log("voteSuccess1=====>", voteSuccess);
      } catch (error) {
        console.log("error=====>", error);
      } finally {
        setShowModal(false);
      }
    }
  };

  //
  // ─── JSX RENDER STARTS HERE ─────────────────────────────────────────────────────
  //'

  return (
    <React.Fragment>
      <SharedBox direction="row" justify="end" style={{ margin: "0 0 10px 0" }}>
        {/* {Nav} */}
        <WalletButton onWalletConnect={setIsWalletConnected} />
      </SharedBox>

      {/* <SharedFeedbackButton
        as="a"
        href=""
        target="_blank"
      >
        Feedback
      </SharedFeedbackButton> */}
      <AppWrapper>
        {showConfetti && <Confetti numberOfPieces={700} />}

        <ElectionCont>
          <CardCont>
            <Heading>Candidate 1</Heading>

            <SubHeading>Total votes: {candidateOneVotes}</SubHeading>

            <ErrorText>
              {isWalletConnected &&
                isVoted &&
                "You have already casted your vote."}
            </ErrorText>

            <button disabled={isVoted} onClick={() => voteForCandidateOne()}>
              Vote
            </button>
          </CardCont>

          <CenterText>VS</CenterText>

          <CardCont>
            <Heading>Candidate 2</Heading>
            <SubHeading>Total votes: {candidateTwoVotes}</SubHeading>
            <ErrorText>
              {isWalletConnected &&
                isVoted &&
                "You have already casted your vote."}
            </ErrorText>

            <button disabled={isVoted} onClick={() => voteForCandidateTwo()}>
              Vote
            </button>
          </CardCont>
        </ElectionCont>

        {showModal && (
          <MyModal modalIsOpen={showModal}>
            <LoaderCont>
              <LoaderImg src={Loader} alt="loader icon" />

              <SubHeading>Casting your vote</SubHeading>
            </LoaderCont>
          </MyModal>
        )}
      </AppWrapper>
    </React.Fragment>
  );
};

export default App;
