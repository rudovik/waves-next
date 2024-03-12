"use client"

import { PayPalScriptProvider } from "@paypal/react-paypal-js"

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "Ac-eLEgnrdGnZ5Jw_nxzjcp5siC8NXrTSkxr-OA4jpzefywkUemTXZU_F-FDZGJwA2TUOHTKXdbmBX2_",
        currency: "USD",
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}
