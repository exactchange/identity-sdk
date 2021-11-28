module.exports = {
  package: {
    name: 'identity-sdk',
    version: '0.0.5'
  },
  Authentication: ({
    rootElement,
    onAuth,
    onSignup,
    onLoad,
    paths = {}
  }) => {
    let auth, signup, login, create, register, email, username, password;

    const onLogin = async event => {
      if (!event.token) {
        event.preventDefault();
      }

      const isValid = (
        (event.username && event.username.length > 2 && event.token && event.token.length > 5) ||
        (username.value.length > 2 && password.value.length > 5)
      );

      if (!isValid) {
        auth.setAttribute('class', 'no');

        return;
      }

      const payload = event.token
        ? { username: event.username, token: event.token }
        : {
          username: username.value,
          password: password.value
        }

      const authResult = await fetch(paths.login, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (authResult && authResult.status === 200) {
        const authResponse = await authResult.json();

        if (username && username.value) {
          username.value = '';
          password.value = '';
        }

        if (auth) {
          rootElement.removeChild(auth);
        }

        return onAuth(authResponse);
      }

      if (event.token) {
        localStorage.clear();
        window.location.reload();
      }
    };

    const onRegister = async event => {
      event.preventDefault();

      const isValid = (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ).test(email.value);

      if (!isValid) {
        signup.setAttribute('class', 'no');

        return;
      }

      const signupResult = await fetch(paths.register, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email.value
        })
      });

      if (signupResult && signupResult.status === 200) {
        const signupResponse = await signupResult.json();

        return onSignup(signupResponse);
      }
    };

    const onShow = ({
      title,
      loginText = 'Login',
      signupText = 'Signup',
      createText = 'Create an account',
      usernamePlaceholder = 'Email',
      passwordPlaceholder = 'Password',
    }) => {
      const element = document.createElement('div');

      element.innerHTML = `
        <form id="signup" action="" class="hide">
          <input id="email" type="email" autocomplete="true" placeholder=${usernamePlaceholder} required />
          <button id="register">${signupText}</button>
        </form>
        <form id="auth" action="">
          <h1 id="branding">
            ${title}
          </h1>
          <input id="username" autocomplete="true" placeholder=${usernamePlaceholder} tabindex="1" />
          <input id="password" type="password" autocomplete="current-password" placeholder=${passwordPlaceholder} tabindex="2" />
          <button id="login" tabindex="3">${loginText}</button>
          <div>
            <button id="create">
              ${createText}
            </button>
          </div>
        </form>
      `;

      Array.from(element.children).reverse().forEach(child => (
        rootElement.insertBefore(child,rootElement.firstElementChild)
      ));

      requestAnimationFrame(() => {
        auth = document.getElementById('auth');
        signup = document.getElementById('signup');
        login = document.getElementById('login');
        create = document.getElementById('create');
        register = document.getElementById('register');
        email = document.getElementById('email');
        username = document.getElementById('username');
        password = document.getElementById('password');

        auth.onsubmit = event => {
          event.preventDefault();

          return false;
        };

        auth.onkeydown = event => {
          if (event.keyCode === 13) {
            onLogin(event);
          }
        };

        signup.onsubmit = event => {
          event.preventDefault();

          return false;
        };

        signup.onkeydown = event => {
          if (event.keyCode === 13) {
            onRegister(event);
          }
        };

        create.onclick = () => {
          auth.setAttribute('class', 'hide');
          signup.removeAttribute('class');
        };

        register.onclick = onRegister;
        login.onclick = onLogin;
      });
    };

    return {
      onShow,
      onLogin,
      onLoad
    }
  },
  Management: {},
  Authorizations: {}
};
