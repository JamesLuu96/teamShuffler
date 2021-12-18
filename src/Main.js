import React from 'react'
import {useState, useRef} from 'react';
import Whitelist from './Whitelist'
import Blacklist from './Blacklist'
import { Box, Button, Text, Input } from '@chakra-ui/react'
import {DeleteIcon} from '@chakra-ui/icons'

import './Main.css';

export default function Main() {
    const [teamAmount, setTeamAmount] = useState(1)
    const [players, setPlayers] = useState([])
    const [playersWhitelist, setPlayersWhitelist] = useState([])
    const [playersBlacklist, setPlayersBlacklist] = useState([])
    const [nameInput, setNameInput] = useState("")
    const nameSpace = useRef()
    const [id, setId] = useState(0)
    const [output, setOutput] = useState([])
    function deletePlayer(playerId){
        console.log(playerId)
        setPlayers(p=>p.filter(player=>player.id !== playerId))
    }
    function addWhitelist(newPlayers){
        setPlayersWhitelist([...playersWhitelist, newPlayers])
        newPlayers.players.forEach(player=>{
            deletePlayer(player.id)
        })
    }
    function deleteWhitelist(whitelistId){
        const whitelistPlayers = playersWhitelist.filter(x=>x.id == whitelistId)
        setPlayers([...players, ...whitelistPlayers[0].players])
        setPlayersWhitelist(playersWhitelist.filter(x=>x.id !== whitelistId))
    }
    function addBlacklist(newPlayers){
        setPlayersBlacklist([...playersBlacklist, newPlayers])
        newPlayers.players.forEach(player=>{
            deletePlayer(player.id)
        })
    }
    function deleteBlacklist(blacklistId){
        const blacklistPlayers = playersBlacklist.filter(x=>x.id == blacklistId)
        setPlayers([...players, ...blacklistPlayers[0].players])
        setPlayersBlacklist(playersBlacklist.filter(x=>x.id !== blacklistId))
    }
    function resetAll(){
        playersWhitelist.forEach(list=>{
            setPlayers(e=>[...e, ...list.players])
        })
        playersBlacklist.forEach(list=>{
            setPlayers(e=>[...e, ...list.players])
        })
        setPlayersWhitelist([])
        setPlayersBlacklist([])
        setOutput([])
    }
    function randomizeTeam(){
        let teams = new Array(teamAmount).fill().map(()=>[])
        
        shuffle(playersWhitelist).forEach(whitelist=>{
            teams = teams.sort((a,b)=>a.length - b.length)
            for(let i = 0; i < whitelist.players.length; i++){
                teams[0].push(whitelist.players[i])
            }
        })

        shuffle(playersBlacklist).forEach(list=>{
            const currentPlayers = shuffle(list.players)
            teams = teams.sort((a,b)=>a.length - b.length)
            let j = 0
            for(let i = 0; i < currentPlayers.length; i++){
                if(j == teams.length){
                    j = 0
                }
                teams[j].push(currentPlayers[i])
                j++
            }
        })

        shuffle(players).forEach(player=>{
            teams = teams.sort((a,b)=>a.length - b.length)
            teams[0].push(player)
        })

        setOutput(e=>shuffle(teams.map(team=>{
            return shuffle(team)
        })))

    }
    function shuffle(ref) {
        const array = [...ref]
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }
    function getLength(){
        let total = 0
        total += players.length
        playersWhitelist.forEach(list=>{
            total += list.players.length
        })
        playersBlacklist.forEach(list=>{
            total += list.players.length
        })
        return total
    }
    return (
        <Box width={"80%"} m="20px auto" textAlign={"center"}>
            {getLength() > 0 && (
                <Button size="sm" colorScheme={"red"} onClick={e=>{
                    resetAll()
                    setPlayers([])
                }}>Clear All?</Button>
            )}
            <Text fontSize={"2rem"} fontWeight={"bold"} color={"white"}>
                James' Team Scrambler
            </Text>
            <Text color="white" m="5px">Number of Teams:</Text>
            <Button m="10px" onClick={()=>{
                setTeamAmount(Math.max(1, teamAmount - 1))
                resetAll()
            }}>-</Button>
            <Text color='white' display={"inline-block"}>{teamAmount}</Text>
            <Button m="10px" onClick={()=>{
                setTeamAmount(teamAmount + 1)
                resetAll()
            }}>+</Button>
            <Text color={"white"} m="5px">Player Name:</Text>
            <Box display="flex" justifyContent={"center"} alignItems={"center"}>
                <form>
                    <Input ref={nameSpace} color="white" width="250px" m="5px" value={nameInput} onChange={e=>setNameInput(e.target.value)}></Input>
                    <Button type="submit" bg={nameInput ? "lightgreen" : "lightgrey"} onClick={e=>{
                        e.preventDefault()
                        if(!nameInput)return
                        setPlayers([...players, {id: id, name: nameInput, value: false}])
                        setId(id + 1)
                        setNameInput("")
                        setOutput([])
                        nameSpace.current.focus()
                    }}>Add Player</Button>
                </form>
            </Box>
            <Box display={"flex"} justifyContent="center" m="0 auto" flexWrap={"wrap"} width="80%">
                {playersWhitelist.map((playerObjects, i)=>(
                    <Box width="150px" key={playerObjects.id} m="15px">
                        <Text color="white">Whitelist {i + 1}: </Text>
                        <Button size="xs" colorScheme={"red"} variant={"outline"} onClick={e=>deleteWhitelist(playerObjects.id)}><DeleteIcon/></Button>
                        {playerObjects.players.map(player=>(<Text bg="rgb(114, 163, 219)" m="3px" p="2px" border="1px solid white" color="white" fontWeight={"bold"} key={player.id}>{player.name}</Text>))}
                    </Box>
                ))}
            </Box>
            <Box display={"flex"} justifyContent="center" m="0 auto" flexWrap={"wrap"} width="80%">
                {playersBlacklist.map((playerObjects, i)=>(
                    <Box key={playerObjects.id} m="15px">
                        <Text color="white">Blacklist {i + 1}: </Text>
                        <Button size="xs" colorScheme={"red"} variant={"outline"} onClick={e=>deleteBlacklist(playerObjects.id)}><DeleteIcon/></Button>
                        {playerObjects.players.map(player=>(<Text bg="rgba(182, 94, 182, 0.822)" m="3px" p="2px" border="1px solid white" color="white" fontWeight={"bold"} key={player.id}>{player.name}</Text>))}
                    </Box>
                ))}
            </Box>
            {players.length > 0 && 
                <Box m="5px" display="flex" justifyContent={"center"} alignItems={"center"}>
                    <Whitelist colorScheme="black" config={{players, setPlayers, addWhitelist, id, setId}}/>
                    <Blacklist config={{players, setPlayers, addBlacklist, id, setId, teamAmount}}/>
                </Box>
            }




            <Text color="white" mb="10px" borderBottom={"1px solid white"}>Total Players: <Text fontWeight={"bold"} display="inline-block">{getLength()}</Text></Text>
            <Box display={"flex"} justifyContent="center" alignItems="center" width="60%" m="0 auto" flexWrap={"wrap"} mb="20px">
                {
                    players.map(player=>(
                        <Box width="200px" key={player.id} display="flex" alignItems={"center"} justifyContent={"center"}>
                            <Text color="white" fontWeight={"bold"} m="5px">{player.name}</Text>
                            <Button size="xs" colorScheme={"red"} variant={"outline"} onClick={e=>{
                                setOutput([])
                                deletePlayer(player.id)
                            }}>x</Button>
                        </Box>
                ))
            }
            </Box>
            
            <Button mb="20px" colorScheme={"green"} onClick={e=>randomizeTeam()}>Randomize Teams!</Button>
                
            
            {output.length > 0 && (
                <>
                    <Text fontSize={"2rem"} fontWeight={"bold"} color="white">Your Teams:</Text>
                    <Button leftIcon={<DeleteIcon/>} mb="20px" size="xs" colorScheme={"red"} variant={"outline"} onClick={(e)=>setOutput([])}>Clear Teams</Button>
                    <Box display={"flex"} justifyContent="space-evenly" width="80%" m="0 auto" mb="300px">
                    {
                        output.map((teams, i)=>(
                            <Box key={i}>
                                <Text mb="5px" borderBottom="1px solid white" color="white" fontWeight={"bold"}>Team {i + 1} ({teams.length}):</Text>
                                <Box>
                                    {teams.map((player, i)=>(
                                        <Text color="white" key={i}>{player.name}</Text>
                                        ))}
                                </Box>
                            </Box>
                        ))
                    }
                    </Box>
                </>
            )}

        </Box>
    )
}
