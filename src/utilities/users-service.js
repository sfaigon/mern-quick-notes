//to import all named exports, we use this syntax:
import * as usersApi from './users-api'

export async function signUp(userData) {
    console.log('this is userData in users-service', userData)
    //Delegate the network request code to the users-api.js API module
    //which will ultimately return a JSON web token
    const token = await usersApi.signUp(userData)
    console.log('this is token in signUp in users-service', token)

    //Persist the "token"
    localStorage.setItem('token', token);
    
    //we'll return the token that we've received from the API
    return getUser() 
} 

export async function login(credentials) {
    try {
        const token = await usersApi.login(credentials)
        localStorage.setItem('token', token)
        return getUser()
    } catch {
        throw new Error('Bad Credentials')
    }
}

// getToken function - assesses the token in loca storgae
export function getToken() {
    // getItem returns null if there's no string
    const token = localStorage.getItem('token');
    if (!token) return null;
    // Obtain the payload of the token
    const payload = JSON.parse(atob(token.split('.')[1]));
    // A JWT's exp is expressed in seconds, not milliseconds, so convert
    if (payload.exp < Date.now() / 1000) {
      // Token has expired - remove it from localStorage
      localStorage.removeItem('token');
      return null;
    }
    return token;
  }
  
  // getUser function - parses the data form the token's payload
  export function getUser() {
    const token = getToken();
    // If there's a token, return the user in the payload, otherwise return null
    return token ? JSON.parse(atob(token.split('.')[1])).user : null;
  }

// logoout function -> deletes token from our local storage
export function logOut() {
    localStorage.removeItem('token')
}

export function checkToken() {
  // we can't forget how to use .then with promises
  return usersApi.checkToken()
    .then(dateStr => new Date(dateStr))
}