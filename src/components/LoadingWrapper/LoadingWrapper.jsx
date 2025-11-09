import React from "react";
import Loading from "../Loading/Loading";
import useLoading from "../../hooks/useLoading";

const LoadingWrapper = ({ children, loadingText = "Loading..." }) => {
  const { loading } = useLoading();
  console.log(loading);

  return (
    <>
      {loading && <Loading text={loadingText} />}

      {children}
    </>
  );
};

export default React.memo(LoadingWrapper);
