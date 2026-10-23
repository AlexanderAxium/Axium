import { Footer } from "@/components/Footer";
import GlobalNavbar from "@/components/GlobalNavbar";
import { Revelar } from "@/components/axium/revelar";
import { WhatsappFlotante } from "@/components/axium/whatsapp-flotante";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalNavbar />
      {children}
      <Footer />
      <WhatsappFlotante />
      <Revelar />
    </>
  );
}
