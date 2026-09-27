import { ConverterApp } from "@/components/converter/converter-app";
import { ConverterLanding } from "@/components/landing/converter-landing";

export default function Home() {
  return <ConverterApp landing={<ConverterLanding />} />;
}
