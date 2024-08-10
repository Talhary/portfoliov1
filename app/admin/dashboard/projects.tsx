'use client';

import React, { useState } from 'react';
import { removeProjectById } from '@/actions/remove';
import {updateProjectById} from '@/actions/update'
import Image from 'next/image';
import {z} from 'zod'
import {formSchema} from '@/lib/form-type'
import {ImageCarousel} from '@/app/admin/dashboard/image-Carosal'
const ItemList = ({ initialItems }: { initialItems: any }) => {
  const [items, setItems] = useState<any>(initialItems);
  const [editingId, setEditingId] = useState<any>(null);
  const [editData, setEditData] = useState<any>({ title: '', type: '', link: '', githubUrl: '' });
  const [loading,setLoading]= useState(false)
  const [msg,setMsg]= useState('')
  const handleRemove = async (id: any) => {
    try {
      const data = await removeProjectById(id);
      if (data.status === 200) {
        setItems((prevItems: any) => prevItems.filter((el: any) => el?.id !== id));
      } else {
        console.error('Something went wrong');
      }
    } catch (error: any) {
      console.error('Error removing project:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ title: item.title, type: item.type, link: item.link, githubUrl: item.githubUrl });
  };

  const handleUpdate = async (id: any) => {
     setLoading(true)
   try {
     const updatedItems = items.map((item: any) =>
       item.id === id ? { ...item, ...editData } : item
     );
     setItems(updatedItems);
     await updateProjectById(id,updatedItems.filter((el:any)=>el.id == id)[0])
     setMsg('Updated')

     setEditingId(null); // Exit edit mode after submission
   } catch (error) {
     console.log(error)
      setMsg('Something Goes wrong')
   }
   setLoading(false)
  };

  if (items.length === 0) {
    return <></>;
  }

  return (
    <div className="p-6 py-7 max-md:py-3 max-md:p-2 flex flex-wrap gap-2">
      {items.map((item: z.infer <typeof formSchema> ) => (
        <div
          key={item.id}
          className="bg-gray-500 px-4 max-md:p-2 py-5 min-w-fit rounded-lg overflow-hidden mb-6 max-w-md flex flex-col justify-between"
        >
          <ImageCarousel images={item.imageUrl}/>
          <div className="mt-2 text-black">
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e: any) => setEditData({ ...editData, title: e.target.value })}
                  className="text-lg font-bold mb-2 w-full p-2 rounded-md"
                />
                <input
                  type="text"
                  value={editData.type}
                  onChange={(e: any) => setEditData({ ...editData, type: e.target.value })}
                  className="text-sm mb-2 w-full p-2 rounded-md"
                />
                <input
                  type="text"
                  value={editData.link}
                  onChange={(e: any) => setEditData({ ...editData, link: e.target.value })}
                  className="text-sm mb-2 w-full p-2 rounded-md"
                />
                <input
                  type="text"
                  value={editData.githubUrl}
                  onChange={(e: any) => setEditData({ ...editData, githubUrl: e.target.value })}
                  className="text-sm mb-2 w-full p-2 rounded-md"
                />
                <button
                  onClick={() => handleUpdate(item.id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white w-full py-2 px-4 rounded-md transition-all"
                >
                  Submit Edit
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <div className="text-sm mb-2 flex flex-wrap flex-row gap-1 items-center justify-start">
                  {item.type.split('|').map((el: any) => (
                    <div
                      key={el}
                      className="text-gray-600 w-fit bg-white px-2 py-1 rounded-full hover:font-semibold hover:scale-[1.001] transition-all hover:text-black"
                    >
                      {el}
                    </div>
                  ))}
                </div>
                <div className='flex flex-row gap-x-2 py-2 items-center'>
                  <div className="text-sm mb-2 w-full">
                    <a href={item.link} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                      <button className='w-full border px-3 py-1 text-lg border-white text-white hover:scale-[1.03] transition-all'>Visit</button>
                    </a>
                  </div>
                  <div className="text-sm mb-2 w-full">
                    <a href={item.githubUrl} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                      <button className='w-full border px-3 py-1 text-lg border-black text-black bg-gray-300 hover:scale-[1.03] transition-all'>Code</button>
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    disabled={loading}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white w-full py-2 px-4 rounded-md transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white w-full py-2 px-4 rounded-md transition-all"
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
          {msg && <div>{msg}</div>}
        </div>
      ))}
    </div>
  );
};

export default ItemList;
