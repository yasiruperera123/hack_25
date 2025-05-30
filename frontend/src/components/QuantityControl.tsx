import React from 'react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  // Optional: min/max quantity, disabled states
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
}) => {
  // Consider disabling decrease button if quantity is 1
  const isDecreaseDisabled = quantity <= 1;

  return (
    <div className="quantity-control">
      <button onClick={onDecrease} disabled={isDecreaseDisabled}>-</button>
      <span>{quantity}</span>
      <button onClick={onIncrease}>+</button>
    </div>
  );
};

export default QuantityControl; 