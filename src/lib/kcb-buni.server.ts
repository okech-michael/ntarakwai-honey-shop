export interface KcbMpesaPushInput {
  amount: number;
  phone: string;
  orderNumber: string;
  description?: string;
}

export interface KcbCardPaymentInput {
  amount: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
}

export interface KcbPaymentResult {
  ok: boolean;
  checkoutRequestID?: string;
  merchantRequestID?: string;
  redirectUrl?: string;
  message: string;
}

export interface KcbCallbackPayload {
  ResultCode?: number;
  ResultDesc?: string;
  CheckoutRequestID?: string;
  MerchantRequestID?: string;
  OrderNumber?: string;
  TransactionID?: string;
  Amount?: number;
  Status?: string;
  Body?: {
    stkCallback?: {
      ResultCode?: number;
      ResultDesc?: string;
      CheckoutRequestID?: string;
      MerchantRequestID?: string;
    };
  };
}

function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return `254${digits}`;
}

export async function getKcbBuniAccessToken(): Promise<string | null> {
  const baseUrl = process.env.KCB_BUNI_BASE_URL || "https://uat.buni.kcbgroup.com";
  const appKey = process.env.KCB_BUNI_APP_KEY;
  const appSecret = process.env.KCB_BUNI_APP_SECRET;

  if (!appKey || !appSecret) {
    return null;
  }

  try {
    const authHeader = Buffer.from(`${appKey}:${appSecret}`).toString("base64");
    const response = await fetch(`${baseUrl}/token?grant_type=client_credentials`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`KCB Buni auth returned status ${response.status}:`, errText);
      return null;
    }

    const data = (await response.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch (error) {
    console.error("Error acquiring KCB Buni access token:", error);
    return null;
  }
}

export async function initiateKcbMpesaPush({ amount, phone, orderNumber, description }: KcbMpesaPushInput): Promise<KcbPaymentResult> {
  const baseUrl = process.env.KCB_BUNI_BASE_URL || "https://uat.buni.kcbgroup.com";
  const shortCode = process.env.KCB_BUNI_SHORTCODE || "522533";
  const passKey = process.env.KCB_BUNI_PASSKEY;
  const callbackUrl = process.env.KCB_BUNI_CALLBACK_URL || "http://localhost:3000/api/kcb/callback";
  const formattedPhone = normalizePhone(phone);

  const token = await getKcbBuniAccessToken();

  if (!token) {
    return {
      ok: false,
      message: "KCB Buni authentication failed. Please verify KCB_BUNI_APP_KEY and KCB_BUNI_APP_SECRET in environment variables.",
    };
  }

  if (!passKey) {
    return {
      ok: false,
      message: "KCB Buni passkey is missing. Please configure KCB_BUNI_PASSKEY in environment variables.",
    };
  }

  try {
    const stkPushEndpoint = process.env.KCB_BUNI_STK_ENDPOINT || `${baseUrl}/mm/api/request/1.0.0/stkpush`;
    const messageId = `NTK_KCB_${Date.now()}`;
    const isShared = process.env.KCB_BUNI_SHARED_SHORTCODE !== "false";

    const response = await fetch(stkPushEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        accept: "application/json",
        routeCode: process.env.KCB_BUNI_ROUTE_CODE || "207",
        operation: process.env.KCB_BUNI_OPERATION || "STKPush",
        messageId,
      },
      body: JSON.stringify({
        phoneNumber: formattedPhone,
        amount: String(Math.round(amount)),
        invoiceNumber: orderNumber,
        sharedShortCode: isShared,
        orgShortCode: isShared ? "" : (process.env.KCB_BUNI_ORG_SHORTCODE || shortCode),
        orgPassKey: isShared ? "" : (process.env.KCB_BUNI_ORG_PASSKEY || passKey || ""),
        callbackUrl: callbackUrl,
        transactionDescription: description || `Ntarakwai Honey Order ${orderNumber}`,
      }),
    });

    const bodyText = await response.text();
    if (!response.ok) {
      console.error(`[KCB_BUNI][STK_ERROR] HTTP ${response.status}:`, bodyText);
      let customerMsg = "We couldn't connect to the M-PESA payment service. Please try again shortly.";
      if (bodyText.includes("Invalid PhoneNumber") || bodyText.includes("Invalid MSISDN")) {
        customerMsg = "Please check your M-PESA phone number and try again.";
      } else if (bodyText.includes("SUSPENDED") || response.status >= 500) {
        customerMsg = "M-PESA payment is temporarily unavailable. Please try again shortly.";
      }
      return {
        ok: false,
        message: customerMsg,
      };
    }

    interface BuniStkResponseData {
      header?: { statusCode?: string; statusDescription?: string };
      response?: {
        CheckoutRequestID?: string;
        MerchantRequestID?: string;
        ResponseDescription?: string;
        CustomerMessage?: string;
      };
      CheckoutRequestID?: string;
      MerchantRequestID?: string;
      ResponseDescription?: string;
      CustomerMessage?: string;
    }

    const data = JSON.parse(bodyText) as BuniStkResponseData;
    const checkoutRequestID = data.response?.CheckoutRequestID ?? data.CheckoutRequestID;
    const merchantRequestID = data.response?.MerchantRequestID ?? data.MerchantRequestID;
    const message = data.response?.CustomerMessage ?? data.response?.ResponseDescription ?? data.CustomerMessage ?? data.ResponseDescription ?? data.header?.statusDescription ?? "KCB Buni M-PESA STK Push sent successfully.";

    console.log(`[KCB_BUNI][STK_ACCEPTED] order=${orderNumber} checkoutId=${checkoutRequestID}`);

    return {
      ok: true,
      checkoutRequestID,
      merchantRequestID,
      message,
    };
  } catch (error) {
    console.error("[KCB_BUNI][STK_EXCEPTION]:", error);
    return {
      ok: false,
      message: "We couldn't connect to the payment service. Please check your network and try again.",
    };
  }
}

