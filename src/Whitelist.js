import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Checkbox,
    Box,
    Text
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDisclosure, Button } from '@chakra-ui/react'

export default function Whitelist({config}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {players, setPlayers, addWhitelist, id, setId} = config
    const [whitelist, setWhitelist] = useState([])
    function checkboxHandler(player){
        if(!player.value){
            setWhitelist([...whitelist, player])
        }else{
            setWhitelist(whitelist.filter(p=>p.id !== player.id))
        }
        setPlayers(players.map(p => {
            if(p.id == player.id){
                return {...p, value: true}
            }
            return p
        }))
    }
    function onCloseHandler(){
        setPlayers(players.map(p => ({...p, value: false})))
        setWhitelist([])
    }
    function addWhitelistHandler(){
        addWhitelist({players: whitelist, id: id})
        setId(id + 1)
        setWhitelist([])
    }
    return (
      <>
        <Button m="5px" bg="lightblue" onClick={onOpen}>Add Whitelist Filter</Button>
  
        <Modal isOpen={isOpen} onClose={e=>{
            onCloseHandler()
            onClose(e)
        }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Whitelist filter</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <p>Add players who you want to stay on the same team:</p>
                <ul>
                    {
                        players.map(player=>(
                            <Box key={player.id} display={"flex"}>
                                <Text color="white" m="5px">{player.name}</Text>
                                <Checkbox defaultChecked={player.value} onChange={e=>checkboxHandler(player)}></Checkbox>
                            </Box>
                        ))
                    }
                </ul>
            </ModalBody>
  
            <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={e=>{
                addWhitelistHandler()
                onClose(e)
            }}>
                Add
              </Button>
              <Button colorScheme='red' mr={3} onClick={e=>{
                    onCloseHandler()
                    onClose(e)
                }}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}