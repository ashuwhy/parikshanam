import RazorpayCheckout from 'react-native-razorpay';

export type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type OpenOpts = {
  orderId: string;
  keyId: string;
  amountPaise: number;
  businessName: string;
  description: string;
  prefillName?: string;
  prefillEmail?: string;
  prefillContact?: string;
};

export function openRazorpayCheckout(opts: OpenOpts): Promise<RazorpaySuccess> {
  const options = {
    description: opts.description,
    image: undefined as string | undefined,
    currency: 'INR',
    key: opts.keyId,
    amount: String(opts.amountPaise),
    name: opts.businessName,
    order_id: opts.orderId,
    prefill: {
      email: opts.prefillEmail ?? '',
      contact: opts.prefillContact ?? '',
      name: opts.prefillName ?? '',
    },
    theme: { color: '#4F46E5' },
  };

  return RazorpayCheckout.open(options) as Promise<RazorpaySuccess>;
}
