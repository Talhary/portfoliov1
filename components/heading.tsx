export const Heading = ({title}:{title:string})=>{
    return <div className='mt-4 mx-2 max-mid:mt-16 max-md:mt-4 transition-all text-white'>
    <h1 className='text-4xl max:lg:text-3xl max-md:text-2xl max-sm:text-xl font-semibold  after:bg-primary '> {title}</h1>
    <div className='bg-primary w-40 my-5 h-1 max-md:w-[6rem]  shadow-primary shadow'/>
</div>
}