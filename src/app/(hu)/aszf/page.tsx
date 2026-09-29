import { PageContent, pageMetadata } from "@/components/pages";

export const metadata = pageMetadata("hu", "terms");

export default function Page() {
  return <PageContent locale="hu" page="terms" />;
}
