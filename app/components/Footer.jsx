"use client";
import { useRect } from "@studio-freight/hamo";
import { useRef } from "react";

function Footer() {
  const ref = useRef();
  const [rectRef, rect] = useRect();

  return (
    <>
      <div ref={rectRef} className="footer">
        <div className="accent-container ">
          <div className="accent">
            <div className="text">
              The next league will run from Mon 7th Aug to Mon 29th Jan 2024.
              Join in!
            </div>
          </div>
        </div>
        <footer>
          <div className="baseline"></div>
          <div className="center-line"></div>

          <div className="questions">
            <h5>Any questions?</h5>
            <p>
              Get in touch with Sarah Mulligan, <br /> Co-ordinator of the
              Womens League.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Footer;
