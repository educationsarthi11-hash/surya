
import { Product } from '../types';

export interface ProductCombo extends Product {
    itemsIncluded?: string[];
    isAdmissionKit?: boolean;
    savingsAmount?: number;
}

const initialProducts: ProductCombo[] = [
    { 
        id: 101, 
        name: 'Full Admission Kit (Summer)', 
        price: 1800, 
        image: 'https://images.unsplash.com/photo-1596495577881-e6333a146355?q=80&w=400&h=400&fit=crop', 
        category: 'Uniform',
        isAdmissionKit: true,
        itemsIncluded: ['2 Shirts', '1 Pant/Skirt', '1 Belt', '1 Tie', '1 Pair Socks'],
        savingsAmount: 450
    },
    { 
        id: 102, 
        name: 'Winter Uniform Set', 
        price: 2400, 
        image: 'https://placehold.co/400x400/1e293b/white?text=Winter+Suit', 
        category: 'Uniform',
        itemsIncluded: ['1 Blazer', '1 Woolen Pant/Skirt', '1 Divider', '1 Woolen Tie'],
        savingsAmount: 600
    },
    { 
        id: 1, 
        name: 'Official School Belt (Embossed)', 
        price: 150, 
        image: 'https://placehold.co/400x400/e2e8f0/64748b?text=School+Belt', 
        category: 'Tie/Belt' 
    },
    { 
        id: 2, 
        name: 'School Tie (Striped)', 
        price: 120, 
        image: 'https://placehold.co/400x400/e2e8f0/64748b?text=School+Tie', 
        category: 'Tie/Belt' 
    },
    { 
        id: 3, 
        name: 'NCERT Class 10 All-in-One Pack', 
        price: 850, 
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&h=400&fit=crop', 
        category: 'Books' 
    },
    { 
        id: 4, 
        name: 'School Bag (Durable)', 
        price: 650, 
        image: 'https://placehold.co/400x400/1e293b/white?text=School+Bag', 
        category: 'Stationery' 
    },
];

let products: ProductCombo[] = [...initialProducts];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

export const productService = {
    getProducts: (): ProductCombo[] => products,

    addProduct: (product: Omit<ProductCombo, 'id'>): void => {
        const newProduct: ProductCombo = {
            ...product,
            id: Date.now(),
        } as ProductCombo;
        products = [newProduct, ...products];
        notifyListeners();
    },

    deleteProduct: (id: number): void => {
        products = products.filter(p => p.id !== id);
        notifyListeners();
    },

    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};
