import "../styles/globals.scss";
import Layout from "../components/layout";
import ShowsState from "../components/context/Shows/showsState";
import AlertsState from "../components/context/Alerts/alertsState";
import Head from "next/head";


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#e21e39" />
        <meta name="msapplication-TileColor" content="#b91d47" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <ShowsState>
        <AlertsState>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AlertsState>
      </ShowsState>
    </>
  );
}

export default MyApp;
