import Cookies from 'js-cookie'

const TokenKey = 'Token'
const UidKey = 'UID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getUid() {
  return Cookies.get(UidKey)
}

export function setUid(uid) {
  return Cookies.set(UidKey, uid)
}

export function clearCookie() {
  Cookies.remove(TokenKey)
  Cookies.remove(UidKey)
}
