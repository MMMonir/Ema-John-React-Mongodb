import React from 'react';
import {useState, useEffect} from 'react';
import { useHistory } from 'react-router';
import useAuth from './../../hooks/useAuth';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const {user} = useAuth();
    const history = useHistory();
    useEffect( () => {
        const url = `http://localhost:5000/orders?email=${user.email}`;
        fetch(url, {headers: {
            'authorization': `Bearer ${localStorage.getItem('idToken')}`
        }})
        .then(res => {
            if(res.status === 200){
                return res.json();
            }
            else if(res.status === 401){
                history.push('/login')
            }
        })
        .then(data => setOrders(data))
    }, [])
    return (
        <div>
            <h2>You have placed {orders.length}</h2>
            <ul>
                {orders.map(order => <li 
                key={order._id}>
                    {order.name},  {order.email}
                </li>)}
            </ul>
        </div>
    );
};

export default Orders;