export async function initiateKcbCardPayment({ amount, orderNumber, customerEmail, customerName }: KcbCardPaymentInput): Promise<KcbPaymentResult> {
  const baseUrl = process.env.KCB_BUNI_BASE_URL || "https://uat.buni.kcbgroup.com";
  const merchantCode = process.env.KCB_BUNI_MERCHANT_CODE || "NTARAKWAI_STORE";
  const callbackUrl = process.env.KCB_BUNI_CALLBACK_URL || "http://localhost:3000/api/kcb/callback";

  const token = await getKcbBuniAccessToken();

  if (!token) {
    return {
      ok: false,
      message: "KCB Buni authentication failed. Please verify KCB_BUNI_APP_KEY and KCB_BUNI_APP_SECRET in environment variables.",
    };
  }

  try {
    const response = await fetch(`${baseUrl}/buni/v1/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        MerchantCode: merchantCode,
        OrderNumber: orderNumber,
        Amount: Math.round(amount),
        Currency: "KES",
        CustomerName: customerName,
        CustomerEmail: customerEmail,
        CallbackUrl: callbackUrl,
        ReturnUrl: `${callbackUrl}/return?order=${orderNumber}`,
      }),
    });

    const bodyText = await response.text();
    if (!response.ok) {
      return {
        ok: false,
        message: `KCB Buni Card Gateway error (${response.status}): ${bodyText}`,
      };
    }

    const data = JSON.parse(bodyText) as { CheckoutRequestID?: string; PaymentUrl?: string; Message?: string };
    return {
      ok: true,
      checkoutRequestID: data.CheckoutRequestID,
      redirectUrl: data.PaymentUrl,
      message: data.Message || "KCB Buni Card payment session created.",
    };
  } catch (error) {
    console.error("KCB Buni Card Checkout error:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to initiate KCB Buni Card Checkout.",
    };
  }
}

