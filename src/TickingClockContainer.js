
//this is a ticking clock with naive use of date.Now() and setInterval so of course it can be a bit erratic.

import * as React from "react";

import './ticking_clock.css'

import AlternatingAudioPlayer from "./AlternatingAudioPlayer";

export default class Clock extends React.Component {

	clockInterval = "";
	constructor(props) {
		super(props);
		this.handleDate = this.handleDate.bind(this);
		this.state = {
			hours: "",
			minutes: "",
			seconds: "",
			childPlay: false
		};
		this.toggleGrey = this.toggleGrey.bind(this);
	}

	componentDidMount() {
		this.clockInterval = setInterval(this.handleDate, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.clockInterval);
	}

	render() {
		const { hours, minutes, seconds } = this.state;
		const secondsStyle = {
			transform: `rotate(${seconds * 6}deg)`
		};
		const minutesStyle = {
			transform: `rotate(${minutes * 6}deg)`
		};
		const hoursStyle = {
			transform: `rotate(${hours * 30}deg)`
		};
		const clockBackgroundStyle = {
			background: `${this.toggleGrey(seconds)}`
		}
		const { title } = this.props;
		return (
			<div className={"clock"}>

				<h3>{title}</h3>
				<div className={"analog-clock"} style={clockBackgroundStyle}>
					{/*<div className={"dial timeIndicator"} style={timeIndicatorStyle} />*/}
					<div className={"dial seconds"} style={secondsStyle} />
					<div className={"dial minutes"} style={minutesStyle} />
					<div className={"dial hours"} style={hoursStyle} />
				</div>
				<div className={"digital-clock"}>
					{hours}:{minutes}:{seconds}
				</div>
				<AlternatingAudioPlayer url_1='wavs/tick_01.wav' url_2='wavs/tock_01.wav' doPlay={this.childPlay}/>
			</div>
		);
	}

	handleDate() {
		const date = new Date();
		date.setHours(date.getHours());
		let hours = this.formatTime(date.getHours());
		let minutes = this.formatTime(date.getMinutes());
		let seconds = this.formatTime(date.getSeconds());
		this.setState({ hours, minutes, seconds });
	}

	formatTime(time) {
		return time < 10 ? `0${time}` : time;
	}

	toggleGrey (second) {
		if (second % 2 === 0) {
			this.childPlay = true; //if we use setState() here the app crashes
			return '#333';
		}
		this.childPlay = false;
		return '#ddd';
	}
}