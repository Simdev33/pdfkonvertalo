import { PageContent, pageMetadata } from "@/components/pages";

export const metadata = pageMetadata("hu", "converter");

export default function Page() {
  return <PageContent locale="hu" page="converter" />;
}
