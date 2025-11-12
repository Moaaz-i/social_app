import Loading from "../Loading/Loading";
import useLoading from "../../hooks/useLoading";

const LoadingWrapper = ({ children, loadingText = "Loading..." }) => {
  const { loading } = useLoading();

  return (
    <>
      {loading && <Loading text={loadingText} />}

      {children}
    </>
  );
};

export default LoadingWrapper;
