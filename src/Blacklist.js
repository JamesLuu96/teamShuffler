import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Checkbox, 
    CheckboxGroup,
    Box,
    Text
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDisclosure, Button } from '@chakra-ui/react'

export default function Blacklist({config}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {players, setPlayers, addBlacklist, id, setId, teamAmount} = config
    const [blacklist, setBlacklist] = useState([])
    function checkboxHandler(player){
        if(!player.value){
            if(blacklist.length == teamAmount)
                return
            setBlacklist([...blacklist, player])
        }else{
            setBlacklist(blacklist.filter(p=>p.id !== player.id))
        }
        setPlayers(players.map(p => {
            if(p.id == player.id){
                return {...p, value: !p.value}
            }
            return p
        }))
    }
    function onCloseHandler(){
        setPlayers(players.map(p => ({...p, value: false})))
        setBlacklist([])
    }
    function addBlacklistHandler(){
        if(blacklist.length <= 1)
            return
        addBlacklist({players: blacklist, id: id})
        setId(id + 1)
        setBlacklist([])
    }
    return (
      <>
        <Button m="5px" bg="grey" color="white" onClick={onOpen}>Add Blacklist Filter</Button>
  
        <Modal isOpen={isOpen} onClose={e=>{
            onCloseHandler()
            onClose(e)
        }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="white">Add Blacklist filter</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text color="yellow">Add players you don't want on the same team:</Text>
                <ul>
                    {
                        players.sort((a,b)=>a.name.localeCompare(b.name)).map(player=>(
                            <Box key={player.id} display={"flex"}>
                                <Text color="white" m="5px">{player.name}</Text>
                                <Checkbox isChecked={player.value} onChange={e=>checkboxHandler(player)}></Checkbox>
                            </Box>
                        ))
                    }
                </ul>
            </ModalBody>
  
            <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={e=>{
                addBlacklistHandler()
                onClose(e)
            }}>
                Add
              </Button>
              <Button colorScheme='red' mr={3} onClick={e=>{
                    onCloseHandler()
                    onClose(e)
                }}>
                X
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}