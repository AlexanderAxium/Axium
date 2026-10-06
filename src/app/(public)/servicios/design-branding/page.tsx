import { BrandDesignPage } from "~/components/axium/brand-design-page";
import { SERVICES } from "~/data/services-data";

const data = SERVICES["design-branding"]!;

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function Page() {
  return <BrandDesignPage />;
}
