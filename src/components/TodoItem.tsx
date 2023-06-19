import React, { FC, useEffect, useRef, useState } from 'react'
import { IList } from '../types';
import {FiEdit,FiMinusCircle} from 'react-icons/fi'


interface TodoItemProps{
  item:IList
  handleRemove:(options:{variables:{id:number}})=>void
  handleUpdate:(options:{variables:IList})=>void
}

const TodoItem: FC<TodoItemProps>= ({item,handleRemove,handleUpdate}) => {

  const[edit,setEdit] = useState(false);
  const[task,setTask] = useState(item.text)
  
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(()=>{
    inputRef?.current?.focus()
  },[edit])

  const hanldeTextChange = (item:IList)=>{
    setEdit(!edit)
    if(edit){
      handleUpdate({
        variables:item
      })
    }
  }
  
  return (
    <div>
      <li className='flex justify-between min-w-full p-5 my-3 text-2xl border-2 rounded-md shadow-md hover:scale-105'>
      <div className='flex items-center w-10/12'>
        <input type='checkbox' checked={item.checked}
          onChange={()=>{handleUpdate({variables:{id: item.id, text:task, checked:!item.checked}})}}
        />
        <input ref={inputRef} type='text' value={task} disabled={!edit} onChange={(e)=>setTask(e.target.value)}
          className={`outline-none h-[25px] text-xl w-full mx-5 px-3 disabled:bg-transparent focus:border-b-[1px] ${item.checked && 'line-through text-stone-500' }`}
        />
      </div>
      <div className='flex justify-between w-1/6'>
        <FiEdit className='hover:scale-105 hover:cursor-pointer' onClick={()=>hanldeTextChange({id:item.id, checked:item.checked, text:task})}/>
        <FiMinusCircle onClick={()=>handleRemove({variables:{id:item.id}})} className='hover:scale-105 hover:cursor-pointer' />
      </div>
      </li>
    </div>
  )
}

export default TodoItem
