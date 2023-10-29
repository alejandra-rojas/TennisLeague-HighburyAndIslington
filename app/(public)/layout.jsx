//Components
import ClientNavbar from "@/app/components/ClientNavbar";

export default async function ClientLayout({ children }) {
  return (
    <>
      <ClientNavbar />
      {children}
    </>
  );
}
