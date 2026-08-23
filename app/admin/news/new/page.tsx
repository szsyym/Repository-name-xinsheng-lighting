import NewsForm from"@/components/admin/NewsForm";import{saveNews}from"../../actions";
export default function NewNews(){return <><h1>Add News</h1><NewsForm action={saveNews}/></>}
