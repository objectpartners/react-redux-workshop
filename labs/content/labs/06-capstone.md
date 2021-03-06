---
title: Capstone
index: 6
---

# Lab Six - Capstone

## Switch to Lab06

* In a terminal:

```
cd ../ # presuming still in previous lab
cd lab-06
yarn start
```

### Are we done yet?

The application is pretty much feature-complete at this point. Nice work!

...but then you notice that just about anybody can modify data. Not good.
We need to add some security to this app, fast!

### What do we need?

We need to restrict access by requiring the user log in using valid credentials.
The good news is that our server team has put together a simple set of Rest services to support a login/logout capability.

**Note**: This is a very naïve login/logout capability as a simple example. Don't use it in production code!

### How are we going to do it?

There aren't any new concepts in this section - we're just applying all the things you've learned from previous labs.
**Try and implement each step yourself** - don't be afraid to ask questions or collaborate with classmates to work out a solution.
If you truly get stuck then each section has a code hint you can refer to.

> Note that many of the files you'll be working with don't exist in the baseline yet, so you'll need to create them. In addition, you'll need to keep an eye out for any missing `import` statements and get those fixed. Just another bit of fun in modern JS development 😃

### Build the Action Types for Auth

Our app is going to have to accept credentials, log the user in, and pull the current user from the server
so we can get info about them.

We need to define our types for Authentication actions.

* One type for when we get a copy of the user from the server and need to save it into State
* A second type to track whether we encountered an error when logging in so we can tell the user.


<details>
  <summary>Code hint:</summary>

```javascript:title=AuthActionTypes.js
export const SET_USER = 'SET_USER';
export const ERROR = 'ERROR';
```

</details>

&nbsp;


### Build the Actions

Now we need a way to fire off login & logout actions based on user interaction.

We need async actions for making API calls to the following endpoints:
* POST `/api/login`, request body of { username: value, password: value }
* POST `/api/logout`, no request body

Then we need actions:

* To handle getting a copy of the user after login & clearing the user after logout
* To track errors on login


<details>
  <summary>Code hint:</summary>

```javascript:title=AuthActionCreator.js
export const setUser = user => {
  return {
    type: AuthActionTypes.SET_USER,
    user: user
  };
};

export const error = error => {
  return {
    type: AuthActionTypes.ERROR,
    error: error
  }
};

export const login = (credentials) => {
  return dispatch => {
    return Axios.post('/api/login', credentials)
      .then(response => {
        dispatch(setUser(response.data));
        console.log('Login successful');
        return true;
      })
      .catch(err => {
        console.log('There was an error logging in.');
        dispatch(error('Failed to login'));
      });
  };
};

export const logout = () => {
  return dispatch => {
    return Axios.post('/api/logout')
      .then(response => {
        dispatch(setUser(null));
        console.log('Logout successful');
        return true;
      })
      .catch(err => {
        console.log('There was an error logging out.');
      });
  };
};
```

</details>

&nbsp;


### Build the Reducer

We need a reducer to handle our actions

* One case needs to save the new active User (which could be null if the user is logging out)
* A second case needs to save an error message if login failed.

<details>
  <summary>Code hint:</summary>

```javascript:title=auth-reducer.js
import * as AuthActionTypes from '../actions/AuthActionTypes';

export default (state = { user: {} }, action) => {
  switch (action.type) {
    case AuthActionTypes.SET_USER:
      return { ...state, user: action.user };
    case AuthActionTypes.ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
```

</details>

&nbsp;

* Don't forget to hook up the new reducer in **src/reducers/index.js**

### Create a Login form

* We need a form that will accept a username and password as well as supply a "Login" button.
* The form needs validation to ensure that a username and password are provided before enabling the login button.
* Look at the existing forms in the rest of the app for examples.

<details>
  <summary>Code hint:</summary>

