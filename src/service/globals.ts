export const getErrorMessage = (errorObj: any) => {
  let errorMessage;
  switch (true) {
    case errorObj.code === -32002:
      errorMessage =
        "A wallet request is already running. Please click on metamask extension and login.";
      break;
    case errorObj.code === 4001:
      errorMessage = "You rejected the transaction request";
      break;

    default:
      errorMessage = "Something went wrong";
      break;
  }
  return errorMessage;
};
