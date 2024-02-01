"use client";
import "../styles/Root.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <nav id="admin-primary-navigation">
      <ul>
        <li className={isActive("/admin") ? "active" : ""}>
          <Link href={"/admin"}>Leagues</Link>
        </li>
        <li className={isActive("/admin/players") ? "active" : ""}>
          <Link href={"/admin/players"}>Players</Link>
        </li>
        <li className={isActive("/admin/teams") ? "active" : ""}>
          <Link href={"/admin/teams"}>Teams</Link>
        </li>
      </ul>
    </nav>
  );
}
