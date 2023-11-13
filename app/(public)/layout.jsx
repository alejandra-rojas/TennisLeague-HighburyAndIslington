//Components
import ClientNavbar from "@/app/components/ClientNavbar";
import "../styles/Public/styles.scss";

export default async function ClientLayout({ children }) {
  return (
    <>
      <header id="web-header">
        <ClientNavbar />
      </header>
      {children}
    </>
  );
}
