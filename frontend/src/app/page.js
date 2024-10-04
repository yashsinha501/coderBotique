
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
require('dotenv').config()


export default function Home() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);  
  const [editedText, setEditedText] = useState('');  
  const [editingId, setEditingId] = useState(null); 


  // Fetch todos from the backend when the component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_LINK}/todos`);
      const data = await response.json();
      setTodos(data);
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (todoText.trim() === '') return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_LINK}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: todoText }),
    });

    const data = await response.json();
    setTodos([...todos, data.data[0]]);
    setTodoText(''); 
  };

  const saveEdit = async (index) => {
    const updatedTodo = {
      text: editedText,
      completed: false, // Update this if you have a completed field
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_LINK}/todos/${todos[index].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    });

    const data = await response.json();

    const updatedTodos = [...todos];
    updatedTodos[index] = data[0]; // Update the specific todo
    setTodos(updatedTodos);
    setEditingIndex(null); 
    setEditedText('');  
    setEditingId(null);  
  };

  const handleDelete = async (index) => {
    const todoId = todos[index].id; 

    await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_LINK}/${todoId}`, {
      method: 'DELETE',
    });

    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <h1 className="text-4xl font-bold mb-6 text-white">Todo List</h1>

      <form onSubmit={handleSubmit} className="flex space-x-4 mb-6">
        <Input
          placeholder="Enter a todo"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          className="w-64 text-white"
        />
        <Button type="submit" variant="secondary">
          Add Todo
        </Button>
      </form>

      <div className="w-full max-w-md space-y-4">
        {todos.map((todo, index) => (
          <Card key={todo.id} className="bg-gray-400 shadow-md">
            <CardHeader>
              <CardTitle>Todo {index + 1}</CardTitle>
              {editingIndex === index ? (
                <Input
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="mb-2"
                />
              ) : (
                <CardDescription className="text-dark">{todo.text}</CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-x-4">
              {editingIndex === index ? (
                <>
                  <Button variant="primary" onClick={() => saveEdit(index)}>
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingIndex(null); 
                      setEditedText('');  
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => {
                    setEditingIndex(index); 
                    setEditedText(todo.text); 
                    setEditingId(todo.id); 
                  }}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
