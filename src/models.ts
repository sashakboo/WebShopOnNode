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

export interface IUser {
    id: number,
    email: string,
    password: string
}