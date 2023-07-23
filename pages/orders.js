import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        })
    }, [])

    return (
        <Layout>
            <h1>Замовлення</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Одержувач</th>
                        <th>Товари</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order}>
                            <td>{order.createdAt}</td>
                            <td>{order.name} <br/> {order.surname}<br/>{order.middlename} <br/>
                            {order.number} <br/> {order.city} <br/> {order.post} <br/>{order.email}
                            </td>
                            <td>{order.line_items?.map(l => (
                                <>  
                                    {l.price_data?.product_data?.name} Кількість:
                                    x{l.quantity} <br/>
                                </>
                            ))}
                            </td>
                        </tr>
                    ) )}
                </tbody>
            </table>
        </Layout>
    )
}