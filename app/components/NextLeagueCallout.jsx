"use client";
import React, { useState, useEffect } from "react";
import { getHomepage } from "../../sanity/sanity-queries";

function NextLeagueCallout() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const homepageData = await getHomepage();
      setData(homepageData);
    };

    fetchData();
  }, []);

  return (
    <div className="accent-container ">
      <div className="accent">
        <div className="text">{data.next_league}</div>
      </div>
    </div>
  );
}

export default NextLeagueCallout;
