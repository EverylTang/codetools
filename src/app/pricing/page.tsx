import { notFound } from "next/navigation";

export const metadata = {
  title: "Not Found - CodeTools",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PricingPage() {
  notFound();
}
