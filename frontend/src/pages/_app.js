import { useEffect } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../../public/assets/css/boxicons.min.css";
import "../../public/assets/css/bootstrap-icons.css";
import "../../public/assets/css/style.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <Script
        src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"
        strategy="afterInteractive"
      />

      {getLayout(<Component {...pageProps} />)}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        pauseOnHover={false}
      />
    </>
  );
}

export default MyApp;
