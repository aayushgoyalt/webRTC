import  { createContext ,useState , useRef , useEffect} from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const socket = io('http://localhost:5000');

const ContextProvider = ({children}) => {

    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((currentStream) =>{
            setStream(currentStream);

            myVideo.current.srcObject = currentStream;
        });
        socket.on('me',(id) => setMe(id));
        socket.on('calluser', ({from , name: callerName , signal }) => {
            setCall({ isReceivedCall: true , from , name: callerName , signal})
        });
    }, []);
    

    const AnswerCall = () =>{
        setCallAccepted(true);

        const peer = new ({ initiator: false , trickle: false , stream});

        peer.on('signal', (data) => {
            socket.emit('answercall', {signal: data , to: call.from})
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const callUser = (id) =>{
        const peer = new ({ initiator: true , trickle: false , stream});

        peer.on('signal', (data) => {
            socket.emit('calluser', {userToCall: id , signalData: data , from: me , name})
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        });
        connectionRef.current = peer;
    }

    const leaveCall = () =>{
        setCallEnded(true);
        connectionRef.current.destroy();

        window.location.reload();

    }

    return (
        <SocketContext.Provider value={{call,callAccepted,myVideo,userVideo,stream,name,setName,callEnded,me,callUser,leaveCall,AnswerCall
        }}>
            {children}

        </SocketContext.Provider>
    )
}

export {ContextProvider, SocketContext};