import React, { useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';

function FoodImageModal({ isOpen, onClose, image, title, price, quantity, onNavigateShop }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !image) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
            onClick={onClose}
        >
            <div 
                className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full cursor-pointer transition shadow-md"
                    title="Close preview"
                >
                    <RxCross2 size={20} />
                </button>

                {/* Enlarged Image */}
                <div className="w-full h-72 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img 
                        src={image} 
                        alt={title || "Food item"} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/400x300?text=Food+Image";
                        }}
                    />
                </div>

                {/* Details Footer */}
                <div className="p-4 sm:p-5 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                            {quantity && (
                                <p className="text-sm text-gray-500 mt-0.5">Quantity: <span className="font-semibold text-gray-700">{quantity}</span></p>
                            )}
                        </div>
                        {price && (
                            <span className="text-lg font-bold text-[#ff4d2d] whitespace-nowrap">₹{price}</span>
                        )}
                    </div>

                    {onNavigateShop && (
                        <button
                            onClick={() => {
                                onClose();
                                onNavigateShop();
                            }}
                            className="mt-2 w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-2.5 rounded-xl font-medium transition cursor-pointer text-sm"
                        >
                            View Restaurant / Shop
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FoodImageModal;
