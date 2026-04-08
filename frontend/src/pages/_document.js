

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Bootstrap Icons Global Link */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" 
        />
        
        {/* Agar koi Google Font bhi global rakhna ho to yahan daal sakte hain */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}