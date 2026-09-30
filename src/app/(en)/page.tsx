import { PageContent, pageMetadata } from "@/components/pages";

export const metadata = pageMetadata("en", "converter");

export default function Page() {
  return <PageContent locale="en" page="converter" />;
}
