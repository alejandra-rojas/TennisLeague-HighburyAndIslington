import Link from "next/link";
import React from "react";

export default function Rules() {
  return (
    <main id="rules">
      <h2>RULES </h2>
      <div>
        <h3>
          ​The current league runs from
          <br /> Mon 7th August &apos;23 to Mon 29th January &apos;24 <br />
        </h3>
        <h4>Mid-way date: Mon 6th November &apos;23</h4>
      </div>

      <div className="rules-container">
        <div className="left-rules">
          <div className="column1">
            <div className="rule">
              <h5>Format</h5>
              <p>
                Each pair plays all other pairs in their division. Each pair is
                responsible for organising their own matches, agreeing dates
                with opponents, booking courts, etc.
              </p>
            </div>
            <div className="rule">
              <h5>Scoring</h5>
              <p>
                Best of 3 tiebreak sets. If time is short and both pairs agree,
                a championship tiebreak (first to 10, 2 points ahead) can be
                played instead of a 3rd set.
              </p>
            </div>
            {/* <div className="rule">
            <h5>Awarded Points</h5>
            <p>
              Two points per set & only completed sets count. If a match is
              unfinished only the completed sets will score and, if possible,
              another time should be arranged to finish the match.
            </p>
          </div> */}
            <div className="rule">
              <h5>Match Reports</h5>
              <p>
                Winners to report the results via email to{" "}
                <a href="mailto:HTCdoublesleagues@gmail.com">
                  HTCdoublesleagues@gmail.com
                </a>{" "}
                or using{" "}
                <Link href={"/report-results"}>
                  <span className="link">this form</span>.{" "}
                </Link>
                Please report the scores even if the match is unfinished.
              </p>
            </div>
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
          </div>
          <div className="column2">
            <div className="rule">
              <h5>Injuries</h5>
              <p>
                If a player is injured during play and unable to continue the
                match, they will concede that match and the points from the
                uncompleted set/s go to the other pair.
              </p>
            </div>
            <div className="rule">
              <h5>Withdrawals</h5>
              <p>
                If a pair has to withdraw from the league, all points won in
                matches against that pair will be deducted. Points awarded for
                completing three (or four) matches by the mid-way date will not
                be affected.
              </p>
            </div>
            <div className="rule">
              <h5>Winners</h5>
              <p>
                If there is a tie for top place at the end, set points are worth
                more than points earned for playing matches. If there is still a
                tie, the prize goes to the pair who won the match between the
                pairs concerned.
              </p>
            </div>
            <div className="rule">
              <h5>Prize</h5>
              <p>
                The prize for the winning pair in each division is a can of
                balls per player.
              </p>
            </div>
          </div>
        </div>
        <div className="right-rules">
          <div className="points">
            <h5>Awarded Points</h5>
            <p className="bold">
              Two points per set & only completed sets count. If a match is
              unfinished, if possible, arrange another time to finish the match.
            </p>
          </div>
          <div className="extra-points">
            <h6>Bonus Points </h6>
            <p className="secondary">
              An extra point is awarded if three matches (four matches for
              Division 3 or 4) against pairs in your division are completed by
              the mid-way date.
              <br /> Another point is awarded if you complete all matches in
              your division by the end date. Only completed matches count.
            </p>
          </div>
          <div className="extra-points">
            <h6>Challenger Matches </h6>
            <p className="secondary">
              It is possible to gain extra points by challenging pairs in the
              Division above to a match. Pairs in Division 1 can challenge pairs
              in Division 2. A point will be awarded to both the challengers and
              the challenged if a match goes ahead AND IS COMPLETED. The points
              won for sets will be 2 points per set for the pair in the lower
              division and 1 point per set for the pair in the higher division.
              If challenged, you do not have to accept.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
