import React, { useState } from 'react';
import Head from 'next/head';
import ProductPage from '../components/ProductPage';

export default function Home() {
  return (
    <>
      <Head>
        <title>Primer Checkout Sandbox - Product Store</title>
        <meta name="description" content="Test Primer payments with our beautiful product store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://sdk.primer.io/web/v2.57.3/Checkout.css" />
      </Head>
      <main>
        <ProductPage />
      </main>
    </>
  );
}