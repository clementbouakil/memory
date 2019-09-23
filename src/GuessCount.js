import React from "react";

import "./GuessCount.css";

import PropTypes from "prop-types";

const GuessCount = ({ guesses }) => <div className="guesses">{guesses}</div>;

export default GuessCount;

GuessCount.propTypes = {
    guesses: PropTypes.number.isRequired
};
