

const Page =async ({ params: { filter }}: { params: { filter: string }}) => {
 

    return (
        <div>
          
            <div>{filter}</div>
        </div>
    );
}
export default Page;
