import "../styles/Root.scss";
import Link from "next/link";
import React from "react";

export default function AdminNavbar() {
  return (
    <nav id="admin-primary-navigation">
      <ul>
        <li>
          <Link href={"/admin"}>Leagues</Link>
        </li>
        <li>
          <Link href={"/admin/players"}>Players</Link>
        </li>
        <li>
          <Link href={"/admin/teams"}>Teams</Link>
        </li>
      </ul>
    </nav>
  );
}
