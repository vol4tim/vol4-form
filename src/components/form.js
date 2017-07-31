import { Component, cloneElement } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { add, reset, success, error } from '../module/actions';

class Form extends Component {
  constructor(props) {
    super(props);
    const fields = _.mapValues(props.fields, (field) => {
      if (!_.has(field, 'error')) {
        field['error'] = ''
      }
      if (!_.has(field, 'type')) {
        field['type'] = 'text'
      }
      return field
    })
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
      this.setState({ fields: this.props.fields });
      this.props.formResetEnd();
    }
  }
  componentWillUnmount() {
    this.props.formError('');
    this.props.formSuccess('');
  }
  setErrors(errors) {
    const fields = {
      ...this.state.fields
    }
    _.forEach(errors, (msg, field) => {
      if (_.has(fields, field)) {
        fields[field].error = msg;
      }
    })
    this.setState({ fields });
  }
  handleChange(event) {
    const fields = {
      ...this.state.fields,
      [event.target.name]: {
        ...this.state.fields[event.target.name],
        value: event.target.value,
        error: ''
      }
    }
    this.setState({ fields });
  }
  handleSubmit(event) {
    this.props.formError('');
    this.props.formSuccess('');
    const data = _.mapValues(this.state.fields, 'value')
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
