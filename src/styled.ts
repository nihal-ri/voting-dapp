import styled, { keyframes } from "styled-components";

export const ElectionCont = styled.main`
  font-family: sans-serif;

  margin-top: 100px;
  min-width: 80vw;
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
`;

export const CenterText = styled.div`
  align-self: center;
  font-weight: 900;
  font-size: 32px;
`;
export const CardCont = styled.main`
  font-family: sans-serif;
  border: 2px solid;
  justify-self: center;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr max-content;
  align-items: stretch;
  padding: 20px;
  min-height: 250px;
  border-radius: 10px;

  button {
    cursor: pointer;
    margin-top: 20px;
    display: block;
    width: 100%;
    padding: 6px 16px;
    border-radius: 10px;
    box-shadow: none;

    &:disabled {
      cursor: not-allowed;
    }
  }
`;

export const Heading = styled.h1`
  font-weight: 900;
  font-size: 32px;
`;

export const SubHeading = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

export const LoaderCont = styled.div`
  min-height: 200px;
  display: grid;

  place-content: center;

  ${SubHeading} {
    margin-top: 40px;
  }
`;
const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

export const LoaderImg = styled.img`
  display: block;
  animation: ${spin} 0.8s linear infinite;
  max-width: 100%;
  height: 100%;
`;
