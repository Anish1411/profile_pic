import React from "react";
import "./Waiting.css";

const Wait: React.FC = () => {
    return (
        <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
    );
};

export default Wait;
