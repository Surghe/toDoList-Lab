import { useReducer, useState } from 'react';

const initialState = [
    {
        "userId": 1,
        "id": 1,
        "title": "delectus aut autem",
        "completed": false
    },
    // ... rest of your todos ...
    {
        "userId": 1,
        "id": 20,
        "title": "ullam nobis libero sapiente ad optio sint",
        "completed": true
    }
].map(todo => ({ ...todo, editing: false }));

function reducer(state, action) {
    switch (action.type) {
        case 'ADD':
            return [{ ...action.payload, id: Date.now(), userId: 1, completed: false, editing: false }, ...state];
        case 'TOGGLE':
            return state.map(todo => todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo);
        case 'DELETE':
            return state.filter(todo => todo.id !== action.payload);
        case 'EDIT':
            return state.map(todo => todo.id === action.payload ? { ...todo, editing: true } : todo);
        case 'SAVE':
            return state.map(todo => todo.id === action.payload.id ? { ...todo, title: action.payload.title, editing: false } : todo);
        case 'CHANGE_TITLE':
            return state.map(todo => todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo);
        default:
            return state;
    }
}

export default function TodoList() {
    const [todos, dispatch] = useReducer(reducer, initialState);
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = () => {
        if (!newTodo.trim()) return;
        dispatch({ type: 'ADD', payload: { title: newTodo } });
        console.log('Todo added:', newTodo);
        setNewTodo('');
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="Add a new todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleAddTodo}
                >
                    Add
                </button>
            </div>
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li key={todo.id} className="border p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 w-full">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => dispatch({ type: 'TOGGLE', payload: todo.id })}
                            />
                            {todo.editing ? (
                                <input
                                    type="text"
                                    className="border p-1 w-full"
                                    value={todo.title}
                                    onChange={(e) =>
                                        dispatch({ type: 'CHANGE_TITLE', payload: { id: todo.id, title: e.target.value } })
                                    }
                                />
                            ) : (
                                <span className={todo.completed ? 'line-through' : ''}>{todo.title}</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {todo.editing ? (
                                <button
                                    className="bg-green-500 text-white px-2 rounded"
                                    onClick={() => {
                                        dispatch({ type: 'SAVE', payload: { id: todo.id, title: todo.title } });
                                        console.log('Todo edited with id:', todo.id);
                                    }}
                                >
                                    Save
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="bg-yellow-500 text-white px-2 rounded"
                                        onClick={() => dispatch({ type: 'EDIT', payload: todo.id })}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 rounded disabled:opacity-50"
                                        onClick={() => {
                                            dispatch({ type: 'DELETE', payload: todo.id });
                                            console.log('Todo deleted with id:', todo.id);
                                        }}
                                        disabled={!todo.completed}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
