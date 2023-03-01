import { randomUUID } from 'node:crypto';
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            }: null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {title, description} = req.body
    
            database.insert('tasks', {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(), 
            })

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {tasks} = req.body

            for(const task of tasks) {
                const [title, description] = task
                
                database.insert('tasks', {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: new Date(),
                    updated_at: new Date(), 
                })
            }

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            try {
                database.delete('tasks', id)
            } catch (error) {
                return res.writeHead(404).end(error.message)
            }

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body
            const newTaskData = {}

            if(title) newTaskData.title = title
            if(description) newTaskData.description = description

            newTaskData.updated_at = new Date()

            try {
                database.update('tasks', id, newTaskData)
            } catch (error) {
                return res.writeHead(404).end(error.message)
            }

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            try {
                if(database.itemValue('tasks', id, 'completed_at') === null) {
                    database.update('tasks', id, {
                        completed_at: new Date()
                    })
                } else {
                    database.update('tasks', id, {
                        completed_at: null
                    })
                }
            } catch (error) {
                return res.writeHead(404).end(error.message)
            }

            return res.writeHead(204).end()
        }
    },
]