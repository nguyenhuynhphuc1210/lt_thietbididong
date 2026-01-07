import api from '../constants/api';

export const addToCart = (
  userId: number,
  productId: number,
  quantity: number = 1
) => {
  return api.post('/cart/add', null, {
    params: {
      userId,
      productId,
      quantity,
    },
  });
};
