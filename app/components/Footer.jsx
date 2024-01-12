"use client";
import React from "react";
import MenuBtnMobile from "./MenuBtnMobile";

function Footer() {
  return (
    <>
      <div className="accent-container ">
        <div className="accent">
          <div className="text">
            The next league will run from Mon 7th Aug to Mon 29th Jan 2024. Join
            in!
          </div>
        </div>
      </div>
      <footer>
        <div className="baseline"></div>
        <div className="center-line"></div>

        <div className="questions">
          <h5>Any questions?</h5>
          <p>
            Get in touch with Sarah Mulligan, <br /> Co-ordinator of the Women's
            League.
          </p>
        </div>

        {/* <MenuBtnMobile /> */}
      </footer>
    </>
  );
}

export default Footer;
