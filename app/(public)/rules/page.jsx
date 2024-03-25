"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import NextLeagueCallout from "../../components/public/NextLeagueCallout";
import { getRules } from "../../../sanity/sanity-queries";

export default function Rules() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const rulespageData = await getRules();
      setData(rulespageData);
    };

    fetchData();
  }, []);

  //console.log(data);

  const column = {
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const item = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <main id="rules">
      <motion.div
        className="header-container"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: "easeIn" }}
      >
        <h2>RULES </h2>
        <div>
          <h3>
            ​The current league runs from
            <br /> {data.Current} <br />
          </h3>
          <h4>Mid-way date: {data.Midway}</h4>
        </div>
      </motion.div>

      <div className="rules-container">
        <div className="left-rules">
          <motion.div
            className="column1"
            initial="hidden"
            animate="visible"
            variants={column}
          >
            <motion.div className="rule" variants={item}>
              <h5>Format</h5>
              <p>{data.format}</p>
            </motion.div>
            <motion.div className="rule" variants={item}>
              <h5>Scoring</h5>
              <p>{data.scoring}</p>
            </motion.div>
            {/* <div className="rule">
            <h5>Awarded Points</h5>
            <p>
              Two points per set & only completed sets count. If a match is
              unfinished only the completed sets will score and, if possible,
              another time should be arranged to finish the match.
            </p>
          </div> */}
            <motion.div className="reports" variants={item}>
              <h5>Match Reporting</h5>
              <p>
                Winners to report the results to{" "}
                <a href="mailto:HTCdoublesleagues@gmail.com">
                  HTCdoublesleagues@gmail.com
                </a>{" "}
                and the scores will be entered on this website.
              </p>{" "}
              <p className="bold">
                Please report the scores even if the match is unfinished.
              </p>
            </motion.div>
            {/* <div className="rule">
            <h5>Bonus Points </h5>
            <p>
              
              An extra point is awarded if three matches (four matches if you
              are in Division 3 or 4) against pairs in your division are
              completed by the mid-way date and another point is awarded if you
              complete all matches in your division by the end date. Only
              completed matches count.
            </p>
          </div> */}
            {/* <div className="rule">
            <h5>Challenger Matches </h5>
            <p>
              It is possible to gain extra points by challenging pairs in the
              Division above to a match. Pairs in Division 1 can challenge pairs
              in Division 2. A point will be awarded to both the challengers and
              the challenged if a match goes ahead AND IS COMPLETED. The points
              won for sets will be 2 points per set for the pair in the lower
              division and 1 point per set for the pair in the higher division.
              If challenged, you do not have to accept.
            </p>
          </div> */}
          </motion.div>
          <motion.div
            className="column2"
            initial="hidden"
            animate="visible"
            variants={column}
          >
            <motion.div className="rule" variants={item}>
              <h5>Injuries</h5>
              <p>{data.injuries}</p>
            </motion.div>
            <motion.div className="rule" variants={item}>
              <h5>Withdrawals</h5>
              <p>{data.withdrawals}</p>
            </motion.div>
            <motion.div className="rule" variants={item}>
              <h5>Winners</h5>
              <p>{data.winners}</p>
            </motion.div>
            <motion.div className="rule" variants={item}>
              <h5>Prize</h5>
              <p>{data.prize}</p>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="right-rules"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeIn" }}
        >
          <div className="points">
            <h5>Awarded Points</h5>
            <p className="bold">{data.points}</p>
          </div>
          <div className="extra-points">
            <h6>Bonus Points </h6>
            <p className="secondary">{data.bonusPoints}</p>
          </div>
          <div className="extra-points">
            <h6>Challenger Matches </h6>
            <p className="secondary">{data.challengers}</p>
          </div>
        </motion.div>
      </div>
      <NextLeagueCallout />
    </main>
  );
}
