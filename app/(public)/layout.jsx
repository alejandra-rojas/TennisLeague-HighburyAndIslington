//Components
import ClientNavbar from "../components/ClientNavbar";
import "../styles/Public/styles.scss";
import Footer from "../components/Footer";
import Link from "next/link";

export default async function ClientLayout({ children }) {
  return (
    <>
      <div className="back-clubsite">
        <Link
          href={"https://www.highburytennisclub.com/"}
          aria-label="Go to the Highbury Tennis Club Website"
        >
          To the Highbury Tennis Club Website
        </Link>
      </div>
      <header id="web-header">
        <ClientNavbar />
      </header>
      {children}

      <Footer />
    </>
  );
}
