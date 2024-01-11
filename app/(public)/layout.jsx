//Components
import ClientNavbar from "@/app/components/ClientNavbar";
import "../styles/Public/styles.scss";
import Footer from "../components/Footer";
import Link from "next/link";

export default async function ClientLayout({ children }) {
  return (
    <>
      <span className="back-clubsite">
        <Link
          href={"https://www.highburytennisclub.com/"}
          aria-label="Go to the Highbury Tennis Club Website"
        >
          Go to the Highbury Tennis Club Website
        </Link>
      </span>
      <header id="web-header">
        <ClientNavbar />
      </header>
      {children}

      <Footer />
    </>
  );
}
