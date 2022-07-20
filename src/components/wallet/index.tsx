import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";

import { injected } from "./utils/connectors";
import {
  chainsMetadata,
  copyTextToClipboard,
  filterList,
  formatAccount,
  getBalanceFromAccount,
  getBalanceInOtherUnit,
  getErrorMessage,
} from "./utils/helpers";
import "../../shared/components/modal/modal.css";

import useChainId from "../../shared/hooks/useChainId";
import MyModal from "../../shared/components/modal";

import BackArrow from "assets/icons/back-arrow.svg";

const WalletButton = (props: any) => {
  const context = useWeb3React();

  const [walletError, setWalletError] = useState("");
  const [currentWalletArr, setCurrentWalletArr] = useState<any>([]);

  const [walletBalance, setWalletBalance] = useState<any>("");
  const [showAllAccounts, setShowAllAccounts] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const myChainId = parseInt(useChainId(), 16) || 97;

  //  Wallet conncection handlers

  const handleMetamaskConnect = async () => {
    try {
      await context.activate(injected, undefined, true);
      setIsOpen(false);
      localStorage.setItem("isWalletConnected", "true");
      props.onWalletConnect(true);
    } catch (error) {
      setWalletError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (context.active) {
    (async () => {
      const balanceInWei = await getBalanceFromAccount(context.account);
      const balanceInEth = await getBalanceInOtherUnit(balanceInWei);
      setWalletBalance(balanceInEth);
    })();
  }
  //   const handleCoinBaseWallet = async () => {
  //     try {
  //       await context.activate(walletlink, undefined, true);
  //       setConnectedAccounts((prev) => new Set(...prev).add("Coinbase"));
  //     } catch (error) {
  //       setWalletError(getErrorMessage(error));
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // Package Issue while opening walletConnect Modal
  // https://github.com/NoahZinsmeister/web3-react/issues/124#issuecomment-984882534

  //   const handleWalletConnect = useCallback(async () => {
  //     try {
  //       await context.activate(walletconnect, undefined, true);
  //       setConnectedAccounts((prev: any) =>
  //         new Set(...prev).add("WalletConnect")
  //       );
  //     } catch (error) {
  //       setWalletError(getErrorMessage(error));
  //       resetWalletConnector(walletconnect);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, [context.activate]);

  const dataSrc = [
    {
      name: "Metamask",
      imgSrc: "/metamask.png",
      onClick: handleMetamaskConnect,
    },
    // {
    //   name: "WalletConnect",
    //   imgSrc:
    //     "https://app.uniswap.org/static/media/walletConnectIcon.304e3277.svg",
    //   onClick: handleWalletConnect,
    // },
    // {
    //   name: "Coinbase",
    //   imgSrc:
    //     "https://app.uniswap.org/static/media/coinbaseWalletIcon.a3a7d7fd.svg",
    //   onClick: handleCoinBaseWallet,
    // },
  ];

  // Modal Handlers
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setWalletError("");
    setLoading(false);
    setCurrentWalletArr([]);
    setShowAllAccounts(true);
  }

  const handleWalletDisconnect = async () => {
    try {
      await context.deactivate();
      setIsOpen(false);
      props.onWalletConnect(false);
      localStorage.setItem("isWalletConnected", "false");
      // window.location.reload();
    } catch (ex) {
      console.error(ex);
    }
  };

  //  Helper Handlers

  const handleCopyTextClick = (e: any) => {
    e.preventDefault();
    copyTextToClipboard(context.account);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 500);
  };
  const handleBackButtonClick = () => {
    setShowAllAccounts(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleWalletChange = () => {
    setShowAllAccounts(false);
  };

  useEffect(() => {
    if (localStorage?.getItem("isWalletConnected") === "true") {
      handleMetamaskConnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="cta-buttonContainer">
        {context.active && (
          <span>
            {Number(walletBalance).toFixed(4)} &nbsp;
            {chainsMetadata[myChainId].tokenSymbol}
          </span>
        )}
        <button
          className={context.active ? "cta-button selected" : "cta-button"}
          onClick={openModal}
        >
          {context.active ? formatAccount(context!.account) : "Connect Wallet"}
        </button>
      </div>

      <MyModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        modalTitle={
          context.active ? (
            showAllAccounts ? (
              "Account"
            ) : (
              <>
                <img
                  onClick={handleBackButtonClick}
                  src={BackArrow}
                  alt="back icon"
                />
              </>
            )
          ) : (
            "Connect Wallet"
          )
        }
      >
        {/* Wallet loading */}
        {loading && (
          <button className="card" disabled>
            <div>{svgLoader}</div>
            <h3>Initializing ....</h3>
          </button>
        )}
        {/* Wallet Connect Error */}
        {walletError && (
          <button className="card" disabled>
            <h3 style={{ color: "red" }}>{walletError}</h3>
          </button>
        )}
        {/* Wallet select Initialization  */}
        {currentWalletArr!.length >= 1 &&
          // @ts-ignore
          filterList(dataSrc, currentWalletArr[0]).map((d) => (
            <React.Fragment key={d.name}>
              {!context.active && (
                <button
                  className="card"
                  onClick={() => {
                    d.onClick();
                    if (!context.active && !context.error) {
                      setLoading(true);
                    }
                    setCurrentWalletArr(d.name);
                  }}
                >
                  <h3>{d.name}</h3>
                  <img src={d.imgSrc} width="24px" height="24px" alt={d.name} />
                </button>
              )}
            </React.Fragment>
          ))}

        {/* ========================================= Wallet connected ========================================= */}

        {context.active && (
          <section className="connect-container">
            <div className="connect-container--header">
              <p>Connected with Metamask</p>
              {/* <button className="btn" onClick={handleWalletChange}>
                Change
              </button> */}

              {localStorage.getItem("isWalletConnected") === "true" && (
                <button className="btn" onClick={handleWalletDisconnect}>
                  Disconnect
                </button>
              )}
            </div>
            <div className="connect-container--body">
              <h1>{context.account && formatAccount(context.account)}</h1>
            </div>
            <div className="connect-container--footer">
              <button className="clearBtn" onClick={handleCopyTextClick}>
                {isCopied ? "Copied" : " Copy address"}
              </button>
              <a
                href={`${chainsMetadata[myChainId].explorerUrl}/${context.account}`}
                target="#blank"
                className="myLink"
              >
                View on explorer
              </a>
            </div>
          </section>
        )}

        {/* ========================================= Wallet connected ========================================= */}

        {(!showAllAccounts || (!context.active && !loading && !walletError)) &&
          dataSrc.map((d) => (
            <React.Fragment key={d.name}>
              <button
                className="card"
                onClick={() => {
                  d.onClick();
                  if (!context.active && !context.error) {
                    setLoading(true);
                  }
                  setCurrentWalletArr((currentWalletArr: any) => [
                    ...currentWalletArr,
                    d.name,
                  ]);
                }}
              >
                <div className="align-center">
                  {/* {connectedAccounts.has(d.name) ? connectedDot : null} */}
                  <h3>{d.name}</h3>
                </div>
                <img src={d.imgSrc} width="24px" height="24px" alt={d.name} />
              </button>
            </React.Fragment>
          ))}
      </MyModal>
    </div>
  );
};

export default WalletButton;

//
// ─── ELEMENTS ───────────────────────────────────────────────────────────────────
//

export const svgLoader = (
  <svg
    width="20px"
    height="118px"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke="#290908"
      strokeWidth="13"
      r="31"
      strokeDasharray="146.08405839192537 50.69468613064179"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
      ></animateTransform>
    </circle>
  </svg>
);

export const connectedDot = <div className="green-dot"></div>;
