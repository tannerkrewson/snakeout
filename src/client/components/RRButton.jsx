import React from "react";
import { useNavigate } from "react-router-dom";

import SOButton from "../components/SOButton";

const RRButton = (props) => {
    const navigate = useNavigate();

    return (
        <SOButton
            type={props.isSubmit}
            isGroup={props.isGroup}
            disabled={props.disabled}
            onClick={() => navigate(props.path)}
        >
            {props.children}
        </SOButton>
    );
};

export default RRButton;
