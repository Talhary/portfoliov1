

const Page =async ({ params: { filter }}: { params: { filter: string }}) => {
    await new Promise((resolve,rejext)=>{
        setTimeout(()=>{
            resolve(null)
       },2000)
    } )
    
    return (
        <div>
          
            <div>{filter}</div>
        </div>
    );
}
export default Page;
