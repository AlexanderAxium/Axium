import data from "~/data/cases/jcpingenieros.json";
import JcpingenierosContent from "./JcpingenierosContent";

export const metadata = {
  title: data.title,
  description: data.description,
};

export default function JcpingenierosPage() {
  return <JcpingenierosContent />;
}
