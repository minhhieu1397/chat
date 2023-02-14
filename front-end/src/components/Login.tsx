import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../css/style.css';
import Logo from "../logo.svg";
import { Navigate, Link } from "react-router-dom";

import AuthService from "../services/auth.service";

type Props = {};

type State = {
    redirect: string | null,
    username: string,
    password: string,
    loading: boolean,
    message: string
};

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);

    this.state = {
      redirect: null,
      username: "",
      password: "",
      loading: false,
      message: ""
    };
  }

  validationSchema() {
    return Yup.object().shape({
      username: Yup.string()
        .test(
          "len",
          "The username must be between 3 and 20 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 3 &&
            val.toString().length <= 20
        )
        .required("This field is required!"),
      email: Yup.string()
        .email("This is not a valid email.")
        .required("This field is required!"),
      password: Yup.string()
        .test(
          "len",
          "The password must be between 6 and 40 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 6 &&
            val.toString().length <= 40
        )
        .required("This field is required!"),
    });
  }

  handleLogin(formValue: { username: string; password: string }) {
    const { username, password } = formValue;

    this.setState({
      message: "",
      loading: true
    });


    AuthService.login(username, password).then(
      () => {
        this.setState({
          redirect: "/profile"
        });
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          loading: false,
          message: resMessage
        });
      }
    );
  }

  render() {
    if (this.state.redirect) {
        return <Navigate to={this.state.redirect} />
      }
  
      const { loading, message } = this.state;
  
      const initialValues = {
        username: "",
        password: "",
      };

    return (
      <div className="row text-center">
      <div className="ps-0 col-md-3 just-content-center">
        <div className="card card-container">
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleLogin}
          >
            <Form>
                <div className="form-register">
                  <div className="form-content">
                    <div className="brand">
                      <img src={Logo} alt="logo" />
                      <h1>ĐĂNG NHẬP</h1>
                    </div>
                    <div className="form-group text-start">
                      <label htmlFor="username"> Tên đăng nhập </label>
                      <Field name="username" type="text" className="form-control" />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="alert alert-danger"
                      />
                    </div>

                    <div className="form-group text-start">
                      <label htmlFor="password"> Mật khẩu </label>
                      <Field
                        name="password"
                        type="password"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="alert alert-danger"
                      />
                    </div>
                    <div className="form-group">
                        <div>
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Login</span>
                            </button>
                        </div>
                        <span className="mt-2">
                            BẠN CHƯA CÓ TÀI KHOẢN ? <Link to="/Register">ĐĂNG KÍ.</Link>
                        </span>
                    </div>
                    </div>
                </div>
            </Form>
          </Formik>
        </div>
      </div>
      </div>
    );
  }
}

