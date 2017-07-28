import { ADD, RESET, SUBMIT, SUCCESS, ERROR } from './actionTypes'

export function add(id) {
  return {
    type: ADD,
    payload: id
  }
}

export function reset(id, bool = true) {
  return {
    type: RESET,
    payload: {
      id,
      bool
    }
  }
}

export function start(id) {
  return {
    type: SUBMIT,
    payload: {
      id,
      bool: true
    }
  }
}

export function stop(id) {
  return {
    type: SUBMIT,
    payload: {
      id,
      bool: false
    }
  }
}

export function success(id, msg) {
  return {
    type: SUCCESS,
    payload: {
      id,
      msg
    }
  }
}

export function error(id, msg) {
  return {
    type: ERROR,
    payload: {
      id,
      msg
    }
  }
}
