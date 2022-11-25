import * as React from "react";

export default class AlternatingAudioPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			audioContext: null,
			sampleSwitch: 1,
			soundOn: false,
			track_1: null,
			track_2: null,
			audio_1_buffer: null,
			audio_2_buffer: null
		}

		const AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContext = new AudioContext();
		this.state.audioContext = audioContext;
		this.audio_1_gain = new GainNode(audioContext);
		this.audio_2_gain = new GainNode(audioContext);
		this.doPlay = this.props.doPlay; //this is the trigger from the parent
	}
	//
	componentDidUpdate(prevProps, prevState) {
		if (prevProps.doPlay !== this.props.doPlay) {
			this.playAlternating();
		}
	}
	//
	componentDidMount() {

	}
	//
	componentWillUnmount() {

	}
	//
	getFileAndPutInBuffer = async (audioContext, filepath) => {
		const rawFile = await fetch(filepath);
		const arrayBuffer = await rawFile.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
		return audioBuffer;
	}

	playAlternating = async () => {
		if (this.state.sampleSwitch === 1) {
			if (this.state.audio_1_buffer === null) {
				const audio_1_buffer = await this.getFileAndPutInBuffer(this.state.audioContext, this.props.url_1);
				this.setState({audio_1_buffer: audio_1_buffer});
			}
			// Get an AudioBufferSourceNode.
			// This is the AudioNode to use when we want to play an AudioBuffer
			const source = this.state.audioContext.createBufferSource();
			// set the buffer in the AudioBufferSourceNode
			source.buffer = this.state.audio_1_buffer;
			// connect the AudioBufferSourceNode to the
			// destination so we can hear the sound
			source.connect(this.audio_1_gain).connect(this.state.audioContext.destination);
			// start the source playing
			this.reaffirmMute();
			source.start();
		} else {
			if (this.state.audio_2_buffer === null) {
				const audio_2_buffer = await this.getFileAndPutInBuffer(this.state.audioContext, this.props.url_2);
				this.setState({audio_2_buffer: audio_2_buffer});
			}
			const source = this.state.audioContext.createBufferSource();
			source.buffer = this.state.audio_2_buffer;
			source.connect(this.audio_2_gain).connect(this.state.audioContext.destination);
			this.reaffirmMute();
			source.start();
		}
		this.setState({sampleSwitch: (this.state.sampleSwitch + 1) % 2})
	}

	toggleSound = () => {
		if (this.state.audioContext.state === 'suspended') {
			this.state.audioContext.resume();
		}
		if (this.state.soundOn === false) {
			this.audio_1_gain.gain.value = 1;
			this.audio_2_gain.gain.value = 1;
			this.setState({soundOn: true})
		} else {
			this.audio_1_gain.gain.value = 0;
			this.audio_2_gain.gain.value = 0;
			this.setState({soundOn: false})
		}
	}

	reaffirmMute = () => {
		if (this.state.soundOn === false) {
			this.audio_1_gain.gain.value = 0;
			this.audio_2_gain.gain.value = 0;
		} else {
			this.audio_1_gain.gain.value = 1;
			this.audio_2_gain.gain.value = 1;
		}
	}

	render() {
		return (
			<div>
				<button onClick={this.toggleSound}>{this.state.soundOn ? 'Mute' : 'Unmute'}</button>
				<p/>
			</div>
		);
	}
}