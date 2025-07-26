import React, { useEffect } from "react";
import inboxPic from "../assets/undraw_mobile-inbox_aszm.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const VerificationPage = () => {
  document.title = "Verification";
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.emailVerification) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="pattern">
      <div className="wrapper">
        <img src={inboxPic} alt="Check Inbox" className="w-2xl m-auto" />
        <p className="text-center mt-4">
          Please check your email inbox for a verification link.
        </p>
        <p className="text-center mt-4">
          Already verified your account?{" "}
          <Link className="text-[#AB8BFF]" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerificationPage;
