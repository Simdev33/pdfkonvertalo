import { PageContent, pageMetadata } from "@/components/pages";

export const metadata = pageMetadata("hu", "privacy");

export default function Page() {
  return <PageContent locale="hu" page="privacy" />;
}
