import chalk from 'chalk';
import React from 'react'
import io from 'socket.io-client'
import { GlobalContext } from './globalContext';

export const SocketContext = React.createContext(null);

export default function SocketProvider(props) {
      const globalContext = React.useContext(GlobalContext);

      const [socket, setSocket] = React.useState(null);

      React.useEffect(() => {
            const newSocket = io('http://localhost:5000');
            setSocket(newSocket);

            newSocket.on('connect', () => {
                  console.log(chalk.greenBright('connected to socket server'));
            });

            newSocket.on('disconnect', () => {
                  globalContext.showSnackBar('Disconnected from server', {
                        variant: 'error',
                        transition: 'right'
                  });
            });

            return () => newSocket.close();
      }, [setSocket]);

      return (
            <>
                  <SocketContext.Provider value={socket}>
                        {props.children}
                  </SocketContext.Provider>
            </>
      )
}
