import { useCartStore } from './cart.store';
import { act } from '@testing-library/react';

beforeEach(() => {
  act(() => {
    useCartStore.setState({
      items: [],
      totalCount: 0,
      totalPrice: 0,
    });
  });
});

const mockItem = {
  id: '1',
  title: 'Тестовый товар',
  description: 'Описание',
  price: 1000,
  img: '/test.jpg',
};

describe('CartStore', () => {
  describe('addToCart', () => {
    it('adds item to empty cart', () => {
      act(() => {
        useCartStore.getState().addToCart(mockItem);
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({ ...mockItem, quantity: 1 });
      expect(state.totalCount).toBe(1);
      expect(state.totalPrice).toBe(1000);
    });

    it('increases quantity when adding existing item', () => {
      act(() => {
        useCartStore.getState().addToCart(mockItem);
      });
      act(() => {
        useCartStore.getState().addToCart(mockItem);
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
      expect(state.totalCount).toBe(2);
      expect(state.totalPrice).toBe(2000);
    });

    it('adds multiple different items', () => {
      const item2 = { ...mockItem, id: '2', title: 'Товар 2', price: 500 };

      act(() => {
        useCartStore.getState().addToCart(mockItem);
      });
      act(() => {
        useCartStore.getState().addToCart(item2);
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.totalCount).toBe(2);
      expect(state.totalPrice).toBe(1500);
    });
  });

  describe('removeFromCart', () => {
    it('removes item from cart', () => {
      act(() => {
        useCartStore.getState().addToCart(mockItem);
      });
      act(() => {
        useCartStore.getState().removeFromCart('1');
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalCount).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('does nothing when removing non-existent item', () => {
      act(() => {
        useCartStore.getState().addToCart(mockItem);
      });
      act(() => {
        useCartStore.getState().removeFromCart('999');
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
    });
  });

  describe('increase', () => {
    it('increases item quantity', () => {
      act(() => {
        useCartStore.getState().addToCart(mockItem);
      });
      act(() => {
        useCartStore.getState().increase('1');
      });

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(2);
      expect(state.totalCount).toBe(2);
      expect(state.totalPrice).toBe(2000);
    });
  });

  describe('decrease', () => {
    it('decreases item quantity', () => {
      act(() => {
        useCartStore.getState().addToCart(mockItem);
      });
      act(() => {
        useCartStore.getState().increase('1');
      });
      act(() => {
        useCartStore.getState().decrease('1');
      });

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalCount).toBe(1);
      expect(state.totalPrice).toBe(1000);
    });

    it('removes item when quantity reaches 0', () => {
      act(() => {
        useCartStore.getState().addToCart(mockItem);
      });
      act(() => {
        useCartStore.getState().decrease('1');
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalCount).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('clears all items', () => {
      act(() => {
        useCartStore.getState().addToCart(mockItem);
      });
      act(() => {
        useCartStore.getState().addToCart({ ...mockItem, id: '2' });
      });
      act(() => {
        useCartStore.getState().clearCart();
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalCount).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('recalc', () => {
    it('calculates totals correctly', () => {
      const items = [
        { ...mockItem, quantity: 2 },
        { ...mockItem, id: '2', price: 500, quantity: 3 },
      ];

      const result = useCartStore.getState().recalc(items);
      expect(result.totalCount).toBe(5);
      expect(result.totalPrice).toBe(3500);
    });
  });
});