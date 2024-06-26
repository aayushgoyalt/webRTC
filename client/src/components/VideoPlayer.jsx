import { Grid, Typography , Paper } from "@material-ui/core"
import {makeStyles} from "@material-ui/core"

import { SocketContext } from "../SocketContext";
import { useContext } from "react";

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));

const VideoPlayer = () => {
  const {name , callAccepted , myVideo,userVideo,callEnded , stream , call} = useContext(SocketContext);
  const classes = useStyles();

  return (
    <Grid className={classes.gridContainer}>
      {/* video own */}
      {
        stream && (
          
            <Paper className={classes.paper}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                    {name || 'Name'}
                </Typography>
                <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
              </Grid>
            </Paper>
        )
      }
      
      
      {/* user video */}
      {
        callAccepted  && !callEnded (
          <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                  {call.name || 'Name'}
              </Typography>
              <video playsInline ref={userVideo} autoPlay className={classes.video} />
            </Grid>
          </Paper>
        )
      }
      </Grid>
  );
}

export default VideoPlayer