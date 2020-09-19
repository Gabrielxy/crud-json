const express = require("express")

const server = express()
const router = express.Router()

// using fs library
const fs = require("fs")

server.use(express.json({extended: true}))

// read from JSON
const readFile = () => {
    const content = fs.readFileSync('./data/items.json', 'utf-8')
    return(JSON.parse(content)) 
    // parse to json object
}

// write in JSON
const writeFile = (content) => {
    const updateFile = JSON.stringify(content)
    // stringify to string transform
    fs.writeFileSync('./data/items.json', updateFile, 'utf-8')
}

router.get('/', (req, res) => {
    const content = readFile()

    res.send(content)
})

router.post('/', (req, res) => {
    const { name, email, phone } = req.body
    const currentContent = readFile()
    const id = Math.random().toString(32).substr(2, 9)
    // generate an ID

    currentContent.push({ id, name, email, phone})

    writeFile(currentContent)

    res.send({ name, email, phone}) 
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const { name, email, phone } = req.body
    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item) => item.id == id)
    const { id: cId, name: cName, email: cEmail, phone: cPhone } = currentContent[selectedItem]

    const newObject = {
        id: cId,
        name: name ? name : cName, 
        // if name exists: get that, else get cName
        email: email ? email : cEmail,
        phone: phone ? phone : cPhone
    }

    currentContent[selectedItem] = newObject

    writeFile(currentContent)

    res.send(newObject)
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    
    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item) => item.id == id)

    currentContent.splice(selectedItem, 1)

    writeFile(currentContent)

    res.send(true)
})

server.use(router)

server.listen(3000, () => {
    console.log('Rodando servidor')
})