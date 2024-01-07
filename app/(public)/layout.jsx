import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
//Components
import ClientNavbar from "@/app/components/ClientNavbar";
import "../styles/Public/styles.scss";

export default async function ClientLayout({ children }) {
  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });

  return (
    <ReactLenis root>
      <header id="web-header">
        <ClientNavbar />
      </header>
      {children}
    </ReactLenis>
  );
}
