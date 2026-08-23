import ProductForm from"@/components/admin/ProductForm";import{createProduct}from"../../actions";import{getCategories}from"@/lib/queries";
export default async function NewProduct(){const categories=await getCategories(true);return <><h1>Add Product</h1><p>Complete the product information, then publish when ready.</p><ProductForm categories={categories} action={createProduct}/></>}
