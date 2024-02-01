"use client";
import "../../styles/Admin/Leagues.scss";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SecondaryAdminNav({ setShowModal }) {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;

  return (
    <section id="leagues-layout-header">
      <a href="#leaguescontent" className="sr-only">
        Skip to leagues section content
      </a>
      <section id="admin-secondary-navigation-leagues">
        <nav aria-labelledby="admin-secondary-navigation-leagues-label">
          <div
            id="admin-secondary-navigation-leagues-label"
            className="sr-only"
          >
            Navigation for Leagues Section
          </div>
          <ul>
            <li
              className={isActive("/admin") ? "active" : ""}
              aria-label="Go to ongoing leagues page"
            >
              <Link href={"/admin"}>Current</Link>
            </li>
            <li className={isActive("/admin/past-leagues") ? "active" : ""}>
              <Link
                href={"/admin/past-leagues"}
                aria-label="Go to finished leagues page"
              >
                Finished
              </Link>
            </li>

            {isActive("/admin") && (
              <li>
                <a onClick={() => setShowModal(true)} className="create-league">
                  <PlusCircleIcon width={35} />
                  <span>
                    New <span className="">league</span>
                  </span>
                </a>
              </li>
            )}
          </ul>
        </nav>
      </section>
    </section>
  );
}

export default SecondaryAdminNav;
