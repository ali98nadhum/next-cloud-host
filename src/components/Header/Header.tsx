import Link from "next/link";
import module from "./header.module.css";
import Navbar from "./Navbar";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyTokken";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const token = cookies().get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);
  return (
    <header className={module.header}>
      <Navbar isAdmin={payload?.isAdmin || false} />
      <div className={module.right}>
        {payload ? (
          <>
          <strong className="text-blue-800 md:text-xl capitalize">
            {payload?.username}
          </strong>
          <LogoutButton/>
          </>
        ) : (
          <>
            <Link className={module.btn} href="/login">
              Login
            </Link>
            <Link className={module.btn} href="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
