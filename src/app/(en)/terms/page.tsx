import { PageContent, pageMetadata } from "@/components/pages";

export const metadata = pageMetadata("en", "terms");

export default function Page() {
  return <PageContent locale="en" page="terms" />;
}
