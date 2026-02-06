import BTS1 from '../assets/images/BTS1.jpeg';
import BTS2 from '../assets/images/BTS2.jpg';
import BTS3 from '../assets/images/BTS3.jpeg';
import BTS4 from '../assets/images/BTS4.jpeg';
import BTS5 from '../assets/images/BTS5.jpeg';
import BTS6 from '../assets/images/BTS6.jpeg';

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
}

export const products: Product[] = [
    {
        id: 1,
        name: '볼 파이톤',
        price: 300000,
        imageUrl: BTS1,
        description: '온순한 성격으로 입문자에게 적합한 볼 파이톤입니다.',
    },
    {
        id: 2,
        name: '콘스네이크',
        price: 180000,
        imageUrl: BTS2,
        description: '활발하고 관리가 쉬운 콘스네이크입니다.',
    },
    {
        id: 3,
        name: '킹스네이크',
        price: 250000,
        imageUrl: BTS3,
        description: '먹성이 좋고 성장 속도가 빠른 킹스네이크입니다.',
    },
    {
        id: 4,
        name: '볼 파이톤2',
        price: 300000,
        imageUrl: BTS4,
        description: '온순한 성격으로 입문자에게 적합한 볼 파이톤입니다.',
    },
    {
        id: 5,
        name: '콘스네이크2',
        price: 180000,
        imageUrl: BTS5,
        description: '활발하고 관리가 쉬운 콘스네이크입니다.',
    },
    {
        id: 6,
        name: '킹스네이크2',
        price: 250000,
        imageUrl: BTS6,
        description: '먹성이 좋고 성장 속도가 빠른 킹스네이크입니다.',
    }
];
