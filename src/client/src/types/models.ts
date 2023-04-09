export interface ICategory {
    id: number,
    title: string
}

export interface IProduct {
    id: number,
    category: ICategory,
    icon: string,
    title: string,
    price: number,
    tag: string
}

export interface IBasketProduct {
    id: number,
    title: string,
    productId: number,
    categoryTitle: string,
    price: number
}

export interface IUpdatedProduct {
    id: number,
    categoryId: number,
    title: string,
    price: number
}

export interface IUser {
    id: number,
    email: string,
    password: string,
    role: string
}
