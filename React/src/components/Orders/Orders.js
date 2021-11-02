import React from 'react';
import {useState, useEffect} from 'react';
import useAuth from './../../hooks/useAuth';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const {user} = useAuth();

    useEffect( () => {
        const url = `http://localhost:5000/orders?email=${user.email}`;
        fetch(url)
        .then(res => res.json())
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