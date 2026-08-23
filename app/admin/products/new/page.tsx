import ProductForm from"@/components/admin/ProductForm";import{createProduct}from"../../actions";
export default function NewProduct(){return <><h1>Add Product</h1><p>Complete the product information, then publish when ready.</p><ProductForm action={createProduct}/></>}
