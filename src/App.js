import './App.css';
import Main from './Main.js'
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  

  return (
    <>
    <ChakraProvider>
      <Main/>
    </ChakraProvider>
    </>
  );
}

export default App;
