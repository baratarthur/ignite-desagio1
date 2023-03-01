import { parse } from 'csv-parse/sync'
import multipart from 'parse-multipart-data'

export async function csv(req, res) {
    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    const boundary = req.headers['content-type'].split(';')[1].split('=')[1]

    try {
        const files = multipart.parse(Buffer.concat(buffers), boundary)
        const tasksFile = files.find(f => f.name === 'tasks')
        const csvTasks = parse(tasksFile.data)

        req.body = {}
        req.body.tasks = csvTasks.slice(1)
    } catch {
        req.body = null
    }

    res.setHeader('Content-type', 'application/json')
}
