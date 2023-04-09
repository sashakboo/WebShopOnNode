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

export interface ICreatedProduct {
    categoryId: number,
    title: string,
    price: number,
    isActive: boolean
}

export interface IUser {
    id: number,
    role: string,
    email: string,
    password: string,
}

export interface IUpdatedUser {
    id: number,
    password: string,
    role: string
}

export interface IUpdatedProduct {
    id: number,
    categoryId: number,
    title: string,
    price: number
}