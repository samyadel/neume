import {Platform} from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesOffering
} from "react-native-purchases"
import React, {useState, useEffect} from "react"

const API_KEYS = {
  apple: "appl_gdzxRUEXANLaJFLIqJIgCvYwhmN",
  google: "goog_PudjIkYgOlELldCmYSXZGLWfEDQ"
}

const typesOfMembership = {
  monthly: "pro",
  yearly: "proYearly"
}

function useRevenueCat() {
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const isProMember = customerInfo?.entitlements.active.pro

  useEffect(() => {
    const fetchData = async() => {
      Purchases.setDebugLogsEnabled(true);

      if (Platform.OS == "android") {
        await Purchases.configure({apiKey: API_KEYS.google})
      } else {
        await Purchases.configure({apiKey: API_KEYS.apple})
      }

      const offerings = await Purchases.getOfferings();
      const customerInfo = await Purchases.getCustomerInfo();

      setCurrentOffering(offerings.current)
      setCustomerInfo(customerInfo)
    }

    fetchData().catch(console.error)
  }, [])

  useEffect(() => {
    const customerInfoUpdates = async (purchaserInfo: CustomerInfo) => {
      setCustomerInfo(purchaserInfo)
    }

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdates)
  }, [])

  return {currentOffering, customerInfo, isProMember}
}

export default useRevenueCat;