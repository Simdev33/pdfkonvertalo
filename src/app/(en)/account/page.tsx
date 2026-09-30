import { PageContent, pageMetadata } from "@/components/pages";

export const metadata = pageMetadata("en", "account");

export default function Page() {
  return <PageContent locale="en" page="account" />;
}
