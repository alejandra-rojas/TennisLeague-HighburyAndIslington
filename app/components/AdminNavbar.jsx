import "../styles/Root.scss";
import Link from "next/link";
import React from "react";

export default function AdminNavbar() {
  return (
    <nav id="admin-primary-navigation">
      <ul>
        <Link href={"/admin"}>Leagues</Link>
        <Link href={"/admin/players"}>Players</Link>
        <Link href={"/admin/teams"}>Teams</Link>
      </ul>
    </nav>
  );
}
