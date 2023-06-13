import React from "react";
import "./NoMessages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

export default function NoMessage() {
  return (
    <div className="yourmess">
      <div className="circle">
        <FontAwesomeIcon icon={faPaperPlane} className="fa-3x" />
      </div>
      <div className="text">
        <h1> Your messages</h1>
        <p>Send private photos and messages to a friend or group</p>
      </div>
    </div>
  );
}
