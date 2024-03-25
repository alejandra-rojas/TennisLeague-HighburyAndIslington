const rules = {
  name: "rules",
  title: "Rules",
  type: "document",
  fields: [
    { name: "Current", type: "Current League Dates", type: "string" },
    { name: "Midway", type: "Midway Date", type: "string" },
    { name: "format", title: "Format", type: "string" },
    { name: "scoring", title: "Scoring", type: "string" },
    { name: "injuries", title: "Injuries", type: "string" },
    { name: "withdrawals", title: "Withdrawals", type: "string" },
    { name: "winners", title: "Winners", type: "string" },
    { name: "prize", title: "Prizes", type: "string" },
    { name: "points", title: "Points", type: "string" },
    { name: "bonusPoints", title: "Bonus Points", type: "string" },
    { name: "challengers", title: "Challenger Matches", type: "string" },
  ],
};

export default rules;
