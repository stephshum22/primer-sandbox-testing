import React from 'react';
import Head from 'next/head';
import CheckoutPage from '../components/CheckoutPage';

export default function Home() {
  return (
    <>
      <Head>
        <title>Primer Checkout Sandbox</title>
        <meta name="description" content="Primer sandbox checkout implementation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CheckoutPage />
      </main>
    </>
  );
}
