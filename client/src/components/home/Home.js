import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { Redirect } from 'react-router-dom';
import RoomList from './RoomList';
import io from 'socket.io-client';
import './Home.css';

let socket;
const Home = () => {
    const { user, setUser } = useContext(UserContext);
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState([]);
    const [recRooms, setRecRooms] = useState([]);
    const [link, setLink] = useState([]);
    const[age, setAge] = useState([]);
    const[domain, setDomain] = useState([]);
    const[recAge, setRecAge] = useState([]);
    const[recDomain, setRecDomain] = useState([]);
    const[recRating, setRecRating] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const ENDPT = '127.0.0.1:5000';
    useEffect(() => {
        socket = io(ENDPT);
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPT])
    useEffect(() => {
        socket.on('output-rooms', rooms => {
            setRooms(rooms)
        })

    }, [])
    useEffect(() => {
        socket.on('rec-rooms', recRooms => {
            setRecRooms(recRooms)
        })

    }, [])
    useEffect(() => {
        socket.on('room-created', room => {
            setRooms([...rooms, room])
        })
    }, [rooms])
    useEffect(() => {
        console.log(rooms)
    }, [rooms])

    const handleSubmit = e => {
        e.preventDefault();
        socket.emit('create-room',room,link, age, domain);
        console.log(room,link, age, domain);
        setRoom('');
        setLink('');
        setAge('');
        setDomain('');
    }
    const handleRecommendations = e =>{
        e.preventDefault();
        socket.emit('rec-room', recDomain, recAge, recRating);
        setRecAge('');
        setRecDomain('');
        setRecRating('');
        console.log(recRooms);
    }
    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    
    if (!user) {
        return <Redirect to='/login' />
    }
    return (
        <div>
            <div className="row">
                <div className="col s12 m6">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Welcome {user ? user.name : ''}</span>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="input-field col s12">
                                    <label>Study Room</label>
                                        <input
                                            placeholder="Enter a Study Room name"
                                            id="room" type="text" className="validate"
                                            value={room}
                                            onChange={e => setRoom(e.target.value)}
                                        />
                                        <input
                                            placeholder="Enter age"
                                            id="age" type="number" className="validate"
                                            value={age}
                                            onChange={e => setAge(e.target.value)}
                                        /> 
                                        <input
                                            placeholder="Enter domain of study"
                                            id="domain" type="text" className="validate"
                                            value={domain}
                                            onChange={e => setDomain(e.target.value)}
                                        />                                           
                                        <input
                                            placeholder="Enter lecture link"
                                            id="link" type="text" className="validate"
                                            value={link}
                                            onChange={e => setLink(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button className="btn">Create Study Room</button>
                            </form>
                        </div>
                        <div className="card-action">

                        </div>
                    </div>

                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Get Personalized Room Recommendations</span>
                            <form onSubmit={handleRecommendations}>
                                <div className="row">
                                    <div className="input-field col s12">
                                    <label>Study Room</label>
                                        <input
                                            placeholder="Enter domain of study"
                                            id="recdomain" type="text" className="validate"
                                            value={recDomain}
                                            onChange={e => setRecDomain(e.target.value)}
                                        /> 
                                        <input
                                            placeholder="Enter age"
                                            id="recage" type="number" className="validate"
                                            value={recAge}
                                            onChange={e => setRecAge(e.target.value)}
                                        />
                                        <input
                                            placeholder="Enter reputation (out of 5)"
                                            id="recrating" type="number" className="validate"
                                            value={recRating}
                                            onChange={e => setRecRating(e.target.value)}
                                        />                                                                                  
                                    </div>
                                </div>
                                <button className="btn">Get Recommendations</button>
                            </form>
                        </div>
                        <div className="card-action">

                        </div>
                    </div>
                </div>
                <button onClick={handleToggleCollapse}>All Rooms</button>

                <div className={isCollapsed ? 'collapsed col s6 m5 offset-1' : 'expanded col s6 m5 offset-1'}>
                    <RoomList rooms={rooms} />
                </div>
                <button>Recommended Rooms</button>
                {recRooms.length>0 && (
                    <div className='col s6 m5 offset-1'>
                    <RoomList rooms={recRooms} />
                </div>
                )}
                {recRooms.length==0 && (
                    <span>No Rooms Available!</span>
                )}

                
            </div>

        </div>
    )
}

export default Home
