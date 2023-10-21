import "../styles/Root.scss";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function LoginNavbar({ user }) {
  console.log(user);
  return (
    <div className="logout-banner-admin">
      {user && <span>Hello {user.email} </span>}
      <LogoutButton />
    </div>
  );
}
