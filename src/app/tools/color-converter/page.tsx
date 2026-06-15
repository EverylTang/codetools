import ToolLayout from "@/components/ToolLayout";
import ColorConverterClient from "./client";

export const metadata = {
  title: "Color Converter - HEX to RGB to HSL Online",
  description: "Free online color converter. Convert between HEX, RGB, HSL, HSV, and CMYK color formats. Real-time preview with color swatch. Perfect for web designers and developers.",
  keywords: ["color converter", "hex to rgb", "rgb to hex", "hex to hsl", "color picker", "color format converter", "在线颜色转换", "颜色格式转换"],
  openGraph: {
    title: "Color Converter - Free Online Color Format Tool",
    description: "Convert between HEX, RGB, HSL, HSV, and CMYK instantly. Real-time color preview. 100% client-side.",
    type: "website",
  },
};

export default function ColorConverterPage() {
  return (
    <ToolLayout toolKey="color-converter" title="Color Converter" description="Convert between HEX, RGB, HSL, HSV, and CMYK color formats. Real-time preview swatch. All processing happens client-side.">
      <ColorConverterClient />
    </ToolLayout>
  );
}