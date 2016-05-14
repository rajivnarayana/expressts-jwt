declare type User = {username:string, password: string, id: string}
 
let users : User[] = [];

exports.signup = (username: string, password: string): Promise<any>  => {
    if (users.find((user: User) => {
        return user.username == username;
    })) {
        return Promise.reject<Error>(new Error('User with that username already exists'))
    }
    let user : User = {username: username, password: password, id: ""+(users.length+1)}
    users.push(user)
    return Promise.resolve(user)
}

exports.login = (username: string, password: string): Promise<any>  => {
    let user:User = users.find((user: User) => {
        return user.username == username && user.password == password;
    })
    if (user) {
        return Promise.resolve(user)
    }
    return Promise.reject(new Error('Invalid user name or password'));
}

exports.findById = (id : string) => {
    return new Promise((resolve, reject) => {
        resolve(users.find((user) => {
            return user.id == id
        }))
    })
}