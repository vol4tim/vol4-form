import _ from 'lodash'
import { ADD, RESET, SUBMIT, SUCCESS, ERROR } from './actionTypes'

const initialState = {
  items: {}
}

export default function forms(state = initialState, action) {
  switch (action.type) {
    case ADD: {
      const items = { ...state.items }
      if (!_.has(items, action.payload)) {
        items[action.payload] = {
          reset: false,
          submitting: false,
          error: '',
          success: ''
        }
      }
      return { ...state, items: { ...items } }
    }

    case RESET: {
      const items = { ...state.items }
      if (_.has(items, action.payload.id)) {
        items[action.payload.id] = {
          ...items[action.payload.id],
          reset: action.payload.bool
        }
      }
      return { ...state, items: { ...items } }
    }

    case SUBMIT: {
      const items = { ...state.items }
      if (_.has(items, action.payload.id)) {
        items[action.payload.id] = {
          ...items[action.payload.id],
          submitting: action.payload.bool
        }
      }
      return { ...state, items: { ...items } }
    }

    case SUCCESS: {
      const items = { ...state.items }
      if (_.has(items, action.payload.id)) {
        items[action.payload.id] = {
          ...items[action.payload.id],
          success: action.payload.msg
        }
      }
      return { ...state, items: { ...items } }
    }

    case ERROR: {
      const items = { ...state.items }
      if (_.has(items, action.payload.id)) {
        items[action.payload.id] = {
          ...items[action.payload.id],
          error: action.payload.msg
        }
      }
      return { ...state, items: { ...items } }
    }

    default:
      return state;
  }
}
