import React, { createContext } from 'react'
import { useState } from 'react'
import ReactPlayer from 'react-player/youtube';
export const MovieContext = createContext();

export const MovieProvider = (props) => {
    // const [id, setid] = useState('');
    const [room, setroom] = useState('');
    const [link, setlink] = useState('');
    const [name, setname] = useState('');
    const[age, setAge] = useState('');
   
    const [movies, setmovies] = useState([
        {
            "id": 1,
             "name": "prarthana",
            "link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley",
            "room": "be-proj"
          }
    ])
    return (
      <MovieContext.Provider value={[movies,setmovies,room,setroom,link,setlink,name,setname, age, setAge]}>
      {props.children}</MovieContext.Provider>  
    );
}