```jsx:title=Login.js
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import FieldWrapper from '../form/FieldWrapper';
import FormControls from '../form/FormControls';

class LoginForm extends React.Component {

  validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = 'Required';
    }
    if (!values.password) {
      errors.password = 'Required';
    }

    return errors;
  };

  login = (values) => {
    this.props.onLogin({
      username: values.username,
      password: values.password
    });
  };

  render() {
    const { loginError } = this.props;

    return (
      <div>
        <Formik
          validate={this.validate}
          onSubmit={this.login}
          initialValues={{
            username: '',
            password: ''
          }}>
          {({ isValid, errors, touched, handleSubmit, handleReset }) => (
            <Form>
              <FieldWrapper type="text" name="username" label="Username" invalid={errors.username} touched={touched.username} />
              <FieldWrapper type="password" name="password" label="Password" invalid={errors.password} touched={touched.password} />

              <FormControls
                action="Login"
                allowSubmit={isValid}
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </Form>
          )}
        </Formik>
        {loginError && (
          <p style={{ color: 'red' }}>{loginError}</p>
        )}
      </div>
    );
  }
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loginError: PropTypes.string
};

export default LoginForm;
```

</details>

&nbsp;

### Get data for Login Form

* We need to get the `onLogin` and `loginError` props somewhere and pass them down into our Form

* We're going to render our LoginForm in **App.js**, so open that file, get it hooked up to Redux, and grab the following:
  - Get the async method you created to log the user in
  - Get the current user and whether there was an error on login from Redux state

<details>
  <summary>Code hint:</summary>

```jsx:title=App.js
const mapStateToProps = state => ({
  user: state.auth.user,
  loginError: state.auth.error
});

const mapDispatchToProps = {
  login: AuthActionCreators.login
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

</details>

&nbsp;


### Add a Logout button

We want to let the user log out from the navbar, so we'll need to add a new link that can fire off the 'Logout' action.

* First, add a 'onLogout' prop to the Navigation component

<details>
  <summary>Code hint:</summary>

```jsx:title=Navigation.js
Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired
};
```

</details>

&nbsp;


* Next, add a link to the NavBar with a click listener that calls the 'onLogout' prop

<details>
  <summary>Code hint:</summary>

```jsx:title=Navigation.js
<Nav pullRight>
 <NavItem>
   <Button onClick={this.props.onLogout}>Logout</Button>
 </NavItem>
</Nav>
```

</details>

&nbsp;


### Grab props to pass into Navigation

Now that Navigation needs a 'onLogout' function to call, we need to get that from Redux and pass it in.

* In **app.js**, grab the Logout async action method in addition to the bindings we add a few steps ago

<details>
  <summary>Code hint:</summary>

```jsx:title=App.js
const mapStateToProps = state => ({
  user: state.auth.user,
  loginError: state.auth.error
});

const mapDispatchToProps = {
  login: AuthActionCreators.login,
  logout: AuthActionCreators.logout
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

</details>

&nbsp;


* Pass the 'logout' action from our AuthActionCreators into Navigation as the 'onLogout' prop

<details>
  <summary>Code hint:</summary>

```jsx:title=App.js
<Navigation onLogout={this.props.logout}/>
```

</details>

&nbsp;


### Render login form until user successfully logs in

We have all the pieces in place, now we just need to prevent the user from accessing the application until they've logged in.

* In **app.js**, look for a good way to render our LoginForm anytime there isn't valid _User_ object in our Redux state.

<details>
  <summary>Code hint:</summary>

```jsx:title=App.js
{!this.props.user ? (
  <LoginForm onLogin={this.props.login} loginError={this.props.loginError} />
) : (
  <Switch>
    ...
  </Switch>
)}
```

</details>

&nbsp;

### Try it out

Let's see if the app does what we want.

| Username | Password |
| -------- | -------- |
| admin    | password |
| user     | password |

* Try accessing any route (employees, projects, etc) - you should be restricted to the login form.
* Try a bad login. Do you get an error message?
* Try a good login - can you access the app?
* Logout of the app - do you get sent back to the login form?

### Commit your changes to Git.

```
git add .
git commit -m "We are React masters"
```

## Extra Credit

* Unit tests! Our new and changed components need tests.

* Do you think we should test our actions & reducers? Any ideas on how to do it?

* Try to figure out a way to tie in `react-router` to provide a `/login` route while still securing the other routes

`git add .` and `git commit -m "extra credit"` when you are done