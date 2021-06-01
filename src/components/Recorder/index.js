import { useState, useRef } from 'react'
//import Visualizer from '../Visualizer'
import Recording from '../Recording'
import './style.css'

const Recorder = () => {
    const [recordingStateText, setRecordingStateText] = useState('Record')
    const [recordings, setRecordings] = useState([])
    const constraints = { audio: true }
    const mediaRecorder = useRef(null)
    let chunks = []

    const onStop = () => {

        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        recordings.push({stream: audioURL})
        setRecordings(recordings)
        setRecordingStateText('Record')
        
    }

    /**
     * We only want to initialize if one doesn't already exist
     * 
     * @param {MediaRecorder} mr 
     * @returns 
     */
    const initMediaRecorder = async (mr) => {

        if( mr === null ) {
            return navigator.mediaDevices.getUserMedia(constraints)
        }
    
    }
    

    const toggleRecording = () => {
        
        initMediaRecorder(mediaRecorder.current)
        .then((currstream) => {
            mediaRecorder.current = new MediaRecorder(currstream);
            mediaRecorder.current.onstop = onStop
            mediaRecorder.current.ondataavailable = function(e) {
                chunks.push(e.data);
            }
        })
        .catch((err) => {
            console.log('MR already exists')
        })
        .then(() => {
            if( 'Record' === recordingStateText ) {
                mediaRecorder.current.start();
                setRecordingStateText('Stop')
            } else {
                mediaRecorder.current.stop();
            }
        })

        
    }


    const renderAudio = () => {

        let audios = recordings.map((recording, index) => {
            return (
                <Recording stream={recording.stream} key={recording.stream.toString()} />
            )   
        })
        
        return audios

    }


    return (
        <>
            <button onClick={toggleRecording}>{recordingStateText}</button>
            {renderAudio()}
        </>
    )
}

Recorder.propTypes = {
    //stream: PropTypes.node
};

export default Recorder;