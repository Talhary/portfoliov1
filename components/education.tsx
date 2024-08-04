

type EducationItemProps = {
  title: string;
  duration: string;
  description: string;
  line: boolean;
};

const EducationItem: React.FC<EducationItemProps> = ({ title, duration, description,line }) => (
  <div className="flex gap-x-10 overflow-hidden pl-2">
       <div  className="point h-2 mt-2 w-2 rounded-full bg-primary  relative border border-white">
        {line && <div className="w-[1px] h-[20rem] ml-1 bg-primary"/>}
</div>  

<div className="mb-6">
<h3 className="text-lg max-md:text-md font-semibold">{title}</h3>
<span className="block text-sm text-gray-400">{duration}</span>
<p className="mt-2 text-sm text-gray-300">{description}</p>
</div>
  </div>
);

const educationData = [
  {
    title: 'University School Of The Arts',
    duration: '2007 — 2008',
    description: 'Nemo enim ipsam voluptatem, blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias exceptur.',
    line:true, 
},
  {
    title: 'New York Academy Of Art',
    duration: '2006 — 2007',
    description: 'Ratione voluptatem sequi nesciunt, facere quisquams facere menda ossimus, omnis voluptas assumenda est omnis.',
    line:true 
     
},
  {
    title: 'High School Of Art And Design',
    duration: '2002 — 2004',
    description: 'Duis aute irure dolor in reprehenderit in voluptate, quila voluptas mag odit aut fugit, sed consequuntur magni dolores eos.',
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
