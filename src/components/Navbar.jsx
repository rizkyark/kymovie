import React, { useState } from "react";

import { Link, useNavigate } from "react-router";
import { useAuth } from "../utils/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 -mt-0.5">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link className="block text-teal-600 dark:text-teal-300" href="#">
          <span className="sr-only">Home</span>
          <img src="./../../public/kymovie_logo.png" className="h-14" />
        </Link>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link
                  className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                  href="#"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                  href="#"
                >
                  History
                </Link>
              </li>

              <li>
                <Link
                  className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                  href="#"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="dropdown dropdown-bottom">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn m-1 btn-ghost btn-circle avatar"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&rounded=true&background=random`}
                    className="h-14"
                  />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm mt-1"
                >
                  <li>
                    <a>Item 1</a>
                  </li>
                  <li>
                    <a className="text-red-500" onClick={logoutUser}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="sm:flex sm:gap-4">
                <Link
                  className="block rounded-md bg-[#AB8BFF] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 dark:hover:bg-teal-500"
                  to="/login"
                >
                  Login
                </Link>

                <Link
                  className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                  to="/register"
                >
                  Register
                </Link>
              </div>
            )}

            {/* <button className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden dark:bg-gray-800 dark:text-white dark:hover:text-white/75">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
