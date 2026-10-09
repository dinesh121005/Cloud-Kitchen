import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import FoodImageModal from './FoodImageModal'

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({}) // itemId:rating
    const [modalData, setModalData] = useState(null) // { image, title, price, quantity, shopId }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const handleRating = async (itemId, rating) => {
        try {
            await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({
                ...prev, [itemId]: rating
            }))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>
            <div className='flex justify-between border-b pb-2'>
                <div>
                    <p className='font-semibold'>
                        order #{data._id.slice(-6)}
                    </p>
                    <p className='text-sm text-gray-500'>
                        Date: {formatDate(data.createdAt)}
                    </p>
                </div>
                <div className='text-right'>
                    {data.paymentMethod == "cod" ? <p className='text-sm text-gray-500'>{data.paymentMethod?.toUpperCase()}</p> : <p className='text-sm text-gray-500 font-semibold'>Payment: {data.payment ? "true" : "false"}</p>}

                    <p className='font-medium text-blue-600'>{data.shopOrders?.[0]?.status}</p>
                </div>
            </div>

            {data.shopOrders.map((shopOrder, index) => (
                <div className='border rounded-lg p-3 bg-[#fffaf7] space-y-3' key={index}>
                    <p className='font-medium text-gray-800'>{shopOrder.shop?.name}</p>

                    <div className='flex space-x-4 overflow-x-auto pb-2'>
                        {shopOrder.shopOrderItems.map((item, itemIndex) => {
                            const itemImage = item?.item?.image || item?.image || "https://placehold.co/300x200?text=Food+Item"
                            return (
                                <div key={itemIndex} className='flex-shrink-0 w-40 border rounded-lg p-2 bg-white'>
                                    <div 
                                        className='overflow-hidden rounded cursor-pointer group relative'
                                        onClick={() => setModalData({
                                            image: itemImage,
                                            title: item.name,
                                            price: item.price,
                                            quantity: item.quantity,
                                            shopId: shopOrder.shop?._id
                                        })}
                                        title='Click to view image'
                                    >
                                        <img 
                                            src={itemImage} 
                                            alt={item.name} 
                                            className='w-full h-24 object-cover transition-transform duration-200 group-hover:scale-105' 
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/300x200?text=Food+Item";
                                            }}
                                        />
                                        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium'>
                                            View Image
                                        </div>
                                    </div>

                                    <p className='text-sm font-semibold mt-1 truncate' title={item.name}>{item.name}</p>
                                    <p className='text-xs text-gray-500'>Qty: {item.quantity} x ₹{item.price}</p>

                                    {shopOrder.status == "delivered" && (
                                        <div className='flex space-x-1 mt-2'>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button 
                                                    key={star}
                                                    type='button'
                                                    className={`text-lg cursor-pointer ${selectedRating[item?.item?._id] >= star ? 'text-yellow-400' : 'text-gray-400'}`} 
                                                    onClick={() => item?.item?._id && handleRating(item.item._id, star)}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <div className='flex justify-between items-center border-t pt-2'>
                        <p className='font-semibold'>Subtotal: ₹{shopOrder.subtotal}</p>
                        <span className='text-sm font-medium text-blue-600 capitalize'>{shopOrder.status}</span>
                    </div>
                </div>
            ))}

            <div className='flex justify-between items-center border-t pt-2'>
                <p className='font-semibold'>Total: ₹{data.totalAmount}</p>
                <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition' onClick={() => navigate(`/track-order/${data._id}`)}>Track Order</button>
            </div>

            {/* Enlarged Food Image Modal */}
            <FoodImageModal 
                isOpen={!!modalData}
                onClose={() => setModalData(null)}
                image={modalData?.image}
                title={modalData?.title}
                price={modalData?.price}
                quantity={modalData?.quantity}
                onNavigateShop={modalData?.shopId ? () => navigate(`/shop/${modalData.shopId}`) : null}
            />
        </div>
    )
}

export default UserOrderCard
