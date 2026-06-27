export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our menu, add items to your cart, and complete checkout with your name, phone, and delivery address. You'll choose a delivery slot and can pay online (demo mode) or cash on delivery.",
  },
  {
    question: "What are your delivery areas?",
    answer:
      "We deliver across Bangalore. Delivery fees depend on your pincode — free delivery applies on orders above ₹999. Enter your address at checkout to see the exact fee.",
  },
  {
    question: "How fresh are the treats?",
    answer:
      "Every brownie and cookie is baked fresh to order. We don't keep pre-made stock — your order goes into the oven after you place it.",
  },
  {
    question: "What is the shelf life?",
    answer:
      "Brownies stay fresh for 3–4 days at room temperature or up to a week refrigerated. Cookies are best within 5–7 days in an airtight container. For peak taste, enjoy within 2–3 days.",
  },
  {
    question: "Do you list allergens?",
    answer:
      "All our treats are made without eggs. They contain wheat and dairy (butter, cream cheese, and similar). Some items include nuts (pistachio, hazelnuts) or chocolate. If you have allergies, mention them in the order notes and we'll confirm before baking.",
  },
  {
    question: "Can I schedule delivery?",
    answer:
      "Yes. At checkout you pick a delivery date and time slot — morning, afternoon, or evening. Order before 6 PM for next-day delivery.",
  },
  {
    question: "How does payment work on this demo site?",
    answer:
      "This portfolio site uses mock payments for demonstration. You can simulate UPI or card payment, or choose cash on delivery. No real money is charged. A production deployment would use Razorpay or similar.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes. Use the Track order page with your order number and phone number to see live status updates — from confirmed to out for delivery.",
  },
  {
    question: "Do you offer gift messages?",
    answer:
      "Absolutely. Add an optional gift message and occasion at checkout. We'll include it with your delivery.",
  },
  {
    question: "How do I contact you?",
    answer:
      "WhatsApp us at +91 9176880130 or email thetatreats@gmail.com. You can also DM us on Instagram @theta_treats.",
  },
];
