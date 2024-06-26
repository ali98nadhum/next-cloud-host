"use client";

import Link from "next/link";
import module from "./header.module.css";
import { GrTechnology } from "react-icons/gr";
import { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

interface NavbarProps {
  isAdmin:boolean
}

const Navbar = ({isAdmin}:NavbarProps) => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className={module.navbar}>
      <div>
        <Link href="/" className={module.logo}>
          CLOUD
          <GrTechnology />
          HOSTING
        </Link>
        <div className={module.menu}>
          {toggle ? (
            <IoMdClose onClick={() => setToggle((prev) => !prev)} />
          ) : (
            <LuMenu onClick={() => setToggle((prev) => !prev)} />
          )}
        </div>
      </div>
      <div
        className={module.navLinksWrapper}
        style={{
          clipPath: (toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)") || "",
        }}
      >
        <ul className={module.navLinks}>
          <Link
            onClick={() => setToggle(false)}
            className={module.navLink}
            href="/"
          >
            Home
          </Link>
          <Link
            onClick={() => setToggle(false)}
            className={module.navLink}
            href="/articles?pageNumber=1"
          >
            Articles
          </Link>
          <Link
            onClick={() => setToggle(false)}
            className={module.navLink}
            href="/about"
          >
            About
          </Link>
          {isAdmin && (
            <Link
            onClick={() => setToggle(false)}
            className={module.navLink}
            href="/admin"
          >
            Admin Dashboard
          </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
