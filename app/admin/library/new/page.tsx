import ContentEntryForm from"@/components/admin/ContentEntryForm";import{saveContentEntry}from"../../actions";
export default function NewContent(){return <><h1>Add Content</h1><ContentEntryForm action={saveContentEntry}/></>}
