const user = {
    "response": [
        {
            "id": 82144039,
            "first_name": "Миша",
            "last_name": "Иванов",
            "can_access_closed": true,
            "is_closed": false
        }
    ]
}
let firstName
try {
    firstName = user.response[0].first_name ?? ''
} catch (e) {
    firstName = ''
}
let lastName
try {
    lastName = user.response[0].last_name ?? ''
} catch (e) {
    lastName = ''
}
console.log(`firstName: ${JSON.stringify(firstName, null, 2)}`)
console.log(`lastName: ${JSON.stringify(lastName, null, 2)}`)

let name
if (!firstName.length && !lastName.length) {
    name = 'from mail'
}
else {
    name = firstName + (firstName.length && lastName.length ? ' ' : '') + lastName
}

console.log(`name: ${JSON.stringify(name, null, 2)}`)