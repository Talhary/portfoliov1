

type EducationItemProps = {
  title: string;
  duration: string;
  description: string;
  line: boolean;
};

const EducationItem: React.FC<EducationItemProps> = ({ title, duration, description,line }) => (
  <div className="flex gap-x-10 overflow-hidden pl-2 max-md:my-6 max-xs:my-4 max-md:gap-x-4 max-xs:gap-x-5 ">
       <div  className="point h-2 mt-2 w-2 rounded-full bg-primary  relative  ">
        {line && <div className="w-[1px] h-[20rem] ml-1 bg-primary"/>}
</div>  

<div className="mb-6">
<h3 className="text-lg max-md:text-md font-semibold dark:text-white ">{title}</h3>
<span className="block text-sm text-gray-400">{duration}</span>
<p className="mt-2 text-sm text-gray-300">{description}</p>
</div>
  </div>
);

const educationData = [
  {
    title: 'Quaid-e-Azam University',
    duration: '2020 — 2024',
    description: 'I completed my Graduation in Mathematics. Which give me excellent problem solving skills ',
    line:true, 
},
  {
    title: 'Fsc Pre-Engg',
    duration: '2018 — 2020',
    description: '',
    line:true 
     
},
  {
    title: 'Matric with Science',
    duration: '2016-2018',
    description: '',
    line:false 
     
},
];

const EducationList: React.FC = () => (
  <div >

    {educationData.map((item, index) => (
      <EducationItem
        key={index}
        title={item.title}
        duration={item.duration}
        description={item.description}
        line={item.line}
      />
    ))}

  </div>
);

export  {EducationList};
