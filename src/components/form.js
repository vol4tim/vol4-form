import { Component, cloneElement } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { add, reset, success, error } from '../module/actions';

const fieldDefault = {
  type: 'text',
  value: '',
  error: ''
};
const fieldsGen = (rows) => {
  const fields = {}
  _.forEach(rows, (field, index) => {
    let name = index
    if (_.has(field, 'name')) {
      name = field.name
    }
    if (_.isArray(field)) {
      fields[name] = fieldsGen(field)
    } else if (_.has(field, 'fields')) {
      fields[name] = fieldsGen(field.fields)
    } else {
      fields[name] = {
        ...fieldDefault,
        ...field,
        name
      }
    }
  })
  if (_.isArray(rows[0])) {
    return _.toArray(fields)
  }
  return fields
}
const getData = (rows) => {
  const fields = {}
  _.forEach(rows, (field, index) => {
    let name = index
    if (_.has(field, 'name')) {
      name = field.name
    }
    if (!_.has(field, 'value')) {
      fields[name] = getData(field)
    } else {
      fields[name] = field.value
    }
  })
  if (_.isArray(rows[0])) {
    return _.toArray(fields)
  }
  return fields
}

class Form extends Component {
  constructor(props) {
    super(props);
    const fields = fieldsGen(props.fields)
    this.state = {
      fields
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    this.props.formAdd();
  }
  componentWillReceiveProps(next) {
    if (next.form.reset === true) {
      this.setState({ fields: fieldsGen(this.props.fields) });
      this.props.formResetEnd();
    }
  }
  componentWillUnmount() {
    this.props.formError('');
    this.props.formSuccess('');
  }
  setErrors(errors) {
    let fields = {
      ...this.state.fields
    }
    _.forEach(errors, (msg, path) => {
      const field = _.get(fields, path);
      field.error = msg
      fields = _.set(fields, path, field)
    })
    this.setState({ fields });
  }
  handleChange(event) {
    const fields = { ...this.state.fields }
    const field = _.get(fields, event.target.name);
    field.value = event.target.value
    field.error = ''
    this.setState({ fields: _.set(fields, event.target.name, field) });
  }
  handleSubmit(event) {
    this.props.formError('');
    this.props.formSuccess('');
    const data = getData(this.state.fields);
    let valid = true
    if (_.has(this.props, 'onValidate')) {
      const errors = this.props.onValidate(data);
      if (!_.isEmpty(errors)) {
        valid = false
        this.setErrors(errors);
        this.props.formError((_.has(errors, 'errorSummary')) ? errors.errorSummary : 'errors');
      }
    }
    if (valid) {
      this.props.onSubmit(data);
    }
    event.preventDefault();
  }
  render() {
    return cloneElement(
      this.props.children,
      {
        ...this.props,
        handleChange: this.handleChange,
        handleSubmit: this.handleSubmit,
        fields: this.state.fields
      }
    )
  }
}

function mapStateToProps(state, props) {
  const idForm = props.id
  let form = {
    reset: false,
    submitting: false,
    error: '',
    success: ''
  }
  if (_.has(state.forms.items, idForm)) {
    form = state.forms.items[idForm]
  }
  return {
    idForm,
    form
  }
}
function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({
    add,
    reset,
    success,
    error,
  }, dispatch)
  return {
    formAdd: () => actions.add(props.id),
    formReset: () => actions.reset(props.id, true),
    formResetEnd: () => actions.reset(props.id, false),
    formSuccess: msg => actions.success(props.id, msg),
    formError: msg => actions.error(props.id, msg),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)
