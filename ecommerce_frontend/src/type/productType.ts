import { Seller } from "./sellerType";

 export interface Product{
    id:number;
    title:string;
    description:string;
    mrpPrice:number;
    sellingPrice:number;
    discountPercent:number;
    quantity:number;
    color:string;
    images:string[];
    numRatings?:number;
    category?:Category;
    seller?:Seller;
    createdAt:Date;
    sizes:string;
    stockStatus?: "IN_STOCK" | "OUT_OF_STOCK";


}

interface Category{
    id?:number;
    name:string;
    categoryId:string;
    parentCategory?:Category;
    level:number;
}

