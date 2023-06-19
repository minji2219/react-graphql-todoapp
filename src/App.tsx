import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ADD_TODO, Get_TODOS, REMOVE_TODO, UPDATE_TODO } from './apollo/todos'
import {useQuery, useMutation}from '@apollo/client'
import TodoItem from './components/TodoItem'
import { AllTodosCache, IList } from './types'

function App() {

  const {loading, error, data} = useQuery(Get_TODOS)
  const [addTodo, {error:addError}] = useMutation(ADD_TODO,{
    update(cache,{data:{createTodo}}){
      //createTodo는 방금 create한 데이터 담고 있음
      const previousTodos =cache.readQuery<AllTodosCache>({query:Get_TODOS})?.allTodos //allTodos에 있는 내용을 다 읽음
      cache.writeQuery({
        query:Get_TODOS,
        data:{
          allTodos:[createTodo,...previousTodos as IList[]]
        }
      })
    }
  })
  const [removeTodo, {error:removeError}] = useMutation(REMOVE_TODO,{
    update(cache,{data:{removeTodo}}){
      cache.modify({
        fields:{
          allTodos(currentTodos:{__ref:string}[]=[]){
            return currentTodos.filter((todo)=>todo.__ref !== `Todo:${removeTodo.id}`)
          }
        }
      })
    }
  })
 const [updateTodo, {error:updateError}]=useMutation(UPDATE_TODO)

  const [input,setInput]=useState('')

  const counter =():string =>{
    if(data?.allTodos as IList[]){
      const completed = data.allTodos.filter((todo:IList)=>todo.checked)
      return `${completed.length}/${data.allTodos.length}`
    }
    return "0/0"
  }
 
  const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(input.trim()==="") return; //input이 아무것도 없을때
    addTodo({
      variables:{
        text:input,
        checked:false
      }
    })
    setInput('')
  }

  const sort = (list:IList[]):IList[]=>{
    const newList = [...list]
    return newList.sort((a,b)=> +a.checked - +b.checked)
  }
  if(error) return <div>Network error</div>
  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='mt-5 text-3xl'>Todo App{" "}<span className='text-sm'>({counter()})</span>
        </div>
          <div className='w-5/6 md:w-1/2 lg:w-3/5'>
            <form onSubmit ={handleSubmit}className='flex justify-between p-5 my-5 text-4xl border-2 rounded-md shadow-md'>
              <input
                placeholder='할 일을 작성해주세요.'
                type={"text"}
                className='outline-none border-b-[1px] text-xl w-10/12 focus:border-b-[3px]'
                value={input}
                onChange={(e)=>{setInput(e.target.value)}}
              />
              <div>
                <button type='submit' className='hover:scale-105'>+</button>
              </div>
            </form>
            {loading ? <div>loading...</div> :
            <ul>
              {data && 
                sort(data.allTodos).map((item:IList)=>(
                <TodoItem
                  handleRemove={removeTodo}
                  handleUpdate={updateTodo}
                  key={item.id}
                  item={item}
                />
              ))}
            </ul>}
          </div>
        
      </div>
    </>
  )
}

export default App
